// import libraries
const router = require("express").Router();
import {
  createUser,
  getUsers,
  getUserByUserId,
  updateUser,
  deleteUserByUserId,
  login,
} from "./user.controller";
import { checkToken } from "../../auth/token_validation";

router.post("/create_user", checkToken, createUser);
router.get("/", checkToken, getUsers);
router.get("/:id", checkToken, getUserByUserId);
router.patch("/update_user", checkToken, updateUser);
router.delete("/delete_user", checkToken, deleteUserByUserId);
router.post("/login", login);

module.exports = router;
