import { showAlert } from "./alert";
import axios from "axios";

export async function updateSetting(data) {
  try {
    const url = "http://localhost:5500/api/v1/users/updateme";
    const response = await axios.patch(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = response.data;
    if (result.status === "success") {
      showAlert("success", "Your Information is successfully Updated");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
}

export async function updatePassword(
  currentPassword,
  newPassword,
  confirmPassword,
) {
  try {
    const url = "http://localhost:5500/api/v1/users/updatepassword";
    const response = await axios.patch(url, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    document.querySelector(".btn--update-password").textContent =
      "Updating.....";
    const result = await response.data;
    if (result.status === "success") {
      showAlert("success", "Your Password are successfully Updated");
    }
    document.querySelector(".btn--update-password").textContent =
      "Save Password";
    window.location.reload();
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
}
