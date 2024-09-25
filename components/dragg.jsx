import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCreateCProductMutation, } from '@/redux/api/cProductApiSlice';
import {
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";
import { toast } from "react-toastify";

function Dragg({ upload, back, category }) {

  const [createCProduct] = useCreateCProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const cproductDetails = {
    cname: 'DGEN CUSTOMS',
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
            ctx.drawImage(imgg, -size / 2, -size / 2, size, size);
            ctx.restore();
          }

          canvas.renderAll();
        });
      });


    }

  }, [canvas, upload]);



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
    const mergedImageURL = canvas.toDataURL('image/png');
    
      if (!mergedImageURL) {
        toast.error("No image data to upload");
        return;
      }

      try {
      // Convert Base64 to File
      const file = base64ToFile(mergedImageURL, 'generated-image.png');
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
      productData.append("offers", 'CUSTOMS');
      productData.append("returnpolicy", 'CUSTOMS');
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
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try again.");
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={400} height={400} ></canvas>
      <div className='finalise'>
        <button type='button' className='finalise-button' onClick={() => { handleFinalise(); }}>CREATE PRODUCT</button>

      </div>

    </>
  );
}

export default Dragg;