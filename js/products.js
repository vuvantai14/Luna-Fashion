import { formatMoney, initCommonLayout, normalizeText, saveData, getData } from "./common.js";

export const productSeed = [
  ["Đầm hoa pastel", "Đầm", 329000, 420000, "Đầm hoa pastel nhẹ nhàng, phù hợp đi chơi, đi cà phê hoặc dạo phố cuối tuần.", "Sale"],
  ["Đầm dự tiệc đen", "Đầm", 499000, 650000, "Đầm dự tiệc màu đen sang trọng, thiết kế đơn giản nhưng nổi bật.", "Hot"],
  ["Đầm linen cổ vuông", "Đầm", 389000, 480000, "Đầm linen cổ vuông nhẹ mát, phù hợp đi làm, đi chơi và những ngày thời tiết nóng.", "Sale"],
  ["Đầm cổ yếm dự tiệc", "Đầm", 529000, 690000, "Đầm cổ yếm thanh lịch cho tiệc tối, sinh nhật hoặc những buổi hẹn quan trọng.", "Hot"],
  ["Đầm sơ mi thắt eo", "Đầm", 419000, 520000, "Đầm sơ mi thắt eo gọn gàng, dễ mặc đi làm và có thể phối cùng túi mini.", "Sale"],
  ["Đầm satin hai dây", "Đầm", 459000, 560000, "Đầm satin hai dây mềm rũ, thích hợp cho các buổi tiệc tối và hẹn hò.", "Hot"],
  ["Đầm babydoll tay bồng", "Đầm", 379000, 460000, "Đầm babydoll tay bồng tạo dáng trẻ trung, dễ mặc trong những buổi dạo phố.", "New"],
  ["Đầm maxi hoa nhí", "Đầm", 559000, 690000, "Đầm maxi hoa nhí mềm mại, phù hợp du lịch, đi biển hoặc những ngày cuối tuần.", "Sale"],
  ["Áo sơ mi trắng nữ", "Áo", 259000, 0, "Áo sơ mi trắng basic, dễ phối cùng quần jeans, chân váy hoặc quần tây.", "New"],
  ["Áo croptop basic", "Áo", 199000, 0, "Áo croptop basic trẻ trung, chất vải mềm, dễ phối với chân váy hoặc quần jean.", "New"],
  ["Áo blouse tay phồng", "Áo", 289000, 350000, "Áo blouse tay phồng nữ tính, dễ phối cùng chân váy chữ A hoặc quần jeans.", "New"],
  ["Áo thun rib ôm dáng", "Áo", 179000, 0, "Áo thun rib co giãn nhẹ, ôm dáng vừa phải và dễ phối trong outfit hằng ngày.", "New"],
  ["Áo kiểu cổ nơ", "Áo", 299000, 360000, "Áo kiểu cổ nơ tạo điểm nhấn nữ tính, hợp với phong cách công sở nhẹ nhàng.", "New"],
  ["Áo khoác cardigan mỏng", "Áo", 349000, 430000, "Áo khoác cardigan mỏng nhẹ, dễ khoác ngoài váy hai dây hoặc áo basic.", "Sale"],
  ["Áo peplum công sở", "Áo", 319000, 390000, "Áo peplum công sở giúp tôn eo, phù hợp phối cùng chân váy hoặc quần tây.", "Sale"],
  ["Chân váy chữ A", "Váy", 279000, 350000, "Chân váy chữ A tôn dáng, phù hợp phong cách đi học và công sở.", "Sale"],
  ["Váy công sở thanh lịch", "Váy", 369000, 450000, "Váy công sở dáng dài vừa phải, thanh lịch, phù hợp đi làm và gặp khách hàng.", "Sale"],
  ["Chân váy midi xếp ly", "Váy", 319000, 390000, "Chân váy midi xếp ly mềm mại, tạo chuyển động nhẹ nhàng khi di chuyển.", "Sale"],
  ["Váy bút chì công sở", "Váy", 339000, 420000, "Váy bút chì công sở có độ co giãn nhẹ, giúp dáng mặc gọn và thanh lịch.", "Sale"],
  ["Chân váy jean chữ A", "Váy", 309000, 0, "Chân váy jean chữ A trẻ trung, dễ phối với áo thun, sơ mi hoặc croptop.", "New"],
  ["Váy tennis xếp ly", "Váy", 289000, 350000, "Váy tennis xếp ly năng động, phù hợp phong cách trẻ trung khi đi học hoặc dạo phố.", "New"],
  ["Chân váy lụa midi", "Váy", 359000, 450000, "Chân váy lụa midi mềm rũ, dễ phối với áo sơ mi, áo thun hoặc cardigan.", "New"],
  ["Chân váy xếp tầng", "Váy", 399000, 490000, "Chân váy xếp tầng nữ tính, tạo độ bay nhẹ cho outfit đi chơi hoặc dự tiệc.", "Hot"],
  ["Túi xách mini", "Phụ kiện", 229000, 0, "Túi xách mini nữ tính, dễ phối cùng đầm, váy hoặc set công sở.", "New"],
  ["Túi đeo vai pastel", "Phụ kiện", 259000, 320000, "Túi đeo vai pastel nhỏ gọn, phù hợp đi chơi, đi học hoặc phối cùng đầm nhẹ.", "Sale"],
  ["Băng đô ngọc trai", "Phụ kiện", 129000, 0, "Băng đô ngọc trai nhỏ xinh, tạo điểm nhấn nhẹ cho outfit váy hoặc đầm pastel.", "New"],
  ["Khăn lụa họa tiết", "Phụ kiện", 149000, 0, "Khăn lụa họa tiết nhẹ nhàng, có thể buộc cổ, buộc tóc hoặc trang trí túi.", "New"],
  ["Thắt lưng bản nhỏ", "Phụ kiện", 169000, 220000, "Thắt lưng bản nhỏ giúp nhấn eo khi phối cùng đầm, váy hoặc áo blazer.", "Sale"]
];

