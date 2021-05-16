// web elements
const usersModuleLink = document.querySelector("#users-module-link");
const questionsModuleLink = document.querySelector("#questions-module-link");
const usersModuleContainer = document.querySelector("#users-module-container");
const questionsModuleContainer = document.querySelector(
  "#questions-module-container"
);
const navUserName = document.querySelector("#nav-user-name");
const navLogOut = document.querySelector("#nav-log-out");
const usersTableBody = document.querySelector("#users-table > tbody");
const adminContainer = document.querySelector("#admin-container-outer");
const addNewUserContainer = document.querySelector("#add-new-user-container");
const buttonAddUser = document.querySelector("#button-add-user");
const selectNewUserType = document.querySelector(
  "#input-new-user-select-isadmin"
);
const inputNewUserFullName = document.querySelector(
  "#input-new-user-full-name"
);
const inputNewUserEmail = document.querySelector("#input-new-user-email");
const inputNewUserPassword = document.querySelector("#input-new-user-password");
const alertNewUserExist = document.querySelector("#input-new-user-exist-alert");
const alertNewUserFullNmae = document.querySelector(
  "#input-new-user-full-name-alert"
);
const alertNewUserEmail = document.querySelector("#input-new-user-email-alert");
const alertNewUserPassword = document.querySelector(
  "#input-new-user-password-alert"
);
const buttonNewUserAdd = document.querySelector("#button-add-new-user");
const buttonNewUserCancel = document.querySelector(
  "#button-add-new-user-cancel"
);
let buttonUserDelete;
let buttonUserUpdate;
const updateUserContainer = document.querySelector("#update-user-container");
const selectUpdateUserType = document.querySelector(
  "#input-update-user-select-isadmin"
);
const inputUpdateUserFullName = document.querySelector(
  "#input-update-user-full-name"
);
const inputUpdateUserEmail = document.querySelector("#input-update-user-email");
const inputUpdateUserPassword = document.querySelector(
  "#input-update-user-password"
);
const alertUpdateUserExist = document.querySelector(
  "#input-update-user-exist-alert"
);
const alertUpdateUserFullNmae = document.querySelector(
  "#input-update-user-full-name-alert"
);
const alertUpdateUserEmail = document.querySelector(
  "#input-update-user-email-alert"
);
const alertUpdateUserPassword = document.querySelector(
  "#input-update-user-password-alert"
);
const buttonUpdateUserUpdate = document.querySelector("#button-update-user");
const buttonUpdateUserCancel = document.querySelector(
  "#button-update-user-cancel"
);
const updateUserId = document.querySelector("#user-id");
const selectIsAdmin = document.querySelector("#select-isAdmin");
const usersCount = document.querySelector("#users-count");
const subjectsTableBody = document.querySelector("#subjects-table > tbody");
const buttonAddSubject = document.querySelector("#button-add-subject");
const addNewSubjectContainer = document.querySelector(
  "#add-new-subject-container"
);
const inputNewSubject = document.querySelector("#input-new-subject");
const alertNewSubjectExists = document.querySelector(
  "#input-new-subject-exist-alert"
);
const buttonNewSubjectAdd = document.querySelector("#button-add-new-subject");
const buttonNewSubjectCansel = document.querySelector(
  "#button-add-new-subject-cancel"
);
const subjectsCount = document.querySelector("#subjects-count");
const questionsCount = document.querySelector("#questions-count");

// global variables
let token = "";
let userName = "";
let users = [];
let isAdminFilter = selectIsAdmin.value;
let subjects = [];
let questions = [];

// event listeners
usersModuleLink.addEventListener("click", usersModuleLinkHandler);
questionsModuleLink.addEventListener("click", questionsModuleLinkHandler);
buttonAddUser.addEventListener("click", addUserHandler);
buttonNewUserCancel.addEventListener("click", addUserCancelHandler);
buttonNewUserAdd.addEventListener("click", addUserButtonHandler);
buttonUpdateUserCancel.addEventListener("click", updateUserCancelHandler);
buttonUpdateUserUpdate.addEventListener("click", updateUserButtonHandler);
selectIsAdmin.addEventListener("change", selectIsAdminHandler);
buttonAddSubject.addEventListener("click", addNewSubjectHandler);
buttonNewSubjectCansel.addEventListener("click", addNewSubjectCanselHandler);
buttonNewSubjectAdd.addEventListener("click", addNewSubjectButtonHandler);

