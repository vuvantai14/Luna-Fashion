import {
  clearCurrentUser,
  formatMoney,
  getCurrentUser,
  getUsers,
  initCommonLayout,
  saveUsers,
  setCurrentUser,
  showCenterNotice
} from "./common.js";
import { getCart, initCartControls } from "./cart.js";
import { formatOrderCode, getOrderStatusClass } from "./orders.js";
import { getOrders, saveOrders } from "./common.js";

function getUserOrders(currentUser) {
  return getOrders().filter((order) => String(order.customerId) === String(currentUser.id) || order.email === currentUser.email);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getAccountImageSrc(image) {
  const imagePath = String(image || "").trim();
  if (!imagePath) return "../assets/product-1.jpg";
  if (/^(https?:|data:|blob:)/.test(imagePath)) return imagePath;

  const normalizedPath = imagePath.replace(/\\/g, "/");
  const assetIndex = normalizedPath.lastIndexOf("assets/");
  if (assetIndex !== -1) return `../${normalizedPath.slice(assetIndex)}`;

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
    showCenterNotice("Vui lòng nhập đầy đủ họ tên và email.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showCenterNotice("Email chưa đúng định dạng.", "error");
    return;
  }

  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  const emailExists = users.some((user) => user.email === email && user.id !== currentUser.id);
  if (emailExists) {
    showCenterNotice("Email này đã được tài khoản khác sử dụng.", "error");
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
  showCenterNotice("Cập nhật thông tin thành công.", "success", callback);
}

function accountMarkup(currentUser, mode = "page") {
  const userOrders = getUserOrders(currentUser);
  const deliveredOrders = userOrders.filter((order) => getOrderStatusClass(order.status) === "is-success").length;
  const recentOrders = userOrders.slice(0, 4);
  const cart = getCart();

  return `
    <div class="user-info-card ${mode === "page" ? "account-page-card" : ""}">
      ${mode === "modal" ? `<button class="user-info-close" type="button" aria-label="Đóng">×</button>` : ""}
      <aside class="user-account-sidebar">
        <div class="user-sidebar-profile">
          <div class="user-info-avatar">👤</div>
          <strong>${currentUser.lastName || ""} ${currentUser.firstName || ""}</strong>
          <span>${currentUser.phone || "Chưa cập nhật SĐT"}</span>
        </div>
        <nav>
          <button class="active" type="button">Thông tin tài khoản</button>
          <a href="orders.html">Đơn hàng của bạn</a>
          <a href="orders.html">Đơn hàng đã hủy</a>
          <button type="button">Sổ địa chỉ</button>
          <button type="button">Phương thức thanh toán</button>
          <button type="button">Đổi mật khẩu</button>
          <button type="button">Mã giảm giá</button>
          <button type="button">Sản phẩm yêu thích</button>
        </nav>
        <button class="logout-btn single-logout-btn" type="button">Đăng xuất</button>
      </aside>

      <section class="user-account-main">
        <div class="user-info-title-row">
          <div>
            <h2>Thông tin tài khoản</h2>
            <p>Quản lý thông tin tài khoản và bảo mật</p>
          </div>
          <button class="edit-user-btn" type="button">Chỉnh sửa thông tin</button>
        </div>

        <div class="user-profile-panel">
          <div class="user-profile-photo">
            <div class="user-info-avatar">👤</div>
            <button type="button">Thay đổi ảnh</button>
          </div>
          <dl>
            <div>
              <dt>Họ và tên</dt>
              <dd class="user-view-value">${currentUser.lastName || ""} ${currentUser.firstName || ""}</dd>
              <div class="user-edit-fields">
                <input type="text" id="userLastNameInput" value="${currentUser.lastName || ""}" placeholder="Nhập họ">
                <input type="text" id="userFirstNameInput" value="${currentUser.firstName || ""}" placeholder="Nhập tên">
              </div>
            </div>
            <div>
              <dt>Email</dt>
              <dd class="user-view-value">${currentUser.email}</dd>
              <div class="user-edit-fields">
                <input type="email" id="userEmailInput" value="${currentUser.email || ""}" placeholder="Nhập email">
              </div>
            </div>
            <div>
              <dt>Số điện thoại</dt>
              <dd class="user-view-value">${currentUser.phone || "Chưa cập nhật"}</dd>
              <div class="user-edit-fields">
                <input type="tel" id="userPhoneInput" value="${currentUser.phone || ""}" placeholder="Nhập số điện thoại">
              </div>
            </div>
            <div>
              <dt>Địa chỉ</dt>
              <dd class="user-view-value">${currentUser.address || "Chưa cập nhật"}</dd>
              <div class="user-edit-fields">
                <input type="text" id="userAddressInput" value="${currentUser.address || ""}" placeholder="Nhập địa chỉ">
              </div>
            </div>
          </dl>
          <div class="user-profile-meta">
            <div><span>Tài khoản được tạo</span><strong>${new Date(currentUser.createdAt || Date.now()).toLocaleDateString("vi-VN")}</strong></div>
            <div><span>Cập nhật lần cuối</span><strong>${new Date().toLocaleDateString("vi-VN")}</strong></div>
            <div><span>Trạng thái tài khoản</span><em>Hoạt động</em></div>
          </div>
        </div>

        <div class="user-action-grid user-edit-actions">
          <button class="save-user-btn" type="button">Cập nhật</button>
          <button class="cancel-edit-btn" type="button">Hủy</button>
        </div>

        <div class="user-account-stats">
          <article><span>🛍</span><strong>${userOrders.length}</strong><small>Đơn hàng</small><a href="orders.html">Xem chi tiết</a></article>
          <article><span>🚚</span><strong>${Math.max(userOrders.length - deliveredOrders, 0)}</strong><small>Đơn đang giao</small><a href="orders.html">Xem chi tiết</a></article>
          <article><span>☑</span><strong>${deliveredOrders}</strong><small>Sản phẩm đã mua</small><a href="orders.html">Xem chi tiết</a></article>
          <article><span>♡</span><strong>${cart.length}</strong><small>Sản phẩm yêu thích</small><a href="products.html">Xem chi tiết</a></article>
          <article><span>%</span><strong>4</strong><small>Mã giảm giá</small><a href="sale.html">Xem chi tiết</a></article>
        </div>

        <div class="user-account-bottom">
          <section class="user-address-panel">
            <div class="user-section-head"><h3>Địa chỉ của tôi</h3><button type="button">+ Thêm địa chỉ</button></div>
            <article>
              <span>Địa chỉ mặc định</span>
              <strong>${currentUser.lastName || ""} ${currentUser.firstName || ""}</strong>
              <p>${currentUser.phone || "Chưa cập nhật SĐT"}</p>
              <p>${currentUser.address || "Chưa cập nhật địa chỉ"}</p>
            </article>
          </section>
          <section class="user-recent-orders">
            <div class="user-section-head"><h3>Đơn hàng gần đây</h3><a href="orders.html">Xem tất cả đơn hàng</a></div>
            ${recentOrders.length ? recentOrders.map((order) => {
              const createdAt = new Date(order.createdAt);
              const firstItem = order.items?.[0];
              return `
                <article>
                  <img src="${getAccountImageSrc(firstItem?.image)}" alt="${firstItem?.name || "Sản phẩm"}">
                  <div class="user-order-code">
                    <strong>${formatOrderCode(order, userOrders)}</strong>
                    <span>${createdAt.toLocaleDateString("vi-VN")}</span>
                  </div>
                  <b>${formatMoney(order.total || 0)}</b>
                  <em class="order-status-pill ${getOrderStatusClass(order.status)}">${order.status || "Đang xử lí"}</em>
                </article>
              `;
            }).join("") : `<p class="user-no-orders">Chưa có đơn hàng gần đây.</p>`}
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
    window.location.href = "index.html";
  });
}

export function renderAccountPage() {
  const userAccountPageContent = document.getElementById("userAccountPageContent");
  if (!userAccountPageContent) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    userAccountPageContent.innerHTML = `
      <div class="orders-empty">
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem và chỉnh sửa thông tin tài khoản.</p>
        <a class="btn btn-primary" href="login.html">Đăng nhập</a>
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
    window.location.href = "login.html";
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
