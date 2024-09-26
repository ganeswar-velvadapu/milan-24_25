import express from 'express';
import { login, signup, verifyOtpAndSaveUser,verifyOtp, logout } from '../controllers/user.js';

const router = express.Router();

router.get("/signup",(req,res)=>{
    res.render("../views/user/signup.ejs")
})
router.get("/login",(req,res)=>{
    res.render("../views/user/login.ejs")
})
router.get("/logout",logout)
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/verify-otp/save', verifyOtpAndSaveUser);
router.post('/login', login);


export default router;
