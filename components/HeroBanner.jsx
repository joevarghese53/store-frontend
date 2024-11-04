import React from 'react';

import { ImageSlider } from './ImageSlider';
import ImageSwiper from './ImageSwiper';

const slide1 = '/img/slide-01.png';
const slide2 = '/img/slide-02.png';
const slide3 = '/img/slide-03.png';
const slide4 = '/img/slide-04.png';
const slide5 = '/img/slide-05.png';
const slide6 = '/img/slide-06.png';

const video1 = '/videos/video-01.mp4';
const video2 = '/videos/video-02.mp4';
const video3 = '/videos/video-03.mp4';

const mslide1 = '/img/mslide-01.png';
const mslide2 = '/img/mslide-02.png';
const mslide3 = '/img/mslide-03.png';
const mslide4 = '/img/mslide-04.png';
const mslide5 = '/img/mslide-05.png';
const mslide6 = '/img/mslide-06.png';

const mvideo1 = '/videos/mvideo-01.mp4';
const mvideo2 = '/videos/mvideo-02.mp4';
const mvideo3 = '/videos/mvideo-03.mp4';


const HeroBanner = () => {
  const desktopMedia = [
    // { type: 'video', url: video1, alt: "video1" },
    { type: 'image', url: slide1, page: "/Customs" },
    { type: 'image', url: slide2, page: "/FilteredProductsMale?category=66adfb21a1698be6bdfa8e59" },
    { type: 'image', url: slide3, page: "/FilteredProductsMale?category=66afb54bc0aa9bfafb408a1f" },
    { type: 'image', url: slide4, page: "/FilteredProductsMale?category=66afb550c0aa9bfafb408a24" },
    { type: 'image', url: slide5, page: "/Customs" },
    { type: 'image', url: slide6, page: "/Customs" },
  ];

  const mobileMedia = [
    { type: 'image', url: mslide1, page: "/Customs" },
    { type: 'image', url: mslide2, page: "/FilteredProductsMale?category=66adfb21a1698be6bdfa8e59" },
    { type: 'image', url: mslide3, page: "/FilteredProductsMale?category=66afb54bc0aa9bfafb408a1f" },
    { type: 'image', url: mslide4, page: "/FilteredProductsMale?category=66afb550c0aa9bfafb408a24" },
    { type: 'image', url: mslide5, page: "/Customs" },
    { type: 'image', url: mslide6, page: "/Customs" },
  ];

  return (
    <>
      <div className='hero-banner-desktop-container'>
        <ImageSlider media={desktopMedia} />
      </div>
      <div className='hero-banner-mobile-container'>
        <ImageSwiper media={mobileMedia} />
      </div>
    </>
  );
};

export default HeroBanner;
