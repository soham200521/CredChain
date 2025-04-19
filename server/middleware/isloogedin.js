const User=require('../models/user');
const jwt=require('jsonwebtoken');
const jwt_key=process.env.KEY

const isloggedin=async(req,res,next)=>{
    try{
        if(!req.cookies.token||req.cookies.token===''){
            return res.status(500).json({message:"You must login first"});
        }
        const data=jwt.verify(req.cookies.token,jwt_key);
        const user=await User.findOne({email:data.email});
        console.log(user)
        if(!user){
            return res.status(500).json({message:"You must login first"});
        }
        req.user=user;
        next();
    }
    catch(err){
        console.log(err);
    }

}
module.exports={isloggedin};