export let products = productSeed.map(([name, category, price, oldPrice, description, tag], index) => ({
  id: index + 1,
  name,
  category,
  price,
  oldPrice,
  image: `../assets/product-${index + 1}.jpg`,
  description,
  tag
}));

export const defaultProducts = products.map((product) => ({ ...product }));
export const PRODUCT_ADMIN_STATE_VERSION = "manual-assets-v1";

let currentFilter = new URLSearchParams(window.location.search).get("category") || "Tất cả";
let currentPage = 1;
let appliedSidebarFilters = { priceValue: "all", colors: [] };
const productsPerPage = window.location.pathname.endsWith("products.html") ? 8 : 10;

export function getProductAdminState() {
  const savedState = getData("lunaProductAdminState", {});

  if (savedState.version !== PRODUCT_ADMIN_STATE_VERSION) {
    const customOnly = (savedState.customProducts || []).filter((product) => product.id > defaultProducts.length);
    const freshState = {
      version: PRODUCT_ADMIN_STATE_VERSION,
      customProducts: customOnly,
      hiddenProductIds: []
    };
    saveProductAdminState(freshState);
    return freshState;
  }

  return {
    version: PRODUCT_ADMIN_STATE_VERSION,
    customProducts: savedState.customProducts || [],
    hiddenProductIds: savedState.hiddenProductIds || []
  };
}

export function saveProductAdminState(state) {
  saveData("lunaProductAdminState", state);
}

export function refreshProductsFromAdminState() {
  const state = getProductAdminState();
  const customById = new Map(state.customProducts.map((product) => [product.id, product]));
  const hiddenIds = new Set(state.hiddenProductIds);
  const mergedDefaults = defaultProducts
    .filter((product) => !hiddenIds.has(product.id))
    .map((product) => customById.get(product.id) || product);
  const customOnly = state.customProducts.filter((product) => !defaultProducts.some((item) => item.id === product.id));

  products = [...mergedDefaults, ...customOnly].filter((product) => !hiddenIds.has(product.id));
}

