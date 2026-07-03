import {
  clearCurrentUser,
  formatMoney,
  getCurrentUser,
  getOrders,
  getUsers,
  pageUrl,
  saveOrders,
  showToast
} from "./common.js";
import { seedAdminAccount } from "./auth.js";
import {
  defaultProducts,
  genderLabels,
  getProductAdminState,
  productCategories,
  products,
  refreshProductsFromAdminState,
  saveProductAdminState
} from "./products.js";
import { formatOrderCode, formatOrderStatusText, getOrderStatusClass, normalizeOrderStatus } from "./orders.js";
import { resolveAssetUrl } from "./api.js";

let adminProductFilters = { gender: "all", category: "all", price: "all", tag: "all", keyword: "" };
let adminCustomerKeyword = "";
let adminOrderFilters = { status: "all", dateFrom: "", dateTo: "", keyword: "" };
let selectedAdminOrderId = null;

const sampleCustomers = [
  { id: 1, name: "Nguyễn Mến", email: "nguyenmen@gmail.com", phone: "0903665225", address: "Tân Phú, TP.HCM", createdAt: "02/06/2026", status: "Hoạt động" },
  { id: 2, name: "Trần Phương Anh", email: "anhtran@gmail.com", phone: "0912345678", address: "Quận 3, TP.HCM", createdAt: "01/06/2026", status: "Hoạt động" },
  { id: 3, name: "Lê Minh Quân", email: "lequan@gmail.com", phone: "0933123456", address: "Bình Thạnh, TP.HCM", createdAt: "31/05/2026", status: "Hoạt động" },
  { id: 4, name: "Hoàng Gia Bảo", email: "baohg@gmail.com", phone: "0909090909", address: "Gò Vấp, TP.HCM", createdAt: "30/05/2026", status: "Tạm khóa" }
];

let sampleOrders = [
  createSampleOrder("sample-order-001", "Nguyễn Mến", "0903665225", "Tân Phú, TP.HCM", "COMPLETED", 1, 17, 43),
  createSampleOrder("sample-order-002", "Trần Phương Anh", "0912345678", "Quận 3, TP.HCM", "PENDING", 4, 26),
  createSampleOrder("sample-order-003", "Lê Minh Quân", "0933123456", "Bình Thạnh, TP.HCM", "SHIPPING", 29, 48),
  createSampleOrder("sample-order-004", "Hoàng Gia Bảo", "0909090909", "Gò Vấp, TP.HCM", "CANCELLED", 31),
  createSampleOrder("sample-order-005", "Phạm Thảo Vy", "0911222333", "Thủ Đức, TP.HCM", "CONFIRMED", 6, 12, 42)
];

