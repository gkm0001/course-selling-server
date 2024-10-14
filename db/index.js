const mongoose = require('mongoose')

const connectdb = async() => {
     try {
         const connectionInstance = await mongoose.connect(process.env.MONGO_URL)
         console.log('\nMongoDB connected')
     }catch(error){
         console.log('MongoDB connection failed',error);
         process.exit(1)       
     }
}

module.exports = connectdb