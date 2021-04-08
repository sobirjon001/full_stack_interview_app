// import libraries
const pool = require("../../database/database");

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
      `select subject_name from subjects where subject_name = ?`,
      [subject],
      (error1, results1, fields1) => {
        console.log("this is result from select querry");
        console.log(results1);
        if (error1) {
          return callback(error1);
        }
        if (results1.length > 0) {
          return callback(null, "duplicate");
        }
        pool.query(
          `insert into subjects (subject_name) values (?)`,
          [subject],
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
  updateSubject: (data, callback) => {
    pool.query(
      `update subjects set subject_name = ? where subject_id = ?`,
      [data.subject_name, data.subject_id],
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
      `select question from questions where question = ?`,
      [data.question],
      (error0, results0, fields0) => {
        if (error0) {
          return callback(error0);
        }
        if (results0.length > 0) {
          return callback(null, "duplicate");
        }
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
              `insert into questions (subject_id, question, solution, time) 
              values(?,?,?,?)`,
              [results1[0].subject_id, data.question, data.solution, data.time],
              (error2, results2, fields2) => {
                if (error2) {
                  return callback(error2);
                }
                return callback(null, results2);
              }
            );
          }
        );
      }
    );
  },
  updateQuestion: (data, callback) => {
    pool.query(
      `select question from questions where question = ?`,
      [data.question],
      (error0, results0, fields0) => {
        if (error0) {
          return callback(error0);
        }
        if (results0.length > 0) {
          return callback(null, "duplicate");
        }
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
};
