import {
  getUsers,
  initCommonLayout,
  saveUsers,
  setCurrentUser,
  showCenterNotice
} from "./common.js";

function setAuthMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `auth-message ${type}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function seedAdminAccount() {
  const users = getUsers();
  const adminEmail = "admin@lunafashion.com";
  const adminPassword = "123456";
  const adminIndex = users.findIndex((user) => user.email === adminEmail);

  const adminUser = {
    id: adminIndex === -1 ? 1 : users[adminIndex].id,
    firstName: "Admin",
    lastName: "Luna",
    email: adminEmail,
    password: adminPassword,
    phone: "",
    address: "",
    role: "admin",
    createdAt: users[adminIndex]?.createdAt || new Date().toISOString()
  };

  if (adminIndex === -1) users.push(adminUser);
  else users[adminIndex] = { ...users[adminIndex], ...adminUser };
  saveUsers(users);
}

export function initRegister() {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");
  if (!registerForm) return;

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value.trim();
    const users = getUsers();

    if (!lastName || !firstName || !email || !password) {
      setAuthMessage(registerMessage, "Vui lòng nhập đầy đủ thông tin.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      setAuthMessage(registerMessage, "Email chưa đúng định dạng.", "error");
      return;
    }

    if (password.length < 6) {
      setAuthMessage(registerMessage, "Mật khẩu cần có ít nhất 6 ký tự.", "error");
      return;
    }

    if (users.some((user) => user.email === email)) {
      setAuthMessage(registerMessage, "Email này đã được đăng ký. Vui lòng đăng nhập.", "error");
      return;
    }

    const newUser = {
      id: Date.now(),
      lastName,
      firstName,
      email,
      phone: "",
      address: "",
      role: "customer",
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setAuthMessage(registerMessage, "Tạo tài khoản thành công.", "success");
    showCenterNotice("Tạo tài khoản thành công. Vui lòng đăng nhập.", "success", () => {
      window.location.href = "login.html";
    });
  });
}

export function initLogin() {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();
    const users = getUsers();
    const user = users.find((item) => item.email === email && item.password === password);

    if (!email || !password) {
      setAuthMessage(loginMessage, "Vui lòng nhập email và mật khẩu.", "error");
      return;
    }

    if (!user) {
      setAuthMessage(loginMessage, "Email hoặc mật khẩu chưa đúng.", "error");
      return;
    }

    setCurrentUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "customer",
      createdAt: user.createdAt
    });

    setAuthMessage(loginMessage, "Đăng nhập thành công.", "success");
    showCenterNotice("Đăng nhập thành công.", "success", () => {
      window.location.href = user.role === "admin" ? "admin.html" : "index.html";
    });
  });
}

export function initAuthPage() {
  seedAdminAccount();
  initCommonLayout();
  initLogin();
  initRegister();
}

if (document.getElementById("loginForm") || document.getElementById("registerForm")) {
  initAuthPage();
}
