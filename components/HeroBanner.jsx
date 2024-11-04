import React from 'react';

import { ImageSlider } from './ImageSlider';

const slide1 = '/img/slide-01.png';
const slide2 = '/img/slide-02.png';
const slide3 = '/img/slide-03.png';
const slide4 = '/img/slide-04.png';
const slide5 = '/img/slide-05.png';
const slide6 = '/img/slide-06.png';
const slide7 = '/img/slide-07.png';

const video1 = '/videos/video-01.mp4';
const video2 = '/videos/video-02.mp4';
const video3 = '/videos/video-03.mp4';

const HeroBanner = () => {
  const media = [
    // { type: 'video', url: video1, alt: "video1" },
    { type: 'image', url: slide1, alt: "slide1" },
    { type: 'image', url: slide2, alt: "slide2" },
    { type: 'image', url: slide3, alt: "slide3" },
    { type: 'image', url: slide4, alt: "slide4" },
    { type: 'image', url: slide5, alt: "slide5" },
    { type: 'image', url: slide6, alt: "slide5" },
  ];

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    >
      <ImageSlider media={media}  />
    </div>
  );
};

export default HeroBanner;
