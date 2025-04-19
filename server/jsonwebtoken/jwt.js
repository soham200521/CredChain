const jwt=require('jsonwebtoken');
const gentoken=(user)=>{
    const key=process.env.KEY;
    const token=jwt.sign({firstname:user.firstName,email:user.email,id:user._id},key);
    return token;
}

module.exports={gentoken};