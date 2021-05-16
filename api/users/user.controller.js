// import libraries
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const {
  createUser,
  getUsers,
  getUserByUserId,
  updateUser,
  deleteUserByUserId,
  getUserByEmail,
} = require("./user.service");
const salt = genSaltSync(10);
const { sign } = require("jsonwebtoken");

// encription options
const secretKey = process.env.SECRET_KEY || "abc1234";

// admin options
const adminEmail = process.env.ADMIN_EMAIL || "admin@cambridge.com";

// controllers
module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    body.password = hashSync(body.password, salt);
    createUser(body, (err, results) => {
      if (err) {
        console.log(err);
        if (err.code == "ER_DUP_ENTRY") {
          return res.status(409).json({
            success: false,
            message: err.sqlMessage,
          });
        }
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Successfully added new user",
        data: results,
      });
    });
  },
  getUsers: (req, res) => {
    if (!req.decodedUser.result.is_admin) {
      return res.status(403).json({
        success: false,
        message: "Unuthorised! Must have administrative account",
      });
    }
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results.length == 0) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }
      const count = results.length;
      return res.status(200).json({
        success: true,
        message: "These are all users",
        users_count: count,
        data: results,
      });
    });
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Found user by provided user_id here",
        data: results,
      });
    });
  },
  updateUser: (req, res) => {
    const body = req.body;
    console.log(body);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        if (err.code == "ER_DUP_ENTRY") {
          return res.status(409).json({
            success: false,
            message: err.sqlMessage,
          });
        }
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      console.log(results);
      if (results.affectedRows == 0) {
        return res.status(409).json({
          success: true,
          message: "Failed to update user",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: results,
      });
    });
  },
  deleteUserByUserId: (req, res) => {
    const id = req.headers.user_id;
    deleteUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, secretKey, {
          expiresIn: "4h",
        });
        return res.status(200).json({
          success: true,
          message: "Login successfull",
          token: jsontoken,
          is_admin: results.is_admin,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    });
  },
  decodeUser: (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Decode successfull",
      data: req.decodedUser.result,
    });
  },
  isAdminChek: (req, res, next) => {
    if (req.decodedUser.result.is_admin != 1) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create account",
      });
    }
    next();
  },
  allowedToModifyUser: (req, res, next) => {
    const id = req.headers.user_id;
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (!results) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }
      if (results.email == adminEmail) {
        return res.status(403).json({
          success: false,
          message: "Deleting or modifying Super Admin is Prohibited!",
        });
      }
      next();
    });
  },
};
