import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

const uploadOnCloudinary=async(filePath)=>{
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret:process.env.CLOUDINARY_API_SECRET_KEY 
    });
    
    try {
        console.log(filePath)
        const cloudResponse=await cloudinary.uploader.upload(filePath,{
            resource_type:'auto'
        })
        fs.unlinkSync(filePath)//remove the file from temp location since it is not uploaded
        return cloudResponse
    } catch (error) {
        fs.unlinkSync(filePath)//remove the file from temp location since it is not uploaded
        console.log('errror in file upload');
        return null
    }
}


export {uploadOnCloudinary}





