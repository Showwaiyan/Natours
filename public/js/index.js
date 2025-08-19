import "@babel/polyfill";
import { validateEmail, login, logout } from "./login";
import { initMap } from "./mapBox";
import { updateSetting, updatePassword } from "./updateSettings";

// DOM Element
const loginForm = document.querySelector(".form--login");
const map = document.getElementById("map");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

// Log in
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Take email and pssword
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // santanize email
    if (!validateEmail(email)) return;

    // make http request
    login(email, password);
  });
}

// Display
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  document.addEventListener("DOMContentLoaded", (e) => {
    initMap(locations);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name",document.getElementById("name").value);
    form.append("email",document.getElementById("email").value);
    form.append("photo",document.getElementById("photo").files[0]);
    updateSetting(form);
  });
}

if (userPasswordForm)
  [
    userPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById("password-current").value;
      const newPassword = document.getElementById("password").value;
      const confirmPassword = document.getElementById("password-confirm").value;
      updatePassword(currentPassword, newPassword, confirmPassword);
    }),
  ];
