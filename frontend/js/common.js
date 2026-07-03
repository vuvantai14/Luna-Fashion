import { clearStoredAuth, getCurrentUserFromApi, getStoredUser, removeToken, setStoredUser } from "./api.js";

export const APP_NAME = "Ni Sport";
export const APP_SLOGAN = "San sang ra san";
export const ADMIN_EMAIL = "admin@nisport.com";

export function getData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function formatMoney(number) {
  return Number(number || 0).toLocaleString("vi-VN") + "d";
}

export const formatCurrency = formatMoney;

export function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/d/g, "d");
}

export function getUsers() {
  return getData("niSportUsers", []);
}

export function saveUsers(users) {
  saveData("niSportUsers", users);
}

export function getOrders() {
  return getData("niSportOrders", []);
}

export function saveOrders(orders) {
  saveData("niSportOrders", orders);
}

export function getCurrentUser() {
  return getStoredUser() || getData("niSportCurrentUser", null);
}

export function setCurrentUser(user) {
  setStoredUser(user);
}

export function clearCurrentUser() {
  clearStoredAuth();
  localStorage.removeItem("niSportCurrentUser");
}

function getPathScope() {
  const pathname = window.location.pathname.replace(/\\/g, "/");
  if (pathname.includes("/admin/")) return "admin";
  if (pathname.includes("/pages/")) return "pages";
  return "root";
}

export function pageUrl(page = "index.html") {
  const cleanPage = String(page).replace(/^\/+/, "");
  const scope = getPathScope();

  if (cleanPage === "index.html") {
    if (scope === "root") return "pages/index.html";
    if (scope === "admin") return "../pages/index.html";
    return "./index.html";
  }
  if (cleanPage.startsWith("admin/")) {
    return adminUrl(cleanPage.replace(/^admin\//, ""));
  }
  if (scope === "root") return `pages/${cleanPage}`;
  if (scope === "admin") return `../pages/${cleanPage}`;
  return `./${cleanPage}`;
}

export function adminUrl(page = "dashboard.html") {
  const cleanPage = String(page).replace(/^\/+/, "");
  const scope = getPathScope();
  if (scope === "admin") return cleanPage;
  if (scope === "pages") return `../admin/${cleanPage}`;
  return `admin/${cleanPage}`;
}

export function checkLogin() {
  return getCurrentUser();
}

export function logout(redirect = pageUrl("login.html")) {
  clearCurrentUser();
  window.location.href = redirect;
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

export function showCenterNotice(message, type = "success", callback) {
  let notice = document.getElementById("centerNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "centerNotice";
    notice.className = "center-notice";
    document.body.appendChild(notice);
  }

  notice.innerHTML = `
    <div class="center-notice-box ${type}">
      <span>${type === "success" ? "OK" : "!"}</span>
      <p>${message}</p>
    </div>
  `;
  notice.classList.add("show");

  setTimeout(() => {
    notice.classList.remove("show");
    if (callback) callback();
  }, 1200);
}

function renderBranding() {
  document.querySelectorAll(".logo-main").forEach((logo) => {
    logo.innerHTML = "Ni<span>Sport</span>";
  });
  document.querySelectorAll(".logo small, .footer-logo small, .auth-logo small").forEach((tagline) => {
    tagline.textContent = APP_SLOGAN;
  });
}

function displayName(user) {
  if (!user) return "Tai khoan";
  return user.fullName || user.firstName || user.email || "Tai khoan";
}

export function updateLoginLinks() {
  const currentUser = getCurrentUser();
  document.querySelectorAll(".account-dropdown").forEach((menu) => menu.remove());

  document.querySelectorAll(".login-link").forEach((link) => {
    if (!currentUser) {
      link.innerHTML = `<span class="account-mark">TK</span><small>Tai khoan</small>`;
      link.href = pageUrl("login.html");
      link.setAttribute("aria-label", "Tai khoan");
      return;
    }

    const label = displayName(currentUser).split(" ").slice(-1)[0] || "Tai khoan";
    link.innerHTML = `<span class="account-mark">TK</span><small>${label}</small>`;
    link.href = "#account-menu";
    link.setAttribute("aria-label", `Tai khoan ${displayName(currentUser)}`);

    const actions = link.closest(".header-actions");
    if (actions) {
      const menu = document.createElement("div");
      menu.className = "account-dropdown";
      menu.innerHTML = `
        <a href="${pageUrl("account.html")}">Thong tin ca nhan</a>
        <a href="${pageUrl("orders.html")}">Don hang cua toi</a>
        ${String(currentUser.role).toUpperCase() === "ADMIN" ? `<a href="${adminUrl("dashboard.html")}">Quan tri admin</a>` : ""}
        <button type="button" data-logout-button>Dang xuat</button>
      `;
      actions.appendChild(menu);
      menu.querySelector("[data-logout-button]")?.addEventListener("click", () => logout(pageUrl("login.html")));
    }

    if (link.dataset.accountReady !== "true") {
      link.dataset.accountReady = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        link.closest(".header-actions")?.querySelector(".account-dropdown")?.classList.toggle("show");
      });
    }
  });
}

export function normalizeCurrentUserRole() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const role = String(currentUser.role || "").toUpperCase();
  setCurrentUser({
    ...currentUser,
    role: role === "ADMIN" ? "admin" : role === "USER" ? "customer" : currentUser.role || "customer"
  });
}

export function guardAdminWebsiteAccess() {
  const currentUser = getCurrentUser();
  const role = String(currentUser?.role || "").toUpperCase();
  if (!currentUser || role !== "ADMIN") return;

  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const allowedAdminPages = new Set(["dashboard.html", "login.html", "register.html"]);
  if (!allowedAdminPages.has(pageName)) window.location.replace(adminUrl("dashboard.html"));
}

export function initPasswordToggles() {
  document.querySelectorAll(".password-field").forEach((field) => {
    const input = field.querySelector("input");
    const button = field.querySelector("button");
    if (!input || !button || button.dataset.passwordReady === "true") return;

    button.dataset.passwordReady = "true";
    button.addEventListener("click", () => {
      const shouldShow = input.type === "password";
      input.type = shouldShow ? "text" : "password";
      button.textContent = shouldShow ? "An" : "Hien";
      button.setAttribute("aria-label", shouldShow ? "An mat khau" : "Hien mat khau");
    });
  });
}

export function initMenuToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (!menuToggle || !mainNav || menuToggle.dataset.menuReady === "true") return;

  menuToggle.dataset.menuReady = "true";
  menuToggle.addEventListener("click", () => mainNav.classList.toggle("show"));
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("show"));
  });
}

export async function refreshCurrentUserFromApi() {
  try {
    await getCurrentUserFromApi();
  } catch {
    removeToken();
  } finally {
    updateLoginLinks();
  }
}

export function initCommonLayout() {
  renderBranding();
  normalizeCurrentUserRole();
  guardAdminWebsiteAccess();
  updateLoginLinks();
  refreshCurrentUserFromApi();
  initPasswordToggles();
  initMenuToggle();

  if (document.body.dataset.commonClickReady !== "true") {
    document.body.dataset.commonClickReady = "true";
    document.addEventListener("click", () => {
      document.querySelectorAll(".account-dropdown.show").forEach((menu) => menu.classList.remove("show"));
    });
  }
}

export const renderHeader = updateLoginLinks;
export function renderFooter() {}
