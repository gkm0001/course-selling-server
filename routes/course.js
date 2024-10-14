const {Router} = require('express')
const router = Router();
const usercoursecontroller = require('../controllers/usercoursecontroller');
const userAuthMiddleware = require('../middleware/userAuthMiddleware');


//exists course in platform
router.get('/preview',usercoursecontroller.preview)


//process for buy the courses
//you would expeect the user to pay the money
router.post('/purchase',userAuthMiddleware,usercoursecontroller.purchase)

module.exports = router