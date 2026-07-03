import { apiRequest, setStoredUser, setToken } from "./api.js";
import {
  ADMIN_EMAIL,
  adminUrl,
  getUsers,
  initCommonLayout,
  pageUrl,
  saveUsers,
  setCurrentUser,
  showCenterNotice,
  updateLoginLinks
} from "./common.js";

function setAuthMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `auth-message ${type}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeUserForFrontend(user) {
  if (!user) return null;
  const role = String(user.role || "").toUpperCase();
  return {
    ...user,
    firstName: user.fullName?.split(" ").slice(-1)[0] || user.email,
    lastName: user.fullName?.split(" ").slice(0, -1).join(" ") || "",
    role: role === "ADMIN" ? "admin" : "customer",
    createdAt: user.createdAt || new Date().toISOString()
  };
}

function getFriendlyError(error, fallback) {
  if (!error) return fallback;
  if (error.status === 0) return "Khong ket noi duoc backend. Hay chay backend tai localhost:8080.";
  if (error.status === 400) return error.message || "Thong tin chua hop le.";
  if (error.status === 401 || error.status === 403) return "Email hoac mat khau chua dung.";
  return error.message || fallback;
}

export function seedAdminAccount() {
  const users = getUsers();
  const adminIndex = users.findIndex((user) => user.email === ADMIN_EMAIL);
  const adminUser = {
    id: adminIndex === -1 ? 1 : users[adminIndex].id,
    firstName: "Admin",
    lastName: "Ni Sport",
    fullName: "Admin Ni Sport",
    email: ADMIN_EMAIL,
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

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const lastName = document.getElementById("lastName")?.value.trim() || "";
    const firstName = document.getElementById("firstName")?.value.trim() || "";
    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase() || "";
    const password = document.getElementById("registerPassword")?.value.trim() || "";
    const phone = document.getElementById("registerPhone")?.value.trim() || "";
    const address = document.getElementById("registerAddress")?.value.trim() || "";
    const fullName = `${lastName} ${firstName}`.trim();

    if (!fullName || !email || !password) {
      setAuthMessage(registerMessage, "Vui long nhap day du ho ten, email va mat khau.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      setAuthMessage(registerMessage, "Email chua dung dinh dang.", "error");
      return;
    }
    if (password.length < 6) {
      setAuthMessage(registerMessage, "Mat khau can co it nhat 6 ky tu.", "error");
      return;
    }

    setAuthMessage(registerMessage, "Dang tao tai khoan...", "success");
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        auth: false,
        body: { fullName, email, password, phone, address }
      });
      setAuthMessage(registerMessage, "Tao tai khoan thanh cong. Hay dang nhap.", "success");
      showCenterNotice("Tao tai khoan thanh cong.", "success", () => {
        window.location.href = pageUrl("login.html");
      });
    } catch (error) {
      setAuthMessage(registerMessage, getFriendlyError(error, "Khong tao duoc tai khoan."), "error");
    }
  });
}

export function initLogin() {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase() || "";
    const password = document.getElementById("loginPassword")?.value.trim() || "";

    if (!email || !password) {
      setAuthMessage(loginMessage, "Vui long nhap email va mat khau.", "error");
      return;
    }

    setAuthMessage(loginMessage, "Dang dang nhap...", "success");
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        auth: false,
        body: { email, password }
      });
      const token = response?.accessToken;
      const user = normalizeUserForFrontend(response?.user);
      if (!token || !user) throw new Error("Login response is missing token or user.");

      setToken(token);
      setStoredUser(user);
      setCurrentUser(user);
      updateLoginLinks();

      setAuthMessage(loginMessage, "Dang nhap thanh cong.", "success");
      showCenterNotice("Dang nhap thanh cong.", "success", () => {
        window.location.href = String(user.role).toUpperCase() === "ADMIN" || user.role === "admin" ? adminUrl("dashboard.html") : pageUrl("index.html");
      });
    } catch (error) {
      setAuthMessage(loginMessage, getFriendlyError(error, "Thong tin dang nhap chua hop le."), "error");
    }
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
