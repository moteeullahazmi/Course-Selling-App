const jwt = require("jsonwebtoken");
const JWT_ADMIN_SECRET = "Admin_secret";
function adminMiddleware(req, res, next) {
  const token = req.headers.token;
  // token decoded
  const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
  if (decoded) {
    req.adminId = decoded.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not Signed in",
    });
  }
}

module.exports = {
  adminMiddleware,
};
