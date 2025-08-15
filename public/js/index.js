import "@babel/polyfill";
import { validateEmail, login } from "./login";
import { initMap } from "./mapBox";

// DOM Element
const form = document.querySelector(".form");
const map = document.getElementById("map");

// Log in
if (form) {
  form.addEventListener("submit", (e) => {
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
