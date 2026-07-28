import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const uploadOnCloudnary = async (localFilePath)=>{ 
    try {
        if(!localFilePath){ // check if a file path provided or not
            return null;
        }
        // upload the file on cloudnary
        
    cloudinary.config({ 
        cloud_name: process.env.CLDNRY_USER_NAME, 
        api_key: process.env.CLDNRY_API_KEY, 
        api_secret: process.env.CLDNRY_API_SECRET 
    });
    
        const response = await cloudinary.uploader.upload(localFilePath , { // this fn uses to upload file in cloudanry
            resource_type:"auto"
        })

        // file has been uploaded successfuly
        //console.log("File is uploaded on cloudnary" , response.url);
        fs.unlinkSync(localFilePath)
        return response;
        
    } catch (error) {
        console.log("CLOUDINARY UPLOAD ERROR:", error);
        fs.unlinkSync(localFilePath) // remove the locally save temporary file as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary = async (publicId) => {
    try {
        if(!publicId) return null;
        const response = await cloudinary.uploader.destroy(publicId);
        return response;

    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return null;
    }
}
export {uploadOnCloudnary , deleteOnCloudinary};


// behind the scene
//  we use this fn to upload file on cloudanry 
// see what happens
// first by multer process the file , and req.file contains file info 
// when multer stores it in your local temp file it pass the file path in cloudanry fn the cloudanry fn takes the path and upload on server