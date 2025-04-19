const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    aadhar:{
        type:Number,
        require:true
    },
    PAN:{
        type:String,
        require:true
    },
    mobileNo:{
        type:String,
        require:true
    },
    
    address:{
        type:String,
        require:true  
    },
    email:{
        type:String,
        require:true
    },
    details: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'detail'
        }
      ]
    

})

module.exports=mongoose.model('user',userSchema);