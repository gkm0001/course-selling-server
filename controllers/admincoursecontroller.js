const {z} = require('zod')
const courseModel = require('../models/coursemodel')
const client = require('../config/redisClient')


const createcourse = async(req,res) => {
    const adminId = req.userId;
    // console.log(adminId);
    
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
    const adminId = req.userId;
    
    const safeparsed = z.object({
        title : z.string().min(3).max(50),
        description : z.string().min(10).max(1000),
        imageUrl : z.string().min(5).max(200),
        price : z.string().min(1).max(5),
        courseId: z.string().min(1)
    })

    const parseDatawithsuccess = safeparsed.safeParse(req.body);
    if(!parseDatawithsuccess.success){
        return res.status(400).json({message : "Invalid input data"})
    }

    const {title,description,imageUrl,price,courseId} = parseDatawithsuccess.data;
    console.log(typeof courseId);
    console.log(typeof adminId);
    
    
    const courses = await courseModel.findOne({_id:courseId , creatorId : adminId});

    if(!courses) {
         return res.status(404).json({message : "Course not found or you don't have permission to update it"})
    }
    console.log({title,description,imageUrl,price,courseId})

    try {
       await courseModel.updateOne(
        {
            _id : courseId,
            creatorId : adminId
        }, 
        {
            title,
            description,
            imageUrl,
            price,
        },{ new: true })

        const storeData = {
             courses : [
                {
                     _id : courseId,
                     title : title,
                     creatorId : adminId,
                     description : description,
                     imageUrl : imageUrl,
                     price : price
                }
             ]
        };
        const redisKey = `AllCourses:${adminId}`
        
        await client.set(redisKey, JSON.stringify(storeData));
        

        return res.status(200).json({
            message: "Course updated successfully",
            courseId: courseId
        })
    } catch(error) {
        console.error("Error updating course:", error);
        return res.status(500).json({
            message : "An error occurred while updating the course"
        })
    }
}

const allcourses = async (req, res) => {
    const adminId = req.userId;
    // console.log("adminid", adminId);
    
    try {
        // Fetch courses from Redis cache
        const redisKey = `AllCourses:${adminId}`
        const getCourse = await client.get(redisKey);

        // If courses are in Redis cache, return them
        if (getCourse) {
            return res.status(200).json({
                message: "Course fetched successfully",
                courses: JSON.parse(getCourse)
            });
        }

        // If not in cache, fetch from MongoDB
        const bulkcourses = await courseModel.find({ creatorId: adminId });
        if (!bulkcourses || bulkcourses.length === 0) {
            return res.status(403).json({ message: "No course exists" });
        }

        // Store courses in Redis cache with a 1-hour expiration time
        await client.set(redisKey, JSON.stringify(bulkcourses), 'EX', 3600);

        return res.status(200).json({
            message: "All courses retrieved",
            bulkcourses
        });

    } catch (error) {
        return res.status(403).json({ message: error.message || "No course exists" });
    }
}

const deletecourse = async(req,res) => {
     const adminId = req.userId;
     
     const course = z.object({
         courseId : z.string().min(4)
     })

     const parseDatawithsuccess = course.safeParse(req.body);
     if(!parseDatawithsuccess.success){
       return res.status(400).json({message : "Parse unsccuessfull"})
     }
     
     const {courseId} = parseDatawithsuccess.data;

     try {
         const findCourse = await courseModel.findOne({_id : courseId , creatorId : adminId});

         if(!findCourse){
            return res.status(400).json({message : "Course not found"});
         }
         
         await courseModel.deleteOne({_id:courseId , creatorId : adminId});

         // Delete the Redis cache for all courses (or you can remove a specific key if needed)
         await client.del("AllCourses");

         return res.status(200).json({message : "Course deleted successfully"})
         
     }catch(err){
         return res.status(404).json({messgae : err.message || "Some error occured while deleting the course"})
     }
}


module.exports = {
     createcourse,
     updatecourse,
     allcourses,
     deletecourse
}