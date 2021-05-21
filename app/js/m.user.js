// wen elements
const playContainer = document.querySelector("#play-container");
const menueContainer = document.querySelector("#menue-container");
const mainButtonText = document.querySelector("#main-button-text");
const subjectsListing = document.querySelector("#subjects-listing");
const subjectsCheckboxContainer = document.querySelector(
  "#subjects-checkbox-container"
);
const updateSubjectsButton = document.querySelector("#update-subjects-button");
const darkLightStyleLink = document.querySelector("#dark-light-style");
const questionsCount = document.querySelector("#questions-count");

// global variables
let userName = "";
let token = "";
let subjects = [];
let selectedSubjects = [];
let questions = [];
let timerIsEnabled = true;
let autoRecordingIsEnabled = true;
let autoSolutionIsEnabled = true;
let subject_name = "";
// event listeners

// functions
(() => {
  token = sessionStorage.getItem("token");
  fetch("/api/users/decode", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    let data = await response.json();
    userName = data.data.full_name;
    // navUserName.innerHTML = "Welcome " + userName;
    openMenueForm();
  });
})();

function openMenueForm() {
  getAllActiveSubjects();
  if (selectedSubjects.length != 0) {
    subjectsCheckboxContainer.classList.add("grey");
    updateSubjectsButton.classList.remove("grey");
  } else {
    subjectsCheckboxContainer.classList.remove("grey");
    updateSubjectsButton.classList.add("grey");
  }
  subjectsListing.innerHTML =
    selectedSubjects.length > 0
      ? "If you want to update subjects<br />click on 'Update subjects list'"
      : "Please choose subjects<br />you want to practise today";
  subjectsListing.classList.remove("alert");
  playContainer.classList.add("inactive");
  menueContainer.classList.remove("hidden");
  mainButtonText.innerHTML = "Go!";
  animateOpenMenue();
}

function closeMenueForm() {
  animateCloseMenue(() => {
    playContainer.classList.remove("inactive");
    menueContainer.classList.add("hidden");
    mainButtonText.innerHTML = "Menue";
  });
}

function getAllActiveSubjects() {
  fetch("/api/questions/active_subjects", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    let data = await response.json();
    if (data.message.includes("No records found")) {
      subjectsListing.innerHTML =
        "No subjects recorded yet<br />Please contact administrator!";
    } else {
      subjects = [];
      subjects.push(...data.subjects);
      let checkboxes = "";
      subjects.forEach((subject) => {
        checkboxes += `<label class="subject-label dark-item"
        >
          ${subject.subject_name}
        <input
          type="checkbox"
          id="${subject.subject_name}"
          class="subject-checkbox dark-item"
        ></label>`;
      });
      // for (let i = 0; i < 20; i++) {
      //   checkboxes += `<label class="subject-label dark-item"
      //   >
      //     Selenium
      //   <input
      //     type="checkbox"
      //     id="${i}"
      //     class="subject-checkbox dark-item"
      //   ></label>`;
      // }
      subjectsCheckboxContainer.innerHTML = checkboxes;
    }
  });
}

function mainMenueButtonHandler(t) {
  if (t.getAttribute("value") == "0") {
    t.setAttribute("value", "1");
    openMenueForm();
    return;
  }
  if (selectedSubjects.length > 0) {
    t.setAttribute("value", "0");
    closeMenueForm();
    return;
  }
  document.querySelectorAll(".subject-checkbox").forEach((checkbox) => {
    if (checkbox.checked) {
      selectedSubjects.push(checkbox.id);
    }
  });
  if (selectedSubjects.length > 0) {
    t.setAttribute("value", "0");
    closeMenueForm();
    getQuestionsByChosenSubjects();
    return;
  }
  subjectsListing.innerHTML =
    "You have to chouse at least one<br />subject to continue!";
  subjectsListing.classList.add("alert");
}

function animateOpenMenue() {
  let tl = gsap.timeline();
  tl.to("#dark-light-form", 1, { x: "25px", ease: "power4.out" })
    .to("#timer-form", 1, { x: "10px", ease: "power4.out" }, 0.2)
    .to("#auto-recording-form", 1, { x: "0px", ease: "power4.out" }, 0.4)
    .to("#auto-solution-form", 1, { x: "0px", ease: "power4.out" }, 0.6)
    .to("#subjects-form", 1, { y: "0%", ease: "elastic.out" }, 0.6);
}

function animateCloseMenue(callback) {
  let tl = gsap.timeline();
  tl.to("#dark-light-form", 1, { x: "-1000px", ease: "power4.in" })
    .to("#timer-form", 1, { x: "-1000px", ease: "power4.in" }, 0.2)
    .to("#auto-recording-form", 1, { x: "-1000px", ease: "power4.in" }, 0.4)
    .to("#auto-solution-form", 1, { x: "-1000px", ease: "power4.in" }, 0.6)
    .to(
      "#subjects-form",
      1,
      { y: "-120%", ease: "elastic.in", onComplete: callback },
      0.6
    );
}

function updateSubjectsButtonHandler() {
  selectedSubjects = [];
  subjectsCheckboxContainer.classList.remove("grey");
}

function generalSwitchButtonHandler(t) {
  if (t.getAttribute("value") == "on") {
    t.setAttribute("value", "off");
    t.setAttribute("src", "../img/switch_off.gif");
  } else {
    t.setAttribute("value", "on");
    t.setAttribute("src", "../img/switch_on.gif");
  }
  return t.getAttribute("value");
}

function darkLightSwitchHandler(t) {
  let status = generalSwitchButtonHandler(t);
  if (status == "on") {
    darkLightStyleLink.href = "../css/user.light.style.css";
    console.log(darkLightStyleLink.href);
  } else {
    darkLightStyleLink.href = "../css/user.dark.style.css";
  }
}

function timerSwitchHandler(t) {
  let status = generalSwitchButtonHandler(t);
  timerIsEnabled = status == "on";
}

function autoRecordingSwitchHandler(t) {
  let status = generalSwitchButtonHandler(t);
  autoRecordingIsEnabled = status == "on";
}

function autoSolutionSwitchHandler(t) {
  let status = generalSwitchButtonHandler(t);
  autoSolutionIsEnabled = status == "on";
}

function getQuestionsByChosenSubjects() {
  let tempSubjectList = [...selectedSubjects];
  questions = [];
  recurringCallToGetQuestions(tempSubjectList, 1, 0);
}

function recurringCallToGetQuestions(subjectsList, current_page, total_pages) {
  if (current_page > total_pages) {
    if (subjectsList.length == 0) {
      startGame();
      return;
    }
    subject_name = subjectsList.splice(0, 1);
    current_page = 1;
  }
  fetch("/api/questions/by_subject", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      subject: subject_name,
      page: current_page,
    },
  }).then(async (response) => {
    let data = await response.json();
    if (data.message.includes("No records found")) {
      questions = [];
      questionsCount.innerHTML = 0 + " questions";
    } else {
      questions.push(...data.questions);
      questionsCount.innerHTML = data.number_of_entries + " questions";
    }
    total_pages = parseInt(data.total_pages);
    if (current_page <= total_pages) {
      recurringCallToGetQuestions(subjectsList, ++current_page, total_pages);
    }
  });
}

function startGame() {
  console.log(questions);
}
