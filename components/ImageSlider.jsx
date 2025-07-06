import React, { useState, useEffect, useRef } from "react";
import { ArrowBigRight, Circle, CircleDot } from "lucide-react";
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight  } from "react-icons/fa";
import Router from "next/router";

export function ImageSlider({ media }) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const router = Router;

  function showNextMedia() {
    setMediaIndex(index => {
      if (index === media.length - 1) return 0;
      return index + 1;
    });
  }

  function showPrevMedia() {
    setMediaIndex(index => {
      if (index === 0) return media.length - 1;
      return index - 1;
    });
  }

  function handleImageClick(page) {
    router.push(page);
  }

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        showNextMedia();
      }, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, media.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Sliding animation styles
  const sliderTrackStyle = {
    display: "flex",
    transition: "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
    transform: `translateX(${-100 * mediaIndex}%)`,
    width: `${media.length * 100}%`
  };
  const slideStyle = {
    minWidth: "100%",
    height: "auto",
    cursor: "pointer"
  };

  return (
    <section
      aria-label="Image Slider"
      className="image-slider-main-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <a href="#after-media-slider-controls" className="skip-link">
        Skip Media Slider Controls
      </a> */}
      <div style={{ display: "flex", overflow: "hidden" }}>
        <div style={sliderTrackStyle}>
          {media.map(({ type, url, page }, index) => (
            type === 'image' ? (
              <img
                key={url}
                src={url}
                alt='slides'
                onClick={() => handleImageClick(page)}
                aria-hidden={mediaIndex !== index}
                className="img-slider-img"
                style={slideStyle}
              />
            ) : (
              <video
                key={url}
                src={url}
                alt='slides'
                onClick={() => handleImageClick(page)}
                aria-hidden={mediaIndex !== index}
                className="img-slider-video"
                style={slideStyle}
                autoPlay
                muted
                loop
              />
            )
          ))}
        </div>
      </div>
      {/* <div className="hero-banner-button-container">
        <div>
          <Link href={`/Customs`}>
            <button type="button">Explore</button>
          </Link>
          <div className="hero-banner-desc">
            Wear Your Own Style
          </div>

        </div>
      </div> */}

      <button
        onClick={showPrevMedia}
        className="img-slider-btn"
        aria-label="View Previous Media"
      >
        <FaChevronLeft aria-hidden  />
      </button>
      <button
        onClick={showNextMedia}
        className="img-slider-btn"
        style={{ right: 0 }}
        aria-label="View Next Media"
      >
        <FaChevronRight  aria-hidden />
      </button>
      {/* <div
        style={{
          position: "absolute",
          bottom: ".5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: ".25rem",
        }}
      >
         {media.map((_, index) => (
          <button
            key={index}
            className="img-slider-dot-btn"
            aria-label={`View Media ${index + 1}`}
            onClick={() => setMediaIndex(index)}
          >
            {index === mediaIndex ? (
              <CircleDot aria-hidden />
            ) : (
              <Circle aria-hidden />
            )}
          </button>
        ))}
      </div> */}
      {/* <div id="after-media-slider-controls" /> */}
    </section>
  );
}
