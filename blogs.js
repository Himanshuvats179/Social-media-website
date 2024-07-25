const express=require('express');

const router=express.Router();

// const auth=require('../middleware/authentication')
const {getAllBlogs,getBlog,updateBlog,deleteBlog,createBlog}=require('../controllers/blogs');

router.route('/').get(getAllBlogs).post(createBlog);
router.route('/:blogID').get(getBlog);
router.route('/:userID/:blogID').patch(updateBlog).delete(deleteBlog);


module.exports=router;