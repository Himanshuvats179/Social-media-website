const nodemailer=require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const {BadRequestError}=require('../errors')
const User=require('../models/User');
const jwt=require('jsonwebtoken');
const axios=require('axios');
const {updateUser}=require('../controllers/auth');
const transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_APP_PSWD
    }
})

const sendEmail=async(req,res)=>{
    // const TestAccount=await nodemailer.createTestAccount();
        const {email}=req.body;
        if(!email)
        throw new BadRequestError('Please enter your email');
        const user=await User.findOne({email});
        if(!user)
        throw new BadRequestError('Email not in use try registering');
        const userID=user._id;
        const name=user.name;
        const image=user.image;
        // console.log(user);
        // console.log(userID);
        const token=jwt.sign({userID,name},process.env.JWT_secret,{
            expiresIn:'1h'
        });
    
        // await axios.get('/');
        // console.log(token);
    //   console.log('hi');
        
        const port = process.env.PORT || 3000;
        const info=await transporter.sendMail({
            from:'Interact',
            to:email,
            subject:'Login',
            html: `<h2>
            click the link to continue</h2>
            localhost:${port}?token=${token}&name=${name}&email=${email}&image=${image}&userID=${userID}`
        });
        res.status(200).json(info);
}


module.exports=sendEmail