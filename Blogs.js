const mongoose=require('mongoose');

const BlogSchema=new mongoose.Schema({
    topics:{
        type:String,
        required:[true,'please provide the related topic(s)'],
        maxlength:[100,'heading can\'t be larger than 100 characters'],
        trim:true
    },
    textContent:{
        type:String,
        required:[true,'can\'t leave the text empty'],
        maxlength:[700,'max length of text is 700 characters'],
        trim:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide the user']
    },
    name:{
        type:String,
        required:[true,'please provide the username'],
    },
    image:{
        type:String,
        default:'https://placehold.jp/100x150.png'
    }
},{timestamps:true})

module.exports=mongoose.model('Blog',BlogSchema);