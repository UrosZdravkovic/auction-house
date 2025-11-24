import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HiUpload, HiX } from "react-icons/hi";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ImagePicker = ({ value, onChange, error }: ImagePickerProps) => {
  const [preview, setPreview] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = () => {
    onChange("");
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>Image</Label>

      {/* File Upload Area */}
      {!preview && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            error
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
          />
          {isUploading ? (
            <p className="text-text-secondary">Processing image...</p>
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClearImage}
            className="absolute top-2 right-2"
          >
            <HiX className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};