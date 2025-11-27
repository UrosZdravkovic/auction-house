
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';

type ImageSliderProps = {
    images: string[]
}


const ImageSlider = ({ images }: ImageSliderProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className='w-lg space-y-4'>
      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Thumbs]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        effect="fade"
        fadeEffect={{
            crossFade: true,
        }}
        className="rounded-lg"
      >
        {images.map((imageUrl, index) => (
          <SwiperSlide key={imageUrl}>
            <div className="relative w-full h-96 bg-surface-hover">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Previews */}
      {images.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbs-swiper"
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {images.map((imageUrl, index) => (
            <SwiperSlide key={imageUrl}>
              <div className="cursor-pointer border-2 border-border hover:border-primary transition-all rounded-lg overflow-hidden h-20 bg-surface-hover">
                <img
                  src={imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ImageSlider;