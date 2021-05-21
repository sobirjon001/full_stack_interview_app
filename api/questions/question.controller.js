// import libraries
const {
  getQuestions,
  getSubjects,
  getActiveSubjects,
  getQuestionsBySubject,
  getQuestionById,
  createSubject,
  updateSubject,
  createQuestion,
  updateQuestion,
  deleteQuestionById,
  deleteQuestionsBySubjectId,
  deleteSubjectById,
} = require("./question.service");

// local reusable functions
function generateQuestions(req, res, results) {
  const page = req.headers.page || 1;
  let length = results.length;
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
    questions: result,
  });
}

function generateSubjects(err, res, results) {
  if (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Database connection error",
    });
  }
  if (results.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No records found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "successful request",
    "number of entries": results.length,
    subjects: results,
  });
}
// controllers
module.exports = {
  getQuestions: (req, res) => {
    getQuestions((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No records found",
        });
      }
      generateQuestions(req, res, results);
    });
  },
  getSubjects: (req, res) => {
    getSubjects((err, results) => {
      generateSubjects(err, res, results);
    });
  },
  getActiveSubjects: (req, res) => {
    getActiveSubjects((err, results) => {
      generateSubjects(err, res, results);
    });
  },
  getQuestionsBySubject: (req, res) => {
    const subject = req.headers.subject;
    getQuestionsBySubject(subject, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No records found",
        });
      }
      generateQuestions(req, res, results);
    });
  },
  getQuestionById: (req, res) => {
    const id = req.params.id;
    getQuestionById(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Found questopn by provided question_id",
        data: results[0],
      });
    });
  },
  createSubject: (req, res) => {
    const subject = req.body.subject_name;
    createSubject(subject, (err, results) => {
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
        message: "Successfully added new subject",
        data: results,
      });
    });
  },
  updateSubject: (req, res) => {
    const body = req.body;
    updateSubject(body, (err, results) => {
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
      if (results.affectedRows === 0) {
        return res.status(409).json({
          success: true,
          message: "Failed to update subject",
          data: results,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Subject updated successfully",
        data: results,
      });
    });
  },
  createQuestion: (req, res) => {
    const body = req.body;
    createQuestion(body, (err, results) => {
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
      if (results === "invalid subject") {
        return res.status(409).json({
          success: false,
          message: "Failed to update! No such a subject",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Successfully added new question",
        data: results,
      });
    });
  },
  updateQuestion: (req, res) => {
    const body = req.body;
    updateQuestion(body, (err, results) => {
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
      if (results === "invalid subject") {
        return res.status(409).json({
          success: false,
          message: "Failed to update! No such a subject",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Successfully updated question",
        data: results,
      });
    });
  },
  deleteQuestionById: (req, res) => {
    const id = req.params.id;
    console.log(id);
    deleteQuestionById(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Question deleted successfully",
        data: results,
      });
    });
  },
  deleteQuestionsBySubjectId: (req, res) => {
    let subject_id = req.headers.subject_id;
    deleteQuestionsBySubjectId(subject_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      console.log("deleting question by subject id");
      return res.status(200).json({
        success: true,
        message: "Questions deleted successfully",
        data: results,
      });
    });
  },
  deleteSubjectById: (req, res) => {
    let subject_id = req.headers.subject_id;
    deleteSubjectById(subject_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
        data: results,
      });
    });
  },
};
