// selectors
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const loginAlert = document.querySelector("#login-alert");
const inputFullname = document.querySelector("#input-fullname");
const inputEmail = document.querySelector("#input-email");
const inputPassword = document.querySelector("#input-password");
const buttonLogin = document.querySelector("#button-login");
const loginLink = document.querySelector("#login-link");
const signUpLink = document.querySelector("#sign-up-link");

// api base_uri settings
const base_uri = "192.168.1.20:7000";

// global variables
let isLoggingIn = true;
let token = "";
let is_admin = 0;

// event listeners
buttonLogin.addEventListener("click", loginButtonHandler);
loginLink.addEventListener("click", toLogin);
signUpLink.addEventListener("click", toSignUp);

// functions
function cleaerLoginInputs() {
  inputFullname.value = "";
  inputEmail.value = "";
  inputPassword.value = "";
  loginAlert.classList.add("hidden");
}

function toLogin() {
  isLoggingIn = true;
  loginMessage.innerHTML = "Login to existing account";
  buttonLogin.value = "Login";
  cleaerLoginInputs();
  inputFullname.classList.add("hidden");
}

function toSignUp() {
  isLoggingIn = false;
  loginMessage.innerHTML = "Sign up to new accaunt";
  buttonLogin.value = "Sign Up";
  cleaerLoginInputs();
  inputFullname.classList.remove("hidden");
}

function loginButtonHandler(event) {
  event.preventDefault();
  if (isLoggingIn) {
    login();
  } else {
    signUp();
  }
}

function login() {
  fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: inputEmail.value,
      password: inputPassword.value,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        loginAlert.classList.add("hidden");
        let data = await response.json();
        token = data.token;
        is_admin = data.is_admin;
        if (is_admin === 1) {
          sessionStorage.setItem("token", token);
          location.replace("./html/admin_users.html");
        } else {
          sessionStorage.setItem("token", token);
          if (
            /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            location.replace("./html/m.user.html");
          } else {
            location.replace("./html/user.html");
          }
        }
      }
      if (response.status === 401) {
        toLogin();
        loginAlert.value = "Invalid email or password!";
        loginAlert.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function signUp() {
  fetch("/api/users/sign_up", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      full_name: inputFullname.value,
      email: inputEmail.value,
      password: inputPassword.value,
      is_admin: 0,
    }),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        toLogin();
        loginMessage.innerHTML = "Logint to created account";
      }
      if (response.status === 401) {
        toSignUp();
        loginAlert.value = "This email is already in use";
        loginAlert.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function test(event) {
  console.log("form submitted");
  console.log(inputEmail.nodeValue);
  console.log(inputPassword.nodeValue);
}