export function getProductById(productId) {
  refreshProductsFromAdminState();
  return products.find((item) => Number(item.id) === Number(productId));
}

export function getProductColors(product) {
  const colorsByCategory = {
    "Đầm": ["Pastel Pink", "Ivory", "Black"],
    "Áo": ["Ivory", "Pastel Pink", "Beige"],
    "Váy": ["Black", "Beige", "Pastel Pink"],
    "Phụ kiện": ["Pastel Pink", "Ivory", "Beige"]
  };
  return colorsByCategory[product.category] || ["Pastel Pink"];
}

export function getProductSizes() {
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
  document.querySelectorAll(".filter-btn").forEach((btn) => {
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

function interleaveProductsByCategory(productList) {
  const categoryOrder = ["Đầm", "Áo", "Váy", "Phụ kiện"];
  const groups = categoryOrder.map((category) => productList.filter((product) => product.category === category));
  const mixedProducts = [];
  let index = 0;

  while (groups.some((group) => index < group.length)) {
    groups.forEach((group) => {
      if (group[index]) mixedProducts.push(group[index]);
    });
    index += 1;
  }

  return mixedProducts;
}

function getProductPagination(productGrid) {
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
  const productGrid = document.getElementById("productGrid");
  const pagination = getProductPagination(productGrid);
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

export function goToProductPage(page) {
  currentPage = page;
  renderProducts();
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function renderProducts() {
  refreshProductsFromAdminState();
  const productGrid = document.getElementById("productGrid");
  const emptyMessage = document.getElementById("emptyMessage");
  const searchInput = document.getElementById("searchInput");
  if (!productGrid || !searchInput || !emptyMessage) return;

  const keyword = normalizeText(searchInput.value.trim());
  const filteredProducts = products.filter((product) => {
    const matchCategory = currentFilter === "Tất cả" || product.category === currentFilter;
    const matchSearch = normalizeText(product.name).includes(keyword);
    const matchPrice = appliedSidebarFilters.priceValue === "all"
      || (() => {
        const [min, max] = appliedSidebarFilters.priceValue.split("-").map(Number);
        return product.price >= min && product.price <= max;
      })();
    const matchColor = appliedSidebarFilters.colors.length === 0
      || appliedSidebarFilters.colors.some((color) => getProductColors(product).includes(color));

    return matchCategory && matchSearch && matchPrice && matchColor;
  });

  productGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    emptyMessage.style.display = "block";
    renderProductPagination(0);
    return;
  }

  emptyMessage.style.display = "none";

  const displayProducts = currentFilter === "Tất cả"
    ? interleaveProductsByCategory(filteredProducts)
    : filteredProducts;
  const totalPages = Math.ceil(displayProducts.length / productsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * productsPerPage;
  displayProducts.slice(startIndex, startIndex + productsPerPage).forEach((product) => {
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

export function initProductFilters() {
  syncCategoryControls(currentFilter);

  document.querySelectorAll(".filter-btn").forEach((button) => {
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

  document.getElementById("applyProductFilters")?.addEventListener("click", () => {
    appliedSidebarFilters = getSidebarFilters();
    currentPage = 1;
    renderProducts();
  });

  document.getElementById("clearProductFilters")?.addEventListener("click", () => {
    currentFilter = "Tất cả";
    syncCategoryControls(currentFilter);
    resetSidebarFilters();
    appliedSidebarFilters = getSidebarFilters();
    currentPage = 1;
    renderProducts();
  });

  document.getElementById("searchInput")?.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
  });
}

export function initCategoryCards() {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentFilter = card.dataset.category;
      syncCategoryControls(currentFilter);
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
}

export function initProductsPage() {
  initCommonLayout();
  initProductFilters();
  initCategoryCards();
  renderProducts();
  import("./cart.js").then(({ initCartControls }) => initCartControls());
}

window.goToProductPage = goToProductPage;

if (document.getElementById("productGrid")) {
  initProductsPage();
}
