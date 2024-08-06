import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


const BoxDrawing = ({ imageUrl, onValuesChange ,imggg }) => {
  console.log(imggg)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);

  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    const containerRect = containerRef.current.getBoundingClientRect();

    setIsDragging(true);
    setStartX(e.clientX - containerRect.left);
    setStartY(e.clientY - containerRect.top);
    setEndX(e.clientX - containerRect.left);
    setEndY(e.clientY - containerRect.top);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const containerRect = containerRef.current.getBoundingClientRect();


      setEndX(e.clientX - containerRect.left);
      setEndY(e.clientY - containerRect.top);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onValuesChange({ startX, startY, endX, endY });
  };

  return (

    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        width: 'auto',
        height: 'auto',

      }}

      onMouseDown={imggg ? handleMouseDown : undefined}
      onMouseMove={imggg ? handleMouseMove : undefined}
      onMouseUp={imggg ? handleMouseUp : undefined}
>      
      {/* <TransformWrapper
        disablePadding	="true"
      >
      <TransformComponent */}
      {/* wrapperStyle={{ backgroundColor: "lightblue",border: "2px solid red" }}> */}
      <img

        id="tshirtImage"
        src={imageUrl}
        alt="Your Image"
        style={{ width: 'auto', height: 'auto'}}
        draggable="false"
      />
     {/* </TransformComponent>
      </TransformWrapper> */}

      {imggg && isDragging && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(startX, endX),
            top: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY),
            border: '2px solid RGBA(167,198,2370,0.3)',
            backgroundColor:"RGBA(167,198,2370,0.3)",
          }}
        />
      )}
    </div>

  );
};

export default BoxDrawing;