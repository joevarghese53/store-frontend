import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCreateCProductMutation, } from '@/redux/api/cProductApiSlice';
import {
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";

function Dragg({ upload, back, design, side, setFinalImageFront, setFinalImageBack, setFinalDesignFront, setFinalDesignBack, setFinalUploadFront, setFinalUploadBack }) {

  const [createCProduct] = useCreateCProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [canvas, setCanvas] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const canvasRef = useRef(null);
  const cproductDetails = {
    cname: 'Flow State CUSTOMS',
    cdetails: 'Product Details',
    cprice: 50,
    cimage: back.substring(1) // Add the image path or URL
  }

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(newCanvas);


    // Cleanup function
    return () => {
      console.log("dispose")
      newCanvas.dispose();
    };
  }, []); // Only run this effect once during the initial render

  useEffect(() => {
    if (canvas) {
      fabric.Image.fromURL(back, function (img) {
        img.scaleToWidth(canvas.width);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }

  }, [canvas, back]);

  useEffect(() => {

    // Ensure canvas is defined before attempting to clear it
    if (canvas) {

      var deleteIcon = "./img/dustbin.png";

      var imgg = document.createElement('img');
      imgg.src = deleteIcon;
      // Clear the existing canvas content
      // canvas.clear();

      // Load an image

      fabric.Image.fromURL(upload, (img) => {
        // Retrieve saved properties from localStorage
        const properties = { left: 150, top: 120, scaleX: 0.1, scaleY: 0.1 };

        // Set image properties (e.g., width, height, position)
        img.set(properties);

        // remove previous image
        if (uploadImage) {
          canvas.remove(uploadImage);
        }
        
        // Add image to the canvas
        canvas.add(img);
        setUploadImage(img);

        // Event listener for changes in object position and size
        img.on('modified', () => {
          // Update the fixed position after user interaction
          img.setCoords();

          // Save the new position and scale to localStorage


          fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderIcon,
            cornerSize: 24
          });

          function deleteObject(eventData, transform) {
            const target = transform.target;
            const canvas = target.canvas;
            canvas.remove(target);
            canvas.requestRenderAll();
          }
          function renderIcon(ctx, left, top, styleOverride, fabricObject) {
            var size = this.cornerSize;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(imgg, -size / 2, -size / 2, size, size);
            ctx.restore();
          }

          canvas.renderAll();
        });
      });


    }

  }, [canvas, upload]);


  const handleFinalise = () => {  
    const mergedImageURL = canvas.toDataURL('image/png');
    if(side === 'front'){
      setFinalImageFront(mergedImageURL);
      setFinalDesignFront(design);
      setFinalUploadFront(upload);
    } else {
      setFinalImageBack(mergedImageURL);
      setFinalDesignBack(design);
      setFinalUploadBack(upload);
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="canvas-desktop" width={400} height={400} ></canvas>
      <canvas ref={canvasRef} className="canvas-mobile" width={350} height={350} ></canvas>
      <div className='finalise'>
        <button type='button' className='finalise-button' onClick={() => { handleFinalise(); }}>CONFIRM DESIGN</button>

      </div>

    </>
  );
}

export default Dragg;