function createSampleOrder(id, customerName, phone, address, status, ...productIds) {
  const items = productIds.map((productId) => {
    const product = defaultProducts.find((item) => item.id === productId) || defaultProducts[0];
    return {
      id: product.id,
      productId: product.id,
      name: product.name,
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      thumbnailUrl: product.thumbnailUrl,
      color: "Black",
      size: product.categoryName === "Phụ kiện" ? "FREE_SIZE" : "M"
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const dayOffset = Number(id.slice(-1)) || 1;
  return {
    id,
    customerId: id,
    customerName,
    email: `${id}@nisport.local`,
    phone,
    address,
    receiverName: customerName,
    receiverPhone: phone,
    createdAt: new Date(2026, 5, 10 - dayOffset, 10 + dayOffset, 20).toISOString(),
    status,
    subtotal,
    shipping,
    total: subtotal + shipping,
    totalAmount: subtotal + shipping,
    items
  };
}

function requireAdminAccess() {
  const adminApp = document.getElementById("adminApp");
  const currentUser = getCurrentUser();
  if (!adminApp) return false;
  if (!currentUser || currentUser.role !== "admin") {
    adminApp.innerHTML = `
      <section class="admin-denied">
        <h1>Không có quyền truy cập</h1>
        <p>Chỉ tài khoản admin mới có thể vào trang quản trị Ni Sport.</p>
        <p><strong>Email:</strong> admin@nisport.com<br><strong>Mật khẩu:</strong> 123456</p>
        <a class="btn btn-primary" href="${pageUrl("login.html")}">Đăng nhập admin</a>
      </section>
    `;
    return false;
  }
  return true;
}

function renderAdminSidebar() {
  const sidebar = document.querySelector(".admin-sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = `
    <a href="#adminDashboard" class="logo admin-sidebar-logo"><span class="logo-main">Ni<span>Sport</span></span><small>Admin</small></a>
    <nav>
      <span class="admin-nav-label">Tổng quan</span>
      <a href="#adminDashboard">Dashboard</a>
      <span class="admin-nav-label">Quản lý</span>
      <a href="#adminProducts">Quản lý sản phẩm</a>
      <a href="#adminOrders">Quản lý đơn hàng</a>
      <a href="#adminCustomers">Quản lý khách hàng</a>
      <span class="admin-nav-label">Cài đặt</span>
      <a href="#adminLogout" id="adminLogoutLink">Đăng xuất</a>
    </nav>
  `;
}

function showAdminSection(sectionId = "adminDashboard") {
  const targetId = sectionId.replace("#", "");
  const targetPanel = document.getElementById(targetId) || document.getElementById("adminDashboard");
  const titles = {
    adminDashboard: ["Dashboard", "Tổng quan hoạt động cửa hàng"],
    adminProducts: ["Quản lý sản phẩm", "Áo bóng đá, quần bóng đá, đồ tập và phụ kiện"],
    adminOrders: ["Quản lý đơn hàng", "Theo dõi và cập nhật trạng thái đơn hàng"],
    adminCustomers: ["Quản lý khách hàng", "Thông tin tài khoản khách hàng"]
  };
  const [title, subtitle] = titles[targetPanel.id] || titles.adminDashboard;
  document.querySelector(".admin-topbar h1").textContent = title;
  document.querySelector(".admin-topbar p").textContent = subtitle;
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.toggle("active", panel === targetPanel));
  document.querySelectorAll(".admin-sidebar nav a[href^='#admin']").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${targetPanel.id}`);
  });
}

function getCustomerOrders() {
  return [...getOrders(), ...sampleOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getOrderTotal(order) {
  return order.totalAmount || order.total || 0;
}

function renderAdminDashboard() {
  const shell = document.querySelector(".admin-dashboard-shell");
  if (!shell) return;
  const users = getUsers().filter((user) => user.role !== "admin");
  const orders = getCustomerOrders();
  const completedOrders = orders.filter((order) => normalizeOrderStatus(order.status) === "COMPLETED");
  const revenue = completedOrders.reduce((sum, order) => sum + getOrderTotal(order), 0);
  const pending = orders.filter((order) => normalizeOrderStatus(order.status) === "PENDING").length;
  const cancelled = orders.filter((order) => normalizeOrderStatus(order.status) === "CANCELLED").length;
  const topProducts = getTopProducts(completedOrders).slice(0, 5);

  shell.innerHTML = `
    <div class="admin-dashboard-header">
      <div><span class="admin-dashboard-kicker">Ni Sport Admin</span><h2>Dashboard cửa hàng</h2></div>
      <div class="admin-dashboard-date">${new Date().toLocaleDateString("vi-VN")}</div>
    </div>
    <div class="admin-stats">
      <article class="admin-stat-card stat-green"><span>Doanh thu hoàn thành</span><strong>${formatMoney(revenue)}</strong><small>Chỉ tính đơn COMPLETED</small></article>
      <article class="admin-stat-card stat-sky"><span>Đơn hàng</span><strong>${orders.length}</strong><small>${pending} đơn chờ xử lý</small></article>
      <article class="admin-stat-card stat-orange"><span>Khách hàng</span><strong>${users.length + sampleCustomers.length}</strong><small>Dữ liệu local demo</small></article>
      <article class="admin-stat-card stat-indigo"><span>Sản phẩm</span><strong>${products.length}</strong><small>50 sản phẩm bóng đá mẫu</small></article>
    </div>
    <div class="admin-dashboard-grid admin-dashboard-grid-clean">
      <section class="admin-chart-card admin-chart-card-main">
        <div class="admin-card-head"><div><h3>Đơn hàng mới nhất</h3><p>Theo dõi nhanh các đơn vừa đặt</p></div><a href="#adminOrders" onclick="showAdminSection('adminOrders')">Xem tất cả</a></div>
        <div class="admin-dashboard-orders">
          <div><span>Mã đơn</span><span>Khách hàng</span><span>Ngày đặt</span><span>Tổng tiền</span><span>Trạng thái</span></div>
          ${orders.slice(0, 6).map((order) => renderDashboardOrderRow(order, orders)).join("")}
        </div>
      </section>
      <section class="admin-category-card">
        <h3>Top sản phẩm bán chạy</h3>
        <ul class="admin-pie-legend">
          ${topProducts.map((product) => `<li><i></i>${product.name}<strong>${product.sold}</strong></li>`).join("") || "<li>Chưa có dữ liệu</li>"}
        </ul>
        <p class="admin-card-head">Đơn đã hủy: ${cancelled}</p>
      </section>
    </div>
  `;
}

function renderDashboardOrderRow(order, orders) {
  const createdAt = new Date(order.createdAt);
  return `<div><strong>${formatOrderCode(order, orders)}</strong><span>${order.customerName || "Khách hàng"}</span><span>${createdAt.toLocaleDateString("vi-VN")}</span><b>${formatMoney(getOrderTotal(order))}</b><em class="order-status-pill ${getOrderStatusClass(order.status)}">${formatOrderStatusText(order.status)}</em></div>`;
}

function getTopProducts(orders) {
  const map = new Map();
  orders.flatMap((order) => order.items || []).forEach((item) => {
    const id = item.productId || item.id;
    const current = map.get(id) || { id, name: item.name || item.productName, sold: 0, revenue: 0 };
    current.sold += item.quantity || 1;
    current.revenue += (item.price || 0) * (item.quantity || 1);
    map.set(id, current);
  });
  return [...map.values()].sort((a, b) => b.sold - a.sold);
}

function filterProducts() {
  const keyword = adminProductFilters.keyword.trim().toLowerCase();
  return products.filter((product) => {
    const matchGender = adminProductFilters.gender === "all" || product.gender === adminProductFilters.gender;
    const matchCategory = adminProductFilters.category === "all" || String(product.categoryId) === String(adminProductFilters.category);
    const matchTag = adminProductFilters.tag === "all" || product.tag === adminProductFilters.tag;
    const matchKeyword = !keyword || product.name.toLowerCase().includes(keyword) || product.categoryName.toLowerCase().includes(keyword);
    const matchPrice =
      adminProductFilters.price === "all" ||
      (adminProductFilters.price === "under250" && product.price < 250000) ||
      (adminProductFilters.price === "250to400" && product.price >= 250000 && product.price <= 400000) ||
      (adminProductFilters.price === "over400" && product.price > 400000);
    return matchGender && matchCategory && matchTag && matchKeyword && matchPrice;
  });
}

function renderAdminProducts() {
  const table = document.getElementById("adminProductTable");
  const head = document.querySelector("#adminProducts .admin-table thead tr");
  if (!table || !head) return;

  head.innerHTML = `
    <th>ID</th><th>Sản phẩm</th><th>Giới tính</th><th>Danh mục</th><th>Giá bán</th><th>Tồn kho</th><th>Trạng thái</th><th>Thao tác</th>
  `;

  const list = filterProducts();
  table.innerHTML = list.map((product) => `
    <tr>
      <td>#${product.id}</td>
      <td><div class="admin-product-cell"><img src="${resolveAssetUrl(product.image)}" alt="${product.name}" onerror="this.src='${resolveAssetUrl(`assets/product-${Math.min(product.id, 28)}.jpg`)}'"><div><strong>${product.name}</strong><small>${product.slug}</small></div></div></td>
      <td>${genderLabels[product.gender] || product.gender}</td>
      <td>${product.categoryName}</td>
      <td><strong class="admin-product-price">${formatMoney(product.price)}</strong>${product.oldPrice ? `<span class="admin-product-old-price">${formatMoney(product.oldPrice)}</span>` : ""}</td>
      <td>${product.totalStock || 0}</td>
      <td><span class="admin-product-status ${product.status === "SELLING" ? "selling" : "out"}">${product.status === "SELLING" ? "Đang bán" : "Tạm dừng"}</span></td>
      <td class="admin-product-actions"><button type="button" onclick="editAdminProduct(${product.id})">Sửa</button><button type="button" onclick="hideAdminProduct(${product.id})">Xóa</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
}

function applyAdminProductFilters() {
  adminProductFilters = {
    gender: document.getElementById("adminFilterGender")?.value || "all",
    category: document.getElementById("adminFilterCategory")?.value || "all",
    price: document.getElementById("adminFilterPrice")?.value || "all",
    tag: document.getElementById("adminFilterTag")?.value || "all",
    keyword: document.getElementById("adminProductSearch")?.value || ""
  };
  renderAdminProducts();
}

function resetAdminProductFilters() {
  ["adminFilterGender", "adminFilterCategory", "adminFilterPrice", "adminFilterTag"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "all";
  });
  const search = document.getElementById("adminProductSearch");
  if (search) search.value = "";
  adminProductFilters = { gender: "all", category: "all", price: "all", tag: "all", keyword: "" };
  renderAdminProducts();
}

function getProductCategoryName(categoryId) {
  return productCategories.find((category) => Number(category.id) === Number(categoryId))?.name || "Áo bóng đá";
}

function openAdminProductForm(productId = null) {
  const modal = document.getElementById("adminProductModal");
  const form = document.getElementById("adminProductForm");
  if (!modal || !form) return;
  form.reset();
  form.productId.value = "";
  if (productId) editAdminProduct(productId);
  else modal.hidden = false;
}

function closeAdminProductForm() {
  const modal = document.getElementById("adminProductModal");
  const form = document.getElementById("adminProductForm");
  if (form) form.reset();
  if (modal) modal.hidden = true;
}

function editAdminProduct(productId) {
  const product = products.find((item) => item.id === productId);
  const modal = document.getElementById("adminProductModal");
  const form = document.getElementById("adminProductForm");
  if (!product || !modal || !form) return;
  modal.hidden = false;
  form.productId.value = product.id;
  form.productName.value = product.name;
  form.productGender.value = product.gender || "UNISEX";
  form.productCategoryId.value = product.categoryId || 1;
  form.productPrice.value = product.price;
  form.productOldPrice.value = product.oldPrice || "";
  form.productImage.value = product.image || `/assets/products/product-${product.id}.jpg`;
  form.productTag.value = product.tag || "NEW";
  form.productDescription.value = product.description || "";
}

function upsertAdminProduct(product) {
  const state = getProductAdminState();
  const index = state.customProducts.findIndex((item) => item.id === product.id);
  if (index === -1) state.customProducts.push(product);
  else state.customProducts[index] = product;
  state.hiddenProductIds = state.hiddenProductIds.filter((id) => id !== product.id);
  saveProductAdminState(state);
  refreshProductsFromAdminState();
}

function hideAdminProduct(productId) {
  const state = getProductAdminState();
  if (!state.hiddenProductIds.includes(productId)) state.hiddenProductIds.push(productId);
  saveProductAdminState(state);
  refreshProductsFromAdminState();
  renderAdminProducts();
  renderAdminDashboard();
}

function renderAdminCustomers() {
  const table = document.getElementById("adminCustomerTable");
  if (!table) return;
  const users = [...sampleCustomers, ...getUsers().filter((user) => user.role !== "admin").map((user) => ({
    id: user.id,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.fullName || user.email,
    email: user.email,
    phone: user.phone || "Chưa cập nhật",
    address: user.address || "Chưa cập nhật",
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "",
    status: "Hoạt động"
  }))];
  const keyword = adminCustomerKeyword.trim().toLowerCase();
  const filtered = users.filter((user) => !keyword || user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword) || user.phone.includes(keyword));
  table.innerHTML = filtered.map((user) => `
    <tr>
      <td>${user.id}</td><td><strong>${user.name}</strong></td><td>${user.email}</td><td>${user.phone}</td><td>${user.address}</td><td>${user.createdAt}</td>
      <td><span class="admin-customer-status">${user.status}</span></td>
      <td><button type="button" class="admin-customer-action" onclick="showToast('Tài khoản: ${user.name}')">Xem</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8">Chưa có khách hàng.</td></tr>`;
}

function renderAdminOrderLayout() {
  const panel = document.getElementById("adminOrders");
  if (!panel || panel.dataset.rendered) return;
  panel.dataset.rendered = "true";
  panel.innerHTML = `
    <div class="admin-order-summary-grid">
      <article class="hot"><span>Tổng đơn hàng</span><strong id="adminOrderTotalCount">0</strong><small>Đơn local demo</small></article>
      <article class="orange"><span>Chờ xác nhận</span><strong id="adminOrderPendingCount">0</strong><small>Cần xử lý</small></article>
      <article class="green"><span>Hoàn thành</span><strong id="adminOrderDoneCount">0</strong><small>Tính doanh thu</small></article>
      <article class="red"><span>Đã hủy</span><strong id="adminOrderCancelCount">0</strong><small>Theo dõi lý do</small></article>
    </div>
    <div class="admin-order-workspace">
      <section class="admin-order-list-card">
        <div class="admin-order-tabs">
          <button class="active" type="button" data-order-filter="all">Tất cả</button>
          <button type="button" data-order-filter="pending">Chờ xác nhận</button>
          <button type="button" data-order-filter="confirmed">Đã xác nhận</button>
          <button type="button" data-order-filter="shipping">Đang giao</button>
          <button type="button" data-order-filter="completed">Hoàn thành</button>
          <button type="button" data-order-filter="cancelled">Đã hủy</button>
        </div>
        <div class="admin-order-toolbar"><input type="search" id="adminOrderSearch" placeholder="Tìm mã đơn, khách hàng..."><button type="button" id="adminSearchOrders">Tìm</button><button type="button" id="adminClearOrderFilters">Xóa</button></div>
        <div class="admin-table-wrap"><table class="admin-order-table"><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody id="adminOrderTable"></tbody></table></div>
      </section>
      <aside class="admin-order-detail-panel" id="adminOrderDetail"><div class="admin-order-empty">Chọn đơn hàng để xem chi tiết.</div></aside>
    </div>
  `;
}

function filterOrders() {
  const keyword = adminOrderFilters.keyword.trim().toLowerCase();
  return getCustomerOrders().filter((order) => {
    const status = normalizeOrderStatus(order.status).toLowerCase();
    const matchStatus = adminOrderFilters.status === "all" || status === adminOrderFilters.status;
    const matchKeyword = !keyword || formatOrderCode(order, getCustomerOrders()).toLowerCase().includes(keyword) || (order.customerName || "").toLowerCase().includes(keyword);
    return matchStatus && matchKeyword;
  });
}

function renderAdminOrders() {
  renderAdminOrderLayout();
  const orders = filterOrders();
  const allOrders = getCustomerOrders();
  const table = document.getElementById("adminOrderTable");
  if (!table) return;
  document.getElementById("adminOrderTotalCount").textContent = allOrders.length;
  document.getElementById("adminOrderPendingCount").textContent = allOrders.filter((order) => normalizeOrderStatus(order.status) === "PENDING").length;
  document.getElementById("adminOrderDoneCount").textContent = allOrders.filter((order) => normalizeOrderStatus(order.status) === "COMPLETED").length;
  document.getElementById("adminOrderCancelCount").textContent = allOrders.filter((order) => normalizeOrderStatus(order.status) === "CANCELLED").length;
  table.innerHTML = orders.map((order) => {
    const createdAt = new Date(order.createdAt);
    return `
      <tr class="${selectedAdminOrderId === order.id ? "active" : ""}">
        <td><strong class="admin-order-code">${formatOrderCode(order, allOrders)}</strong></td>
        <td><strong>${order.customerName || "Khách hàng"}</strong><small>${order.phone || order.email || ""}</small></td>
        <td>${createdAt.toLocaleDateString("vi-VN")}<small>${createdAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</small></td>
        <td><b>${formatMoney(getOrderTotal(order))}</b></td>
        <td><span class="order-state ${getOrderStatusClass(order.status)}">${formatOrderStatusText(order.status)}</span></td>
        <td class="admin-order-actions"><button type="button" title="Xem chi tiết" onclick="selectAdminOrder('${order.id}')">Xem</button><button type="button" title="Xác nhận" onclick="updateAdminOrderStatus('${order.id}', 'CONFIRMED')">Duyệt</button><button type="button" title="Hủy" onclick="updateAdminOrderStatus('${order.id}', 'CANCELLED')">Hủy</button></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6">Chưa có đơn hàng phù hợp.</td></tr>`;
  renderAdminOrderDetail();
}

function selectAdminOrder(orderId) {
  selectedAdminOrderId = orderId;
  renderAdminOrders();
}

function renderAdminOrderDetail() {
  const detail = document.getElementById("adminOrderDetail");
  if (!detail) return;
  const order = getCustomerOrders().find((item) => item.id === selectedAdminOrderId);
  if (!order) {
    detail.innerHTML = `<div class="admin-order-empty">Chọn đơn hàng để xem chi tiết.</div>`;
    return;
  }
  const items = order.items || [];
  const subtotal = order.subtotal || items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = order.shipping || 0;
  detail.innerHTML = `
    <div class="admin-order-detail-head"><div><h3>Chi tiết đơn hàng</h3><strong>${formatOrderCode(order, getCustomerOrders())}</strong></div><button type="button" onclick="selectAdminOrder(null)">Đóng</button></div>
    <section><h4>Thông tin khách hàng</h4><p>${order.customerName || "Khách hàng"}</p><p>${order.phone || "Chưa cập nhật SĐT"}</p><p>${order.address || "Chưa cập nhật địa chỉ"}</p></section>
    <section class="admin-order-detail-items"><h4>Sản phẩm</h4>${items.map((item) => `<article><img src="${resolveAssetUrl(item.image || item.thumbnailUrl)}" alt="${item.name}" onerror="this.src='${resolveAssetUrl("assets/product-1.jpg")}'"><div><strong>${item.name || item.productName}</strong><small>${item.color || "Black"} - ${item.size || "M"}</small></div><span>x${item.quantity || 1}</span><b>${formatMoney(item.price || 0)}</b></article>`).join("")}</section>
    <div class="admin-order-detail-total"><div><span>Tạm tính</span><strong>${formatMoney(subtotal)}</strong></div><div><span>Phí vận chuyển</span><strong>${shipping ? formatMoney(shipping) : "Miễn phí"}</strong></div><div class="total"><span>Tổng cộng</span><strong>${formatMoney(getOrderTotal(order))}</strong></div></div>
    <div class="admin-order-detail-actions"><button type="button" onclick="updateAdminOrderStatus('${order.id}', 'CONFIRMED')">Xác nhận</button><button type="button" onclick="updateAdminOrderStatus('${order.id}', 'CANCELLED')">Hủy đơn</button></div>
  `;
}

function updateAdminOrderStatus(orderId, status) {
  const localOrders = getOrders();
  const localIndex = localOrders.findIndex((order) => order.id === orderId);
  if (localIndex !== -1) {
    localOrders[localIndex] = { ...localOrders[localIndex], status };
    saveOrders(localOrders);
  } else {
    sampleOrders = sampleOrders.map((order) => order.id === orderId ? { ...order, status } : order);
  }
  showToast(`Đã cập nhật đơn hàng thành "${formatOrderStatusText(status)}".`);
  renderAdminDashboard();
  renderAdminOrders();
}

function initAdminPage() {
  seedAdminAccount();
  if (!requireAdminAccess()) return;
  renderAdminSidebar();
  renderAdminDashboard();
  renderAdminProducts();
  renderAdminCustomers();
  renderAdminOrders();
  showAdminSection(window.location.hash || "adminDashboard");

  document.querySelectorAll(".admin-sidebar a[href^='#admin']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute("href");
      if (sectionId === "#adminLogout") {
        clearCurrentUser();
        window.location.href = pageUrl("login.html");
        return;
      }
      showAdminSection(sectionId);
      history.replaceState(null, "", sectionId);
    });
  });

  document.getElementById("adminApplyProductFilters")?.addEventListener("click", applyAdminProductFilters);
  document.getElementById("adminSearchProducts")?.addEventListener("click", applyAdminProductFilters);
  document.getElementById("adminClearProductFilters")?.addEventListener("click", resetAdminProductFilters);
  document.getElementById("adminProductSearch")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyAdminProductFilters();
    }
  });

  document.getElementById("adminProductForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const id = Number(form.productId.value) || Date.now();
    const categoryId = Number(form.productCategoryId.value);
    const product = {
      id,
      name: form.productName.value.trim(),
      slug: form.productName.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      gender: form.productGender.value,
      categoryId,
      categoryName: getProductCategoryName(categoryId),
      category: getProductCategoryName(categoryId),
      price: Number(form.productPrice.value),
      oldPrice: Number(form.productOldPrice.value) || 0,
      image: form.productImage.value.trim() || `/assets/products/product-${id}.jpg`,
      thumbnailUrl: form.productImage.value.trim() || `/assets/products/product-${id}.jpg`,
      tag: form.productTag.value.trim().toUpperCase() || "NEW",
      tagLabel: form.productTag.value.trim().toUpperCase() || "NEW",
      description: form.productDescription.value.trim(),
      totalStock: 36,
      status: "SELLING",
      variants: []
    };
    if (!product.name || !product.price || !product.description) {
      showToast("Vui lòng nhập đầy đủ tên, giá và mô tả sản phẩm.");
      return;
    }
    upsertAdminProduct(product);
    closeAdminProductForm();
    renderAdminDashboard();
    renderAdminProducts();
    showToast("Đã lưu sản phẩm.");
  });

  document.getElementById("adminSearchCustomers")?.addEventListener("click", () => {
    adminCustomerKeyword = document.getElementById("adminCustomerSearch")?.value || "";
    renderAdminCustomers();
  });
  document.getElementById("adminClearCustomerSearch")?.addEventListener("click", () => {
    adminCustomerKeyword = "";
    const input = document.getElementById("adminCustomerSearch");
    if (input) input.value = "";
    renderAdminCustomers();
  });

  document.querySelectorAll("[data-order-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      adminOrderFilters.status = button.dataset.orderFilter || "all";
      document.querySelectorAll("[data-order-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderAdminOrders();
    });
  });
  document.getElementById("adminSearchOrders")?.addEventListener("click", () => {
    adminOrderFilters.keyword = document.getElementById("adminOrderSearch")?.value || "";
    renderAdminOrders();
  });
  document.getElementById("adminClearOrderFilters")?.addEventListener("click", () => {
    adminOrderFilters = { status: "all", dateFrom: "", dateTo: "", keyword: "" };
    const input = document.getElementById("adminOrderSearch");
    if (input) input.value = "";
    document.querySelectorAll("[data-order-filter]").forEach((item, index) => item.classList.toggle("active", index === 0));
    renderAdminOrders();
  });
}

window.openAdminProductForm = openAdminProductForm;
window.closeAdminProductForm = closeAdminProductForm;
window.editAdminProduct = editAdminProduct;
window.hideAdminProduct = hideAdminProduct;
window.selectAdminOrder = selectAdminOrder;
window.updateAdminOrderStatus = updateAdminOrderStatus;
window.showAdminSection = showAdminSection;
window.showToast = showToast;

initAdminPage();
