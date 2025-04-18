const mongoose=require('mongoose')
const conn=process.env.CONNECTION_STRING
const connection=mongoose.connect(conn);
module.exports=mongoose.connection;
