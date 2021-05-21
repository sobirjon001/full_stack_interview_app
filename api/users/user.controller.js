// import libraries
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const {
  createUser,
  getAllUsers,
  getUsersByType,
  getUserByUserId,
  getUserByFullName,
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

// local reusable functions
function generateUsers(err, req, res, results) {
  if (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Database connection error",
    });
  }
  let length = results.length;
  if (length == 0) {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }
  const page = req.headers.page || 1;
  let iterNum = Math.floor(length / 10);
  if (length % 10 != 0) {
    iterNum++;
  }
  if (page > iterNum) {
    return res.status(413).json({
      success: false,
      message: "Requested page number is too large",
      "max number of pages": iterNum,
    });
  }
  const start = (page - 1) * 10;
  const end = (page - 1) * 10 + 10;
  let result = [];
  for (let i = start; i < end; i++) {
    if (results[i] == null) break;
    result.push(results[i]);
  }
  return res.status(200).json({
    success: true,
    message: "successful request",
    number_of_entries: length,
    current_page: page,
    total_pages: iterNum,
    users: result,
  });
}

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
    if (req.headers.user_status == "All") {
      getAllUsers((err, results) => {
        generateUsers(err, req, res, results);
      });
    } else {
      let user_type = req.headers.user_status == "Admin" ? 1 : 0;
      getUsersByType(user_type, (err, results) => {
        generateUsers(err, req, res, results);
      });
    }
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
  getUserByFullName: (req, res) => {
    const full_name = req.headers.full_name;
    console.log(full_name);
    getUserByFullName(full_name, (err, results) => {
      generateUsers(err, req, res, results);
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
        message: "Unuthorised! Must have administrative account",
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
