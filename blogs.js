const Blog=require('../models/Blogs');
const {StatusCodes}=require('http-status-codes');

const {BadRequestError,NotFoundError,UnauthenticatedError}=require('../errors');


const getAllBlogs=async (req,res)=>{
    // console.log('hi');
    let {topics,userID,sort}=req.query;
    
    // console.log(req.query);
    // console.log(topics,userID,sort);
    const queryObject={};
    if(topics){
        queryObject.topics={$regex:topics,$options:'i'};
    }
    // console.log(queryObject);
    if(userID){
        queryObject.createdBy=userID;
    }
    // console.log(queryObject);
    if(!sort){
        sort='-createdAt';
    }
    // console.log(queryObject);
    const page=Number(req.query.page)||1,limit=Number(req.query.limit)||10;
    const skip=(page-1)*10;
    const blogs= await Blog.find(queryObject).sort(sort).skip(skip).limit(limit);
    // console.log(blogs);
    res.status(StatusCodes.OK).json({blogs,count:blogs.length});
}



const getBlog=async(req,res)=>{
    const {params:{blogID}}=req;
    const blog=await Blog.findOne({
        _id:blogID
    })
    if(!blog){
        throw new NotFoundError(`No job with id ${jobID}`);
    }
    res.status(StatusCodes.OK).json({blog});
}

const createBlog=async(req,res)=>{
    req.body.createdBy=req.user.userID;
    // console.log(req.body);
    const blog=await Blog.create(req.body);
    res.status(StatusCodes.CREATED).json({blog});

}

const updateBlog= async (req,res)=>{
    const {params:{blogID,userID}}=req;

    // const that_blog=await Blog.findById({_id:blogID});
    const currUserID=req.user.userID;
    if(currUserID!=userID)
    throw new UnauthenticatedError('You don\'t have the access to edit this');
    const blog=await Blog.findByIdAndUpdate({
    _id:blogID,createdBy:userID
    },req.body,{
        new:true,
        runValidators:true
    });
    if(!blog){
        throw new NotFoundError(`No job with id ${jobID}`);
    }
    res.status(StatusCodes.CREATED).json({blog});
}

const deleteBlog=async(req,res)=>{
    const {params:{blogID,userID}}=req;

    // const that_blog=await Blog.findById({_id:blogID});
    // console.log(blogID);
    // console.log(userID);
   
    const currUserID=req.user.userID;
    // console.log(currUserID)
    if(currUserID!=userID)
    throw new UnauthenticatedError('You don\'t have the access to delete this');
    const blog=await Blog.findByIdAndDelete({
        _id:blogID,createdBy:userID
    });
    // console.log(blog);
    res.status(StatusCodes.OK).send();
}

module.exports={
    createBlog,getAllBlogs,getBlog,updateBlog,deleteBlog
};