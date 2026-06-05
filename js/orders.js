import { formatMoney, getCurrentUser, getOrders, initCommonLayout } from "./common.js";
import { initCartControls } from "./cart.js";

let selectedUserOrderId = null;

export function formatOrderCode(order, orders = []) {
  const index = orders.findIndex((item) => String(item.id) === String(order.id));
  const number = index === -1 ? 1 : index + 1;
  return `#DH${String(number).padStart(4, "0")}`;
}

export function getOrderStatusClass(status) {
  const normalizedStatus = String(status || "").toLowerCase();
  if (normalizedStatus.includes("hủy")) return "is-cancelled";
  if (normalizedStatus.includes("đã xử") || normalizedStatus.includes("đã giao") || normalizedStatus.includes("hoàn thành")) return "is-success";
  if (normalizedStatus.includes("đang") || normalizedStatus.includes("chờ")) return "is-pending";
  return "is-pending";
}

export function renderUserOrders() {
  const userOrdersContent = document.getElementById("userOrdersContent");
  if (!userOrdersContent) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    userOrdersContent.innerHTML = `
      <div class="orders-empty">
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
        <a class="btn btn-primary" href="login.html">Đăng nhập</a>
      </div>
    `;
    return;
  }

  const orders = getOrders().filter((order) => order.customerId === currentUser.id || order.email === currentUser.email);
  if (orders.length === 0) {
    userOrdersContent.innerHTML = `
      <div class="orders-empty">
        <h2>Chưa có đơn hàng</h2>
        <p>Các đơn hàng bạn đã đặt sẽ được hiển thị tại đây.</p>
        <a class="btn btn-primary" href="products.html">Mua sắm ngay</a>
      </div>
    `;
    return;
  }

  if (!selectedUserOrderId || !orders.some((order) => String(order.id) === String(selectedUserOrderId))) {
    selectedUserOrderId = orders[0].id;
  }

  const selectedOrder = orders.find((order) => String(order.id) === String(selectedUserOrderId)) || orders[0];
  const selectedDate = new Date(selectedOrder.createdAt);
  const selectedItems = selectedOrder.items || [];
  const selectedSubtotal = selectedOrder.subtotal || selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedShipping = selectedOrder.shipping || 0;
  const selectedTotal = selectedOrder.total || selectedSubtotal + selectedShipping;
  const discount = Math.max(selectedSubtotal + selectedShipping - selectedTotal, 0);

  userOrdersContent.innerHTML = `
    <div class="user-orders-layout">
      <section class="user-orders-list">
        <div class="user-order-tabs">
          <button class="active" type="button">Tất cả</button>
          <button type="button">Chờ xác nhận</button>
          <button type="button">Đang xử lý</button>
          <button type="button">Đang giao</button>
          <button type="button">Đã giao</button>
          <button type="button">Đã hủy</button>
        </div>
        <div class="user-order-table">
          <div class="user-order-head">
            <span>Mã đơn hàng</span>
            <span>Ngày đặt</span>
            <span>Tổng tiền</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          ${orders.map((order) => {
            const createdAt = new Date(order.createdAt);
            return `
              <article class="user-order-row ${String(order.id) === String(selectedOrder.id) ? "active" : ""}">
                <strong>${formatOrderCode(order, orders)}</strong>
                <span>${createdAt.toLocaleDateString("vi-VN")} ${createdAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                <b>${formatMoney(order.total || 0)}</b>
                <em class="order-status-pill ${getOrderStatusClass(order.status)}">${order.status || "Đang xử lí"}</em>
                <button type="button" data-user-order-id="${order.id}">Xem chi tiết</button>
              </article>
            `;
          }).join("")}
        </div>
        <div class="user-order-pagination">
          <span>Hiển thị 1 đến ${orders.length} của ${orders.length} đơn hàng</span>
          <div><button type="button">‹</button><button class="active" type="button">1</button><button type="button">›</button></div>
        </div>
      </section>

      <aside class="user-order-detail">
        <div class="user-order-detail-head">
          <div>
            <h2>Chi tiết đơn hàng</h2>
            <strong>${formatOrderCode(selectedOrder, orders)}</strong>
          </div>
          <em class="order-status-pill ${getOrderStatusClass(selectedOrder.status)}">${selectedOrder.status || "Đang xử lí"}</em>
        </div>
        <div class="user-order-detail-meta">
          <p>Ngày đặt: ${selectedDate.toLocaleDateString("vi-VN")} ${selectedDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
          <p>Phương thức thanh toán: Thanh toán khi giao hàng</p>
          <p>Phương thức vận chuyển: Giao hàng nhanh</p>
        </div>
        <section class="user-order-address">
          <h3>Địa chỉ giao hàng</h3>
          <strong>${selectedOrder.customerName || `${currentUser.lastName || ""} ${currentUser.firstName || ""}`}</strong>
          <p>${selectedOrder.phone || currentUser.phone || "Chưa cập nhật SĐT"}</p>
          <p>${selectedOrder.address || currentUser.address || "Chưa cập nhật địa chỉ"}</p>
        </section>
        <section class="user-order-products">
          <div class="user-section-head"><h3>Sản phẩm (${selectedItems.length})</h3><a href="products.html">Xem tất cả</a></div>
          ${selectedItems.map((item) => `
            <article>
              <img src="${item.image}" alt="${item.name}">
              <div><strong>${item.name}</strong><span>${item.color || "Pastel Pink"} - ${item.size || "M"}</span></div>
              <small>x${item.quantity}</small>
              <b>${formatMoney(item.price)}</b>
            </article>
          `).join("")}
        </section>
        <div class="user-order-summary">
          <div><span>Tạm tính</span><strong>${formatMoney(selectedSubtotal)}</strong></div>
          <div><span>Phí vận chuyển</span><strong>${selectedShipping ? formatMoney(selectedShipping) : "Miễn phí"}</strong></div>
          <div><span>Giảm giá</span><strong>-${formatMoney(discount)}</strong></div>
          <div class="total"><span>Tổng cộng</span><strong>${formatMoney(selectedTotal)}</strong></div>
        </div>
        <a class="user-buy-again" href="products.html">Mua lại</a>
      </aside>
    </div>
  `;

  userOrdersContent.querySelectorAll("[data-user-order-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedUserOrderId = button.dataset.userOrderId;
      renderUserOrders();
    });
  });
}

export function initOrdersPage() {
  initCommonLayout();
  initCartControls();
  renderUserOrders();
}

if (document.getElementById("userOrdersContent")) {
  initOrdersPage();
}
