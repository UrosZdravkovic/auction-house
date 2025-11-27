import { useParams } from "react-router-dom";
import { useAuction } from "@/hooks/useAuctions";
import { getThumbnailUrl } from "@/services/storageService";
import ImageSlider from "@/components/ui/ImageSlider";

export const AdminAuctionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: auction, isLoading, error } = useAuction(id!);

    return (
        <div className="min-h-screen bg-background p-8">

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-error">Error: {error.message}</p>}
            {auction && (
                <>
                    <div className="flex ">
                        <div>
                            <ImageSlider images={auction.imageUrls.map(url => getThumbnailUrl(url))} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-text-primary mb-4">{auction.title}</h1>
                            <p className="text-text-secondary">{auction.description}</p>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
}