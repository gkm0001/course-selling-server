const jwt = require('jsonwebtoken')

const adminAuthMiddleware = (req,res,next) => {

    try {
        const token = req.header('Authorization')?.replace("Bearer ","");
        console.log(token);
        
        if(!token){
             return res.status(401).json({message : "Token not found"})
        }
        const verify = jwt.verify(token,process.env.JWT_SECRET)

        // In req.userId (userId name could be anything ) by verify.userId came from payload
         req.userId = verify.userId
         next();

    }catch(error){
         console.log(error);
         return res.status(401).json({message : error.message || "Unable to verify"})
    }
       
}

module.exports = adminAuthMiddleware