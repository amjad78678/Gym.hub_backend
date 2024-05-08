import sharp from "sharp";
import iSharpen from "../../useCase/interface/sharpen";
import CloudinaryUpload from "../utils/cloudinaryUpload";


const cloudinaryUpload=new CloudinaryUpload()
interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
  }

class SharpImages implements iSharpen {

   async sharpenImage(image: any,width: number, height: number,filePath: string): Promise<CloudinaryResponse> {
        const buffer = await sharp(image.path)
        .resize(width, height)
        .toBuffer();
        
        const result = await cloudinaryUpload.uploadBuffer(buffer,image.path,'ilhnxgqy') as CloudinaryResponse

        return result 
    
    }

}

export default SharpImages