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
const encriptKey = process.env.ENCRIP_KEY || "qwe1234";

// controllers
module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    body.password = hashSync(body.password, salt);
    createUser(body, (err, results) => {
      if (err) {
        console.log(err);
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
    getUsers((err, results) => {
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
      const count = results.length;
      return res.status(200).json({
        success: true,
        message: "These are all users",
        "users count": count,
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
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (!results) {
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
      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, encriptKey, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          success: true,
          message: "Login successfull",
          token: jsontoken,
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
};
