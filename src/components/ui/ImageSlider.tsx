import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';

type ImageSliderProps = {
  images: string[];
  alwaysShowArrows?: boolean;
};

export default function ImageSlider({ images, alwaysShowArrows = false }: ImageSliderProps) {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Show arrows: always if prop is true, or on hover for larger screens
  // When alwaysShowArrows is "responsive", show always below xl-custom (1050px)
  const arrowVisibilityClass = alwaysShowArrows
    ? "opacity-100"
    : "max-xl-custom:opacity-100 opacity-0 group-hover:opacity-100";

  return (
    <div className="relative bg-surface rounded-xl overflow-hidden shadow-lg group">
  
      
      <Swiper
        onSwiper={setMainSwiper}
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-contain" 
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm font-medium z-5">
        {activeIndex + 1} / {images.length}
      </div>

      {/* Custom Navigation Arrows */}
      <button
        onClick={() => mainSwiper?.slidePrev()}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-300 ${arrowVisibilityClass}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => mainSwiper?.slideNext()}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-300 ${arrowVisibilityClass}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}