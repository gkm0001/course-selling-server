const mongoose = require('mongoose');
const { string } = require('zod');

const courseSchema = new mongoose.Schema({
     title : {
         type: String,
         required : true,
     },
     creatorId : {
         type : mongoose.Schema.Types.ObjectId,
         ref : 'admin',
         required : true
     },
     description : {
         type : String,
         required : true
     },
     imageUrl : {
         type : String,
         required : true
     },
     price : {
         type : String,
         required : true
     }
     
})

const courseModel = mongoose.model("course",courseSchema);
module.exports = courseModel