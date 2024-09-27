import jwt from 'jsonwebtoken';

const checkToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.render("../views/user/signup.ejs",{token:null,message:"Please Login or Signup"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId }; 
        next();
    } catch (err) {
        return res.render('../views/user/login.ejs',{token:null,message: "Authentication Failed" });
    }
};

export default checkToken;
