// import libraries
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  getQuestions,
  getSubjects,
  getQuestionsBySubject,
  getQuestionById,
  createSubject,
  updateSubject,
  createQuestion,
} = require("./question.controller");

router.get("/", checkToken, getQuestions);
router.get("/all_subjects", checkToken, getSubjects);
router.get("/by_subject", checkToken, getQuestionsBySubject);
router.get("/by_question_id", checkToken, getQuestionById);
router.post("/create_subject", checkToken, createSubject);
router.post("/update_subject", checkToken, updateSubject);
router.post("/create", checkToken, createQuestion);

module.exports = router;
