const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId =  mongoose.Types.ObjectId;

const userSchema = new Schema ({
    id : ObjectId,
    email : {type:String, unique:true},
    password : String,
    firstName : String,
    lastName : String
});

const userModel = mongoose.model("Users", userSchema);
module.exports ={
    userModel
}