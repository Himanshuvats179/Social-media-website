const User=require('../models/User');
const {StatusCodes}=require('http-status-codes');
const bcrypt=require('bcryptjs');
const {BadRequestError}=require('../errors');
const {UnauthenticatedError}=require('../errors');
const {NotFoundError}=require('../errors')
const jwt=require('jsonwebtoken');

const register=async(req,res)=>{
    const user= await User.create(req.body);
    // console.log(user);
    const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name,image:user.image,userId:user._id},token});
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    // console.log(email,password);
    if(!email||!password){
        // console.log('hi');
        throw new BadRequestError('Please provide email and password')
    }
    const user= await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials');
    }
    // console.log('hi');
    const isPasswordCorrect=await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const token=user.createJWT();
    res.status(StatusCodes.OK).json(({user:{name:user.name,image:user.image,userId:user._id},token}));
}

const updateUser=async(req,res)=>{
    // console.log(req.body);
   const {user:{userID}}=req.body;
  console.log(userID);
    if(!userID){
        throw new BadRequestError('UserID not available')
    }
    const {password}=req.body;
    const data=req.body;
    if(password){
        const salt=await bcrypt.genSalt(10);
        if(password.length<7)
        throw new BadRequestError('Password too short');
        const encrypassword=await bcrypt.hash(password,salt);
        data.password=encrypassword;
        // console.log(encrypassword);
    }
    // console.log(data);
    const user=await User.findByIdAndUpdate({
        _id:userID
    },data,{
        new:true,
        runValidators:true
    })
    if(!user){
        throw new NotFoundError(`No User found with id ${userID}`);
    }
    res.status(StatusCodes.OK).json({user});
}

const deleteUser=async(req,res)=>{
    const {user:{userID}}=req.body;
    const user= await User.findByIdAndDelete({_id:userID});
    if(!user)
    throw new NotFoundError(`No job with id ${jobID}`);
    res.status(StatusCodes.OK).json({user});
}

const getUsers=async(req,res)=>{

    const {name,userID}=req.query;
    // console.log(name,userID);
    const queryObject={};
    if(name){
        queryObject.name={$regex:name,$options:'i'};
    }
    if(userID){
        queryObject._id=userID;
    }
    // console.log(queryObject);
    // console.log(queryObject);
    const users=await User.find(queryObject);
    // console.log(users);
    res.status(StatusCodes.OK).json({users});
    // console.log(users);
}

module.exports={
    login,register,deleteUser,updateUser,getUsers
}