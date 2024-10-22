const express = require("express");
const adminRouter = express.Router();
const { adminModel } = require("../models/admin");
const {courseModel} =  require("../models/course")
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const JWT_ADMIN_SECRET = "Admin_secret";

const {adminMiddleware} = require("../middleware/admin")

// user signup detail
adminRouter.post("/signup", async function (req, res) {
  try {
    // validation zod
    const zodValidation = z.object({
      email: z.string().email().toLowerCase(),
      password: z.string().min(6).max(20),
      firstName: z.string().min(3).max(20),
      lastName: z.string().min(1),
    });
    const userData = zodValidation.safeParse(req.body);

    // handle validation errors
    if (!userData.success) {
      return res.status(400).json({ errors: userData.error });
    }

    // extracting validate data
    const { email, password, firstName, lastName } = userData.data;

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // storing a databse
    const adminDetails = await adminModel.create({
      email,
      password: hashPassword, // because password is name in schema to save
      firstName,
      lastName,
    });
    res.json({
      message: "Singup Successful",
      adminDetails
    });
  } catch (error) {
    res.json({ error });
  }
});

// user signin route
adminRouter.post("/signin", async function (req, res) {


  const { email, password } = req.body;
  // password comparing
  const admin = await adminModel.findOne({
    email,
  });
  if (!admin) {
    return res.status(403).json({
      messaage: "Incorrect Credentials",
    });
  }

  // compare provided password with hash store
  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    // create JWT token containing the user ID, signed with user JWT Secret
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_SECRET);
    res.status(200).json({
      token,
      adminId : admin._id   //very very impoortant role because use everywere req.adminId =
    });


  }
});

// Admin create a course and add secure only admin open
adminRouter.post("/course", adminMiddleware, async(req, res)=>{
  const adminId = req.adminId
  const {title, description, price, imageurl} = req.body;
  try{
    const course = await courseModel.create({
      title,
      description,
      price,
      imageurl,
      creatorId :adminId
    });
    res.json({
      message: "Course created",
    });
  }catch(error){

  }
})

adminRouter.put("/course", adminMiddleware, async (req,res)=>{
 try{
   const adminId = req.adminId;
   const { title, description, price, imageurl, courseId } = req.body;

   const course = await courseModel.findOneAndUpdate(
     {
       _id: courseId,
       creatorId: adminId,
     },
     {
       title,
       description,
       price,
       imageurl,
     }
   );
   if(!course){
    res.json({
      message: "Your are not creator this course using courseID",
    });
   } else{
    res.json({
      message: "Course Update"
    })
   }
 }
 catch(error){
  res.json({
    error
  })
 }
})

// delete course
adminRouter.delete("/course", adminMiddleware, async (req, res) => {
 try{
     const adminId = req.adminId;
     const courseId = req.body.courseId;

     const course = await courseModel.findOne({
       _id: courseId,
       creatorId: adminId,
     });
     if (!course) {
      return res.json({
         message: "course not found",
       });
     }

     // delete the course with geiven courseId and creator Id
     await courseModel.deleteOne({
       _id: courseId,
       creatorId: adminId,
     });

     res.status(200).json({
       message: "Course Deleted",
     });
 }catch(error){
  res.json({
    error
  });
 }
})

// define admin routes for getting all courses 
adminRouter.get("/course", adminMiddleware, async (req, res)=>{
  const adminId = req.adminId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });
  res.json({
    courses,
  });

})


module.exports = {
  adminRouter
}