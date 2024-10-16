const jwt = require('jsonwebtoken')

const userAuthMiddleware = (req,res,next) => {

    try {
        const token = req.header('Authorization')?.replace("Bearer ","");
     //    console.log(token);
     //    console.log(typeof token);
        
        
        if(!token){
             return res.status(401).json({message : "Token not found"})
        }
        const verify = jwt.verify(token,process.env.JWT_ADMIN_SECRET)
         req.userId = verify.userId
         next();

    }catch(error){
         console.log(error);
         return res.status(401).json({message : error.message || "Unable to verify"})
        
    }      
}

module.exports = userAuthMiddleware