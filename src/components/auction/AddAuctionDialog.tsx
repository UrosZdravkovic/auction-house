import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "./ImagePicker";
import { useCreateAuction } from "../../hooks/useAuctions";
import { useAuth } from "../../hooks/useAuth";

interface AddAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "electronics",
  "art",
  "collectibles",
  "fashion",
  "home",
  "sports",
  "vehicles",
  "other",
] as const;

const auctionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  category: z.enum(categories, { message: "Please select a category" }),
  startPrice: z.string().min(1, "Starting price is required"),
  imageUrls: z.array(z.string()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
  endsAt: z.string().min(1, "End date is required"),
}).refine((data) => {
  const price = parseFloat(data.startPrice);
  return !isNaN(price) && price > 0;
}, {
  message: "Starting price must be greater than 0",
  path: ["startPrice"],
}).refine((data) => {
  const endDate = new Date(data.endsAt);
  return endDate > new Date();
}, {
  message: "End date must be in the future",
  path: ["endsAt"],
});

type AuctionFormData = z.infer<typeof auctionSchema>;

export const AddAuctionDialog = ({ open, onOpenChange }: AddAuctionDialogProps) => {
  const { user } = useAuth();
  const createAuction = useCreateAuction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      imageUrls: [],
    },
  });

  const categoryValue = watch("category");
  const imageUrlsValue = watch("imageUrls") || [];

  const onSubmit = async (data: AuctionFormData) => {
    if (!user) return;

    try {
      await createAuction.mutateAsync({
        title: data.title,
        description: data.description,
        category: data.category,
        startPrice: parseFloat(data.startPrice),
        imageUrls: data.imageUrls,
        ownerId: user.uid,
        endsAt: new Date(data.endsAt),
      });

      reset({ imageUrls: [] });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create auction:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Auction</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details below to create a new auction. All fields are required.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter auction title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the item in detail"
              {...register("description")}
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Category and Start Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryValue}
                onValueChange={(value) => setValue("category", value as typeof categories[number])}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startPrice">Starting Price ($)</Label>
              <Input
                id="startPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register("startPrice")}
                className={errors.startPrice ? "border-red-500" : ""}
              />
              {errors.startPrice && (
                <p className="text-sm text-red-600">{errors.startPrice.message}</p>
              )}
            </div>
          </div>

          {/* Image Picker */}
          <ImagePicker
            value={imageUrlsValue}
            onChange={(value) => setValue("imageUrls", value)}
            error={errors.imageUrls?.message}
          />

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endsAt">End Date & Time</Label>
            <Input
              id="endsAt"
              type="datetime-local"
              {...register("endsAt")}
              className={errors.endsAt ? "border-red-500" : ""}
            />
            {errors.endsAt && (
              <p className="text-sm text-red-600">{errors.endsAt.message}</p>
            )}
          </div>

          {/* Error Message */}
          {createAuction.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
              <p className="text-sm text-red-600">
                {createAuction.error?.message || "Failed to create auction"}
              </p>
            </div>
          )}
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={createAuction.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit(onSubmit)}
            disabled={createAuction.isPending}
          >
            {createAuction.isPending ? "Creating..." : "Create Auction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};