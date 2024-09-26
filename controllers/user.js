import User from '../models/user.js'
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const validDomain = "@iith.ac.in"
function validateEmail(email){
    return email.endsWith(validDomain)
}

const otpStore = {};

export const signup = async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(401).json({ "message": "Enter all the details" });
        }

        if (!validateEmail(email)) {
            return res.status(401).json({ "message": "Please use a valid IITH email" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ "message": "User already exists. Please try to login" });
        }

        const otp = generateOtp();
        otpStore[email] = { otp, createdAt: Date.now() };  

     
        await sendOtp(email, otp);
        res.render("../views/user/otp.ejs");

    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};



export const verifyOtpAndSaveUser = async (req, res) => {
    const { username, password, degree, isPlaced, hostel,year,branch } = req.body;
    try {
        
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ "message": "No token provided" });
        }

 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            degree,
            hostel,
            year,
            branch,
            isPlaced: isPlaced === 'on'
        });

        await newUser.save();

       
        delete otpStore[email];

        
        res.clearCookie('token');
        const newToken = jwt.sign(
            { userId: newUser._id, email: newUser.email },  
            process.env.JWT_SECRET,  
            { expiresIn: '1h' }  
        );
        res.cookie("token",newToken,{httpOnly:true})
        return res.render("../views/home.ejs");

    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};



export const verifyOtp = (req, res) => {
    const { clientOtp, email } = req.body;

    try {
        const otpData = otpStore[email];  
        if (!otpData) {
            return res.status(400).json({ "message": "No OTP found. Please request a new OTP." });
        }

        const { otp: storedOtp, createdAt } = otpData;

        
        const otpValidityDuration = 10 * 60 * 1000; 
        if (Date.now() - createdAt > otpValidityDuration) {
            delete otpStore[email];  
            return res.status(400).json({ "message": "OTP expired. Please request a new OTP." });
        }

        
        if (storedOtp.toString() !== clientOtp.toString()) {
            return res.status(400).json({ "message": "Invalid OTP. Please try again." });
        }

       
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,  
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
        });
        
        res.render("../views/user/afterotp.ejs");
        // return res.status(200).json({ "message": "OTP verified", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
};

async function sendOtp(email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS  
        }
    });

    let mailOptions = {
        from: `"Signup Verification" <${process.env.MAIL}>`,
        to: email,
        subject: 'OTP for Signup Verification',
        text: `Your OTP for signup is ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
}


function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}


export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                "message": "User not found"
            });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                "message": "Wrong Password"
            });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },  
            process.env.JWT_SECRET,  
            { expiresIn: '1h' }  
        );
        // return res.status(200).json({
        //     "message": "Login Successful",
        //     "token" : token
        // });
        res.cookie('token', token, {
            httpOnly: true,
        });
        res.render("../views/home.ejs")
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "Internal Server Error"
        });
    }
};

export const logout = (req,res)=>{
    try {
        res.clearCookie('newtoken'); 
        res.render("../views/user/login.ejs");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}