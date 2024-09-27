import express from 'express';
import { login, signup, verifyOtpAndSaveUser,verifyOtp, logout } from '../controllers/user.js';

const router = express.Router();

router.get("/signup",(req,res)=>{
    const token = req.cookies.token
    res.render("../views/user/signup.ejs",{token})
})
router.get("/login",(req,res)=>{
    const token = req.cookies.token
    res.render("../views/user/login.ejs",{token})
})
router.get("/logout",logout)
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/verify-otp/save', verifyOtpAndSaveUser);
router.post('/login', login);


export default router;
