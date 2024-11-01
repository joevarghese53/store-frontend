import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


const BoxDrawing = ({ imageUrl, onValuesChange, imggg, category, side, screen}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);

  const containerRef = useRef(null);

  const getTshirtBounds = (screen, category, side) => {
    const bounds = {
      desktop: {
        regular: {
          front: { left: 110, top: 140, right: 285, bottom: 380 },
          back: { left: 115, top: 50, right: 285, bottom: 370 }
        },
        oversized: {
          front: { left: 115, top: 140, right: 280, bottom: 375 },
          back: { left: 120, top: 60, right: 280, bottom: 375 }
        },
        hoodies: {
          front: { left: 100, top: 150, right: 290, bottom: 240 },
          back: { left: 105, top: 105, right: 290, bottom: 340 }
        }
      },
      mobile: {
        regular: {
          front: { left: 98, top: 120, right: 248, bottom: 330 },
          back: { left: 103, top: 43, right: 248, bottom: 320 }
        },
        oversized: {
          front: { left: 103, top: 120, right: 245, bottom: 330 },
          back: { left: 105, top: 50, right: 245, bottom: 330 }
        },
        hoodies: {
          front: { left: 88, top: 130, right: 253, bottom: 210 },
          back: { left: 94, top: 95, right: 253, bottom: 300 }
        }
      },
      default: {
        front: { left: 120, top: 70, right: 290, bottom: 355 },
        back: { left: 115, top: 65, right: 285, bottom: 345 }
      }
    };
  
    // Ensure we have a valid screen, category, and side, and return a safe default if not
    return (bounds[screen]?.[category]?.[side]) || bounds.default[side] || { left: 0, top: 0, right: 0, bottom: 0 };
  };
  
  const tshirtBounds = getTshirtBounds(screen, category, side);

  console.log(tshirtBounds)


  const handleMouseDown = (e) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    console.log(containerRect)

    if (
      e.clientX - containerRect.left < tshirtBounds.left ||
      e.clientX - containerRect.left > tshirtBounds.right ||
      e.clientY - containerRect.top < tshirtBounds.top ||
      e.clientY - containerRect.top > tshirtBounds.bottom
    ) {
      return;
    }


    setIsDragging(true);
    setStartX(e.clientX - containerRect.left);
    setStartY(e.clientY - containerRect.top);
    setEndX(e.clientX - containerRect.left);
    setEndY(e.clientY - containerRect.top);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const containerRect = containerRef.current.getBoundingClientRect();

      let newEndX = e.clientX - containerRect.left;
      let newEndY = e.clientY - containerRect.top;

      // Clamp the values to ensure they don't go outside the T-shirt bounds
      if (newEndX < tshirtBounds.left) newEndX = tshirtBounds.left;
      if (newEndX > tshirtBounds.right) newEndX = tshirtBounds.right;
      if (newEndY < tshirtBounds.top) newEndY = tshirtBounds.top;
      if (newEndY > tshirtBounds.bottom) newEndY = tshirtBounds.bottom;

      // Update the end coordinates
      setEndX(newEndX);
      setEndY(newEndY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onValuesChange({ startX, startY, endX, endY });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  return (

    <div
      ref={containerRef}
      onTouchStart={imggg ? handleTouchStart : undefined}
      onTouchMove={imggg ? handleTouchMove : undefined}
      onTouchEnd={imggg ? handleTouchEnd : undefined}
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
        style={{ width: 'auto', height: 'auto' }}
        draggable="false"
      />
      {/* </TransformComponent>
      </TransformWrapper> */}

      {imggg && (
        <div
          style={{
            position: 'absolute',
            left: tshirtBounds.left - 3,
            top: tshirtBounds.top - 3,
            width: (tshirtBounds.right + 6) - tshirtBounds.left,
            height: (tshirtBounds.bottom + 6) - tshirtBounds.top,
            border: '2px dashed red',
            // backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent black background
              color: 'white',
              padding: '2px 5px',
              fontSize: '10px',
              borderRadius: '3px',
            }}
          >
            Selectable Area
          </span>
        </div>
      )
      }

      {imggg && isDragging && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(startX, endX),
            top: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY),
            border: '2px solid rgba(167, 198, 237, 1)',  // Corrected RGBA
            backgroundColor: 'rgba(167, 198, 237, 0.3)', // Corrected RGBA
          }}
        />
      )}
    </div>

  );
};

export default BoxDrawing;