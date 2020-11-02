const mongoose = require('mongoose')
const College = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    founded:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    studentCount:{
        type:Number,
        required:true
    },
    courses:[{
        type: String,
        required:true 
    }]

})
module.exports= mongoose.model("College",College,"colleges")