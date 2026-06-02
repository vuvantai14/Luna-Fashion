let products = [
  {
    id: 1,
    name: "Đầm hoa pastel",
    category: "Đầm",
    price: 329000,
    oldPrice: 420000,
    image: "assets/product-1.svg",
    description: "Đầm hoa pastel nhẹ nhàng, phù hợp đi chơi, đi cà phê hoặc dạo phố cuối tuần.",
    tag: "Sale"
  },
  {
    id: 2,
    name: "Áo sơ mi trắng nữ",
    category: "Áo",
    price: 259000,
    oldPrice: 0,
    image: "assets/product-2.svg",
    description: "Áo sơ mi trắng basic, dễ phối cùng quần jeans, chân váy hoặc quần tây.",
    tag: "New"
  },
  {
    id: 3,
    name: "Chân váy chữ A",
    category: "Váy",
    price: 279000,
    oldPrice: 350000,
    image: "assets/product-3.svg",
    description: "Chân váy chữ A tôn dáng, phù hợp phong cách đi học và công sở.",
    tag: "Sale"
  },
  {
    id: 4,
    name: "Đầm dự tiệc đen",
    category: "Đầm",
    price: 499000,
    oldPrice: 650000,
    image: "assets/product-4.svg",
    description: "Đầm dự tiệc màu đen sang trọng, thiết kế đơn giản nhưng nổi bật.",
    tag: "Hot"
  },
  {
    id: 5,
    name: "Áo croptop basic",
    category: "Áo",
    price: 199000,
    oldPrice: 0,
    image: "assets/product-5.svg",
    description: "Áo croptop basic trẻ trung, chất vải mềm, dễ phối với chân váy hoặc quần jean.",
    tag: "New"
  },
  {
    id: 6,
    name: "Váy công sở thanh lịch",
    category: "Váy",
    price: 369000,
    oldPrice: 450000,
    image: "assets/product-6.svg",
    description: "Váy công sở dáng dài vừa phải, thanh lịch, phù hợp đi làm và gặp khách hàng.",
    tag: "Sale"
  },
  {
    id: 7,
    name: "Túi xách mini",
    category: "Phụ kiện",
    price: 229000,
    oldPrice: 0,
    image: "assets/product-7.svg",
    description: "Túi xách mini nữ tính, dễ phối cùng đầm, váy hoặc set công sở.",
    tag: "New"
  },
  {
    id: 8,
    name: "Set áo và chân váy",
    category: "Đầm",
    price: 459000,
    oldPrice: 560000,
    image: "assets/product-8.svg",
    description: "Set áo và chân váy đồng bộ, giúp bạn có outfit hoàn chỉnh chỉ trong vài giây.",
    tag: "Hot"
  },
  {
    id: 9,
    name: "Đầm linen cổ vuông",
    category: "Đầm",
    price: 389000,
    oldPrice: 480000,
    image: "assets/product-1.svg",
    description: "Đầm linen cổ vuông nhẹ mát, phù hợp đi làm, đi chơi và những ngày thời tiết nóng.",
    tag: "Sale"
  },
  {
    id: 10,
    name: "Áo blouse tay phồng",
    category: "Áo",
    price: 289000,
    oldPrice: 350000,
    image: "assets/product-2.svg",
    description: "Áo blouse tay phồng nữ tính, dễ phối cùng chân váy chữ A hoặc quần jeans.",
    tag: "New"
  },
  {
    id: 11,
    name: "Chân váy midi xếp ly",
    category: "Váy",
    price: 319000,
    oldPrice: 390000,
    image: "assets/product-3.svg",
    description: "Chân váy midi xếp ly mềm mại, tạo chuyển động nhẹ nhàng khi di chuyển.",
    tag: "Sale"
  },
  {
    id: 12,
    name: "Đầm cổ yếm dự tiệc",
    category: "Đầm",
    price: 529000,
    oldPrice: 690000,
    image: "assets/product-4.svg",
    description: "Đầm cổ yếm thanh lịch cho tiệc tối, sinh nhật hoặc những buổi hẹn quan trọng.",
    tag: "Hot"
  },
  {
    id: 13,
    name: "Áo thun rib ôm dáng",
    category: "Áo",
    price: 179000,
    oldPrice: 0,
    image: "assets/product-5.svg",
    description: "Áo thun rib co giãn nhẹ, ôm dáng vừa phải và dễ phối trong outfit hằng ngày.",
    tag: "New"
  },
  {
    id: 14,
    name: "Váy bút chì công sở",
    category: "Váy",
    price: 339000,
    oldPrice: 420000,
    image: "assets/product-6.svg",
    description: "Váy bút chì công sở có độ co giãn nhẹ, giúp dáng mặc gọn và thanh lịch.",
    tag: "Sale"
  },
  {
    id: 15,
    name: "Túi đeo vai pastel",
    category: "Phụ kiện",
    price: 259000,
    oldPrice: 320000,
    image: "assets/product-7.svg",
    description: "Túi đeo vai pastel nhỏ gọn, phù hợp đi chơi, đi học hoặc phối cùng đầm nhẹ.",
    tag: "Sale"
  },
  {
    id: 16,
    name: "Set cardigan và váy",
    category: "Đầm",
    price: 489000,
    oldPrice: 590000,
    image: "assets/product-8.svg",
    description: "Set cardigan và váy tạo vẻ ngoài dịu dàng, phù hợp tiết trời mát hoặc đi cà phê.",
    tag: "Hot"
  },
  {
    id: 17,
    name: "Đầm sơ mi thắt eo",
    category: "Đầm",
    price: 419000,
    oldPrice: 520000,
    image: "assets/product-1.svg",
    description: "Đầm sơ mi thắt eo gọn gàng, dễ mặc đi làm và có thể phối cùng túi mini.",
    tag: "Sale"
  },
  {
    id: 18,
    name: "Áo kiểu cổ nơ",
    category: "Áo",
    price: 299000,
    oldPrice: 360000,
    image: "assets/product-2.svg",
    description: "Áo kiểu cổ nơ tạo điểm nhấn nữ tính, hợp với phong cách công sở nhẹ nhàng.",
    tag: "New"
  },
  {
    id: 19,
    name: "Chân váy jean chữ A",
    category: "Váy",
    price: 309000,
    oldPrice: 0,
    image: "assets/product-3.svg",
    description: "Chân váy jean chữ A trẻ trung, dễ phối với áo thun, sơ mi hoặc croptop.",
    tag: "New"
  },
  {
    id: 20,
    name: "Đầm satin hai dây",
    category: "Đầm",
    price: 459000,
    oldPrice: 560000,
    image: "assets/product-4.svg",
    description: "Đầm satin hai dây mềm rũ, thích hợp cho các buổi tiệc tối và hẹn hò.",
    tag: "Hot"
  },
  {
    id: 21,
    name: "Áo khoác cardigan mỏng",
    category: "Áo",
    price: 349000,
    oldPrice: 430000,
    image: "assets/product-5.svg",
    description: "Áo khoác cardigan mỏng nhẹ, dễ khoác ngoài váy hai dây hoặc áo basic.",
    tag: "Sale"
  },
  {
    id: 22,
    name: "Váy tennis xếp ly",
    category: "Váy",
    price: 289000,
    oldPrice: 350000,
    image: "assets/product-6.svg",
    description: "Váy tennis xếp ly năng động, phù hợp phong cách trẻ trung khi đi học hoặc dạo phố.",
    tag: "New"
  },
  {
    id: 23,
    name: "Băng đô ngọc trai",
    category: "Phụ kiện",
    price: 129000,
    oldPrice: 0,
    image: "assets/product-7.svg",
    description: "Băng đô ngọc trai nhỏ xinh, tạo điểm nhấn nhẹ cho outfit váy hoặc đầm pastel.",
    tag: "New"
  }
];

