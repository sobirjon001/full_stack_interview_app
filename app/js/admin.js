// web elements
const usersModuleLink = document.querySelector("#users-module-link");
const questionsModuleLink = document.querySelector("#questions-module-link");
const usersModuleContainer = document.querySelector("#users-module-container");
const questionsModuleContainer = document.querySelector(
  "#questions-module-container"
);
const navUserName = document.querySelector("#nav-user-name");
const navLogOut = document.querySelector("#nav-log-out");

// global variables
let token = "";
let userName = "";

// event listeners
usersModuleLink.addEventListener("click", usersModuleLinkHandler);
questionsModuleLink.addEventListener("click", questionsModuleLinkHandler);

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
  });
})();

function usersModuleLinkHandler() {
  usersModuleLink.classList.add("active-link");
  questionsModuleLink.classList.remove("active-link");
  usersModuleContainer.classList.remove("hidden");
  questionsModuleContainer.classList.add("hidden");
}

function questionsModuleLinkHandler() {
  usersModuleLink.classList.remove("active-link");
  questionsModuleLink.classList.add("active-link");
  usersModuleContainer.classList.add("hidden");
  questionsModuleContainer.classList.remove("hidden");
}
