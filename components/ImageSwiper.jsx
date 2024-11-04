import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination'

const ImageSwiper = ({ media }) => {
    return (
        <section aria-label="Image Slider" className="image-slider-main-container">
            <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]} >
                {media.map(({ type, url, alt }, index) => (
                    type === 'image' ? (
                        <SwiperSlide key={url}>
                            <img src={url} alt={alt} className="img-slider-img" />
                        </SwiperSlide>
                    ) : (
                        <SwiperSlide key={url}>
                            <video src={url} alt={alt} className="img-slider-img" autoPlay muted loop />
                        </SwiperSlide>
                    )
                ))}
            </Swiper>
        </section>
    )
}

export default ImageSwiper