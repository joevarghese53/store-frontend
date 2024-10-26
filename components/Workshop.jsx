import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BoxDrawing from '@/components/BoxDrawing';
import Dragg from '@/components/dragg';
import { RingLoader } from 'react-spinners';
import { FaUpload, FaPalette, FaCog } from 'react-icons/fa';
import { MdCategory } from "react-icons/md";
import { useFetchCategoriesQuery } from '@/redux/api/categoryApiSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useCreateCProductMutation, } from '@/redux/api/cProductApiSlice';
import {
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";
import { toast } from "react-toastify";


const Workshop = ({ setActiveTab }) => {

  const [createCProduct] = useCreateCProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useFetchCategoriesQuery();
  const [activeColor, setActiveColor] = useState('black');
  const [activeSide, setActiveSide] = useState('front');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [animbool, setanimbool] = useState(false);
  const [showBusyMessage, setShowBusyMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('regular');
  const [category, setCategory] = useState('66adfb21a1698be6bdfa8e59');
  const [boxDrawingValues, setBoxDrawingValues] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const colorSets = {
    regular: ['white', 'black', 'dark_greenr', 'brown', 'lavender', 'beige', 'grey', 'peach', 'violet', 'hot_pink'],
    oversized: ['white', 'black', 'green', 'brown', 'lavender', 'beige', 'royal_blue', 'baby_pink'],
    hoodies: ['white', 'black', 'dark_greenh', 'lavender', 'sky_blue', 'dark_grey', 'aqua_green'],
  };

  const currentColorSet = colorSets[selectedCategory] || colorSets.regular;

  const categoryMap = {
    "Regular T-Shirts": "regular",
    "Oversized T-shirts": "oversized",
    "Hoodies": "hoodies",
  };

  const handleFileChange = (e) => {
    setSelectedFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleColorClick = (color) => {
    if (color !== activeColor) {
      setActiveColor(color);  
    }
  };

  const handleSideChange = (e) => {
    setActiveSide(e.target.value);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = '63px';
    let scrollHeight = e.target.scrollHeight;
    e.target.style.height = `${scrollHeight}px`;
  };

  const handleSubmit = () => {
    // Check if the prompt (textareaValue) is empty
    if (!textareaValue.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    const { startX, startY, endX, endY } = boxDrawingValues;
    if (startX === 0 && startY === 0 && endX === 0 && endY === 0) {
      toast.error("Please select an area on the canvas.");
      return;
    }

    setShowBusyMessage(false);
    setanimbool(true)
    const boxDrawingValuesArray = Object.values(boxDrawingValues);
    const formattedBoxDrawingValues = boxDrawingValuesArray.join('_');
    const formattedTextareaValue = textareaValue.replace(/ /g, '_');

    const postData = `prompt-input=${formattedTextareaValue} ${activeColor} ${formattedBoxDrawingValues} ${selectedCategory}`;
    console.log(postData);

    fetch('https://4375-35-185-228-15.ngrok-free.app/submit-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        var html_code = data;
        var regex = /src="(.*?)"\sclass=/;
        var match = html_code.match(regex);

        // Assuming match[1] contains the base64 image
        console.log(match[1])

        setImageData(match[1]);
        setanimbool(false)

      })
      .catch(error => {
        console.error('Error:', error);
        setanimbool(false);
        setShowBusyMessage(true);
      });
  };

  const handleBoxDrawingValuesChange = (values) => {
    setBoxDrawingValues(values);
    console.log('BoxDrawing values:', values);
  };

  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleFinalise = async () => {
    try {
      if (!imageData) {
        throw new Error("No image data to upload");
      }

      // Convert Base64 to File
      const file = base64ToFile(imageData, 'generated-image.png');
      const formData = new FormData();
      formData.append("image", file);
      console.log("generated image", file);
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      const uploadedImagePath = res.image;

      const productData = new FormData();
      productData.append("image", uploadedImagePath);
      console.log("Image Path: ", uploadedImagePath);
      productData.append("name", 'CUSTOMS');
      productData.append("description", 'CUSTOMS');
      productData.append("price", 799);
      productData.append("category", category);
      console.log("Category: ", category);
      productData.append("offers", 'No offers available right now');
      productData.append("returnpolicy", 'Return policy not available for this item');
      productData.append("countInStock", 10);
      console.log("CProduct Data: ", productData);

      const { data } = await createCProduct(productData);
      console.log("Data: ", data);

      if (data.error) {
        toast.error("Product creation failed. Try again.");
        console.log("Product creation failed. Try again.");
        console.log("Error: ", data.error);
      } else {
        toast.success(`Product is created`);
        setActiveTab('CProducts');
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  useEffect(() => {
    if (animbool) {
      const timeout = setTimeout(() => {
        setanimbool(false);
        setShowBusyMessage(true);  // Show busy message if timeout occurs

        // Hide the busy message after 3 seconds
        setTimeout(() => {
          setShowBusyMessage(false);
        }, 1500);

      }, 90000);  // 1 minute 30 seconds
      return () => clearTimeout(timeout);
    }
  }, [animbool]);

  useEffect(() => {
    if (showBusyMessage) {
      const hideMessageTimeout = setTimeout(() => {
        setShowBusyMessage(false);
      }, 1500);  // Hide after 3 seconds
      return () => clearTimeout(hideMessageTimeout);
    }
  }, [showBusyMessage]);

  return (
    <>
      {userInfo ? (
        <div className="workshop-main-container">

          {/* ------------------------------------Left Tabs Start-------------------------------------- */}

          <Tabs className="workshop-tabs">
            <TabList className="workshop-tabs-list">
              <Tab>
                <MdCategory size={24} />
                <div>Select Category</div>
              </Tab>
              <Tab>
                <FaUpload size={24} />
                <div>Upload File</div>
              </Tab>
              <Tab>
                <FaPalette size={24} />
                <div>Select Color</div>
              </Tab>
              <Tab>
                <FaCog size={24} />
                <div>Generate</div>
              </Tab>
            </TabList>

            <TabPanel className="workshop-tab-panel">
              <div className="workshop-category-content">
                <h1>SELECT CATEGORY</h1>
                <div className="workshop-category-groups">
                  {categoriesData?.map((category) => (
                    <div
                      key={category._id}
                      className={`workshop-category-card ${selectedCategory === categoryMap[category.name] ? "selected" : ""
                        }`}
                      onClick={() => { setSelectedCategory(categoryMap[category.name]); setCategory(category._id); setActiveColor('black'); }}
                    >
                      <h4>{category.name.toUpperCase()}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>

            <TabPanel className="workshop-tab-panel">
              <input type="file" onChange={handleFileChange} />
            </TabPanel>

            <TabPanel className="workshop-tab-panel">
              <div className="workshop-color-content">
                <h4>SELECT COLOR</h4>
                <div className="workshop-color-groups">
                  {currentColorSet.map((color) => (
                    <div
                      key={color}
                      className={`color color-${color} ${color === activeColor ? 'active-color' : ''}`}
                      onClick={() => handleColorClick(color)}
                    ></div>
                  ))}
                </div>
              </div>
            </TabPanel>

            <TabPanel className="workshop-tab-panel">
              <input
                spellCheck="false"
                type="text"
                value={textareaValue}
                onChange={handleTextareaChange}
                placeholder="Type something here..."
                onKeyUp={handleTextareaResize}
              />
              <button id='prompt-submit-button' onClick={handleSubmit}>Submit</button>
            </TabPanel>
          </Tabs>

          {/* ------------------------------------Left Tabs Start-------------------------------------- */}


          <div className="workshop-image-area">
            <div className="workshop-image-header">
              <span>Canvas</span>
              <span>Preview</span>
            </div>

            <div className="workshop-side-selection">
              <label>Select Side:</label>
              <select value={activeSide} onChange={handleSideChange}>
                <option value="front">Front</option>
                <option value="back">Back</option>
              </select>
            </div>

            <div className="workshop-images">
              <div className="imagecomponent">
                <BoxDrawing imageUrl={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} onValuesChange={handleBoxDrawingValuesChange} imggg={true} category={`${selectedCategory}`} side = {`${activeSide}`}/>
              </div>
              {animbool && (
                <div className="ring-loader">
                  <RingLoader color='#00fffc' />
                </div>
              )}
              {showBusyMessage && (
                <div className="busy-message">
                  Server is busy, please try again.🙂
                </div>
              )}
              <div className="generated-image" >
                {imageData ? (
                  <React.Fragment>
                    {!selectedFile && (
                      <div>
                        <img src={`${imageData}`} alt="Generated Image" />
                        <div className='finalise'>
                          <button type='button' className='finalise-button' onClick={() => { handleFinalise(); }}>CREATE PRODUCT</button>
                        </div>
                      </div>
                    )}
                    {selectedFile && (
                      <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Dragg upload={selectedFile} back={`${imageData}`} category={category} />
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {!selectedFile && <img src={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} alt="Generated Image" draggable="false" />}
                    {selectedFile && (
                      <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Dragg upload={selectedFile} back={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} category={category} />
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-redirect">
          <h1>Please <Link href="/LoginPage">
            <span style={{ textDecoration: 'underline' }}>LOGIN</span>
          </Link> to use this feature.</h1>
        </div>
      )}
    </>
  )
}

export default Workshop