// functions
(() => {
  token = sessionStorage.getItem("token");
  // console.log("this token was loaded from login session:");
  // console.log(token);
  fetch("/api/users/decode", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    let data = await response.json();
    userName = data.data.full_name;
    navUserName.innerHTML = "Welcome " + userName;
    usersModuleLinkHandler();
  });
})();

function usersModuleLinkHandler() {
  usersModuleLink.classList.add("active-link");
  questionsModuleLink.classList.remove("active-link");
  usersModuleContainer.classList.remove("hidden");
  questionsModuleContainer.classList.add("hidden");
  getAllUsers();
}

function questionsModuleLinkHandler() {
  usersModuleLink.classList.remove("active-link");
  questionsModuleLink.classList.add("active-link");
  usersModuleContainer.classList.add("hidden");
  questionsModuleContainer.classList.remove("hidden");
  getAllSubjects();
}

function getAllUsers() {
  fetch("/api/users", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    let data = await response.json();
    users = [];
    users.push(...users, ...data.data);
    displayUsers();
  });
}

function displayUsers() {
  usersCount.innerHTML = users.length + " users";
  let matcher = "";
  switch (isAdminFilter) {
    case "User":
      matcher = /0/;
      break;
    case "Admin":
      matcher = /1/;
      break;
    default:
      matcher = /.?/;
  }
  let tableRows = "";
  users.forEach((user) => {
    if (matcher.test(user.is_admin)) {
      tableRows += `<tr><td>
      <button class="user-action-delete">Delete</button>
      <button class="user-action-update">Update</button></td>
      <td>${user.user_id}</td><td>${user.full_name}</td>
      <td>${user.email}</td><td>${user.is_admin == 1}</td></tr>`;
    }
  });
  usersTableBody.innerHTML = tableRows;
  buttonUserDelete = document.querySelectorAll(".user-action-delete");
  buttonUserUpdate = document.querySelectorAll(".user-action-update");
  buttonUserDelete.forEach((button) =>
    button.addEventListener("click", deleteUser)
  );
  buttonUserUpdate.forEach((button) =>
    button.addEventListener("click", updateUser)
  );
}

function clearNewUserForm() {
  for (let alert of [
    alertNewUserExist,
    alertNewUserFullNmae,
    alertNewUserEmail,
    alertNewUserPassword,
  ]) {
    alert.classList.add("hidden");
  }
  for (let input of [
    inputNewUserFullName,
    inputNewUserEmail,
    inputNewUserPassword,
  ]) {
    input.value = "";
  }
}

function addUserHandler() {
  clearNewUserForm();
  adminContainer.classList.add("grey");
  addNewUserContainer.classList.remove("hidden");
}

function addUserCancelHandler() {
  adminContainer.classList.remove("grey");
  addNewUserContainer.classList.add("hidden");
}

function validateFullName(full_name) {
  return /[A-Z]([a-z]){3,10}\s[A-Z]([a-z]){3,15}/.test(full_name);
}

function validateEmail(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
}

function validatePassword(password) {
  return /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?@"]).*$/.test(password);
}

function addUserButtonHandler() {
  let canAddNewUser = true;
  if (!validateFullName(inputNewUserFullName.value)) {
    alertNewUserFullNmae.classList.remove("hidden");
    canAddNewUser = false;
  }
  if (!validateEmail(inputNewUserEmail.value)) {
    {
      alertNewUserEmail.classList.remove("hidden");
      canAddNewUser = false;
    }
  }
  if (!validatePassword(inputNewUserPassword.value)) {
    alertNewUserPassword.classList.remove("hidden");
    canAddNewUser = false;
  }
  if (canAddNewUser) {
    fetch("/api/users/create_user", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        full_name: inputNewUserFullName.value,
        email: inputNewUserEmail.value,
        password: inputNewUserPassword.value,
        is_admin: parseInt(selectNewUserType.value),
      }),
    }).then(async (response) => {
      let data = await response.json();
      if (data.success) {
        addUserCancelHandler();
        getAllUsers();
      } else if (data.message.includes("Duplicate entry")) {
        clearNewUserForm();
        alertNewUserExist.classList.remove("hidden");
      }
    });
  }
}

function deleteUser(e) {
  let id = e.target.parentElement.parentElement.children[1].innerHTML;
  fetch("/api/users/delete_user", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      user_id: id,
    },
  }).then(async (response) => {
    let data = await response.json();
    if (data.success) {
      getAllUsers();
    } else if (
      data.message.includes("Deleting or modifying Super Admin is Prohibited!")
    ) {
      alert(data.message);
    }
  });
}

