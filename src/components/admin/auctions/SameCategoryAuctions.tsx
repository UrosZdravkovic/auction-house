import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSameCategoryAuctions } from "@/hooks/useAuctions";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';

type SameCategoryAuctionsProps = {
  categoryId: string;
  currentAuctionId: string;
};

type Auction = {
  id: string;
  title: string;
  currentBid: number;
  imageUrls?: string[];
};

function AuctionCard({ auction }: { auction: Auction }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/auctions/${auction.id}`)}
      className="bg-background rounded-lg border border-border overflow-hidden hover:border-primary transition-colors cursor-pointer"
    >
      {auction.imageUrls?.[0] && (
        <img
          src={auction.imageUrls[0]}
          alt={auction.title}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium text-text-primary truncate">{auction.title}</h3>
        <p className="text-xs text-text-secondary mt-1">
          Current Bid: <span className="text-primary font-semibold">${auction.currentBid.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

export default function SameCategoryAuctions({ categoryId, currentAuctionId }: SameCategoryAuctionsProps) {
  const { data: similarAuctions } = useSameCategoryAuctions(categoryId, currentAuctionId);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  if (!similarAuctions || similarAuctions.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Related Auctions</h2>
        <p className="text-text-secondary">No related auctions found.</p>
      </div>
    );
  }

  const showSlider = similarAuctions.length > 3;

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Related Auctions</h2>
        
        {showSlider && (
          <div className="flex gap-2">
            <button
              onClick={() => swiper?.slidePrev()}
              className="bg-background hover:bg-primary/10 text-text-primary p-1.5 rounded-lg border border-border transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              className="bg-background hover:bg-primary/10 text-text-primary p-1.5 rounded-lg border border-border transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showSlider ? (
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={12}
          loop={true}
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            550: {
              slidesPerView: 3,
            },
          }}
        >
          {similarAuctions.map(auction => (
            <SwiperSlide key={auction.id}>
              <AuctionCard auction={auction} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
          {similarAuctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}