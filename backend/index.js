// importing a library express, mongoose, jsonwebtoken
const express =  require("express")
const mongoose = require("mongoose")
const app = express();


app.use(express.json())
// import router
const   { userRouter } = require("./routes/user")
const { courseRouter } = require("./routes/course")
const { adminRouter } = require("./routes/admin")

// imorting models
const {model} = require("./models/model")


// define router
app.use("/api/v1/user", userRouter)
app.use("/api/v1/course" , courseRouter)
app.use("/api/v1/admin", adminRouter)

try{
    mongoose.connect("mongodb+srv://100xdevs:WvaTca0509mb90YX@cluster0.ossjd.mongodb.net/Azmi_Course_Selling_App")
    console.log("Server Connected")
    app.listen(3000,()=> {
        console.log("server running on port 3000")
    })
}catch(error){
    console.log(error)
}

