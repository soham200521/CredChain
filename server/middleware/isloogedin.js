const User=require('../models/user');
const jwt=require('jsonwebtoken');
const jwt_key=process.env.KEY

const isloggedin = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token || req.cookies.token === '') {
            return res.status(401).json({ message: "You must login first" });
        }
        const data = jwt.verify(req.cookies.token, jwt_key);
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(401).json({ message: "User not found, please login again" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Authentication middleware error:", err.message);
        return res.status(401).json({ message: "Invalid or expired session. Please login again." });
    }
};
module.exports={isloggedin};