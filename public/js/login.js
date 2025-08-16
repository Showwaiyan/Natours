import axios from "axios";
import { showAlert } from "./alert";

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export async function login(email, password) {
  try {
    const url = "http://localhost:5500/api/v1/users/login";
    const response = await axios.post(url, {
      email,
      password,
    });
    const result = await response.data;
    if (result.status === "success") {
      showAlert("success", "Logged In Successfully");
      window.setTimeout(() => {
        window.location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
}

export async function logout() {
  try {
    const url = "http://localhost:5500/api/v1/users/logout";
    const response = await axios.get(url);
    const result = await response.data;
    if (result.status === "success") {
      showAlert("success", "Logged Out Successfully");
      window.location.reload(true);
      window.location.assign("/login");
    }
  } catch (error) {
    showAlert("error", "Error Logging Out! Try Again.");
  }
}
