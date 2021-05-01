// import libraries
const pool = require("./database");
const { createUser } = require("../users/user.service");

// admin values
const adminEmail = process.env.ADMIN_EMAIL || "admin@cybertek.com";
const adminPassword = process.env.ADMIN_PASSWORD || "cyberteck";

// functions
function checkSubjects(callback) {
  console.log("Checking if subjects table exist ...");
  pool.query(
    `select exists(
      select 1 from information_schema.tables 
      where table_schema = 'node_db'
      and table_name = 'subjects'
    ) as 'exist';`,
    [],
    (error, results, fields) => {
      if (error) {
        console.log("failed to check if subjects table exist " + error.message);
      }
      if (results[0].exist == 0) {
        console.log("Subjects table does not not exist, creating ...");
        pool.query(
          `create table subjects (
            subject_id int auto_increment primary key ,
            subject_name varchar(255) not null
          );`,
          [],
          (err, res, fiel) => {
            if (error) {
              console.log("failed to create subjects table " + error.message);
            }
            console.log("Created subjects table successfully!");
          }
        );
      }
      callback();
    }
  );
}

function checkUsers(callback) {
  console.log("Cheking if userd tabel exist ...");
  pool.query(
    `select exists(
      select 1 from information_schema.tables 
      where table_schema = 'node_db'
      and table_name = 'users'
    ) as 'exist';`,
    [],
    (error, results, fields) => {
      if (error) {
        console.log("failed to check if users table exist " + error.message);
      }
      if (results[0].exist == 0) {
        console.log("Users table does not exist, creating ...");
        pool.query(
          `create table users (
            user_id int auto_increment primary key ,
            full_name varchar(255),
            email varchar(255),
            password varchar(255),
            is_admin boolean default false
          );`,
          [],
          (err, res, fiel) => {
            if (error) {
              console.log("failed to create users table " + error.message);
            }
            console.log("Successfully create usrs tabel!");
          }
        );
      }
      callback();
    }
  );
}

function checkAdmin(callback) {
  console.log("Checking if Super Admin exist ...");
  pool.query(
    `select exists(
      select 1 from users
      where email = ?
    ) as 'exist';`,
    [adminEmail],
    (error, results, fields) => {
      if (error) {
        console.log(
          "failed to check if super admin table exist" + error.message
        );
      }
      if (results[0].exist == 0) {
        console.log("Super Admin does not exist, creating ...");
        let data = {
          full_name: "Super Admin",
          email: adminEmail,
          password: adminPassword,
          is_admin: true,
        };
        createUser(data, (err, res) => {
          if (err) {
            console.log("Failed to create Super Admin " + err.message);
          }
          if (res) {
            console.log("Successully created Super Admin!");
          }
          console.log("Successfully created Super User!");
        });
      }
      callback();
    }
  );
}

function checkQuestions() {
  console.log("Checking if questions table exist ...");
  pool.query(
    `select exists(
      select 1 from information_schema.tables 
      where table_schema = 'node_db'
      and table_name = 'questions'
    ) as 'exist';`,
    [],
    (error, results, fields) => {
      if (error) {
        console.log(
          "failed to check if questions table exist " + error.message
        );
      }
      if (results[0].exist == 0) {
        console.log("Questions table does not exists, creating ...");
        pool.query(
          `create table questions (
            question_id int auto_increment primary key ,
            subject_id int not null ,
            question varchar(1024),
            solution varchar(1024),
            time int,
            foreign key (subject_id)
            references subjects (subject_id)
          );`,
          [],
          (err, res, fiel) => {
            if (error) {
              console.log("failed to create questions table " + error.message);
            }
            console.log("Successfully created question table!");
          }
        );
      }
    }
  );
}

const initialisation = () => {
  console.log("Running initialization ...");
  checkSubjects(function () {
    checkUsers(function () {
      checkAdmin(function () {
        checkQuestions();
      });
    });
  });
};

module.exports = initialisation;
