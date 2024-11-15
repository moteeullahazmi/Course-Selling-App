const jwt = require("jsonwebtoken")
const JWT_USER_SECRET = "User_secret";
function userMiddleware (req,res,next){
    try{
            const token = req.headers.token;
    // token decoded
    const decoded = jwt.verify(token,JWT_USER_SECRET);
    if(decoded){
        req.userId = decoded.id;
        next();
    }
    }catch(error){
        res.status(403).json({
          message: "JSON token not cerify",
        });
    }
}

module.exports = {
    userMiddleware,
}