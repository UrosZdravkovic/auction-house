const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Upload an image to Cloudinary
 * @param file - The image file to upload
 * @param userId - The user's ID (for organizing uploads in folders)
 * @returns The secure URL of the uploaded image
 */
export const uploadImage = async (file: File, userId: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `auctions/${userId}`); // Organize by user
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    
    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Delete an image from Cloudinary
 * Note: This requires server-side implementation with API secret
 * For now, we'll just log it
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234/auctions/user123/image.jpg
    const matches = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
    
    if (matches) {
      const publicId = matches[1];
      console.log('Image to delete (public_id):', publicId);
      
      // Note: Actual deletion requires backend with API secret
      // You'd need to create a server endpoint that uses:
      // cloudinary.uploader.destroy(publicId, callback)
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

/**
 * Generate a thumbnail URL from Cloudinary image
 * @param imageUrl - Original Cloudinary image URL
 * @param width - Thumbnail width (default: 400)
 * @param height - Thumbnail height (default: 300)
 * @returns Transformed image URL
 */
export const getThumbnailUrl = (imageUrl: string, width = 400, height = 300): string => {
  if (!imageUrl.includes('cloudinary.com')) return imageUrl;
  
  return imageUrl.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
  );
};

/**
 * Generate an optimized URL for Cloudinary images
 * @param imageUrl - Original Cloudinary image URL
 * @returns Optimized image URL
 */
export const getOptimizedUrl = (imageUrl: string): string => {
  if (!imageUrl.includes('cloudinary.com')) return imageUrl;
  
  return imageUrl.replace(
    '/upload/',
    '/upload/q_auto,f_auto/'
  );
};