const defaultProducts = products.map((product) => ({ ...product }));

function getProductAdminState() {
  return JSON.parse(localStorage.getItem("lunaProductAdminState")) || {
    customProducts: [],
    hiddenProductIds: []
  };
}

function saveProductAdminState(state) {
  localStorage.setItem("lunaProductAdminState", JSON.stringify(state));
}

function refreshProductsFromAdminState() {
  const state = getProductAdminState();
  const customById = new Map(state.customProducts.map((product) => [product.id, product]));
  const hiddenIds = new Set(state.hiddenProductIds);
  const mergedDefaults = defaultProducts
    .filter((product) => !hiddenIds.has(product.id))
    .map((product) => customById.get(product.id) || product);
  const customOnly = state.customProducts.filter((product) => !defaultProducts.some((item) => item.id === product.id));

  products = [...mergedDefaults, ...customOnly].filter((product) => !hiddenIds.has(product.id));
}

refreshProductsFromAdminState();

const productGrid = document.getElementById("productGrid");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartOpenBtn = document.getElementById("cartOpenBtn");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const quickModal = document.getElementById("quickModal");
const quickCloseBtn = document.getElementById("quickCloseBtn");
const quickViewBody = document.getElementById("quickViewBody");
const toast = document.getElementById("toast");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const checkoutBtn = document.getElementById("checkoutBtn");
const detailTitle = document.getElementById("detailTitle");
const detailCategory = document.getElementById("detailCategory");
const detailImage = document.getElementById("detailImage");
const detailPrice = document.getElementById("detailPrice");
const detailOldPrice = document.getElementById("detailOldPrice");
const detailDescription = document.getElementById("detailDescription");
const detailSpecs = document.getElementById("detailSpecs");
const detailAddBtn = document.getElementById("detailAddBtn");
const relatedGrid = document.getElementById("relatedGrid");
const detailRouteName = document.getElementById("detailRouteName");
const colorOptions = document.getElementById("colorOptions");
const sizeOptions = document.getElementById("sizeOptions");
const cartPageItems = document.getElementById("cartPageItems");
const cartPageCount = document.getElementById("cartPageCount");
const cartPageSubtotal = document.getElementById("cartPageSubtotal");
const cartPageShipping = document.getElementById("cartPageShipping");
const cartPageTotal = document.getElementById("cartPageTotal");
const cartPageNotice = document.getElementById("cartPageNotice");
const clearProductFiltersBtn = document.getElementById("clearProductFilters");
const applyProductFiltersBtn = document.getElementById("applyProductFilters");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");
const adminProductForm = document.getElementById("adminProductForm");
const adminProductTable = document.getElementById("adminProductTable");
const adminCustomerTable = document.getElementById("adminCustomerTable");
const adminOrderTable = document.getElementById("adminOrderTable");
const adminStats = document.getElementById("adminStats");
const adminApp = document.getElementById("adminApp");
const checkoutMainBtn = document.querySelector(".checkout-main-btn");

