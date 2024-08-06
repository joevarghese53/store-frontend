import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BoxDrawing from '@/components/BoxDrawing';
import Dragg from '@/components/dragg';
import { Hourglass } from 'react-loader-spinner';
import { FaUpload, FaPalette, FaCog } from 'react-icons/fa';

const App = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(URL.createObjectURL(e.target.files[0]));
  };

  
  const colors = ['white', 'black', 'yellow', 'blue', 'red'];
  const [activeColor, setActiveColor] = useState('white');

  const handleColorClick = (color) => {
    if (color !== activeColor) {
      setActiveColor(color);
      setNewColor(color);
    }
  };
  const setNewColor = (color) => {
    setActiveColor(color);
  };

  const [textareaValue, setTextareaValue] = useState('');

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

    fetch('https://d1e7-34-87-168-34.ngrok-free.app/submit-prompt', {
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


  const [boxDrawingValues, setBoxDrawingValues] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  const [imageData, setImageData] = useState(null);
  const [animbool, setanimbool] = useState(false);

  const handleBoxDrawingValuesChange = (values) => {
    setBoxDrawingValues(values);
    console.log('BoxDrawing values:', values);
  };



  return (
    <div className="app-container">
      <Tabs className="tabs">
        <TabList className="tabs-list">
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

        <TabPanel className="tab-panel">
          <input type="file" onChange={handleFileChange} />
        </TabPanel>

        <TabPanel className="tab-panel">
          <div className="color-content">
            <h4>SELECT COLOR</h4>
            <div className="color-groups">
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

        <TabPanel className="tab-panel">
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

      <header className="banner-wrapper">
        <section className="content">
          <div className='both-image'>
            <div className="imagecomponent">
              <BoxDrawing imageUrl={`./img/${activeColor}_tshirt.png`} onValuesChange={handleBoxDrawingValuesChange} imggg={true} />
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
                  {!selectedFile && <img src={`./img/${activeColor}_tshirt.png`} alt="Generated Image" draggable="false" />}
                  {selectedFile && (
                    <div style={{ position: 'absolute', top: 0, left: 0 }}>
                      <Dragg upload={selectedFile} back={`./img/${activeColor}_tshirt.png`} />
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </section>
      </header>
    </div>
  );
};

export default App;
