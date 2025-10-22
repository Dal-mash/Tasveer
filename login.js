/////////////////////////////////////
/// LOGIN FORM
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch('https://backend-production-fea2.up.railway.app/Sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const { userId, token } = data;

    if (response.ok && token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.href = "./Home/";
    } else {
      alert(data.message || "Invalid credentials. Please try again.");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Please check your connection and try again.");
  }
});


/////////////////////////////////////
/// SIGN UP FORM
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!username || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    // Step 1: Sign up
    const signupResponse = await fetch('https://backend-production-fea2.up.railway.app/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    // Always safely parse JSON, or fallback once
    let signupData;
    try {
      const text = await signupResponse.text();
      signupData = text ? JSON.parse(text) : {};
    } catch {
      signupData = {};
    }

    if (!signupResponse.ok) {
      alert(signupData.message || "Sign-up failed. Please try again.");
      return;
    }

    alert("Sign-up successful! Logging you in...");

    // Step 2: Auto-login after successful signup
    const loginResponse = await fetch('https://backend-production-fea2.up.railway.app/Sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    let loginData;
    try {
      const text = await loginResponse.text();
      loginData = text ? JSON.parse(text) : {};
    } catch {
      loginData = {};
    }

    const { userId, token } = loginData;

    if (loginResponse.ok && token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.replace("./Home/");
    } else {
      alert(loginData.message || "Login after sign-up failed. Please log in manually.");
    }

  } catch (error) {
    console.error("Error during signup/login:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
});
