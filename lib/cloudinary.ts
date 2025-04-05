import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file: any, folder: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto"
    });
    
    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      resourceType: uploadResponse.resource_type
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload media");
  }
};

export const deleteFromCloudinary = async (publicId: string, resourceType: string = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return true;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};