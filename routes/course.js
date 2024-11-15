const express = require('express')
const courseRouter = express.Router()
const {userMiddleware} = require("../middleware/user")
const {purchaseModel} = require("../models/purchase")
const {courseModel} = require("../models/course")

courseRouter.post("/purchases",userMiddleware, async (req,res) =>{

    try{
        const userId = req.userId;
        const courseId = req.body.courseId;

        // create a purchase record in the database
       const userPurchase = await purchaseModel.create({
          courseId: courseId,
          userId: userId,
        });

        // check if the creation was not succeful
        if(!userPurchase){
            return res.status(403).json({
                message : "Course not found"
            })
        }else{
            // send succes message
            return res.json({
                message : "Course Purchase"
            });   
            }
        
        
    } catch(error){
        return res.status(500).json({
            message: "An error occured",
            error: error.message,  // log error message debugging
        })
    }
    
    
}
);

// purchases course route
courseRouter.get("/preview", async function(req,res){
   const coursePreview= await courseModel.find({})
   res.json({
    coursePreview
   });
    

})


module.exports = {
    courseRouter
}

