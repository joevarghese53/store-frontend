import React, { useState, useEffect } from 'react';
import mergeImages from 'merge-images';

const MergedImage = () => {
  const [mergedImageSrc, setMergedImageSrc] = useState('');

  useEffect(() => {
    const mergeAndSetImage = async () => {
      try {
        const mergedImageBase64 = await mergeImages(['./img/tshirt_white.jpg','./img/body.png' ,'./img/eyes.png', './img/mouth.png']);
        setMergedImageSrc(mergedImageBase64);
      } catch (error) {
        console.error('Error merging images:', error);
      }
    };

    mergeAndSetImage();
  }, []); // Run once on component mount

  return (
    <div>
      {mergedImageSrc && <img src={mergedImageSrc} alt="Merged Image" />}
    </div>
  );
};

export default MergedImage;
