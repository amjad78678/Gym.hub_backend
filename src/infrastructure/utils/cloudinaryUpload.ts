import { buffer } from "stream/consumers";
import cloudinary from "../config/cloudinary";
import fs from "fs";

class CloudinaryUpload {
  async upload(filePath: string, folder: string) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    return result;
  }

  async uploadVideo(filePath: string, folder: string) {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: folder,
    });
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
    return result;
  }

  async uploadBuffer(
    buffer: Buffer,
    filePath: string,
    uploadPreset: any,
    folder: string
  ) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { upload_preset: uploadPreset, folder: folder },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    return result;
  }

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
      
    } catch (error) {
      console.error("error........ deleting cloudinary image", error);
    }
  }
}

export default CloudinaryUpload;
