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
import { FaArrowRightLong } from "react-icons/fa6";
import { TbReload } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";




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
  const [designData, setDesignData] = useState(null);
  const [finalImageFront, setFinalImageFront] = useState(null);
  const [finalImageBack, setFinalImageBack] = useState(null);
  const [finalDesignFront, setFinalDesignFront] = useState(null);
  const [finalDesignBack, setFinalDesignBack] = useState(null);
  const [finalUploadFront, setFinalUploadFront] = useState(null);
  const [finalUploadBack, setFinalUploadBack] = useState(null);
  const [animbool, setanimbool] = useState(false);
  const [showBusyMessage, setShowBusyMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('regular');
  const [category, setCategory] = useState('66adfb21a1698be6bdfa8e59');
  const [showCategoryMobile, setShowCategoryMobile] = useState(false);
  const [showUploadMobile, setShowUploadMobile] = useState(false);
  const [showColorMobile, setShowColorMobile] = useState(false);
  const [showGenerateMobile, setShowGenerateMobile] = useState(false);
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

  const showColorSets = {
    'white': 'White [HEX: #FFFFFF]',
    'black': 'Black [HEX: #000000]',
    'dark_greenr': 'Dark Green [HEX: #05270B]',
    'brown': 'Brown [HEX: #290C06]',
    'lavender': 'Lavender [HEX: #9E68C6]',
    'beige': 'Beige [HEX: #BBA576]',
    'grey': 'Grey [HEX: #353A4A]',
    'peach': 'Peach [HEX: #F78266]',
    'violet': 'Violet [HEX: #3F0051]',
    'hot_pink': 'Hot Pink [HEX: #D01957]',
    'green': 'Green [HEX: #00A15A]',
    'royal_blue': 'Royal Blue [HEX: #095BE5]',
    'baby_pink': 'Baby Pink [HEX: #F8CDD5]',
    'dark_greenh': 'Dark Green [HEX: #003920]',
    'sky_blue': 'Sky Blue [HEX: #8CB4F4]',
    'dark_grey': 'Dark Grey [HEX: #14141C]',
    'aqua_green': 'Aqua Green [HEX: #75EDB8]',
  }

  const currentColorSet = colorSets[selectedCategory] || colorSets.regular;

  const categoryMap = {
    "Regular T-Shirts": "regular",
    "Oversized T-shirts": "oversized",
    "Oversized Hoodies": "hoodies",
  };

  const handleFileChange = (e) => {
    setSelectedFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleColorClick = (color) => {
    if (color !== activeColor) {
      setActiveColor(color);
      setSelectedFile(null);
      setImageData(null);
      setFinalImageFront(null);
      setFinalImageBack(null);
      setFinalDesignFront(null);
      setFinalDesignBack(null);
    }
  };

  const handleSideChange = (e) => {
    setActiveSide(e.target.value);
    setSelectedFile(null);
    setImageData(null);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = '63px';
    let scrollHeight = e.target.scrollHeight;
    e.target.style.height = `${scrollHeight}px`;
  };

  const handleImageDataReload = () => {
    setImageData(null);
  };

  const handleFinalImageFrontDelete = () => {
    setFinalImageFront(null);
    setFinalDesignFront(null);
    setFinalUploadFront(null);
  };

  const handleFinalImageBackDelete = () => {
    setFinalImageBack(null);
    setFinalDesignBack(null);
    setFinalUploadBack(null);
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

    const postData = `prompt-input=${formattedTextareaValue} ${activeColor} ${formattedBoxDrawingValues} ${selectedCategory} ${activeSide}`;
    console.log(postData);

    fetch('https://33ae-34-87-47-157.ngrok-free.app/submit-prompt', {
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
        var regex = /src="(data:image\/[^"]+)"/g;
        var matches = [...html_code.matchAll(regex)];

        setImageData(matches[0][1]);
        setDesignData(matches[1][1]);
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

  const handleFinalise = () => {
    if (activeSide === 'front') {
      setFinalImageFront(imageData);
      setFinalDesignFront(designData);
      setImageData(null);
      setDesignData(null);
      setFinalUploadFront(null);
    } else {
      setFinalImageBack(imageData);
      setFinalDesignBack(designData);
      setImageData(null);
      setDesignData(null);
      setFinalUploadBack(null);
    }
  }

  async function fetchImageAsFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  async function blobUrlToFile(blobUrl, fileName) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  const handleCreateProduct = async () => {
    try {

      console.log("Final Image Front: ", finalImageFront);
      console.log("Final Image Back: ", finalImageBack);
      console.log("Final Design Front: ", finalDesignFront);
      console.log("Final Design Back: ", finalDesignBack);
      console.log("Final Upload Front: ", finalUploadFront);
      console.log("Final Upload Back: ", finalUploadBack);

      let frontImagefile;
      let backImagefile;
      let frontDesignfile;
      let backDesignfile;
      let uploadFrontFile;
      let uploadBackFile;

      const formData = new FormData();

      // Convert Base64 to File
      if (finalImageFront) {
        frontImagefile = base64ToFile(finalImageFront, 'generated-front-image.png');
      } else {
        frontImagefile = await fetchImageAsFile(`./img/${activeColor}_tshirt_${selectedCategory}_front.png`, 'generated-front-image.png');
      }
      formData.append("frontImage", frontImagefile);

      if (finalImageBack) {
        backImagefile = base64ToFile(finalImageBack, 'generated-back-image.png');
      } else {
        backImagefile = await fetchImageAsFile(`./img/${activeColor}_tshirt_${selectedCategory}_back.png`, 'generated-back-image.png');
      }
      formData.append("backImage", backImagefile);

      if (finalDesignFront) {
        frontDesignfile = base64ToFile(finalDesignFront, 'generated-front-design.png');
        formData.append("frontDesign", frontDesignfile);
      }

      if (finalDesignBack) {
        backDesignfile = base64ToFile(finalDesignBack, 'generated-back-design.png');
        formData.append("backDesign", backDesignfile);
      }

      if (finalUploadFront) {
        uploadFrontFile = await blobUrlToFile(finalUploadFront, 'generated-front-upload.png');
        formData.append("frontUpload", uploadFrontFile);
      }

      if (finalUploadBack) {
        uploadBackFile = await blobUrlToFile(finalUploadBack, 'generated-back-upload.png');
        formData.append("backUpload", uploadBackFile);
      }

      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      console.log("Response: ", res);
      console.log("frontImage: ", res.imageUrls.frontImage[0]);
      console.log("backImage: ", res.imageUrls.backImage[0]);
      const frontImagePath = res.imageUrls.frontImage[0];
      const backImagePath = res.imageUrls.backImage[0];
      let frontDesignPath;
      let backDesignPath;
      let frontUploadPath;
      let backUploadPath;
      if (res.imageUrls.frontDesign) {
        frontDesignPath = res.imageUrls.frontDesign[0];
      } else {
        frontDesignPath = "undefined";
      }
      if (res.imageUrls.backDesign) {
        backDesignPath = res.imageUrls.backDesign[0];
      } else {
        backDesignPath = "undefined";
      }
      if (res.imageUrls.frontUpload) {
        frontUploadPath = res.imageUrls.frontUpload[0];
      } else {
        frontUploadPath = "undefined";
      }
      if (res.imageUrls.backUpload) {
        backUploadPath = res.imageUrls.backUpload[0];
      } else {
        backUploadPath = "undefined";
      }


      const productData = new FormData();
      productData.append("frontImage", frontImagePath);
      productData.append("backImage", backImagePath);
      productData.append("frontDesign", frontDesignPath);
      productData.append("backDesign", backDesignPath);
      productData.append("frontUpload", frontUploadPath);
      productData.append("backUpload", backUploadPath);
      productData.append("name", 'CUSTOMS');
      if (selectedCategory === 'regular') {
        productData.append("description", '• 180 GSM\n• 100% Cotton Material\n• Pre-shrunk\n• Bio-Washed\n• Super Combed Cotton\n• No Colour Fading');
        if (frontDesignPath && (backDesignPath || backUploadPath)) {
          productData.append("price", 899);
        } else if (frontUploadPath && (backDesignPath || backUploadPath)) {
          productData.append("price", 899);
        } else {
          productData.append("price", 699);
        }
      } else if (selectedCategory === 'oversized') {
        productData.append("description", '• 240 GSM\n• 100% Cotton Material\n• Pre-shrunk\n• Double Stitching\n• Super Combed Cotton\n• No Colour Fading');
        if (frontDesignPath && (backDesignPath || backUploadPath)) {
          productData.append("price", 1099);
        } else if (frontUploadPath && (backDesignPath || backUploadPath)) {
          productData.append("price", 1099);
        } else {
          productData.append("price", 899);
        }
      } else if (selectedCategory === 'hoodies') {
        productData.append("description", '• 350 GSM\n• 60% Cotton 40% Poly\n• Pre-shrunk\n• Double Hood\n• Super Combed Cotton\n• Cross Neck');
        if (frontDesignPath && (backDesignPath || backUploadPath)) {
          productData.append("price", 1299);
        } else if (frontUploadPath && (backDesignPath || backUploadPath)) {
          productData.append("price", 1299);
        } else {
          productData.append("price", 1099);
        }
      }
      productData.append("category", category);
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
        <>
          <div className="workshop-main-container">

            {/* ------------------------------------Left Tabs Start-------------------------------------- */}

            <Tabs className="workshop-tabs-desktop">
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
                        onClick={() => { setSelectedCategory(categoryMap[category.name]); setCategory(category._id); setActiveColor('black'); setImageData(null); setSelectedFile(null); setFinalImageFront(null); setFinalImageBack(null); setImageData(null); setDesignData(null); setFinalDesignFront(null); setFinalDesignBack(null); setFinalUploadFront(null); setFinalUploadBack(null); }}
                      >
                        <h4>{category.name.toUpperCase()}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>

              <TabPanel className="workshop-tab-panel">
                <input className='file-upload-input' type="file" onChange={handleFileChange} />
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
                      >
                        <span className="tooltip">{showColorSets[color]}</span>
                      </div>
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
                  placeholder="Enter your prompt..."
                  onKeyUp={handleTextareaResize}
                />
                <button id='prompt-submit-button' onClick={handleSubmit}>Submit</button>
              </TabPanel>
            </Tabs>

            {/* ------------------------------------Left Tabs Start-------------------------------------- */}


            <div className="workshop-image-area">
              <div className="workshop-image-header">


              </div>

              <div className="workshop-side-selection">
                <label>Select Side:</label>
                <select value={activeSide} onChange={handleSideChange}>
                  <option value="front">Front</option>
                  <option value="back">Back</option>
                </select>
              </div>

              <div className="workshop-images">

                <div className="canvas">
                  <span>Canvas:</span>
                  <div className="imagecomponent-desktop">
                    <BoxDrawing imageUrl={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} onValuesChange={handleBoxDrawingValuesChange} imggg={true} category={`${selectedCategory}`} side={`${activeSide}`} screen='desktop' />
                  </div>
                  <div className="imagecomponent-mobile">

                    <BoxDrawing imageUrl={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} onValuesChange={handleBoxDrawingValuesChange} imggg={true} category={`${selectedCategory}`} side={`${activeSide}`} screen = 'mobile' />
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
                </div>
                <div className="preview">
                  <span>Preview:</span>
                  <div className="generated-image" >

                    {imageData ? (
                      <React.Fragment>
                        {!selectedFile && (
                          <div>
                            <img src={`${imageData}`} alt="Generated Image" />
                            <div className='finalise'>
                              <button type='button' className='finalise-button' onClick={() => { handleFinalise(); }}>CONFIRM DESIGN</button>
                            </div>
                            <div className='reload'>
                              <TbReload size={34} onClick={handleImageDataReload} />
                            </div>
                          </div>
                        )}
                        {selectedFile && (
                          <div style={{ position: 'absolute', top: 0, left: 0 }}>
                            <Dragg upload={selectedFile} back={`${imageData}`} design={designData} side={activeSide} setFinalImageFront={setFinalImageFront} setFinalImageBack={setFinalImageBack} setFinalDesignFront={setFinalDesignFront} setFinalDesignBack={setFinalDesignBack} setFinalUploadFront={setFinalUploadFront} setFinalUploadBack={setFinalUploadBack} />
                          </div>
                        )}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {!selectedFile && <img src={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} alt="Generated Image" draggable="false" />}
                        {selectedFile && (
                          <div style={{ position: 'absolute', top: 0, left: 0 }}>
                            <Dragg upload={selectedFile} back={`./img/${activeColor}_tshirt_${selectedCategory}_${activeSide}.png`} design={designData} side={activeSide} setFinalImageFront={setFinalImageFront} setFinalImageBack={setFinalImageBack} setFinalDesignFront={setFinalDesignFront} setFinalDesignBack={setFinalDesignBack} setFinalUploadFront={setFinalUploadFront} setFinalUploadBack={setFinalUploadBack} />
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="final-product-main-container">
            <div className="final-product-images">
              <div className="final-product-front">
                {finalImageFront &&
                  <div className="final-image-container">
                    <img src={finalImageFront} alt="Final Product Front" />
                    <div className='final-image-delete'>
                      <MdDelete size={34} onClick={handleFinalImageFrontDelete} color='red' />
                    </div>
                  </div>
                }
                {!finalImageFront && <img src={`./img/${activeColor}_tshirt_${selectedCategory}_front.png`} alt="Final Product Front" />}
              </div>
              <div className="final-product-back">
                {finalImageBack &&
                  <div className="final-image-container">
                    <img src={finalImageBack} alt="Final Product Back" />
                    <div className='final-image-delete'>
                      <MdDelete size={34} onClick={handleFinalImageBackDelete} color='red' />
                    </div>
                  </div>
                }
                {!finalImageBack && <img src={`./img/${activeColor}_tshirt_${selectedCategory}_back.png`} alt="Final Product Back" />}
              </div>
            </div>
            <div className="final-product-create">
              <button type='button' onClick={handleCreateProduct}>CREATE PRODUCT <FaArrowRightLong size={24} /></button>
            </div>
          </div>

          {/* ------------------------------------Mobile Tabs Start-------------------------------------- */}
          <div className={`workshop-tabs-mobile-category-slider ${showCategoryMobile ? 'open' : ''}`} >
            <button onClick={() => setShowCategoryMobile(false)} className='hamburger-menu-links-close-btn'><IoClose /></button>
            <div className="workshop-category-content">
                  <h1>SELECT CATEGORY</h1>
                  <div className="workshop-category-groups">
                    {categoriesData?.map((category) => (
                      <div
                        key={category._id}
                        className={`workshop-category-card ${selectedCategory === categoryMap[category.name] ? "selected" : ""
                          }`}
                        onClick={() => { setSelectedCategory(categoryMap[category.name]); setCategory(category._id); setActiveColor('black'); setImageData(null); setSelectedFile(null); setFinalImageFront(null); setFinalImageBack(null); setImageData(null); setDesignData(null); setFinalDesignFront(null); setFinalDesignBack(null); setFinalUploadFront(null); setFinalUploadBack(null); }}
                      >
                        <h4>{category.name.toUpperCase()}</h4>
                      </div>
                    ))}
                  </div>
                </div>
          </div>
          <div className={`workshop-tabs-mobile-category-slider ${showUploadMobile ? 'open' : ''}`} >
            <button onClick={() => setShowUploadMobile(false)} className='hamburger-menu-links-close-btn'><IoClose /></button>
            <input className='file-upload-input' type="file" onChange={handleFileChange} />
            <button onClick={() => setShowUploadMobile(false)} className='file-upload-close'>DONE</button>
          </div>
          <div className={`workshop-tabs-mobile-category-slider ${showColorMobile ? 'open' : ''}`} >
            <button onClick={() => setShowColorMobile(false)} className='hamburger-menu-links-close-btn'><IoClose /></button>
            <div className="workshop-color-content">
                  <h4>SELECT COLOR</h4>
                  <div className="workshop-color-groups">
                    {currentColorSet.map((color) => (
                      <div
                        key={color}
                        className={`color color-${color} ${color === activeColor ? 'active-color' : ''}`}
                        onClick={() => handleColorClick(color)}
                      >
                        <span className="tooltip">{showColorSets[color]}</span>
                      </div>
                    ))}
                  </div>
                </div>
          </div>
          <div className={`workshop-tabs-mobile-category-slider ${showGenerateMobile ? 'open' : ''}`} >
            <button onClick={() => setShowGenerateMobile(false)} className='hamburger-menu-links-close-btn'><IoClose /></button>
            <input
                  spellCheck="false"
                  type="text"
                  value={textareaValue}
                  onChange={handleTextareaChange}
                  placeholder="Enter your prompt..."
                  onKeyUp={handleTextareaResize}
                  className='mobile-prompt-input'
                />
                <button id='prompt-submit-button' onClick={handleSubmit}>Submit</button>
          </div>

          <div className="workshop-tabs-mobile">
            <div className="workshop-tabs-category-mobile" onClick={() => setShowCategoryMobile(true)}>
              <MdCategory size={18} />
              <span>CATEGORY</span>
            </div>
            <div className="workshop-tabs-upload-mobile" onClick={() => setShowUploadMobile(true)}>
              <FaUpload size={18} />
              <span>UPLOAD</span>
            </div>
            <div className="workshop-tabs-color-mobile" onClick={() => setShowColorMobile(true)}>
              <FaPalette size={18} />
              <span>COLOR</span>
            </div>
            <div className="workshop-tabs-generate-mobile" onClick={() => setShowGenerateMobile(true)}>
              <FaCog size={18} />
              <span>GENERATE</span>
            </div>
          </div>
        </>
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