// import libraries
const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserByUserId,
  updateUser,
  deleteUserByUserId,
  login,
  decodeUser,
} = require("./user.controller");
const { checkToken } = require("../../auth/token_validation");

router.post("/create_user", checkToken, createUser);
router.get("/", checkToken, getUsers);
router.get("/:id", checkToken, getUserByUserId);
router.patch("/update_user", checkToken, updateUser);
router.delete("/delete_user", checkToken, deleteUserByUserId);
router.post("/login", login);
router.post("/decode", checkToken, decodeUser);

module.exports = router;
