const User=require('../models/User');
const jwt=require('jsonwebtoken');

const {UnauthenticatedError}=require('../errors')

const auth=async (req,res,next)=>{
    //check header
    // console.log('hiiii');
    // console.log(req.headers);
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication Error')
    }
    const token=authHeader.split(' ')[1];
    // console.log(token,'');
    // console.log(token);
    try {
        // console.log('hi');
        const payload=jwt.verify(token,process.env.JWT_secret);
        // console.log('bye');
        // console.log(payload)
        req.user={userID:payload.userId,name:payload.name}
        // console.log('hbdj');
        next();
    } catch (error) {
        
        throw new UnauthenticatedError('Authentication Error')
    }
}

module.exports=auth;