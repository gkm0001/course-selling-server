const {Router} = require('express')
const router = Router();
const admincontroller = require('../controllers/admincontroller')
const admincoursecontroller = require('../controllers/admincoursecontroller')
const adminMiddleWare = require('../middleware/userAuthMiddleware')

//admin Signup 
router.post('/signup',admincontroller.signup);

//admin signin
router.post('/signin',admincontroller.signin)

//admin add courses
router.post('/create/course',adminMiddleWare,admincoursecontroller.createcourse)

//admin update course
router.put('/update/course',adminMiddleWare,admincoursecontroller.updatecourse)

//give all the courses which I create
router.get('/allcourses',adminMiddleWare,admincoursecontroller.allcourses)

//Delete the course
router.delete('/delete/:id',adminMiddleWare , admincoursecontroller.deletecourse)


module.exports = router