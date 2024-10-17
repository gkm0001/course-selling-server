const express = require('express')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const courseRouter = require('./routes/course')
const adminRouter = require('./routes/admin')
const connectdb = require('./db')
const limiter = require('./middleware/ratelimiter')
const app = express();
const port = process.env.PORT || 3000
dotenv.config();

//connect database
connectdb();

//apply rate limiter
app.use(limiter)



app.use(express.json())
app.use('/api/v1/user',userRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/course',courseRouter)


app.listen(port,()=>{
     console.log(`Server is running on ${PORT}`)
})