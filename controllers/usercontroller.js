const {z} = require('zod')
const User = require('../models/usermodel')
const bcrypt = require('bcrypt')
const purchase = require('../models/purchasemodel')
const course = require('../models/coursemodel')
const jwt = require('jsonwebtoken')
const client = require('../config/redisClient')

const signup = async(req,res) => {
    //adding zod validation 
  
     const requiredBody = z.object({
             email : z.string().email({ message: "Invalid email address" }).max(100),
             password : z.string().min(6, { message: "Password must be at least 6 characters long" }).max(100),
             fullname : z.string().min(1, { message: "Full name is required" }).max(100)
         })

    const parseDatawithsuccess = requiredBody.safeParse(req.body);

    if(!parseDatawithsuccess.success){
        return res.json({
             message:"Incorrect Format"
        })      
    }

    const {email,password,fullname} = parseDatawithsuccess.data;

    try {
         // Hash the password
         const saltRounds = 5;
        const hashedpassword = await  bcrypt.hash(password,saltRounds)

        const user = new User({
             email,
             password : hashedpassword,
             fullname
        })
     
        await user.save();
        return res.status(200).json({message : "User created successfully"})

    }catch(error){
        return res.status(500).json({message : error.message || "An error occured"})
    }
    
}

const login = async(req,res) => {

    const requiredBody = z.object({
         email : z.string().max(100).email(),
         password : z.string().max(100)
    })

    const parseDatawithsuccess = requiredBody.safeParse(req.body);

    if(!parseDatawithsuccess.success){
         return res.status(500).json({message : "Incorrect format"})
    }

    const {email , password} = parseDatawithsuccess.data;

    try{
         const user  = await User.findOne({email})
         if(!user){
             return res.status(500).json({message : "User is not exists"})
         }

         const isMatch = await bcrypt.compare(password,user.password);
         if(!isMatch){
             return res.status(500).json({message : "Pa"})
         }
         const payload = {userId : user._id}

         const token = jwt.sign(payload,process.env.JWT_SECRET)

         return res.status(200).json({token})
         
    }catch(error){
        console.error(error);
        return res.status(403).json({message : error.message || "Internal error occured"})
        
    }
     
}

//old way
// const coursepurchases =async (req,res) => {
//      const userId = req.userId;
//      try{
//          const purchasesExists = await purchase.find({ 
//             userId
//          })  
//          if(!purchasesExists){
//              return res.status(401).json({message :  "No purchases found for this user"})
//          }

//          // Find course by course Id 
//          const findCourse = await course.find({
//              _id : {$in : purchasesExists.map(x => x.courseId)}
//          })

//          if (!findCourse) {
//             return res.status(404).json({ message: "Course not found" });
//         }

//          return res.status(200).json({
//              message : "Successfully retrieved the course",
//              coursedata : findCourse,
//              purchase : purchasesExists
//          })

//      }catch(error){
//         // Handle any unexpected errors
//         return res.status(500).json({ message: error.message || "An error occurred while retrieving the course" });
//      }
// }

//total courses purchased by user
//new way
const coursepurchases =async (req,res) => {
     const userId = req.userId;
     try{
         const purchasesExists = await User.findOne({ 
            _id : userId
         })  
         if(!purchasesExists){
             return res.status(401).json({message :  "No purchases found for this user"})
         }

         const redisUser = `totalCourse:${userId}`
         const getCourse = client.get(redisUser)

         if (getCourse) {
            return res.status(200).json({
                message: "Course fetched successfully",
                courses: JSON.parse(getCourse)
            });
        }

         // Find course by course Id 
         const findCourse = await course.find({
             _id : {$in : purchasesExists.purchasedCourses}
         })

         if (!findCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

         return res.status(200).json({
             message : "Successfully retrieved the course",
             coursedata : findCourse,
         })

     }  catch(error){
        // Handle any unexpected errors
        return res.status(500).json({ message: error.message || "An error occurred while retrieving the course" });
     }
}

module.exports = {
     signup,
     login,
     coursepurchases
}