import {
  clearCurrentUser,
  formatMoney,
  getCurrentUser,
  getOrders,
  getUsers,
  initPasswordToggles,
  saveOrders,
  showToast
} from "./common.js";
import { seedAdminAccount } from "./auth.js";
import {
  defaultProducts,
  getProductAdminState,
  products,
  refreshProductsFromAdminState,
  saveProductAdminState
} from "./products.js";
import { formatOrderCode, getOrderStatusClass } from "./orders.js";

let adminProductFilters = { category: "all", price: "all", tag: "all", keyword: "" };
let adminCustomerKeyword = "";
let adminOrderFilters = { status: "all", dateFrom: "", dateTo: "", keyword: "" };
let selectedAdminOrderId = null;

function requireAdminAccess() {
  const adminApp = document.getElementById("adminApp");
  const currentUser = getCurrentUser();
  if (!adminApp) return false;

  if (!currentUser || currentUser.role !== "admin") {
    adminApp.innerHTML = `
      <section class="admin-denied">
        <h1>Không có quyền truy cập</h1>
        <p>Chỉ tài khoản admin mới có thể vào trang quản trị.</p>
        <p><strong>Email:</strong> admin@lunafashion.com<br><strong>Mật khẩu:</strong> 123456</p>
        <a class="btn btn-primary" href="login.html">Đăng nhập admin</a>
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
    <a href="#adminDashboard" class="logo admin-sidebar-logo">
      <span class="logo-main">Luna</span>
      <small>Fashion</small>
    </a>
    <nav>
      <span class="admin-nav-label">Tổng quan</span>
      <a href="#adminDashboard">Dashboard</a>
      <span class="admin-nav-label">Quản lý</span>
      <a href="#adminProducts">Quản lí sản phẩm</a>
      <a href="#adminOrders">Quản lí đơn hàng</a>
      <a href="#adminCustomers">Quản lí khách hàng</a>
      <span class="admin-nav-label">Cài đặt</span>
      <a href="#adminLogout" id="adminLogoutLink">Đăng xuất</a>
    </nav>
    <div class="admin-account">
      <strong>Admin mặc định</strong>
      <span>admin@lunafashion.com</span>
      <span>123456</span>
    </div>
  `;
}

function showAdminSection(sectionId = "adminDashboard") {
  const targetId = sectionId.replace("#", "");
  const targetPanel = document.getElementById(targetId) || document.getElementById("adminDashboard");
  const sectionTitles = {
    adminDashboard: ["Dashboard", "Control panel"],
    adminProducts: ["Quản lý sản phẩm", "Danh sách và trạng thái sản phẩm"],
    adminOrders: ["Quản lý đơn hàng", "Theo dõi và xử lý đơn hàng"],
    adminCustomers: ["Quản lý khách hàng", "Thông tin tài khoản khách hàng"]
  };
  const [title, subtitle] = sectionTitles[targetPanel.id] || sectionTitles.adminDashboard;

  document.querySelector(".admin-topbar h1").textContent = title;
  document.querySelector(".admin-topbar p").textContent = subtitle;
  document.querySelectorAll(".admin-panel").forEach((panel) => {
    panel.classList.toggle("active", panel === targetPanel);
  });
  document.querySelectorAll(".admin-sidebar nav a[href^='#admin']").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${targetPanel.id}`);
  });
}

function initAdminSections() {
  document.querySelectorAll(".admin-sidebar a[href^='#admin']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute("href");
      if (sectionId === "#adminLogout") {
        clearCurrentUser();
        window.location.href = "login.html";
        return;
      }
      showAdminSection(sectionId);
      history.replaceState(null, "", sectionId);
    });
  });

  showAdminSection(window.location.hash || "adminDashboard");
}

function renderAdminStats() {
  const statsTarget = document.getElementById("adminStats");
  if (!statsTarget) return;

  const users = getUsers().filter((user) => user.role !== "admin");
  const orders = getCustomerOrders();
  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  statsTarget.innerHTML = `
    <article class="admin-stat-card stat-pink"><span>Tổng doanh thu</span><strong>${formatMoney(revenue)}</strong><small>+ 18.6% so với tháng trước</small></article>
    <article class="admin-stat-card stat-purple"><span>Đơn hàng</span><strong>${orders.length}</strong><small>+ 12.5% so với tháng trước</small></article>
    <article class="admin-stat-card stat-orange"><span>Khách hàng</span><strong>${users.length}</strong><small>+ 8.7% so với tháng trước</small></article>
    <article class="admin-stat-card stat-teal"><span>Sản phẩm</span><strong>${products.length}</strong><small>+ 5.3% so với tháng trước</small></article>
  `;
}

function renderAdminDashboard() {
  const dashboardShell = document.querySelector("#adminDashboard .admin-dashboard-shell");
  if (!dashboardShell) return;

  const recentOrders = getCustomerOrders().slice(0, 3);
  dashboardShell.innerHTML = `
    <div class="admin-dashboard-header">
      <div>
        <span class="admin-dashboard-kicker">Dashboard</span>
        <h2>Bảng điều khiển quản trị</h2>
      </div>
      <label class="admin-dashboard-search">
        <input type="search" placeholder="Tìm kiếm...">
        <span>⌕</span>
      </label>
    </div>
    <div class="admin-stats" id="adminStats"></div>
    <div class="admin-dashboard-grid admin-dashboard-grid-clean">
      <article class="admin-chart-card admin-chart-card-main">
        <div class="admin-card-head">
          <div><h3>Doanh thu</h3><p>Biểu đồ doanh thu theo ngày trong tháng</p></div>
          <div class="admin-chart-controls"><select id="dashboardSalesFilter"><option>Tháng này</option><option>Tuần này</option><option>Năm nay</option></select></div>
        </div>
        <div class="admin-wave-chart">
          <div class="admin-wave-yaxis"><span>800M</span><span>600M</span><span>400M</span><span>200M</span><span>0</span></div>
          <div class="admin-wave-plot">
            <svg viewBox="0 0 720 260" preserveAspectRatio="none" role="img" aria-label="Biểu đồ doanh thu">
              <defs><linearGradient id="salesWaveFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ff6aa2" stop-opacity="0.3"/><stop offset="100%" stop-color="#ff6aa2" stop-opacity="0.04"/></linearGradient></defs>
              <path class="wave-area" d="M0,218 C34,188 55,173 84,154 C112,137 134,76 168,106 C196,132 220,148 250,122 C284,92 306,72 338,104 C374,138 394,66 426,92 C462,118 482,176 514,150 C552,118 576,116 608,90 C646,58 682,34 720,40 L720,240 L0,240 Z"></path>
              <path class="wave-line" d="M0,218 C34,188 55,173 84,154 C112,137 134,76 168,106 C196,132 220,148 250,122 C284,92 306,72 338,104 C374,138 394,66 426,92 C462,118 482,176 514,150 C552,118 576,116 608,90 C646,58 682,34 720,40"></path>
              <circle cx="338" cy="104" r="6"></circle><text x="338" y="72">520.000.000đ</text>
            </svg>
            <div class="admin-wave-xaxis"><span>01</span><span>05</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span></div>
          </div>
        </div>
      </article>
      <article class="admin-category-card admin-order-ratio-card">
        <div class="admin-card-head"><div><h3>Tỉ lệ đơn hàng</h3><p>Phân bổ theo trạng thái</p></div></div>
        <div class="admin-pie-chart" aria-label="Tỉ lệ đơn hàng"><strong>${getCustomerOrders().length}</strong><span>Tổng đơn</span></div>
        <ul class="admin-pie-legend">
          <li><i></i>Đã xử lí <strong>69%</strong></li>
          <li><i></i>Đang xử lí <strong>20%</strong></li>
          <li><i></i>Đã hủy <strong>10%</strong></li>
          <li><i></i>Hoàn trả <strong>5%</strong></li>
        </ul>
      </article>
    </div>
    <article class="admin-chart-card admin-recent-orders-card">
      <div class="admin-card-head"><div><h3>Đơn hàng mới nhất</h3><p>Theo dõi nhanh các đơn vừa được đặt</p></div><a href="#adminOrders" onclick="showAdminSection('adminOrders')">Xem tất cả</a></div>
      <div class="admin-dashboard-orders">
        <div><span>Mã đơn</span><span>Khách hàng</span><span>Ngày đặt</span><span>Tổng tiền</span><span>Trạng thái</span></div>
        ${recentOrders.length ? recentOrders.map((order) => {
          const createdAt = new Date(order.createdAt);
          return `<div><strong>${formatOrderCode(order, getCustomerOrders())}</strong><span>${order.customerName || "Khách hàng"}</span><span>${createdAt.toLocaleDateString("vi-VN")} ${createdAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span><b>${formatMoney(order.total || 0)}</b><em class="order-status-pill ${getOrderStatusClass(order.status)}">${order.status || "Đang xử lí"}</em></div>`;
        }).join("") : `<div class="admin-dashboard-order-empty"><span>Chưa có đơn hàng mới.</span></div>`}
      </div>
    </article>
  `;

  renderAdminStats();
}

function getFilteredAdminProducts() {
  refreshProductsFromAdminState();
  const keyword = adminProductFilters.keyword.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = adminProductFilters.category === "all" || product.category === adminProductFilters.category;
    const matchesPrice =
      adminProductFilters.price === "all" ||
      (adminProductFilters.price === "under250" && product.price < 250000) ||
      (adminProductFilters.price === "250to400" && product.price >= 250000 && product.price <= 400000) ||
      (adminProductFilters.price === "over400" && product.price > 400000);
    const matchesTag = adminProductFilters.tag === "all" || product.tag === adminProductFilters.tag;
    const matchesKeyword = !keyword || [product.name, product.category, product.tag, product.description, product.price]
      .some((value) => String(value || "").toLowerCase().includes(keyword));
    return matchesCategory && matchesPrice && matchesTag && matchesKeyword;
  });
}

function renderAdminProductLayout() {
  const productPanel = document.getElementById("adminProducts");
  if (!productPanel || productPanel.dataset.enhanced === "true") return;

  productPanel.dataset.enhanced = "true";
  const tableHead = productPanel.querySelector(".admin-table thead tr");
  if (tableHead) {
    tableHead.innerHTML = `
      <th><input type="checkbox"></th>
      <th>Sản phẩm</th>
      <th>Danh mục</th>
      <th>Giá bán</th>
      <th>Kho</th>
      <th>Trạng thái</th>
      <th>Lượt bán</th>
      <th>Ngày tạo</th>
      <th>Thao tác</th>
    `;
  }
  productPanel.insertAdjacentHTML("afterbegin", `
    <div class="admin-product-summary">
      <article><span>Tổng sản phẩm</span><strong>568</strong><small class="up">+ 12.5% so với tháng trước</small></article>
      <article><span>Đang bán</span><strong>486</strong><small class="up">+ 8.2% so với tháng trước</small></article>
      <article><span>Hết hàng</span><strong>32</strong><small class="down">- 4.3% so với tháng trước</small></article>
      <article><span>Ngừng kinh doanh</span><strong>50</strong><small class="down">- 1.7% so với tháng trước</small></article>
    </div>
  `);
}

function renderAdminProducts() {
  const productTable = document.getElementById("adminProductTable");
  if (!productTable) return;

  const filteredProducts = getFilteredAdminProducts();
  productTable.innerHTML = filteredProducts.length ? filteredProducts.map((product, index) => {
    const stock = index % 6 === 5 ? 0 : 120 - (index * 7 % 90);
    const sold = 320 - (index * 20 % 250);
    const statusText = stock === 0 ? "Hết hàng" : index % 9 === 8 ? "Ngừng kinh doanh" : "Đang bán";
    const statusClass = stock === 0 ? "out" : index % 9 === 8 ? "stop" : "selling";
    return `
      <tr>
        <td><input type="checkbox" aria-label="Chọn ${product.name}"></td>
        <td>
          <div class="admin-product-cell">
            <img src="${product.image}" alt="${product.name}">
            <div><strong>${product.name}</strong><small>SP${String(index + 1).padStart(3, "0")}</small></div>
          </div>
        </td>
        <td>${product.category}</td>
        <td><strong class="admin-product-price">${formatMoney(product.price)}</strong>${product.oldPrice ? `<small class="admin-product-old-price">${formatMoney(product.oldPrice)}</small>` : ""}</td>
        <td>${stock}</td>
        <td><span class="admin-product-status ${statusClass}">${statusText}</span></td>
        <td>${sold}</td>
        <td>${String(18 - (index % 5)).padStart(2, "0")}/05/2024</td>
        <td class="admin-product-actions">
          <button type="button" onclick="editAdminProduct(${product.id})">Sửa</button>
          <button type="button">Copy</button>
          <button type="button" onclick="hideAdminProduct(${product.id})">Xóa</button>
        </td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="9">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
}

function applyAdminProductFilters() {
  adminProductFilters = {
    category: document.getElementById("adminFilterCategory")?.value || "all",
    price: document.getElementById("adminFilterPrice")?.value || "all",
    tag: document.getElementById("adminFilterTag")?.value || "all",
    keyword: document.getElementById("adminProductSearch")?.value || ""
  };
  renderAdminProducts();
}

function resetAdminProductFilters() {
  adminProductFilters = { category: "all", price: "all", tag: "all", keyword: "" };
  ["adminFilterCategory", "adminFilterPrice", "adminFilterTag"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "all";
  });
  const search = document.getElementById("adminProductSearch");
  if (search) search.value = "";
  renderAdminProducts();
}

