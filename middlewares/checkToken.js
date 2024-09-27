import jwt from 'jsonwebtoken';

const checkToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.render("../views/user/signup.ejs")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId }; 
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
    }
};

export default checkToken;
