import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "e_commerce",
        resource_type: "auto",
    }
});
const deleteCloudinary = async (publicId) => {
    try {
        let result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });

        if (result.result === "not found") {
            result = await cloudinary.uploader.destroy(publicId, {
                resource_type: "video",
            });
        }
        if (result.result === "not found") {
            result = await cloudinary.uploader.destroy(publicId, {
                resource_type: "raw",
            });
        }

        return result;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};

const uploadCloudinary = multer({ storage });
export { uploadCloudinary, deleteCloudinary };