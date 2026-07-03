import { apiRequest, getToken, resolveAssetUrl } from "./api.js";
import { formatMoney, initCommonLayout, pageUrl, showToast } from "./common.js";
import { initCartControls } from "./cart.js";

let selectedUserOrderId = null;
let currentOrders = [];

const orderStatusLabels = {
  PENDING: "Cho xac nhan",
  CONFIRMED: "Da xac nhan",
  SHIPPING: "Dang giao",
  COMPLETED: "Hoan thanh",
  CANCELLED: "Da huy"
};

export function normalizeOrderStatus(status) {
  const upperStatus = String(status || "PENDING").toUpperCase();
  return orderStatusLabels[upperStatus] ? upperStatus : "PENDING";
}

export function getOrderStatusClass(status) {
  const normalizedStatus = normalizeOrderStatus(status);
  if (normalizedStatus === "CANCELLED") return "is-cancelled";
  if (normalizedStatus === "COMPLETED") return "is-success";
  return "is-pending";
}

export function formatOrderStatusText(status) {
  return orderStatusLabels[normalizeOrderStatus(status)];
}

export function formatOrderCode(order, orders = []) {
  return order?.orderCode || `#DH${String((orders.findIndex((item) => String(item.id) === String(order?.id)) + 1) || 1).padStart(4, "0")}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
}

function normalizeOrder(order) {
  const items = order?.items || [];
  return {
    ...order,
    items,
    totalQuantity: Number(order?.totalQuantity ?? items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)),
    totalAmount: Number(order?.totalAmount ?? order?.total ?? 0),
    receiverName: order?.receiverName || order?.customerName || "",
    receiverPhone: order?.receiverPhone || order?.phone || "",
    receiverAddress: order?.receiverAddress || order?.address || ""
  };
}

async function loadOrders() {
  const page = await apiRequest("/orders?page=0&size=50");
  const content = Array.isArray(page) ? page : page?.content || [];
  currentOrders = content.map(normalizeOrder);
  return currentOrders;
}

async function loadOrderDetail(orderId) {
  const order = normalizeOrder(await apiRequest(`/orders/${orderId}`));
  currentOrders = currentOrders.map((item) => String(item.id) === String(order.id) ? order : item);
  return order;
}

function renderLoginRequired(container) {
  container.innerHTML = `
    <div class="orders-empty">
      <h2>Ban chua dang nhap</h2>
      <p>Vui long dang nhap de xem lich su don hang.</p>
      <a class="btn btn-primary" href="${pageUrl("login.html")}">Dang nhap</a>
    </div>
  `;
}

function renderEmpty(container) {
  container.innerHTML = `
    <div class="orders-empty">
      <h2>Chua co don hang</h2>
      <p>Cac don hang dat thanh cong se hien thi tai day.</p>
      <a class="btn btn-primary" href="${pageUrl("products.html")}">Mua sam ngay</a>
    </div>
  `;
}

function renderOrderItems(order) {
  return (order.items || []).map((item) => `
    <article>
      <img src="${resolveAssetUrl(item.thumbnailUrl)}" alt="${item.productName}">
      <div>
        <strong>${item.productName}</strong>
        <span>${item.color || "Black"} - ${item.size || "M"}</span>
        <small>SKU: ${item.sku || "NI"}</small>
      </div>
      <small>x${item.quantity}</small>
      <b>${formatMoney(item.subtotal || item.price * item.quantity)}</b>
    </article>
  `).join("");
}

async function renderOrderDetail(container, order) {
  const status = normalizeOrderStatus(order.status);
  container.innerHTML = `
    <div class="user-order-detail-head">
      <div>
        <h2>Chi tiet don hang</h2>
        <strong>${formatOrderCode(order, currentOrders)}</strong>
      </div>
      <em class="order-status-pill ${getOrderStatusClass(order.status)}">${formatOrderStatusText(order.status)}</em>
    </div>
    <div class="user-order-detail-meta">
      <p>Ngay dat: ${formatDate(order.createdAt)}</p>
      <p>Phuong thuc thanh toan: ${order.paymentMethod || "COD"}</p>
      <p>Tong so luong: ${order.totalQuantity || 0}</p>
    </div>
    <section class="user-order-address">
      <h3>Thong tin nguoi nhan</h3>
      <strong>${order.receiverName || "Nguoi nhan"}</strong>
      <p>${order.receiverPhone || "Chua co so dien thoai"}</p>
      <p>${order.receiverAddress || "Chua co dia chi"}</p>
      ${order.note ? `<p>Ghi chu: ${order.note}</p>` : ""}
    </section>
    <section class="user-order-products">
      <div class="user-section-head"><h3>San pham (${order.items?.length || 0})</h3><a href="${pageUrl("products.html")}">Mua them</a></div>
      ${renderOrderItems(order)}
    </section>
    <div class="user-order-summary">
      <div class="total"><span>Tong cong</span><strong>${formatMoney(order.totalAmount)}</strong></div>
    </div>
    ${status === "PENDING" ? `<button class="user-buy-again" type="button" data-cancel-order="${order.id}">Huy don hang</button>` : `<a class="user-buy-again" href="${pageUrl("products.html")}">Mua lai</a>`}
  `;

  container.querySelector("[data-cancel-order]")?.addEventListener("click", async () => {
    await cancelOrder(order.id);
  });
}

async function cancelOrder(orderId) {
  try {
    const cancelled = normalizeOrder(await apiRequest(`/orders/${orderId}/cancel`, { method: "PATCH" }));
    currentOrders = currentOrders.map((order) => String(order.id) === String(orderId) ? cancelled : order);
    selectedUserOrderId = cancelled.id;
    showToast("Da huy don hang.");
    renderUserOrdersFromData();
  } catch (error) {
    if (error.status === 401) {
      showToast("Vui long dang nhap lai.");
      setTimeout(() => window.location.href = pageUrl("login.html"), 900);
    } else {
      showToast(error.message || "Khong huy duoc don hang.");
    }
  }
}

function renderUserOrdersFromData() {
  const userOrdersContent = document.getElementById("userOrdersContent");
  if (!userOrdersContent) return;

  if (!currentOrders.length) {
    renderEmpty(userOrdersContent);
    return;
  }

  if (!selectedUserOrderId || !currentOrders.some((order) => String(order.id) === String(selectedUserOrderId))) {
    selectedUserOrderId = currentOrders[0].id;
  }
  const selectedOrder = currentOrders.find((order) => String(order.id) === String(selectedUserOrderId)) || currentOrders[0];

  userOrdersContent.innerHTML = `
    <div class="user-orders-layout">
      <section class="user-orders-list">
        <div class="user-order-tabs">
          <button class="active" type="button">Tat ca</button>
          <button type="button">Cho xac nhan</button>
          <button type="button">Da xac nhan</button>
          <button type="button">Dang giao</button>
          <button type="button">Hoan thanh</button>
          <button type="button">Da huy</button>
        </div>
        <div class="user-order-table">
          <div class="user-order-head">
            <span>Ma don</span>
            <span>Ngay dat</span>
            <span>Tong tien</span>
            <span>Trang thai</span>
            <span>Thao tac</span>
          </div>
          ${currentOrders.map((order) => `
            <article class="user-order-row ${String(order.id) === String(selectedOrder.id) ? "active" : ""}">
              <strong>${formatOrderCode(order, currentOrders)}</strong>
              <span>${formatDate(order.createdAt)}</span>
              <b>${formatMoney(order.totalAmount)}</b>
              <em class="order-status-pill ${getOrderStatusClass(order.status)}">${formatOrderStatusText(order.status)}</em>
              <button type="button" data-user-order-id="${order.id}">Xem chi tiet</button>
            </article>
          `).join("")}
        </div>
        <div class="user-order-pagination">
          <span>Hien thi ${currentOrders.length} don hang</span>
          <div><button class="active" type="button">1</button></div>
        </div>
      </section>
      <aside class="user-order-detail" id="userOrderDetail"></aside>
    </div>
  `;

  userOrdersContent.querySelectorAll("[data-user-order-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      selectedUserOrderId = button.dataset.userOrderId;
      const detail = await loadOrderDetail(selectedUserOrderId);
      renderUserOrdersFromData();
      const detailContainer = document.getElementById("userOrderDetail");
      if (detailContainer) renderOrderDetail(detailContainer, detail);
    });
  });

  const detailContainer = document.getElementById("userOrderDetail");
  if (detailContainer) renderOrderDetail(detailContainer, selectedOrder);
}

export async function renderUserOrders() {
  const userOrdersContent = document.getElementById("userOrdersContent");
  if (!userOrdersContent) return;
  if (!getToken()) {
    renderLoginRequired(userOrdersContent);
    return;
  }

  userOrdersContent.innerHTML = `<div class="orders-empty"><p>Dang tai don hang...</p></div>`;
  try {
    await loadOrders();
    renderUserOrdersFromData();
  } catch (error) {
    if (error.status === 401) {
      renderLoginRequired(userOrdersContent);
    } else {
      userOrdersContent.innerHTML = `
        <div class="orders-empty">
          <h2>Khong tai duoc don hang</h2>
          <p>${error.message || "Hay thu lai sau."}</p>
          <button class="btn btn-primary" type="button" id="retryOrders">Thu lai</button>
        </div>
      `;
      document.getElementById("retryOrders")?.addEventListener("click", renderUserOrders);
    }
  }
}

export function initOrdersPage() {
  initCommonLayout();
  initCartControls();
  renderUserOrders();
}

if (document.getElementById("userOrdersContent")) {
  initOrdersPage();
}
