import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HiUpload, HiX } from "react-icons/hi";
import { uploadImage } from "../../services/storageService";
import { useAuth } from "../../hooks/useAuth";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ImagePicker = ({ value, onChange, error }: ImagePickerProps) => {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    if (!user) {
      setUploadError("You must be logged in to upload images");
      return;
    }

    setIsUploading(true);

    try {
      // Create local preview first (for immediate feedback)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const downloadURL = await uploadImage(file, user.uid);
      
      // Update form with Firebase URL
      onChange(downloadURL);
      setPreview(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload image");
      setPreview("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = () => {
    onChange("");
    setPreview("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayError = error || uploadError;

  return (
    <div className="space-y-3">
      <Label>Image</Label>

      {/* File Upload Area */}
      {!preview && (
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
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div>
              <div className="w-12 h-12 mx-auto mb-3 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-secondary">Uploading image...</p>
            </div>
          ) : (
            <>
              <HiUpload className="w-12 h-12 mx-auto mb-3 text-text-secondary" />
              <p className="text-sm text-text-primary font-medium mb-1">
                Click to upload an image
              </p>
              <p className="text-xs text-text-secondary">
                PNG, JPG, GIF up to 5MB
              </p>
            </>
          )}
        </div>
      )}

      {displayError && <p className="text-sm text-red-600">{displayError}</p>}

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-border"
            onError={() => {
              setUploadError("Failed to load image");
              setPreview("");
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClearImage}
            className="absolute top-2 right-2"
            disabled={isUploading}
          >
            <HiX className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};