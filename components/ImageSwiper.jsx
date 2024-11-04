import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination'
import Router from "next/router";


const ImageSwiper = ({ media }) => {
    const router = Router;

    function handleImageClick(page) {
        router.push(page);
    }


    return (
        <section aria-label="Image Slider" className="image-slider-main-container">
            <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]} >
                {media.map(({ type, url, page }, index) => (
                    type === 'image' ? (
                        <SwiperSlide key={url}>
                            <img src={url} alt='slides' className="img-slider-img" onClick={() => handleImageClick(page)} />
                        </SwiperSlide>
                    ) : (
                        <SwiperSlide key={url}>
                            <video src={url} alt='slides' className="img-slider-img" onClick={() => handleImageClick(page)} autoPlay muted loop />
                        </SwiperSlide>
                    )
                ))}
            </Swiper>
        </section>
    )
}

export default ImageSwiper