// import libraries
import pool from "../../config/database";

module.exports = {
  createUser: (data, callback) => {
    pool.query(
      `insert into users (full_name, email, password, is_admin)
    values(?,?,?,?)`,
      [data.full_name, data.email, data.password, data.is_admin],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  getUsers: (callback) => {
    pool.query(
      `select user_id, full_name, email, password, is_admin from users`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(results);
      }
    );
  },
  getUserByUserId: (id, callback) => {
    pool.query(
      `select user_id, full_name, email, password, is_admin from users where user_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  updateUser: (data, callback) => {
    pool.query(
      `update users set full_name, email, password, is_admin where user_id = ?`,
      [data.full_name, data.email, data.password, data.is_admin, data.user_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  deleteUserByUserId: (id, callback) => {
    pool.query(
      `delete from users where user_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  getUserByEmail: (email, callback) => {
    pool.query(
      `select * from users where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
};
