const express = require("express");
const userRouter = express.Router();
const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken")
const JWT_USER_SECRET = "User_secret"
const { purchaseModel } = require("../models/purchase"); 


// midleware user import
const { userMiddleware } = require("../middleware/user");
const { courseModel } = require("../models/course");


userRouter

// user signup detail
userRouter.post("/signup", async function (req, res) {
    
  
  
  try {
    // validation zod
  const userValidation = z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(6).max(20),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(1),
  });
    const userData = userValidation.safeParse(req.body);

    // handle validation errors
    if (!userData.success) {
      return res.status(400).json({ errors: userData.error });
    };

    // extracting validate data
    const { email, password, firstName, lastName} = userData.data;


    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // storing a databse
      await userModel.create({
      email,
      password: hashPassword, // because password is name in schema to save
      firstName,
      lastName,
    });
    res.json({
      message: "Singup Successful",
    });
  } catch (error) {
    res.json({error});
  }
});

// user signin route
userRouter.post("/signin", async function (req, res) {
    const {email,password} = req.body;
    // password comparing
    const user = await userModel.findOne({
      email,
    })
    if (!user) {
      return res.status(403).json({
        messaage: "Incorrect Credentials"
      });
    }
    
    // compare provided password with hash store
    const passwordMatch = await bcrypt.compare(password,user.password);

    if(passwordMatch){
      // create JWT token containing the user ID, signed with user JWT Secret
      const token = jwt.sign({ id: user._id },JWT_USER_SECRET);
      res.status(200).json({
        token
      });
    }
});



// my purchases route
userRouter.get("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }

  const coursesData = await courseModel.find({
    _id: { $in: purchasedCourseIds },
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: userRouter,
};