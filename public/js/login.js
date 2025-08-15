document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Take email and pssword
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // santanize email
  if (!validateEmail(email)) return;

  // make http request
  login(email, password);
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

async function login(email, password) {
  try {
    const url = "http://localhost:5500/api/v1/users/login";
    const respond = await axios.post(url, {
      email,
      password,
    });
    const result = await respond.data;
    if (respond.data.status === "success") {
      alert("Logged In Successfully");
      window.setTimeout(() => {
        window.location.assign("/");
      }, 1500);
    }
  } catch (error) {
    alert(error.respond.data.message);
  }
}
