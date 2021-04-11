// selectors
const loginForm = document.querySelector("#login-form");
const inputLoginEmail = document.querySelector("#input-login-email");
const inputLoginPassword = document.querySelector("#input-login-password");
const buttonLogin = document.querySelector("#button-login");
const alertInvalidCredentials = document.querySelector(
  "#alert-invalid-credentials"
);

// global variables
let token = "";

// event listeners
buttonLogin.addEventListener("click", login);

// functions
function login(event) {
  event.preventDefault();
  fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: inputLoginEmail.value,
      password: inputLoginPassword.value,
    }),
  })
    .then((responce) => {
      console.log(responce);
      if (responce.status === 200) {
        alertInvalidCredentials.classList.add("hidden");
        token = responce.json().token;
        openLandingPage;
      }
      if (responce.status === 401) {
        alertInvalidCredentials.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function test(event) {
  event.preventDefault();
  console.log("form submitted");
  console.log(inputLoginEmail.nodeValue);
  console.log(inputLoginPassword.nodeValue);
}

function openLandingPage() {}
