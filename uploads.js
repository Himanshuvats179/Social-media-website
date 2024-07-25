const fs=require('fs');

const path=require('path');

const {StatusCodes}=require('http-status-codes');

const CustomError=require('../errors');

const {log}=require('console');
const cloudinary=require('cloudinary').v2;

const uploadUserImage=async (req,res)=>{
    const result=await cloudinary.uploader.upload(req.files.image.tempFilePath,{
        use_filename:true,folder:'interact'
    })
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
}

module.exports={
    uploadUserImage
}