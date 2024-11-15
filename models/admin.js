const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId =  mongoose.Types.ObjectId;

const adminSchema = new Schema ({
    id : ObjectId,
    email : {type:String, unique:true},
    password : String,
    firstName : String,
    lastName : String
});

const adminModel = mongoose.model("Admin", adminSchema);
module.exports ={
    adminModel
}