function resetAdminProductForm() {
  const form = document.getElementById("adminProductForm");
  if (!form) return;
  form.reset();
  form.productId.value = "";
}

function openAdminProductForm() {
  const modal = document.getElementById("adminProductModal");
  const form = document.getElementById("adminProductForm");
  if (!form) return;
  resetAdminProductForm();
  if (modal) modal.hidden = false;
  form.classList.add("show");
  form.productName.focus();
}

function closeAdminProductForm() {
  const modal = document.getElementById("adminProductModal");
  const form = document.getElementById("adminProductForm");
  if (!form) return;
  form.classList.remove("show");
  if (modal) modal.hidden = true;
  resetAdminProductForm();
}

function editAdminProduct(productId) {
  const product = products.find((item) => item.id === productId);
  const form = document.getElementById("adminProductForm");
  if (!product || !form) return;

  document.getElementById("adminProductModal").hidden = false;
  form.classList.add("show");
  form.productId.value = product.id;
  form.productName.value = product.name;
  form.productCategory.value = product.category;
  form.productPrice.value = product.price;
  form.productOldPrice.value = product.oldPrice || "";
  form.productImage.value = product.image;
  form.productTag.value = product.tag;
  form.productDescription.value = product.description;
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
  renderAdminStats();
}

function renderAdminCustomers() {
  const table = document.getElementById("adminCustomerTable");
  if (!table) return;

  const keyword = adminCustomerKeyword.trim().toLowerCase();
  const users = getUsers()
    .filter((user) => user.role !== "admin")
    .filter((user) => !keyword || [user.firstName, user.lastName, user.email, user.phone, user.address].some((value) => String(value || "").toLowerCase().includes(keyword)));

  table.innerHTML = users.length ? users.map((user, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${user.lastName || ""} ${user.firstName || ""}</strong><small>Khách hàng</small></td>
      <td>${user.email}</td>
      <td>${user.phone || "Chưa cập nhật"}</td>
      <td>${user.address || "Chưa cập nhật"}</td>
      <td>${new Date(user.createdAt || Date.now()).toLocaleDateString("vi-VN")}</td>
      <td><span class="admin-status-badge">Activated</span></td>
      <td class="admin-customer-actions"><button type="button" onclick="viewAdminCustomer('${user.id}')">Xem</button></td>
    </tr>
  `).join("") : `<tr><td colspan="8">Chưa có khách hàng.</td></tr>`;
}

function applyAdminCustomerSearch() {
  adminCustomerKeyword = document.getElementById("adminCustomerSearch")?.value || "";
  renderAdminCustomers();
}

function resetAdminCustomerSearch() {
  adminCustomerKeyword = "";
  const search = document.getElementById("adminCustomerSearch");
  if (search) search.value = "";
  renderAdminCustomers();
}

function viewAdminCustomer(userId) {
  const user = getUsers().find((item) => String(item.id) === String(userId));
  showToast(user ? `Tài khoản: ${user.lastName || ""} ${user.firstName || ""}`.trim() : "Không tìm thấy tài khoản.");
}

function getCustomerOrders() {
  const adminUserIds = new Set(getUsers().filter((user) => user.role === "admin").map((user) => user.id));
  return getOrders().filter((order) => !adminUserIds.has(order.customerId));
}

function renderAdminOrderLayout() {
  const orderPanel = document.getElementById("adminOrders");
  const orderManager = orderPanel?.querySelector(".admin-order-manager");
  if (!orderPanel || !orderManager || orderPanel.dataset.enhanced === "true") return;

  orderPanel.dataset.enhanced = "true";
  orderManager.innerHTML = `
    <div class="admin-order-summary-grid">
      <article class="hot"><span>Tổng đơn hàng</span><strong id="adminOrderTotalCount">0</strong><small>+ 12.5% so với tháng trước</small></article>
      <article class="orange"><span>Đang xử lí</span><strong id="adminOrderPendingCount">0</strong><small>+ 8.2% so với tháng trước</small></article>
      <article class="green"><span>Đã xử lí</span><strong id="adminOrderDoneCount">0</strong><small>+ 9.8% so với tháng trước</small></article>
      <article class="red"><span>Đã hủy</span><strong id="adminOrderCancelCount">0</strong><small>- 4.1% so với tháng trước</small></article>
    </div>
    <div class="admin-order-workspace">
      <section class="admin-order-list-card">
        <div class="admin-order-tabs">
          <button class="active" type="button" data-order-filter="all">Tất cả</button>
          <button type="button" data-order-filter="pending">Đang xử lí</button>
          <button type="button" data-order-filter="done">Đã xử lí</button>
          <button type="button" data-order-filter="cancel">Đã hủy</button>
        </div>
        <div class="admin-order-toolbar">
          <button class="admin-clear-filter-btn" type="button" id="adminClearOrderFilters">Bộ lọc</button>
          <input type="search" id="adminOrderSearch" placeholder="Tìm kiếm đơn hàng, khách hàng...">
          <button type="button" id="adminSearchOrders">Tìm</button>
        </div>
        <div class="admin-order-date-filter">
          <label>Từ ngày<input type="date" id="adminOrderDateFrom"></label>
          <label>Đến ngày<input type="date" id="adminOrderDateTo"></label>
          <button type="button" id="adminFilterOrderDate">Lọc thời gian</button>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table admin-order-table">
            <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody id="adminOrderTable"></tbody>
          </table>
        </div>
      </section>
      <aside class="admin-order-detail-panel" id="adminOrderDetailPanel"></aside>
    </div>
  `;
}

function filterAdminOrders() {
  const keyword = adminOrderFilters.keyword.trim().toLowerCase();
  const customerOrders = getCustomerOrders();
  const statusMap = {
    pending: ["đang xử", "chờ", "pending"],
    done: ["đã xử", "đã giao", "done", "hoàn thành"],
    cancel: ["hủy", "cancel"]
  };

  return customerOrders.filter((order) => {
    const createdDate = new Date(order.createdAt);
    const fromDate = adminOrderFilters.dateFrom ? new Date(`${adminOrderFilters.dateFrom}T00:00:00`) : null;
    const toDate = adminOrderFilters.dateTo ? new Date(`${adminOrderFilters.dateTo}T23:59:59`) : null;
    const normalizedStatus = String(order.status || "").toLowerCase();
    const matchesStatus = adminOrderFilters.status === "all" || (statusMap[adminOrderFilters.status] || []).some((value) => normalizedStatus.includes(value));
    const matchesDateFrom = !fromDate || createdDate >= fromDate;
    const matchesDateTo = !toDate || createdDate <= toDate;
    const matchesKeyword = !keyword || [order.id, formatOrderCode(order, customerOrders), order.customerName, order.email, order.status, order.total]
      .some((value) => String(value || "").toLowerCase().includes(keyword));
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesKeyword;
  });
}

function renderAdminOrders() {
  renderAdminOrderLayout();
  const orderTable = document.getElementById("adminOrderTable");
  const detailPanel = document.getElementById("adminOrderDetailPanel");
  if (!orderTable) return;

  const customerOrders = getCustomerOrders();
  const orders = filterAdminOrders();
  const setText = (id, value) => {
    const target = document.getElementById(id);
    if (target) target.textContent = value;
  };
  setText("adminOrderTotalCount", customerOrders.length);
  setText("adminOrderPendingCount", customerOrders.filter((order) => getOrderStatusClass(order.status) === "is-pending").length);
  setText("adminOrderDoneCount", customerOrders.filter((order) => getOrderStatusClass(order.status) === "is-success").length);
  setText("adminOrderCancelCount", customerOrders.filter((order) => getOrderStatusClass(order.status) === "is-cancelled").length);

  const selectedOrder = selectedAdminOrderId ? customerOrders.find((order) => String(order.id) === String(selectedAdminOrderId)) : null;
  orderTable.innerHTML = orders.length ? orders.map((order) => {
    const createdAt = new Date(order.createdAt);
    return `
      <tr class="${String(order.id) === String(selectedOrder?.id) ? "active" : ""}">
        <td><strong class="admin-order-code">${formatOrderCode(order, customerOrders)}</strong></td>
        <td><strong>${order.customerName || "Khách hàng"}</strong><small>${order.phone || order.email || ""}</small></td>
        <td>${createdAt.toLocaleDateString("vi-VN")}<br><small>${createdAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</small></td>
        <td><strong>${formatMoney(order.total || 0)}</strong></td>
        <td><span class="order-state ${getOrderStatusClass(order.status)}">${order.status || "Đang xử lí"}</span></td>
        <td class="admin-order-actions">
          <button type="button" title="Xem chi tiết" onclick="selectAdminOrder('${order.id}')">◉</button>
          <button type="button" title="Xác nhận" onclick="updateAdminOrderStatus('${order.id}', 'Đã xử lí')">✓</button>
          <button type="button" title="Hủy" onclick="updateAdminOrderStatus('${order.id}', 'Đã hủy')">×</button>
        </td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="6">Chưa có đơn hàng phù hợp.</td></tr>`;

  if (!detailPanel) return;
  if (!selectedOrder) {
    detailPanel.innerHTML = `<p class="admin-order-empty">Bấm nút tròn trong cột thao tác để xem chi tiết đơn hàng.</p>`;
    return;
  }

  const createdAt = new Date(selectedOrder.createdAt);
  const items = selectedOrder.items || [];
  const subtotal = selectedOrder.subtotal || items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = selectedOrder.shipping || 0;
  const total = selectedOrder.total || subtotal + shipping;

  detailPanel.innerHTML = `
    <div class="admin-order-detail-head">
      <div><h3>Chi tiết đơn hàng</h3><strong>${formatOrderCode(selectedOrder, customerOrders)}</strong></div>
      <button type="button" onclick="selectAdminOrder(null)">×</button>
    </div>
    <span class="order-state ${getOrderStatusClass(selectedOrder.status)}">${selectedOrder.status || "Đang xử lí"}</span>
    <section><h4>Thông tin khách hàng</h4><p>${selectedOrder.customerName || "Khách hàng"}</p><p>${selectedOrder.phone || "Chưa cập nhật SĐT"}</p><p>${selectedOrder.email || "Chưa cập nhật email"}</p><p>${selectedOrder.address || "Chưa cập nhật địa chỉ"}</p></section>
    <section><h4>Thông tin đơn hàng</h4><div><span>Ngày đặt</span><strong>${createdAt.toLocaleDateString("vi-VN")} ${createdAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</strong></div><div><span>Thanh toán</span><strong>COD</strong></div><div><span>Vận chuyển</span><strong>Giao hàng nhanh</strong></div></section>
    <section class="admin-order-detail-items">
      <h4>Sản phẩm</h4>
      ${items.map((item) => `<article><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><small>${item.color || "Pastel"} - ${item.size || "M"}</small></div><span>x${item.quantity}</span><b>${formatMoney(item.price)}</b></article>`).join("") || "<p>Không có sản phẩm.</p>"}
    </section>
    <div class="admin-order-detail-total"><div><span>Tạm tính</span><strong>${formatMoney(subtotal)}</strong></div><div><span>Phí vận chuyển</span><strong>${shipping ? formatMoney(shipping) : "Miễn phí"}</strong></div><div class="total"><span>Tổng cộng</span><strong>${formatMoney(total)}</strong></div></div>
    <div class="admin-order-detail-actions"><button type="button" onclick="updateAdminOrderStatus('${selectedOrder.id}', 'Đã xử lí')">Cập nhật trạng thái</button><button type="button" onclick="updateAdminOrderStatus('${selectedOrder.id}', 'Đã hủy')">Hủy đơn</button></div>
  `;
}

function selectAdminOrder(orderId) {
  selectedAdminOrderId = orderId;
  renderAdminOrders();
}

function updateAdminOrderStatus(orderId, status) {
  const orders = getOrders();
  const index = orders.findIndex((order) => String(order.id) === String(orderId));
  if (index === -1) return;

  orders[index] = { ...orders[index], status };
  saveOrders(orders);
  renderAdminDashboard();
  renderAdminOrders();
  showToast(`Đã cập nhật đơn hàng thành "${status}".`);
}

function applyAdminOrderFilters() {
  adminOrderFilters.keyword = document.getElementById("adminOrderSearch")?.value || "";
  renderAdminOrders();
}

function applyAdminOrderDateFilter() {
  adminOrderFilters.dateFrom = document.getElementById("adminOrderDateFrom")?.value || "";
  adminOrderFilters.dateTo = document.getElementById("adminOrderDateTo")?.value || "";
  renderAdminOrders();
}

function resetAdminOrderFilters() {
  adminOrderFilters = { status: "all", dateFrom: "", dateTo: "", keyword: "" };
  ["adminOrderDateFrom", "adminOrderDateTo", "adminOrderSearch"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
  document.querySelectorAll("#adminOrders [data-order-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.orderFilter === "all");
  });
  renderAdminOrders();
}

function bindAdminEvents() {
  document.getElementById("adminApplyProductFilters")?.addEventListener("click", applyAdminProductFilters);
  document.getElementById("adminSearchProducts")?.addEventListener("click", applyAdminProductFilters);
  document.getElementById("adminClearProductFilters")?.addEventListener("click", resetAdminProductFilters);
  document.getElementById("adminProductSearch")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyAdminProductFilters();
    }
  });

  document.getElementById("adminSearchCustomers")?.addEventListener("click", applyAdminCustomerSearch);
  document.getElementById("adminClearCustomerSearch")?.addEventListener("click", resetAdminCustomerSearch);
  document.getElementById("adminCustomerSearch")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyAdminCustomerSearch();
    }
  });

  document.querySelectorAll("#adminOrders [data-order-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      adminOrderFilters.status = button.dataset.orderFilter || "all";
      document.querySelectorAll("#adminOrders [data-order-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderAdminOrders();
    });
  });
  document.getElementById("adminSearchOrders")?.addEventListener("click", applyAdminOrderFilters);
  document.getElementById("adminFilterOrderDate")?.addEventListener("click", applyAdminOrderDateFilter);
  document.getElementById("adminClearOrderFilters")?.addEventListener("click", resetAdminOrderFilters);

  document.getElementById("adminProductForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const id = Number(form.productId.value) || Date.now();
    const product = {
      id,
      name: form.productName.value.trim(),
      category: form.productCategory.value,
      price: Number(form.productPrice.value),
      oldPrice: Number(form.productOldPrice.value) || 0,
      image: form.productImage.value.trim() || "../assets/product-1.jpg",
      tag: form.productTag.value.trim() || "New",
      description: form.productDescription.value.trim()
    };

    if (!product.name || !product.price || !product.description) {
      showToast("Vui lòng nhập đầy đủ tên, giá và mô tả sản phẩm.");
      return;
    }

    upsertAdminProduct(product);
    closeAdminProductForm();
    renderAdminStats();
    renderAdminProducts();
    showToast("Đã lưu sản phẩm.");
  });
}

function initAdminPage() {
  seedAdminAccount();
  if (!requireAdminAccess()) return;
  refreshProductsFromAdminState();
  renderAdminSidebar();
  renderAdminDashboard();
  renderAdminProductLayout();
  renderAdminProducts();
  renderAdminCustomers();
  renderAdminOrders();
  initAdminSections();
  bindAdminEvents();
  initPasswordToggles();
}

window.openAdminProductForm = openAdminProductForm;
window.closeAdminProductForm = closeAdminProductForm;
window.editAdminProduct = editAdminProduct;
window.hideAdminProduct = hideAdminProduct;
window.viewAdminCustomer = viewAdminCustomer;
window.updateAdminOrderStatus = updateAdminOrderStatus;
window.selectAdminOrder = selectAdminOrder;
window.showAdminSection = showAdminSection;

initAdminPage();
