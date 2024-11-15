const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId =  mongoose.Types.ObjectId;

const purchaseSchema = new Schema ({
    courseId : ObjectId,
    userId: ObjectId
});

const purchaseModel = mongoose.model("Purchases", purchaseSchema);
module.exports ={
    purchaseModel
}