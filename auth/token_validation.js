// import libraries
const { verify } = require("jsonwebtoken");

// encription options
const encriptKey = process.env.ENCRIP_KEY || "qwe1234";

module.exports = {
  checkToken: (req, res, next) => {
    const token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      verify(token, encriptKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
          });
        } else {
          next();
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Access denied! Unauthorized user",
      });
    }
  },
};
