// import libraries
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
} = require("./question.service");

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
      const page = req.params.page;
      let length = results.length;
      if (!page || page === 1) {
        let result = [];
        for (let i = 0; i < length && i < 10; i++) {
          result.push(results[i]);
        }
        return res.status(200).json({
          success: true,
          message: "successful request",
          "number of entries": length,
          questions: result,
        });
      }
      if (length <= 10) {
        return res.status(200).json({
          success: true,
          message: "successful request",
          "number of entries": length,
          questions: results,
        });
      }
      let iterNum = length / 10;
      if (length % 10 != 0) {
        iterNum++;
      }
      if (page > iterNum) {
        return res.status(413).json({
          success: false,
          message: "Request Entity Too Large",
          "max number of pages": iterNum,
        });
      }
      const start = (page - 1) * 10;
      const end = (page - 1) * 10 + 10;
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(results[i]);
      }
      return res.status(200).json({
        success: true,
        message: "successful request",
        "number of entries": length,
        "current page": page,
        questions: result,
      });
    });
  },
  getSubjects: (req, res) => {
    getSubjects((err, results) => {
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
    });
  },
  getQuestionsBySubject: (req, res) => {
    const subject = req.body.subject;
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
      const page = req.params.page;
      let length = results.length;
      if (!page || page === 1) {
        let result = [];
        for (let i = 0; i < length && i < 10; i++) {
          result.push(results[i]);
        }
        return res.status(200).json({
          success: true,
          message: "successful request",
          "number of entries": length,
          questions: result,
        });
      }
      if (length <= 10) {
        return res.status(200).json({
          success: true,
          message: "successful request",
          "number of entries": length,
          questions: results,
        });
      }
      let iterNum = length / 10;
      if (length % 10 != 0) {
        iterNum++;
      }
      if (page > iterNum) {
        return res.status(413).json({
          success: false,
          message: "Request Entity Too Large",
          "max number of pages": iterNum,
        });
      }
      const start = (page - 1) * 10;
      const end = (page - 1) * 10 + 10;
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(results[i]);
      }
      return res.status(200).json({
        success: true,
        message: "successful request",
        "number of entries": length,
        "current page": page,
        questions: result,
      });
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
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results === "duplicate") {
        return res.status(403).json({
          success: false,
          message: "Forbidden! This subject already exist",
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
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results === "duplicate") {
        return res.status(403).json({
          success: false,
          message: "This question already exist",
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
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results === "duplicate") {
        return res.status(403).json({
          success: false,
          message: "This question already exist",
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
    deleteQuestionById(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database connection error",
        });
      }
      if (results.changedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Question deleted successfully",
        data: results,
      });
    });
  },
};
