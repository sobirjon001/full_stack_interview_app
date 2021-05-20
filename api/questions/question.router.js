// import libraries
const router = require("express").Router();
const { checkToken } = require("../auth/token_validation");
const {
  getQuestions,
  getSubjects,
  getQuestionsBySubject,
  getQuestionById,
  createSubject,
  updateSubject,
  createQuestion,
  updateQuestion,
  deleteQuestionById,
  deleteQuestionsBySubjectId,
  deleteSubjectById,
} = require("./question.controller");
const { isAdminChek } = require("../users/user.controller");

router.get("/", checkToken, getQuestions);
router.get("/all_subjects", checkToken, getSubjects);
router.get("/by_subject", checkToken, getQuestionsBySubject);
router.get("/:id", checkToken, getQuestionById);
router.post("/create_subject", checkToken, isAdminChek, createSubject);
router.patch("/update_subject", checkToken, isAdminChek, updateSubject);
router.post("/create", checkToken, isAdminChek, createQuestion);
router.patch("/update", checkToken, isAdminChek, updateQuestion);
router.delete(
  "/by_subject_id",
  checkToken,
  isAdminChek,
  deleteQuestionsBySubjectId
);
router.delete("/subject_by_id", checkToken, isAdminChek, deleteSubjectById);
router.delete("/:id", checkToken, isAdminChek, deleteQuestionById);

module.exports = router;
