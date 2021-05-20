// import libraries
const pool = require("../database/database");

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
      return callback(null, results);
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
      `insert into subjects (subject_name) values (?)`,
      [subject],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  updateSubject: (data, callback) => {
    pool.query(
      `update subjects set subject_name = ?, subject_is_active = ? where subject_id = ?`,
      [data.subject_name, data.subject_is_active, data.subject_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  createQuestion: (data, callback) => {
    pool.query(
      `insert into questions (subject_id, question, solution, time) 
          values(?,?,?,?)`,
      [data.subject_id, data.question, data.solution, data.time],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  updateQuestion: (data, callback) => {
    pool.query(
      `select subject_id from subjects where subject_name = ?`,
      [data.subject_name],
      (error1, results1, fields1) => {
        if (error1) {
          return callback(error1);
        }
        if (results1.length === 0) {
          return callback(null, "invalid subject");
        }
        pool.query(
          `update questions set subject_id = ?, question = ?, solution = ?, time = ?
              where question_id = ?`,
          [
            results1[0].subject_id,
            data.question,
            data.solution,
            data.time,
            data.question_id,
          ],
          (error2, results2, fields2) => {
            if (error2) {
              return callback(error2);
            }
            return callback(null, results2);
          }
        );
      }
    );
  },
  deleteQuestionById: (id, callback) => {
    pool.query(
      `delete from questions where question_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteQuestionsBySubjectId: (subject_id, callback) => {
    pool.query(
      `delete from questions where subject_id = ?`,
      [subject_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteSubjectById: (subject_id, callback) => {
    pool.query(
      `delete from subjects where subject_id = ?`,
      [subject_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
