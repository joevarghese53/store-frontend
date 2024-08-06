import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { generateSlug } from '../utils/generateSlug';
import { useRouter } from 'next/router';
import Link from 'next/link';


function Dragg({ upload ,back}) {

  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const router = useRouter();
  const [dynamicProductSlug, setDynamicProductSlug] = useState('some-slug');
  const cproductDetails={
    cname: 'Product Name',
    cdetails: 'Product Details',
    cprice: 50,
    cimage: back.substring(1) // Add the image path or URL
    // Add other details as needed
  }



  useEffect(() => {
    // Simulate fetching the dynamicProductSlug asynchronously
    // In a real scenario, replace this with actual fetching logic
    const fetchDynamicProductSlug = async () => {
      // Simulating an asynchronous delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a slug using our utility function
      const slug1 = generateSlug();
      setDynamicProductSlug(slug1);
    };

    fetchDynamicProductSlug();
  }, []);

  if (!dynamicProductSlug) {
    // Return a loading state or handle the case where dynamicProductSlug is not available yet
    return <div>Loadingff...</div>;
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
        fabric.Image.fromURL(back, function(img) {
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
        const properties = { left: 150, top: 120, scaleX: 0.1 , scaleY: 0.1 };

        // Set image properties (e.g., width, height, position)
        img.set(properties);

        // Add image to the canvas
        canvas.add(img);

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
            ctx.drawImage(imgg, -size/2, -size/2, size, size);
            ctx.restore();
          }

          canvas.renderAll();
        });
      });


    }





  }, [canvas,upload]); 

  const handleButtonClick = () => {
    const mergedImageURL = canvas.toDataURL('image/png');
    cproductDetails.cimage=mergedImageURL

    router.push({
      pathname: '/dynamic-product/[slug1]',
      query: {
        slug1: dynamicProductSlug,
        ...cproductDetails,
      },
    });
  };

  return (
    <>
      <canvas ref={canvasRef} width={400} height={400} ></canvas>
      <div className='finalise'>         
            <button type='button' className='finalise-button' onClick={() => { handleButtonClick();  }}>VIEW PRODUCT</button>

        </div>

    </>
  );
}

export default Dragg;