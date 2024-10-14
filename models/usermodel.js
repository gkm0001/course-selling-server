const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
      
      fullname : {
         type: String,
         required : true,
      },
      email : {
         type:String,
         required : true,
         unique : true
      },
      password : {
         type :String,
         required : true
      }, purchasedCourses: [
        // List of purchased course IDs
        {
            type: mongoose.Schema.Types.ObjectId, // Reference to Course model
            ref: "Course",
        },
    ],
})

const usersModel = mongoose.model("user", userSchema)
module.exports = usersModel;
