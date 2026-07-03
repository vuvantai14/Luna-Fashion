import {
  clearCurrentUser,
  formatMoney,
  getCurrentUser,
  getUsers,
  initCommonLayout,
  pageUrl,
  saveUsers,
  setCurrentUser,
  showCenterNotice
} from "./common.js";
import { getCart, initCartControls } from "./cart.js";
import { formatOrderCode, formatOrderStatusText, getOrderStatusClass } from "./orders.js";
import { getOrders, saveOrders } from "./common.js";
import { resolveAssetUrl } from "./api.js";

function getUserOrders(currentUser) {
  return getOrders().filter((order) => String(order.customerId) === String(currentUser.id) || order.email === currentUser.email);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getAccountImageSrc(image) {
  const imagePath = String(image || "").trim();
  if (!imagePath) return resolveAssetUrl("assets/product-1.jpg");
  if (/^(https?:|data:|blob:)/.test(imagePath)) return imagePath;

  const normalizedPath = imagePath.replace(/\\/g, "/");
  const assetIndex = normalizedPath.lastIndexOf("assets/");
  if (assetIndex !== -1) return resolveAssetUrl(normalizedPath.slice(assetIndex));

  return normalizedPath;
}

function saveUserFromForm(container, callback) {
  const currentUser = getCurrentUser();
  const lastName = container.querySelector("#userLastNameInput")?.value.trim();
  const firstName = container.querySelector("#userFirstNameInput")?.value.trim();
  const email = container.querySelector("#userEmailInput")?.value.trim().toLowerCase();
  const phone = container.querySelector("#userPhoneInput")?.value.trim();
  const address = container.querySelector("#userAddressInput")?.value.trim();

  if (!lastName || !firstName || !email) {
    showCenterNotice("Vui lĂ²ng nháº­p Ä‘áº§y Ä‘á»§ há» tĂªn vĂ  email.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showCenterNotice("Email chÆ°a Ä‘Ăºng Ä‘á»‹nh dáº¡ng.", "error");
    return;
  }

  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  const emailExists = users.some((user) => user.email === email && user.id !== currentUser.id);
  if (emailExists) {
    showCenterNotice("Email nĂ y Ä‘Ă£ Ä‘Æ°á»£c tĂ i khoáº£n khĂ¡c sá»­ dá»¥ng.", "error");
    return;
  }

  const updatedUser = { ...currentUser, lastName, firstName, email, phone, address };
  if (userIndex !== -1) users[userIndex] = { ...users[userIndex], lastName, firstName, email, phone, address };

  const orders = getOrders();
  const updatedCustomerName = `${lastName || ""} ${firstName || ""}`.trim();
  const updatedOrders = orders.map((order) => {
    const isCurrentUserOrder = String(order.customerId) === String(currentUser.id) || order.email === currentUser.email;
    if (!isCurrentUserOrder) return order;

    return {
      ...order,
      customerName: updatedCustomerName,
      email,
      phone,
      address
    };
  });

  setCurrentUser(updatedUser);
  saveUsers(users);
  saveOrders(updatedOrders);
  showCenterNotice("Cáº­p nháº­t thĂ´ng tin thĂ nh cĂ´ng.", "success", callback);
}

function accountMarkup(currentUser, mode = "page") {
  const userOrders = getUserOrders(currentUser);
  const deliveredOrders = userOrders.filter((order) => getOrderStatusClass(order.status) === "is-success").length;
  const recentOrders = userOrders.slice(0, 4);
  const cart = getCart();

  return `
    <div class="user-info-card ${mode === "page" ? "account-page-card" : ""}">
      ${mode === "modal" ? `<button class="user-info-close" type="button" aria-label="ÄĂ³ng">Ă—</button>` : ""}
      <aside class="user-account-sidebar">
        <div class="user-sidebar-profile">
          <div class="user-info-avatar">NS</div>
          <strong>${currentUser.lastName || ""} ${currentUser.firstName || ""}</strong>
          <span>${currentUser.phone || "ChÆ°a cáº­p nháº­t SÄT"}</span>
        </div>
        <nav>
          <button class="active" type="button">ThĂ´ng tin tĂ i khoáº£n</button>
          <a href="${pageUrl("orders.html")}">ÄÆ¡n hĂ ng cá»§a báº¡n</a>
          <a href="${pageUrl("orders.html")}">ÄÆ¡n hĂ ng Ä‘Ă£ há»§y</a>
          <button type="button">Sá»• Ä‘á»‹a chá»‰</button>
          <button type="button">PhÆ°Æ¡ng thá»©c thanh toĂ¡n</button>
          <button type="button">Äá»•i máº­t kháº©u</button>
          <button type="button">MĂ£ giáº£m giĂ¡</button>
          <button type="button">Sáº£n pháº©m yĂªu thĂ­ch</button>
        </nav>
      </aside>

      <section class="user-account-main">
        <div class="user-info-title-row">
          <div>
            <h2>ThĂ´ng tin tĂ i khoáº£n</h2>
            <p>Quáº£n lĂ½ thĂ´ng tin tĂ i khoáº£n vĂ  báº£o máº­t</p>
          </div>
          <div class="user-title-actions">
            <button class="edit-user-btn" type="button">Chá»‰nh sá»­a thĂ´ng tin</button>
            <button class="logout-btn single-logout-btn" type="button">ÄÄƒng xuáº¥t</button>
          </div>
        </div>

        <div class="user-profile-panel">
          <div class="user-profile-photo">
            <div class="user-info-avatar">NS</div>
            <button type="button">Thay Ä‘á»•i áº£nh</button>
          </div>
          <dl>
            <div>
              <dt>Há» vĂ  tĂªn</dt>
              <dd class="user-view-value">${currentUser.lastName || ""} ${currentUser.firstName || ""}</dd>
              <div class="user-edit-fields">
                <input type="text" id="userLastNameInput" value="${currentUser.lastName || ""}" placeholder="Nháº­p há»">
                <input type="text" id="userFirstNameInput" value="${currentUser.firstName || ""}" placeholder="Nháº­p tĂªn">
              </div>
            </div>
            <div>
              <dt>Email</dt>
              <dd class="user-view-value">${currentUser.email}</dd>
              <div class="user-edit-fields">
                <input type="email" id="userEmailInput" value="${currentUser.email || ""}" placeholder="Nháº­p email">
              </div>
            </div>
            <div>
              <dt>Sá»‘ Ä‘iá»‡n thoáº¡i</dt>
              <dd class="user-view-value">${currentUser.phone || "ChÆ°a cáº­p nháº­t"}</dd>
              <div class="user-edit-fields">
                <input type="tel" id="userPhoneInput" value="${currentUser.phone || ""}" placeholder="Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i">
              </div>
            </div>
            <div>
              <dt>Äá»‹a chá»‰</dt>
              <dd class="user-view-value">${currentUser.address || "ChÆ°a cáº­p nháº­t"}</dd>
              <div class="user-edit-fields">
                <input type="text" id="userAddressInput" value="${currentUser.address || ""}" placeholder="Nháº­p Ä‘á»‹a chá»‰">
              </div>
            </div>
          </dl>
          <div class="user-profile-meta">
            <div><span>TĂ i khoáº£n Ä‘Æ°á»£c táº¡o</span><strong>${new Date(currentUser.createdAt || Date.now()).toLocaleDateString("vi-VN")}</strong></div>
            <div><span>Cáº­p nháº­t láº§n cuá»‘i</span><strong>${new Date().toLocaleDateString("vi-VN")}</strong></div>
            <div><span>Tráº¡ng thĂ¡i tĂ i khoáº£n</span><em>Hoáº¡t Ä‘á»™ng</em></div>
          </div>
        </div>

        <div class="user-action-grid user-edit-actions">
          <button class="save-user-btn" type="button">Cáº­p nháº­t</button>
          <button class="cancel-edit-btn" type="button">Há»§y</button>
        </div>

        <div class="user-account-stats">
          <article><strong>${userOrders.length}</strong><small>ÄÆ¡n hĂ ng</small><a href="${pageUrl("orders.html")}">Xem chi tiáº¿t</a></article>
          <article><strong>${Math.max(userOrders.length - deliveredOrders, 0)}</strong><small>ÄÆ¡n Ä‘ang giao</small><a href="${pageUrl("orders.html")}">Xem chi tiáº¿t</a></article>
          <article><strong>${deliveredOrders}</strong><small>Sáº£n pháº©m Ä‘Ă£ mua</small><a href="${pageUrl("orders.html")}">Xem chi tiáº¿t</a></article>
          <article><strong>${cart.length}</strong><small>Sáº£n pháº©m yĂªu thĂ­ch</small><a href="${pageUrl("products.html")}">Xem chi tiáº¿t</a></article>
          <article><strong>4</strong><small>MĂ£ giáº£m giĂ¡</small><a href="${pageUrl("sale.html")}">Xem chi tiáº¿t</a></article>
        </div>

        <div class="user-account-bottom">
          <section class="user-address-panel">
            <div class="user-section-head"><h3>Äá»‹a chá»‰ cá»§a tĂ´i</h3><button type="button">+ ThĂªm Ä‘á»‹a chá»‰</button></div>
            <article>
              <span>Äá»‹a chá»‰ máº·c Ä‘á»‹nh</span>
              <strong>${currentUser.lastName || ""} ${currentUser.firstName || ""}</strong>
              <p>${currentUser.phone || "ChÆ°a cáº­p nháº­t SÄT"}</p>
              <p>${currentUser.address || "ChÆ°a cáº­p nháº­t Ä‘á»‹a chá»‰"}</p>
            </article>
          </section>
          <section class="user-recent-orders">
            <div class="user-section-head"><h3>ÄÆ¡n hĂ ng gáº§n Ä‘Ă¢y</h3><a href="${pageUrl("orders.html")}">Xem táº¥t cáº£ Ä‘Æ¡n hĂ ng</a></div>
            ${recentOrders.length ? recentOrders.map((order) => {
              const createdAt = new Date(order.createdAt);
              const firstItem = order.items?.[0];
              return `
                <article>
                  <img src="${getAccountImageSrc(firstItem?.image)}" alt="${firstItem?.name || "Sáº£n pháº©m"}">
                  <div class="user-order-code">
                    <strong>${formatOrderCode(order, userOrders)}</strong>
                    <span>${createdAt.toLocaleDateString("vi-VN")}</span>
                  </div>
                  <b>${formatMoney(order.total || 0)}</b>
                  <em class="order-status-pill ${getOrderStatusClass(order.status)}">${formatOrderStatusText(order.status)}</em>
                </article>
              `;
            }).join("") : `<p class="user-no-orders">ChÆ°a cĂ³ Ä‘Æ¡n hĂ ng gáº§n Ä‘Ă¢y.</p>`}
          </section>
        </div>
      </section>
    </div>
  `;
}

function bindAccountActions(root, rerender) {
  root.querySelector(".edit-user-btn")?.addEventListener("click", () => {
    root.querySelector(".user-info-card")?.classList.add("editing");
  });
  root.querySelector(".cancel-edit-btn")?.addEventListener("click", () => {
    root.querySelector(".user-info-card")?.classList.remove("editing");
  });
  root.querySelector(".save-user-btn")?.addEventListener("click", () => saveUserFromForm(root, rerender));
  root.querySelector(".logout-btn")?.addEventListener("click", () => {
    clearCurrentUser();
    window.location.href = pageUrl("index.html");
  });
}

export function renderAccountPage() {
  const userAccountPageContent = document.getElementById("userAccountPageContent");
  if (!userAccountPageContent) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    userAccountPageContent.innerHTML = `
      <div class="orders-empty">
        <h2>Báº¡n chÆ°a Ä‘Äƒng nháº­p</h2>
        <p>Vui lĂ²ng Ä‘Äƒng nháº­p Ä‘á»ƒ xem vĂ  chá»‰nh sá»­a thĂ´ng tin tĂ i khoáº£n.</p>
        <a class="btn btn-primary" href="${pageUrl("login.html")}">ÄÄƒng nháº­p</a>
      </div>
    `;
    return;
  }

  userAccountPageContent.innerHTML = accountMarkup(currentUser, "page");
  bindAccountActions(userAccountPageContent, renderAccountPage);
}

export function showUserInfo() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = pageUrl("login.html");
    return;
  }

  let modal = document.getElementById("userInfoModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "userInfoModal";
    modal.className = "user-info-modal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = accountMarkup(currentUser, "modal");
  modal.classList.add("show");
  modal.querySelector(".user-info-close")?.addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("show");
  });
  bindAccountActions(modal, showUserInfo);
}

export function initAccountPage() {
  initCommonLayout();
  initCartControls();
  renderAccountPage();
}

window.showUserInfo = showUserInfo;

if (document.getElementById("userAccountPageContent")) {
  initAccountPage();
}

