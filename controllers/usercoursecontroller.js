const purchaseModel = require('../models/purchasemodel')
const course = require('../models/coursemodel')
const User = require('../models/usermodel')
const z = require('zod')

const purchase = async (req, res) => {
    const userId = req.userId;

    const requiredBody = z.object({
        courseId: z.string().min(2).max(100)
    });

    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        return res.status(400).json({ message: "Invalid data provided" });
    }

    const { courseId } = parseDataWithSuccess.data;

    try {
        // Handle duplication in the course
        const existingPurchase = await purchaseModel.findOne({ courseId: courseId, userId: userId });

        if (existingPurchase) {
            return res.status(400).json({ message: "You have already purchased this course" });
        }

        // Create a new purchase record
        const purchases = new purchaseModel({
            courseId: courseId,
            userId: userId
        });

        // Update user's purchasedCourses array
        await User.updateOne(
            { _id: userId },
            { "$push": { purchasedCourses: courseId } }
        );

        await purchases.save();

        return res.status(200).json({
            message: "You have successfully bought the course",
        });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Some error occurred" });
    }
};


//return all the courses either loged in or not
const preview = async (req, res) => {
    try {
       
        // Fetch all courses from the database
        const courses = await Course.find({});
        
        // Return a successful response with the courses
        return res.status(200).json({
            message: "Courses fetched successfully",
            courses
        });
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        return res.status(500).json({
            message: error.message || "An error occurred while fetching courses"
        });
    }
};


module.exports = {
     purchase,
     preview
}