const {z} = require('zod')
const Admin = require('../models/adminmodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async(req,res) => {

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
    const hashedpassword = await bcrypt.hash(password,saltRounds)

   const admin = new Admin({
        email,
        password : hashedpassword,
        fullname
   })

   await admin.save();
   return res.status(200).json({message : "Admin created successfully"})

}catch(error){
   return res.status(500).json({message : error.message || "An error occured"})
}
}

const signin = async(req,res) => {
     
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
        const admin  = await Admin.findOne({email})
        if(!admin){
            return res.status(500).json({message : "Admin is not exists"})
        }

        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(500).json({message : "Passowrd is incorrect"})
        }
        const payload = {userId : admin._id}

        const token = jwt.sign(payload,process.env.JWT_ADMIN_SECRET)

        return res.status(200).json({token})
        
   }catch(error){
       console.error(error);
       return res.status(403).json({message : error.message || "Internal error occured"})
       
   }
}

module.exports = {
     signup,
     signin
}