import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HiUpload, HiX } from "react-icons/hi";
import { uploadImage } from "../../../services/storageService";
import { useAuth } from "../../../hooks/useAuth";

interface ImagePickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  maxImages?: number;
}

export const ImagePicker = ({ value, onChange, error, maxImages = 5 }: ImagePickerProps) => {
  const { user } = useAuth();
  const [previews, setPreviews] = useState<string[]>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset error
    setUploadError("");

    // Check if adding these files would exceed the limit
    if (previews.length + files.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (!user) {
      setUploadError("You must be logged in to upload images");
      return;
    }

    // Validate all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Each image must be less than 5MB");
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload all files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const downloadURL = await uploadImage(file, user.uid);
        uploadedUrls.push(downloadURL);
      }

      // Update form with all URLs
      const newUrls = [...previews, ...uploadedUrls];
      onChange(newUrls);
      setPreviews(newUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = previews.filter((_, i) => i !== index);
    onChange(newUrls);
    setPreviews(newUrls);
    setUploadError("");
  };

  const displayError = error || uploadError;
  const canAddMore = previews.length < maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Images ({previews.length}/{maxImages})</Label>
        {previews.length > 0 && canAddMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <HiUpload className="w-4 h-4 mr-1" />
            Add More
          </Button>
        )}
      </div>

      {/* File Upload Area - Show when no images */}
      {previews.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            displayError
              ? "border-red-500 hover:border-red-600"
              : "border-border hover:border-primary"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div>
              <div className="w-12 h-12 mx-auto mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-secondary">Uploading images...</p>
            </div>
          ) : (
            <>
              <HiUpload className="w-12 h-12 mx-auto mb-3 text-text-secondary" />
              <p className="text-sm text-text-primary font-medium mb-1">
                Click to upload images
              </p>
              <p className="text-xs text-text-secondary">
                PNG, JPG, GIF up to 5MB each (max {maxImages} images)
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden input for adding more images */}
      {previews.length > 0 && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      )}

      {displayError && <p className="text-sm text-red-600">{displayError}</p>}

      {/* Image Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
                onError={() => {
                  setUploadError("Failed to load image");
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isUploading}
                >
                  <HiX className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
