const {Router} = require('express')
const router = Router();
const usercontroller = require('../controllers/usercontroller')
const userMiddleWare = require('../middleware/userAuthMiddleware')


//FOR USER ROUTE
//for user signup 
router.post('/signup', usercontroller.signup)

//for login 
router.post('/login',usercontroller.login)

//list of courses which are already purchased by user
router.get('/purchases',userMiddleWare,usercontroller.coursepurchases)

 
module.exports = router