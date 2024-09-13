import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BoxDrawing from '@/components/BoxDrawing';
import Dragg from '@/components/dragg';
import { Hourglass } from 'react-loader-spinner';
import { FaUpload, FaPalette, FaCog } from 'react-icons/fa';
import { MdCategory  } from "react-icons/md";
import {useFetchCategoriesQuery} from '@/redux/api/categoryApiSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const Customs = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const colors = ['white', 'black', 'yellow', 'blue', 'red'];
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useFetchCategoriesQuery(); 

  const [activeColor, setActiveColor] = useState('white');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [animbool, setanimbool] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('regular');
  console.log(selectedCategory);
  const [boxDrawingValues, setBoxDrawingValues] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

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
      setNewColor(color);
    }
  };

  const setNewColor = (color) => {
    setActiveColor(color);
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
    setanimbool(true)
    const boxDrawingValuesArray = Object.values(boxDrawingValues);
    const formattedBoxDrawingValues = boxDrawingValuesArray.join('_');
    const formattedTextareaValue = textareaValue.replace(/ /g, '_');

    const postData = `prompt-input=${formattedTextareaValue} ${activeColor} ${formattedBoxDrawingValues}`;

    fetch('https://3e19-34-125-182-54.ngrok-free.app/submit-prompt', {
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
      });
  };

  const handleBoxDrawingValuesChange = (values) => {
    setBoxDrawingValues(values);
    console.log('BoxDrawing values:', values);
  };



  return (
    <>
      {userInfo ? (
        <div className="customs-main-container">

          {/* ------------------------------------Left Tabs Start-------------------------------------- */}

          <Tabs className="customs-tabs">
            <TabList className="customs-tabs-list">
              <Tab>
                <MdCategory  size={24} />
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

            <TabPanel className="customs-tab-panel">
              <div className="customs-category-content">
                <h1>SELECT CATEGORY</h1>
                <div className="customs-category-groups">
                  {categoriesData?.map((category) => (
                    <div
                      key={category._id}
                      className={`customs-category-card ${
                        selectedCategory === categoryMap[category.name] ? "selected" : ""
                      }`}
                      onClick={() => setSelectedCategory(categoryMap[category.name])}
                    >
                      <h4>{category.name.toUpperCase()}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>

            <TabPanel className="customs-tab-panel">
              <input type="file" onChange={handleFileChange} />
            </TabPanel>

            <TabPanel className="customs-tab-panel">
              <div className="customs-color-content">
                <h4>SELECT COLOR</h4>
                <div className="customs-color-groups">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className={`color color-${color} ${color === activeColor ? 'active-color' : ''}`}
                      onClick={() => handleColorClick(color)}
                    ></div>
                  ))}
                </div>
              </div>
            </TabPanel>

            <TabPanel className="customs-tab-panel">
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


          <div className="customs-image-area">
              <div className="imagecomponent">
                <BoxDrawing imageUrl={`./img/${activeColor}_tshirt_${selectedCategory}.png`} onValuesChange={handleBoxDrawingValuesChange} imggg={true} />
              </div>
              {animbool && (
                <div className="loader">
                  <Hourglass
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="hourglass-loading"
                    wrapperStyle={{
                      position: 'absolute',
                      top: '50%',
                      left: '43%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    colors={['#306cce', '#72a1ed']}
                  />
                </div>
              )}
              <div className="generated-image" style={{ position: 'relative' }}>
                {imageData ? (
                  <React.Fragment>
                    {!selectedFile && <img src={`${imageData}`} alt="Generated Image" />}
                    {selectedFile && (
                      <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Dragg upload={selectedFile} back={`${imageData}`} />
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {!selectedFile && <img src={`./img/${activeColor}_tshirt_${selectedCategory}.png`} alt="Generated Image" draggable="false" />}
                    {selectedFile && (
                      <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Dragg upload={selectedFile} back={`./img/${activeColor}_tshirt_${selectedCategory}.png`} />
                      </div>
                    )}
                  </React.Fragment>
                )}
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
  );
};

export default Customs;
