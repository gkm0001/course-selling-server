const mongoose = require('mongoose')


const purchaseSchema = new mongoose.Schema({
     
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    courseId : {
         type : mongoose.Schema.Types.ObjectId,
         ref : 'course',
         required : true
    }

})

const purchaseModel = mongoose.model("purchase",purchaseSchema);
module.exports = purchaseModel