function updateUser(e) {
  let id = e.target.parentElement.parentElement.children[1].innerHTML;
  let full_name = e.target.parentElement.parentElement.children[2].innerHTML;
  let email = e.target.parentElement.parentElement.children[3].innerHTML;
  let is_admin = e.target.parentElement.parentElement.children[4].innerHTML;
  adminContainer.classList.add("grey");
  updateUserContainer.classList.remove("hidden");
  updateUserId.innerHTML = id;
  selectUpdateUserType.value = is_admin == "true" ? "1" : "0";
  inputUpdateUserFullName.value = full_name;
  inputUpdateUserEmail.value = email;
  inputUpdateUserPassword.value = "";
}

function updateUserCancelHandler() {
  adminContainer.classList.remove("grey");
  updateUserContainer.classList.add("hidden");
}

function updateUserButtonHandler() {
  let id = parseInt(updateUserId.innerHTML);
  let canUpdateUser = true;
  if (!validateFullName(inputUpdateUserFullName.value)) {
    alertUpdateUserFullNmae.classList.remove("hidden");
    canUpdateUser = false;
  }
  if (!validateEmail(inputUpdateUserEmail.value)) {
    {
      alertUpdateUserEmail.classList.remove("hidden");
      canUpdateUser = false;
    }
  }
  if (!validatePassword(inputUpdateUserPassword.value)) {
    alertUpdateUserPassword.classList.remove("hidden");
    canUpdateUser = false;
  }
  if (canUpdateUser) {
    fetch("/api/users/update_user", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        user_id: id,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        full_name: inputUpdateUserFullName.value,
        email: inputUpdateUserEmail.value,
        password: inputUpdateUserPassword.value,
        is_admin: parseInt(selectUpdateUserType.value),
        user_id: id,
      }),
    }).then(async (response) => {
      let data = await response.json();
      if (data.success) {
        updateUserCancelHandler();
        getAllUsers();
      } else if (data.message.includes("Duplicate entry")) {
        alertUpdateUserExist.classList.remove("hidden");
      } else if (
        data.message.includes(
          "Deleting or modifying Super Admin is Prohibited!"
        )
      ) {
        alert(data.message);
        updateUserCancelHandler();
      }
    });
  }
}

function selectIsAdminHandler() {
  isAdminFilter = selectIsAdmin.value;
  displayUsers();
}

function getAllSubjects() {
  fetch("/api/questions/all_subjects", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    let data = await response.json();
    console.log(data);
    if (data.message.includes("No records found")) {
      subjects = [
        {
          subject_id: 0,
          subject_name: "No subjects",
          subject_is_active: 0,
        },
      ];
      subjectsCount.innerHTML = 0 + " subjects";
    } else {
      subjects = [];
      subjects.push(...subjects, ...data.subjects);
      console.log(subjects);
      subjectsCount.innerHTML = subjects.length + " subjects";
    }
    displaySubjects();
  });
}

function displaySubjects() {
  let tableRows = "";
  subjects.forEach((subject) => {
    let state =
      subject.subject_is_active == 0
        ? "../img/switch_off.gif"
        : "../img/switch_on.gif";
    tableRows += `<tr>
        <td>
          <span class="id-value">${subject.subject_id} </span>
          <span class="subject-name">${subject.subject_name}</span>
        </td>
        <td>
          <div class="subject-actions">
            <img class="icon subject-update" src="../img/edit.png">
            <img class="icon subject-delete" src="../img/delete.png">
            <img class="switch-item" src="${state}">
          </div>
        </td>
      </tr>`;
  });
  subjectsTableBody.innerHTML = tableRows;
  if (subjects[0].subject_name == "No subjects") {
    document.querySelector(".subject-actions").classList.add("grey");
  }
}

function addNewSubjectHandler() {
  inputNewSubject.value = "";
  adminContainer.classList.add("grey");
  addNewSubjectContainer.classList.remove("hidden");
}

function addNewSubjectCanselHandler() {
  adminContainer.classList.remove("grey");
  addNewSubjectContainer.classList.add("hidden");
}

function addNewSubjectButtonHandler() {
  if (inputNewSubject.value.length > 2) {
    fetch("/api/questions/create_subject", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        subject_name: inputNewSubject.value,
      }),
    }).then(async (response) => {
      let data = await response.json();
      if (data.success) {
        addNewSubjectCanselHandler();
        getAllSubjects();
      } else if (data.message.includes("Duplicate entry")) {
        inputNewSubject.value = "";
        alertNewSubjectExists.classList.remove("hidden");
      }
    });
  }
}
