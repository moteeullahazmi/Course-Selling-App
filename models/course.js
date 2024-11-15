const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId =  mongoose.Types.ObjectId;

const courseSchema = new Schema ({
    id : ObjectId,
    title :{type: String, unique:true},
    description : String,
    price : Number,
    imageurl : String,
    creatorId : ObjectId
});

const courseModel = mongoose.model("Courses", courseSchema);
module.exports ={
    courseModel
}