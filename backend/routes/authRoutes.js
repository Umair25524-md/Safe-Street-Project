const express = require('express');
const router=express.Router();
const {getAuthentication,logout,login,signup,verifyEmail,googleLogin,googleCallback}=require('../controllers/authController')

router.get('/isAuthenticated',getAuthentication)
router.get('/logout',logout);
router.post('/login',login)
router.post('/signup',signup)
router.get('/verify-email',verifyEmail)


//Google OAuth routes
router.get('/auth/google',googleLogin)
router.get('/auth/google/callback',googleCallback)

module.exports=router;