const express = require('express');
const router=express.Router();
const {getAuthentication,logout,login,signup,verifyEmail}=require('../controllers/authController')

router.get('/isAuthenticated',getAuthentication)
router.get('/logout',logout);
router.post('/login',login)
router.post('/signup',signup)
router.get('/verify-email',verifyEmail)

module.exports=router;