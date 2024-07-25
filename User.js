const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name not there'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'email not there'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password not there'],
        minlength:7,
    },
    image:{
        type:String,
        // required:true
        default:'https://placehold.jp/100x150.png'
    }
})


UserSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10);
    if(this.password.length<7)
    throw new BadRequestError('Password too short');
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

UserSchema.methods.createJWT=function(){
    // console.log('hi');
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_secret,{
        expiresIn:'30d'
    })
}

UserSchema.methods.comparePassword=async function(candidatePassword){
    const isMatch=await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

module.exports=mongoose.model('User',UserSchema);