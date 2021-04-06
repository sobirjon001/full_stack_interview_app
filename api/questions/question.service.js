// import libraries
const pool = require("../../config/database");

module.exports = {
  getQuestions: (callback) => {
    pool.query(
      `select q.question_id, s.subject_name, q.question, q.solution, q.time 
    from questions q
    inner join subjects s on q.subject_id = s.subject_id`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getSubjects: (callback) => {
    pool.query(`select * from subjects`, [], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(nill, results);
    });
  },
  getQuestionsBySubject: (subject, callback) => {
    pool.query(
      `select q.question_id, s.subject_name, q.question, q.solution, q.time 
      from questions q
      inner join subjects s on q.subject_id = s.subject_id
      where s.subject_name = ?`,
      [subject],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getQuestionById: (id, callback) => {
    pool.query(
      `select q.question_id, s.subject_name, q.question, q.solution, q.time 
    from questions q
    inner join subjects s on q.subject_id = s.subject_id
    where q.question_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  createSubject: (subject, callback) => {
    pool.query(
      `select subject_name from subjects`,
      [],
      (error1, results1, fields1) => {
        if (error1) {
          return callback(error1);
        }
        if (results1) {
          return callback(null, "duplicate");
        }
        pool.query(
          `insert into subjects (subject_name) valies (?)`,
          [],
          (error2, results2, fields2) => {
            if (error2) {
              return callback(error2);
            }
            return callback(null, results2[0]);
          }
        );
      }
    );
  },
  updateSubject: (data, callback) => {
    pool.query(
      `update subjects set subject_name where subject_id = ?`,
      [data.subject_name, data.subject_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  createQuestion: (data, callback) => {
    pool.query(
      `select subject_id from subject where subject_name = ?`,
      [data.subject_name],
      (error1, results1, fields1) => {
        if (error1) {
          return callback(error1);
        }
        if (!results1) {
          return callback(null, "invalid subject");
        }
        pool.query(
          `insert into questions (subject_id, question, solution, time) 
      values(?,?,?,?)`,
          [results1[0], data.question, data.solution, data.time],
          (error2, results2, fields2) => {
            if (error2) {
              return callback(error2);
            }
            return callback(null, results2[0]);
          }
        );
      }
    );
  },
};
