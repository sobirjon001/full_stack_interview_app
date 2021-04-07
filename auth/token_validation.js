// import libraries
const { verify } = require("jsonwebtoken");

// encription options
const encriptKey = process.env.ENCRIP_KEY || "qwe1234";

module.exports = {
  checkToken: (req, res, next) => {
    const authHeader = req.get("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Please provide token",
      });
    }
    verify(token, encriptKey, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
      req.decodedUser = decodedUser;
      next();
    });
  },
};
