const mongoose = require('mongoose')
const Student = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    batch:{
        type:Number,
        required:true
    },
    collegeID:{
        type:String,
        required:true
    },
    skills:[{
        type: String,
        required:true 
    }]

})
module.exports= mongoose.model("Student",Student)