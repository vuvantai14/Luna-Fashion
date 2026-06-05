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
  return Number(number || 0).toLocaleString("vi-VN") + "đ";
}

export const formatCurrency = formatMoney;

export function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export function getUsers() {
  return getData("lunaUsers", []);
}

export function saveUsers(users) {
  saveData("lunaUsers", users);
}

export function getOrders() {
  return getData("lunaOrders", []);
}

export function saveOrders(orders) {
  saveData("lunaOrders", orders);
}

export function getCurrentUser() {
  return getData("lunaCurrentUser", null);
}

export function setCurrentUser(user) {
  saveData("lunaCurrentUser", user);
}

export function clearCurrentUser() {
  localStorage.removeItem("lunaCurrentUser");
}

export function checkLogin() {
  return getCurrentUser();
}

export function logout(redirect = "login.html") {
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
      <span>${type === "success" ? "✓" : "!"}</span>
      <p>${message}</p>
    </div>
  `;
  notice.classList.add("show");

  setTimeout(() => {
    notice.classList.remove("show");
    if (callback) callback();
  }, 1200);
}

export function updateLoginLinks() {
  const currentUser = getCurrentUser();
  document.querySelectorAll(".account-dropdown").forEach((menu) => menu.remove());

  document.querySelectorAll(".login-link").forEach((link) => {
    if (!currentUser) {
      link.innerHTML = `<span>👤</span><small>Tài khoản</small>`;
      link.href = "login.html";
      link.setAttribute("aria-label", "Tài khoản");
      return;
    }

    link.innerHTML = `<span>👤</span><small>${currentUser.firstName || "Tài khoản"}</small>`;
    link.href = "#account-menu";
    link.setAttribute("aria-label", `Tài khoản ${currentUser.firstName || ""}`);

    const actions = link.closest(".header-actions");
    if (actions) {
      const menu = document.createElement("div");
      menu.className = "account-dropdown";
      menu.innerHTML = `
        <a href="account.html">Thông tin người dùng</a>
        <a href="orders.html">Đơn hàng của tôi</a>
      `;
      actions.appendChild(menu);
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

  const normalizedUser = currentUser.email === "admin@lunafashion.com"
    ? { ...currentUser, role: "admin" }
    : { ...currentUser, role: currentUser.role || "customer" };

  setCurrentUser(normalizedUser);
}

export function guardAdminWebsiteAccess() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") return;

  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const allowedAdminPages = new Set(["admin.html", "login.html", "register.html"]);
  if (!allowedAdminPages.has(pageName)) window.location.replace("admin.html");
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
      button.textContent = shouldShow ? "◈" : "◇";
      button.setAttribute("aria-label", shouldShow ? "Ẩn mật khẩu" : "Hiện mật khẩu");
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

export function initCommonLayout() {
  normalizeCurrentUserRole();
  guardAdminWebsiteAccess();
  updateLoginLinks();
  initPasswordToggles();
  initMenuToggle();

  document.addEventListener("click", () => {
    document.querySelectorAll(".account-dropdown.show").forEach((menu) => menu.classList.remove("show"));
  });
}

export const renderHeader = updateLoginLinks;
export function renderFooter() {}
