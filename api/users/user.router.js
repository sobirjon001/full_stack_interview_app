// import libraries
const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserByUserId,
  getUserByFullName,
  updateUser,
  deleteUserByUserId,
  login,
  decodeUser,
  isAdminChek,
  allowedToModifyUser,
} = require("./user.controller");
const { checkToken } = require("../auth/token_validation");

router.post("/sign_up", createUser);
router.post("/create_user", checkToken, isAdminChek, createUser);
router.get("/", checkToken, isAdminChek, getUsers);
router.get("/by_full_name", checkToken, isAdminChek, getUserByFullName);
router.get("/:id", checkToken, isAdminChek, getUserByUserId);
router.patch(
  "/update_user",
  checkToken,
  isAdminChek,
  allowedToModifyUser,
  updateUser
);
router.delete(
  "/delete_user",
  checkToken,
  isAdminChek,
  allowedToModifyUser,
  deleteUserByUserId
);
router.post("/login", login);
router.post("/decode", checkToken, decodeUser);

module.exports = router;
