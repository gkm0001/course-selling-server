const mongoose = require('mongoose')

const adminSchema= new mongoose.Schema({
      
      fullname : {
         type : String,
         required : true,
      },
      email : { 
         type : String,
         required : true,
         unique : true
      },
      password : { 
         type : String,
         required : true,
      }
})

const adminModel = mongoose.model("admin",adminSchema);
module.exports = adminModel