const express=require('express');
const router=express.Router();
const authenticateUser=require('../middleware/authentication')
const {login,register,deleteUser,updateUser,getUsers}=require('../controllers/auth');
const {uploadUserImage}=require('../controllers/uploads')

router.post('/register',register);
router.post('/login',login);
router.post('/upload',authenticateUser,uploadUserImage);
router.patch('/update',authenticateUser,updateUser);
router.delete('/delete',authenticateUser,deleteUser);
router.get('/',authenticateUser,getUsers);
module.exports=router;