let currentFilter = "Tất cả";
let currentPage = 1;
const productsPerPage = window.location.pathname.endsWith("products.html") ? 8 : 10;
let cart = JSON.parse(localStorage.getItem("lunaCart")) || [];
let appliedSidebarFilters = {
  priceValue: "all",
  colors: []
};

let currentUser = JSON.parse(localStorage.getItem("lunaCurrentUser")) || null;

function seedAdminAccount() {
  const users = getUsers();
  const adminEmail = "admin@lunafashion.com";

  if (!users.some((user) => user.email === adminEmail)) {
    users.push({
      id: 1,
      firstName: "Admin",
      lastName: "Luna",
      email: adminEmail,
      password: "admin123",
      phone: "",
      address: "",
      role: "admin",
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }
}

function normalizeCurrentUserRole() {
  if (!currentUser) return;
  if (currentUser.email === "admin@lunafashion.com") {
    currentUser = { ...currentUser, role: "admin" };
  } else if (!currentUser.role) {
    currentUser = { ...currentUser, role: "customer" };
  }
  localStorage.setItem("lunaCurrentUser", JSON.stringify(currentUser));
}

const params = new URLSearchParams(window.location.search);
const categoryParam = params.get("category");
if (categoryParam) {
  currentFilter = categoryParam;
}

const detailSpecsMap = {
  "Đầm": [
    ["Chất liệu", "Voan lụa mềm, có lót"],
    ["Phom dáng", "Xòe nhẹ, tôn eo"],
    ["Chiều dài", "Qua gối"],
    ["Màu sắc", "Pastel / Đen / Kem"],
    ["Size", "S, M, L"],
    ["Phù hợp", "Dạo phố, đi làm, dự tiệc nhẹ"],
    ["Bảo quản", "Giặt tay hoặc giặt túi lưới"]
  ],
  "Áo": [
    ["Chất liệu", "Cotton pha mềm mịn"],
    ["Phom dáng", "Basic dễ phối"],
    ["Tay áo", "Ngắn / dài tùy mẫu"],
    ["Màu sắc", "Trắng, kem, hồng nhạt"],
    ["Size", "S, M, L"],
    ["Phù hợp", "Đi học, đi làm, dạo phố"],
    ["Bảo quản", "Ủi nhiệt thấp"]
  ],
  "Váy": [
    ["Chất liệu", "Tuyết mưa co giãn nhẹ"],
    ["Phom dáng", "Chữ A thanh lịch"],
    ["Chiều dài", "Trên gối hoặc midi"],
    ["Màu sắc", "Đen, be, nâu sữa"],
    ["Size", "S, M, L"],
    ["Phù hợp", "Công sở, gặp khách hàng"],
    ["Bảo quản", "Không dùng chất tẩy mạnh"]
  ],
  "Phụ kiện": [
    ["Chất liệu", "Da tổng hợp cao cấp"],
    ["Kiểu dáng", "Mini bag nữ tính"],
    ["Kích thước", "20 x 14 x 7 cm"],
    ["Màu sắc", "Kem, đen, hồng"],
    ["Ngăn chứa", "1 ngăn chính, 1 ngăn phụ"],
    ["Phù hợp", "Dạo phố, đi tiệc"],
    ["Bảo quản", "Tránh nước và ánh nắng gắt"]
  ]
};

function formatMoney(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function getUsers() {
  return JSON.parse(localStorage.getItem("lunaUsers")) || [];
}

function saveUsers(users) {
  localStorage.setItem("lunaUsers", JSON.stringify(users));
}

function setAuthMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `auth-message ${type}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateLoginLinks() {
  document.querySelectorAll(".login-link").forEach((link) => {
    if (!currentUser) return;
    link.innerHTML = `<span>👤</span><small>${currentUser.firstName}</small>`;
    link.href = "#user-info";
    link.setAttribute("aria-label", `Tài khoản ${currentUser.firstName}`);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showUserInfo();
    });
  });
}

function showUserInfo() {
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

  modal.innerHTML = `
    <div class="user-info-card">
      <button class="user-info-close" type="button" aria-label="Đóng">×</button>
      <div class="user-info-avatar">👤</div>
      <div class="user-info-title-row">
        <h2>Thông tin tài khoản</h2>
        <button class="edit-user-btn" type="button">Chỉnh sửa</button>
      </div>
      <dl>
        <div>
          <dt>Họ tên</dt>
          <dd class="user-view-value">${currentUser.lastName} ${currentUser.firstName}</dd>
          <div class="user-edit-fields">
            <input type="text" id="userLastNameInput" value="${currentUser.lastName || ""}" placeholder="Nhập họ">
            <input type="text" id="userFirstNameInput" value="${currentUser.firstName || ""}" placeholder="Nhập tên">
          </div>
        </div>
        <div><dt>Email</dt><dd>${currentUser.email}</dd></div>
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
      <div class="user-action-grid user-edit-actions">
        <button class="save-user-btn" type="button">Cập nhật</button>
        <button class="cancel-edit-btn" type="button">Hủy</button>
      </div>
      ${currentUser.role === "admin" ? `<a class="admin-shortcut-btn" href="admin.html">Vào trang admin</a>` : ""}
      <button class="logout-btn single-logout-btn" type="button">Đăng xuất</button>
    </div>
  `;

  modal.classList.add("show");
  modal.querySelector(".user-info-close").addEventListener("click", () => modal.classList.remove("show"));
  modal.querySelector(".edit-user-btn").addEventListener("click", () => {
    modal.querySelector(".user-info-card").classList.add("editing");
  });
  modal.querySelector(".cancel-edit-btn").addEventListener("click", () => {
    modal.querySelector(".user-info-card").classList.remove("editing");
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("show");
  });
  modal.querySelectorAll(".logout-btn").forEach((button) => button.addEventListener("click", () => {
    localStorage.removeItem("lunaCurrentUser");
    currentUser = null;
    window.location.href = "index.html";
  }));

  modal.querySelector(".save-user-btn").addEventListener("click", () => {
    const lastName = document.getElementById("userLastNameInput").value.trim();
    const firstName = document.getElementById("userFirstNameInput").value.trim();
    const phone = document.getElementById("userPhoneInput").value.trim();
    const address = document.getElementById("userAddressInput").value.trim();
    const users = getUsers();
    const userIndex = users.findIndex((user) => user.id === currentUser.id);

    if (!lastName || !firstName) {
      showCenterNotice("Vui lòng nhập đầy đủ họ và tên.", "error");
      return;
    }

    currentUser = { ...currentUser, lastName, firstName, phone, address };
    localStorage.setItem("lunaCurrentUser", JSON.stringify(currentUser));

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], lastName, firstName, phone, address };
      saveUsers(users);
    }

    showCenterNotice("Cập nhật thông tin thành công.", "success", () => {
      showUserInfo();
    });
  });
}

function showCenterNotice(message, type = "success", callback) {
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

function getProductColors(product) {
  const colorsByCategory = {
    "Đầm": ["Pastel Pink", "Ivory", "Black"],
    "Áo": ["Ivory", "Pastel Pink", "Beige"],
    "Váy": ["Black", "Beige", "Pastel Pink"],
    "Phụ kiện": ["Pastel Pink", "Ivory", "Beige"]
  };

  return colorsByCategory[product.category] || ["Pastel Pink"];
}

function getProductSizes(product) {
  return ["S", "M", "L", "XL", "XXL"];
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getSidebarFilters() {
  const priceValue = document.querySelector('input[name="priceFilter"]:checked')?.value || "all";
  const colors = getCheckedValues("colorFilter");

  return { priceValue, colors };
}

function syncCategoryControls(category) {
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === category);
  });

  document.querySelectorAll('input[name="sidebarCategory"]').forEach((input) => {
    input.checked = input.value === category;
  });
}

function resetSidebarFilters() {
  document.querySelector('input[name="priceFilter"][value="all"]')?.click();
  document.querySelectorAll('input[name="colorFilter"]').forEach((input) => {
    input.checked = false;
  });
}

function getProductPagination() {
  if (!productGrid) return null;

  let pagination = document.getElementById("productPagination");
  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "productPagination";
    pagination.className = "product-pagination";
    productGrid.insertAdjacentElement("afterend", pagination);
  }

  return pagination;
}

function renderProductPagination(totalPages) {
  const pagination = getProductPagination();
  if (!pagination) return;

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="${page === currentPage ? "active" : ""}" onclick="goToProductPage(${page})">${page}</button>`;
  }).join("");

  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="goToProductPage(${currentPage - 1})">‹</button>
    ${pageButtons}
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="goToProductPage(${currentPage + 1})">›</button>
  `;
}

function goToProductPage(page) {
  currentPage = page;
  renderProducts();
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderProducts() {
  if (!productGrid || !searchInput || !emptyMessage) return;

  const keyword = normalizeText(searchInput.value.trim());

  const sidebarFilters = appliedSidebarFilters;

  const filteredProducts = products.filter((product) => {
    const matchCategory = currentFilter === "Tất cả" || product.category === currentFilter;
    const matchSearch = normalizeText(product.name).includes(keyword);
    const matchPrice = sidebarFilters.priceValue === "all"
      || (() => {
        const [min, max] = sidebarFilters.priceValue.split("-").map(Number);
        return product.price >= min && product.price <= max;
      })();
    const matchColor = sidebarFilters.colors.length === 0
      || sidebarFilters.colors.some((color) => getProductColors(product).includes(color));

    return matchCategory && matchSearch && matchPrice && matchColor;
  });

  productGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    emptyMessage.style.display = "block";
    renderProductPagination(0);
    return;
  }

  emptyMessage.style.display = "none";

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <a class="product-image" href="product-detail.html?id=${product.id}">
        <span class="product-tag">${product.tag}</span>
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button class="action-btn add-btn" onclick="addToCart(${product.id})">🛒 Thêm vào giỏ</button>
          <button class="action-btn quick-btn" onclick="openQuickView(${product.id})">Xem nhanh</button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });

  renderProductPagination(totalPages);
}

filterButtons.forEach((button) => {
  button.classList.toggle("active", button.dataset.filter === currentFilter);

  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    syncCategoryControls(currentFilter);
    currentPage = 1;
    renderProducts();
  });
});

document.querySelectorAll('input[name="sidebarCategory"]').forEach((input) => {
  input.addEventListener("change", () => {
    currentFilter = input.value;
    syncCategoryControls(currentFilter);
  });
});

if (applyProductFiltersBtn) {
  applyProductFiltersBtn.addEventListener("click", () => {
    appliedSidebarFilters = getSidebarFilters();
    currentPage = 1;
    renderProducts();
  });
}

if (clearProductFiltersBtn) {
  clearProductFiltersBtn.addEventListener("click", () => {
    currentFilter = "Tất cả";
    syncCategoryControls(currentFilter);
    resetSidebarFilters();
    appliedSidebarFilters = getSidebarFilters();
    currentPage = 1;
    renderProducts();
  });
}

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    currentFilter = card.dataset.category;
    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
      currentPage = 1;
      renderProducts();
    } else {
      window.location.href = `products.html?category=${encodeURIComponent(currentFilter)}`;
    }
  });
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
  });
}

if (registerForm) {
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
    localStorage.setItem("lunaCurrentUser", JSON.stringify({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: "",
      address: "",
      role: newUser.role
    }));

    setAuthMessage(registerMessage, "Tạo tài khoản thành công.", "success");
    showCenterNotice("Tạo tài khoản thành công. Vui lòng đăng nhập.", "success", () => {
      window.location.href = "login.html";
    });
  });
}

if (loginForm) {
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

    localStorage.setItem("lunaCurrentUser", JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "customer"
    }));

    setAuthMessage(loginMessage, "Đăng nhập thành công.", "success");
    showCenterNotice("Đăng nhập thành công.", "success", () => {
      window.location.href = user.role === "admin" ? "admin.html" : "index.html";
    });
  });
}

function saveCart() {
  localStorage.setItem("lunaCart", JSON.stringify(cart));
}

function getCartKey(productId, size = "", color = "") {
  return `${productId}-${size || "default"}-${color || "default"}`;
}

function addToCart(productId, options = {}) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const size = options.size || "";
  const color = options.color || "";
  const cartKey = getCartKey(productId, size, color);
  const existingItem = cart.find((item) => (item.cartKey || getCartKey(item.id, item.size, item.color)) === cartKey);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, size, color, cartKey, quantity: 1 });
  }

  saveCart();
  renderCart();
  renderCartPage();
  showToast("Đã thêm sản phẩm vào giỏ hàng.");
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalMoney = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartCount) cartCount.textContent = totalQuantity;
  if (cartTotal) cartTotal.textContent = formatMoney(totalMoney);
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Giỏ hàng đang trống.</p>`;
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      const key = item.cartKey || getCartKey(item.id, item.size, item.color);
      const variantText = [item.size ? `Size ${item.size}` : "", item.color ? `Màu ${item.color}` : ""]
        .filter(Boolean)
        .join(" | ");

      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          ${variantText ? `<small>${variantText}</small>` : ""}
          <p>${formatMoney(item.price)}</p>
          <div class="qty-row">
            <button onclick="changeQuantity('${key}', -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity('${key}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart('${key}')">Xóa</button>
          </div>
        </div>
      `;

      cartItems.appendChild(row);
    });
  }
}

function changeQuantity(cartKey, amount) {
  const item = cart.find((cartItem) => (cartItem.cartKey || getCartKey(cartItem.id, cartItem.size, cartItem.color)) === String(cartKey));
  if (!item) return;

  item.quantity += amount;

  if (item.quantity < 1) {
    item.quantity = 1;
    showToast("Số lượng tối thiểu là 1.");
  }

  saveCart();
  renderCart();
  renderCartPage();
}

function removeFromCart(cartKey) {
  cart = cart.filter((item) => (item.cartKey || getCartKey(item.id, item.size, item.color)) !== String(cartKey));
  saveCart();
  renderCart();
  renderCartPage();
  showToast("Đã xóa sản phẩm khỏi giỏ hàng.");
}

function renderCartPage() {
  if (!cartPageItems) return;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  cartPageCount.textContent = `(${totalQuantity} sản phẩm)`;
  cartPageSubtotal.textContent = formatMoney(subtotal);
  cartPageShipping.textContent = formatMoney(shipping);
  cartPageTotal.textContent = formatMoney(total);

  if (cartPageNotice) {
    cartPageNotice.textContent = totalQuantity
      ? `Quý khách đã thêm ${totalQuantity} sản phẩm vào giỏ hàng.`
      : "Giỏ hàng của Quý khách đang trống.";
  }

  if (cart.length === 0) {
    cartPageItems.innerHTML = `
      <div class="cart-page-empty">
        <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
        <a class="btn btn-primary" href="products.html">Tiếp tục mua sắm</a>
      </div>
    `;
    return;
  }

  cartPageItems.innerHTML = cart.map((item) => {
    const key = item.cartKey || getCartKey(item.id, item.size, item.color);
    const itemTotal = item.price * item.quantity;
    return `
      <article class="cart-page-item">
        <div class="cart-check"><input type="checkbox" checked aria-label="Chọn sản phẩm"></div>
        <div class="cart-page-product">
          <a class="cart-page-image" href="product-detail.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}">
          </a>
          <div class="cart-page-info">
            <h3><a href="product-detail.html?id=${item.id}">${item.name}</a></h3>
            <p>SKU: LUNA-${String(item.id).padStart(4, "0")}</p>
            <p>SIZE: ${item.size || "M"} | MÀU SẮC: ${item.color || "Pastel Pink"}</p>
          </div>
        </div>
        <div class="cart-page-price">
          ${item.oldPrice ? `<span>${formatMoney(item.oldPrice)}</span>` : ""}
          <strong>${formatMoney(item.price)}</strong>
        </div>
        <div class="cart-page-qty">
          <button onclick="changeQuantity('${key}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${key}', 1)">+</button>
        </div>
        <div class="cart-page-line-total">
          <strong>${formatMoney(itemTotal)}</strong>
        </div>
        <div class="cart-page-remove">
          <button onclick="removeFromCart('${key}')" aria-label="Xóa ${item.name}">⌫<span>Xóa</span></button>
        </div>
      </article>
    `;
  }).join("");
}

function getOrders() {
  return JSON.parse(localStorage.getItem("lunaOrders")) || [];
}

function saveOrders(orders) {
  localStorage.setItem("lunaOrders", JSON.stringify(orders));
}

function createOrderFromCart() {
  if (cart.length === 0) {
    showToast("Giỏ hàng đang trống.");
    return;
  }

  if (!currentUser) {
    showToast("Vui lòng đăng nhập trước khi thanh toán.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const order = {
    id: Date.now(),
    customerId: currentUser.id,
    customerName: `${currentUser.lastName} ${currentUser.firstName}`,
    email: currentUser.email,
    phone: currentUser.phone || "",
    address: currentUser.address || "",
    items: cart,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "Chờ xử lý",
    createdAt: new Date().toISOString()
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  cart = [];
  saveCart();
  renderCart();
  renderCartPage();
  showCenterNotice("Đặt hàng thành công. Đơn hàng đã được gửi tới admin.", "success");
}

function requireAdminAccess() {
  if (!adminApp) return true;

  if (!currentUser || currentUser.role !== "admin") {
    adminApp.innerHTML = `
      <section class="admin-denied">
        <h1>Không có quyền truy cập</h1>
        <p>Chỉ tài khoản admin mới có thể vào trang quản trị.</p>
        <p><strong>Email:</strong> admin@lunafashion.com<br><strong>Mật khẩu:</strong> admin123</p>
        <a class="btn btn-primary" href="login.html">Đăng nhập admin</a>
      </section>
    `;
    return false;
  }

  return true;
}

function renderAdminStats() {
  if (!adminStats) return;

  const users = getUsers().filter((user) => user.role !== "admin");
  const orders = getOrders();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  adminStats.innerHTML = `
    <article><span>Sản phẩm</span><strong>${products.length}</strong></article>
    <article><span>Khách hàng</span><strong>${users.length}</strong></article>
    <article><span>Đơn hàng</span><strong>${orders.length}</strong></article>
    <article><span>Doanh thu</span><strong>${formatMoney(revenue)}</strong></article>
  `;
}

function renderAdminProducts() {
  if (!adminProductTable) return;

  adminProductTable.innerHTML = products.map((product) => `
    <tr>
      <td><img src="${product.image}" alt="${product.name}"></td>
      <td><strong>${product.name}</strong><small>${product.description}</small></td>
      <td>${product.category}</td>
      <td>${formatMoney(product.price)}</td>
      <td>${product.tag}</td>
      <td>
        <button type="button" onclick="editAdminProduct(${product.id})">Sửa</button>
        <button type="button" onclick="hideAdminProduct(${product.id})">Ẩn</button>
      </td>
    </tr>
  `).join("");
}

function renderAdminCustomers() {
  if (!adminCustomerTable) return;

  const users = getUsers().filter((user) => user.role !== "admin");

  adminCustomerTable.innerHTML = users.length ? users.map((user) => `
    <tr>
      <td>${user.lastName} ${user.firstName}</td>
      <td>${user.email}</td>
      <td>${user.phone || "Chưa cập nhật"}</td>
      <td>${user.address || "Chưa cập nhật"}</td>
      <td>${new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
    </tr>
  `).join("") : `<tr><td colspan="5">Chưa có khách hàng.</td></tr>`;
}

function renderAdminOrders() {
  if (!adminOrderTable) return;

  const orders = getOrders();

  adminOrderTable.innerHTML = orders.length ? orders.map((order) => `
    <tr>
      <td>#${order.id}</td>
      <td><strong>${order.customerName}</strong><small>${order.email}</small></td>
      <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</td>
      <td>${formatMoney(order.total)}</td>
      <td>${order.status}</td>
      <td>${new Date(order.createdAt).toLocaleString("vi-VN")}</td>
    </tr>
  `).join("") : `<tr><td colspan="6">Chưa có đơn hàng.</td></tr>`;
}

function resetAdminProductForm() {
  if (!adminProductForm) return;
  adminProductForm.reset();
  adminProductForm.productId.value = "";
}

function editAdminProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || !adminProductForm) return;

  adminProductForm.productId.value = product.id;
  adminProductForm.productName.value = product.name;
  adminProductForm.productCategory.value = product.category;
  adminProductForm.productPrice.value = product.price;
  adminProductForm.productOldPrice.value = product.oldPrice || "";
  adminProductForm.productImage.value = product.image;
  adminProductForm.productTag.value = product.tag;
  adminProductForm.productDescription.value = product.description;
}

function upsertAdminProduct(product) {
  const state = getProductAdminState();
  const index = state.customProducts.findIndex((item) => item.id === product.id);

  if (index === -1) {
    state.customProducts.push(product);
  } else {
    state.customProducts[index] = product;
  }

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

function initAdminPage() {
  if (!adminApp || !requireAdminAccess()) return;
  renderAdminStats();
  renderAdminProducts();
  renderAdminCustomers();
  renderAdminOrders();

  if (adminProductForm) {
    adminProductForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = Number(adminProductForm.productId.value) || Date.now();
      const product = {
        id,
        name: adminProductForm.productName.value.trim(),
        category: adminProductForm.productCategory.value,
        price: Number(adminProductForm.productPrice.value),
        oldPrice: Number(adminProductForm.productOldPrice.value) || 0,
        image: adminProductForm.productImage.value.trim() || "assets/product-1.svg",
        tag: adminProductForm.productTag.value.trim() || "New",
        description: adminProductForm.productDescription.value.trim()
      };

      if (!product.name || !product.price || !product.description) {
        showToast("Vui lòng nhập đầy đủ tên, giá và mô tả sản phẩm.");
        return;
      }

      upsertAdminProduct(product);
      resetAdminProductForm();
      renderAdminStats();
      renderAdminProducts();
      showToast("Đã lưu sản phẩm.");
    });
  }
}

function openCart() {
  cartDrawer.classList.add("show");
  overlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("show");
  overlay.classList.remove("show");
}

if (cartOpenBtn) {
  cartOpenBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}
if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
if (overlay) {
  overlay.addEventListener("click", () => {
    closeCart();
    closeQuickView();
  });
}

function openQuickView(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || !quickViewBody || !quickModal) return;

  quickViewBody.innerHTML = `
    <div class="quick-view">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
        </div>
        <p>${product.description}</p>
        <button class="btn btn-primary" onclick="addToCart(${product.id}); closeQuickView(); openCart();">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  `;

  quickModal.classList.add("show");
}

function renderProductDetail() {
  if (!detailTitle) return;

  const id = Number(params.get("id")) || 1;
  const product = products.find((item) => item.id === id) || products[0];
  const specs = detailSpecsMap[product.category] || detailSpecsMap["Đầm"];
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  document.title = `${product.name} - Luna Fashion`;
  detailTitle.textContent = product.name;
  detailCategory.textContent = product.category;
  if (detailRouteName) detailRouteName.textContent = product.name;
  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailPrice.textContent = formatMoney(product.price);
  detailOldPrice.textContent = product.oldPrice ? formatMoney(product.oldPrice) : "";
  detailOldPrice.style.display = product.oldPrice ? "inline" : "none";
  detailDescription.textContent = product.description;
  detailSpecs.innerHTML = specs.map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join("");

  const discountBadge = document.getElementById("detailDiscount");
  if (discountBadge) {
    discountBadge.textContent = discount ? `Tiết kiệm ${discount}%` : "Hàng mới";
  }

  document.querySelectorAll(".vertical-thumbs button").forEach((button, index) => {
    const image = index === 0 ? product.image : button.dataset.image;
    button.dataset.image = image;
    const thumbImage = button.querySelector("img");
    if (index === 0 && thumbImage) thumbImage.src = product.image;

    button.addEventListener("click", () => {
      document.querySelectorAll(".vertical-thumbs button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      detailImage.src = button.dataset.image;
    });
  });

  if (colorOptions) {
    colorOptions.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        colorOptions.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  if (sizeOptions) {
    sizeOptions.querySelectorAll("button:not(:disabled)").forEach((button) => {
      button.addEventListener("click", () => {
        sizeOptions.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  detailAddBtn.addEventListener("click", () => {
    const selectedSize = sizeOptions?.querySelector("button.active")?.dataset.size;
    const selectedColor = colorOptions?.querySelector("button.active")?.dataset.color || "Pastel Pink";
    if (!selectedSize) {
      showToast("Vui lòng chọn size trước khi thêm vào giỏ.");
      return;
    }

    addToCart(product.id, { size: selectedSize, color: selectedColor });
    window.location.href = "cart.html";
  });

  if (relatedGrid) {
    const relatedProducts = products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);

    relatedGrid.innerHTML = relatedProducts.map((item) => `
      <article class="product-card">
        <a class="product-image" href="product-detail.html?id=${item.id}">
          <span class="product-tag">${item.tag}</span>
          <img src="${item.image}" alt="${item.name}">
        </a>
        <div class="product-info">
          <span class="product-category">${item.category}</span>
          <h3><a href="product-detail.html?id=${item.id}">${item.name}</a></h3>
          <div class="price-row">
            <span class="price">${formatMoney(item.price)}</span>
            ${item.oldPrice ? `<span class="old-price">${formatMoney(item.oldPrice)}</span>` : ""}
          </div>
          <div class="product-actions">
            <button class="action-btn add-btn" onclick="addToCart(${item.id})">🛒 Thêm vào giỏ</button>
          </div>
        </div>
      </article>
    `).join("");
  }
}

function closeQuickView() {
  if (!quickModal) return;
  quickModal.classList.remove("show");
}

if (quickCloseBtn) quickCloseBtn.addEventListener("click", closeQuickView);

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    formMessage.className = "form-message";

    if (!fullName || !email || !message) {
      formMessage.textContent = "Vui lòng nhập đầy đủ họ tên, email và nội dung.";
      formMessage.classList.add("error");
      return;
    }

    if (!email.includes("@")) {
      formMessage.textContent = "Email chưa đúng định dạng.";
      formMessage.classList.add("error");
      return;
    }

    formMessage.textContent = "Gửi liên hệ thành công. Luna Fashion sẽ phản hồi bạn sớm!";
    formMessage.classList.add("success");
    contactForm.reset();
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Giỏ hàng đang trống.");
      return;
    }

    showToast("Chức năng thanh toán đang được phát triển.");
  });
}

if (checkoutMainBtn) {
  checkoutMainBtn.addEventListener("click", createOrderFromCart);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("show");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("show");
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeQuickView();
  }
});

seedAdminAccount();
normalizeCurrentUserRole();
syncCategoryControls(currentFilter);
updateLoginLinks();
renderProducts();
renderProductDetail();
renderCart();
renderCartPage();
initAdminPage();
