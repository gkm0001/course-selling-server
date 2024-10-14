const {z} = require('zod')
const courseModel = require('../models/coursemodel')

const createcourse = async(req,res) => {
    const adminId = req.userId;
    console.log(adminId);
    
    const course = z.object({
          title : z.string().min(3).max(50),
          description : z.string().min(10).max(1000),
          imageUrl : z.string().min(5).max(1000),
          price : z.string().min(1).max(5)
    })

    const parseDatawithsuccess = course.safeParse(req.body);
    if(!parseDatawithsuccess.success){
         return res.status(400).json({message : "Parse unsuccesfull"})
    }

    const {title,description,imageUrl,price} = parseDatawithsuccess.data;

    try{

        // const purchasedBy = await admin.findById({adminId});
        // if(!purchasedBy){
        //      return res.status(401).json({message : "User not found"})
        // }
        const courseDetails = new courseModel({
             title,
             description,
             imageUrl,
             price,
             creatorId:adminId
        })

        await courseDetails.save();
        return res.
               status(200).
               json({
                 message : "Course added successfully",
                 courseId : courseDetails._id
                })    
    }catch(error){
        return res.status(403).json({message : error.message || "Some error occured"
        })     
    }
}

const updatecourse = async(req,res) => {
    const adminId = req.adminId;
    
    const safeparsed = z.object({
        title : z.string().min(3).max(50),
        description : z.string().min(10).max(1000),
        imageUrl : z.string().min(5).max(200),
        price : z.string.min(1).max(5),
        courseId: z.string().min(1)
  })

  const parseDatawithsuccess = safeparsed.safeParse(req.body);
  if(!parseDatawithsuccess.success){
    return res.status(401).json({message : "Parse unsuccessfull"})
  }

  const {title,description,imageUrl,price,courseId} = parseDatawithsuccess.data;

  try {
     const courses = await course.updateOne
     ({
           _id : courseId,
           creatorId : adminId
     }, {
         title,
         description,
         imageUrl,
         price,
         courseId
     })

     return res.status(200)
            .json({
                 message:"Course updated successfully",
                 courseId : courses._id
            })
     
  }catch(error){
        return res.status(500).json({
            message : error.message || "Some error occured while updating the course"
        })
  }
  
}

const allcourses = async(req,res) => {
     const adminId = req.userId;
      
     try {
        const bulkcourses = await course.find({ creatorId : adminId}) 
        if(!bulkcourses){
             return res.status(403).json({message : "No course exists"})
        }
        return res.status(200).json({ 
                message : "All courses retrieve",
                bulkcourses
            })

     } catch(error) {
        return res.status(403).json({message : error.message || "No course exists"})
     }
}

module.exports = {
     createcourse,
     updatecourse,
     allcourses
}