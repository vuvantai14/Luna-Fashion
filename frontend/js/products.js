import { apiRequest, resolveAssetUrl } from "./api.js";
import { formatMoney, getData, initCommonLayout, normalizeText, pageUrl, saveData, showToast } from "./common.js";

export let productCategories = [
  { id: 1, name: "Ao bong da", slug: "ao-bong-da" },
  { id: 2, name: "Quan bong da", slug: "quan-bong-da" },
  { id: 3, name: "Bo do bong da", slug: "bo-do-bong-da" },
  { id: 4, name: "Do tap bong da", slug: "do-tap-bong-da" },
  { id: 5, name: "Phu kien", slug: "phu-kien" }
];

export const genderLabels = {
  MALE: "Nam",
  FEMALE: "Nu",
  UNISEX: "Unisex"
};

const fallbackNames = [
  ["Ao bong da san nha nam 2026", "ao-bong-da-san-nha-nam-2026", "MALE", 1],
  ["Ao bong da san khach nam 2026", "ao-bong-da-san-khach-nam-2026", "MALE", 1],
  ["Ao thu mon nam phan quang", "ao-thu-mon-nam-phan-quang", "MALE", 1],
  ["Ao bong da nu san nha 2026", "ao-bong-da-nu-san-nha-2026", "FEMALE", 1],
  ["Ao bong da nu co tim", "ao-bong-da-nu-co-tim", "FEMALE", 1],
  ["Ao bong da tre em xanh san co", "ao-bong-da-tre-em-xanh-san-co", "UNISEX", 1],
  ["Ao bong da unisex form rong", "ao-bong-da-unisex-form-rong", "UNISEX", 1],
  ["Ao polo the thao Ni Sport", "ao-polo-the-thao-ni-sport", "UNISEX", 1],
  ["Ao tap compression tay dai", "ao-tap-compression-tay-dai", "UNISEX", 4],
  ["Ao bib tap luyen doi bong", "ao-bib-tap-luyen-doi-bong", "UNISEX", 4],
  ["Quan bong da nam basic", "quan-bong-da-nam-basic", "MALE", 2],
  ["Quan bong da nam tui khoa", "quan-bong-da-nam-tui-khoa", "MALE", 2],
  ["Quan bong da nu dang gon", "quan-bong-da-nu-dang-gon", "FEMALE", 2],
  ["Quan short tap gym bong da", "quan-short-tap-gym-bong-da", "UNISEX", 4],
  ["Quan jogger the thao Ni Sport", "quan-jogger-the-thao-ni-sport", "UNISEX", 4],
  ["Bo do bong da nam do den", "bo-do-bong-da-nam-do-den", "MALE", 3],
  ["Bo do bong da nam xanh navy", "bo-do-bong-da-nam-xanh-navy", "MALE", 3],
  ["Bo do bong da nu trang xanh", "bo-do-bong-da-nu-trang-xanh", "FEMALE", 3],
  ["Bo do bong da nu hong den", "bo-do-bong-da-nu-hong-den", "FEMALE", 3],
  ["Bo do bong da unisex toi gian", "bo-do-bong-da-unisex-toi-gian", "UNISEX", 3],
  ["Bo do bong da tre em vang xanh", "bo-do-bong-da-tre-em-vang-xanh", "UNISEX", 3],
  ["Bo do thu mon nam cam den", "bo-do-thu-mon-nam-cam-den", "MALE", 3],
  ["Bo do thu mon unisex xanh la", "bo-do-thu-mon-unisex-xanh-la", "UNISEX", 3],
  ["Set training unisex xam den", "set-training-unisex-xam-den", "UNISEX", 4],
  ["Ao khoac gio bong da unisex", "ao-khoac-gio-bong-da-unisex", "UNISEX", 4],
  ["Ao khoac training nam", "ao-khoac-training-nam", "MALE", 4],
  ["Ao khoac training nu", "ao-khoac-training-nu", "FEMALE", 4],
  ["Quan dai training unisex", "quan-dai-training-unisex", "UNISEX", 4],
  ["Ao giu nhiet bong da", "ao-giu-nhiet-bong-da", "UNISEX", 4],
  ["Tat bong da chong truot", "tat-bong-da-chong-truot", "UNISEX", 5],
  ["Tat bong da co cao", "tat-bong-da-co-cao", "UNISEX", 5],
  ["Boc ong dong thi dau", "boc-ong-dong-thi-dau", "UNISEX", 5],
  ["Gang tay thu mon basic", "gang-tay-thu-mon-basic", "UNISEX", 5],
  ["Gang tay thu mon pro grip", "gang-tay-thu-mon-pro-grip", "UNISEX", 5],
  ["Bang doi truong", "bang-doi-truong", "UNISEX", 5],
  ["Bang co chan the thao", "bang-co-chan-the-thao", "UNISEX", 5],
  ["Tui dung giay bong da", "tui-dung-giay-bong-da", "UNISEX", 5],
  ["Tui trong the thao Ni Sport", "tui-trong-the-thao-ni-sport", "UNISEX", 5],
  ["Binh nuoc the thao 750ml", "binh-nuoc-the-thao-750ml", "UNISEX", 5],
  ["Khan the thao nhanh kho", "khan-the-thao-nhanh-kho", "UNISEX", 5],
  ["Non luoi trai the thao", "non-luoi-trai-the-thao", "UNISEX", 5],
  ["Day khang luc tap chan", "day-khang-luc-tap-chan", "UNISEX", 4],
  ["Thang day tap toc do", "thang-day-tap-toc-do", "UNISEX", 4],
  ["Coc tieu tap luyen bo 10", "coc-tieu-tap-luyen-bo-10", "UNISEX", 4],
  ["Bong da tap luyen size 5", "bong-da-tap-luyen-size-5", "UNISEX", 5],
  ["Bong futsal size 4", "bong-futsal-size-4", "UNISEX", 5],
  ["Bom bong mini", "bom-bong-mini", "UNISEX", 5],
  ["Kim bom bong bo 5", "kim-bom-bong-bo-5", "UNISEX", 5],
  ["Ao co vu Ni Sport", "ao-co-vu-ni-sport", "UNISEX", 1],
  ["Combo thi dau doi bong 5 nguoi", "combo-thi-dau-doi-bong-5-nguoi", "UNISEX", 3]
];

export const productSeed = fallbackNames.map(([name, slug, gender, categoryId], index) => [
  name,
  slug,
  gender,
  categoryId,
  99000 + ((index + 2) * 17000),
  index % 3 === 0 ? 149000 + ((index + 2) * 18000) : 0,
  `${name} chat lieu the thao thoang khi, phu hop tap luyen va thi dau phong trao.`,
  ["HOT", "NEW", "SALE", "BASIC"][index % 4]
]);

function getCategoryName(categoryId) {
  return productCategories.find((category) => Number(category.id) === Number(categoryId))?.name || "San pham";
}

function buildFallbackVariants(product) {
  const isAccessory = Number(product.categoryId) === 5;
  const sizes = isAccessory ? ["FREE_SIZE"] : ["S", "M", "L", "XL"];
  const colors = isAccessory ? ["Black", "White", "Beige", "Brown"] : ["Black", "White", "Beige"];
  return sizes.flatMap((size, sizeIndex) => colors.map((color, colorIndex) => ({
    id: Number(`${product.id}${sizeIndex + 1}${colorIndex + 1}`),
    productId: product.id,
    size,
    color,
    stock: 10 + ((product.id * 7 + sizeIndex * 5 + colorIndex * 3) % 41),
    sku: `NI-${String(product.id).padStart(3, "0")}-${size}-${color.toUpperCase()}`,
    price: product.price
  })));
}

export function getProductImagePath(productId) {
  return resolveAssetUrl(`assets/products/product-${productId}.jpg`);
}

export function getDisplayImagePath(productId) {
  return resolveAssetUrl(`assets/products/product-${productId}.jpg`);
}

export function handleProductImageError(image, productId = 1) {
  if (!image || image.dataset.fallbackApplied === "true") return;
  image.dataset.fallbackApplied = "true";
  image.src = resolveAssetUrl(`assets/product-${Math.min(Number(productId) || 1, 28)}.jpg`);
}

function normalizeProduct(product) {
  const categoryId = product.categoryId || product.category?.id || 1;
  const thumbnailUrl = product.thumbnailUrl || product.imageUrl || product.image_url || getProductImagePath(product.id);
  const variants = product.variants || [];
  return {
    ...product,
    categoryId,
    categoryName: product.categoryName || product.category?.name || getCategoryName(categoryId),
    category: product.categoryName || product.category?.name || getCategoryName(categoryId),
    oldPrice: product.oldPrice || 0,
    thumbnailUrl,
    image: resolveAssetUrl(thumbnailUrl, getDisplayImagePath(product.id)),
    image_url: thumbnailUrl,
    tag: product.tag || "NEW",
    tagLabel: product.tag || "NEW",
    status: product.status || "SELLING",
    totalStock: product.totalStock ?? variants.reduce((sum, item) => sum + Number(item.stock || 0), 0),
    variants
  };
}

export let products = productSeed.map(([name, slug, gender, categoryId, price, oldPrice, description, tag], index) => {
  const product = normalizeProduct({
    id: index + 1,
    name,
    slug,
    gender,
    categoryId,
    price,
    oldPrice,
    description,
    tag,
    thumbnailUrl: getProductImagePath(index + 1)
  });
  product.variants = buildFallbackVariants(product);
  product.totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  return product;
});

export let productImages = products.map((product) => ({
  id: product.id,
  productId: product.id,
  image_url: product.thumbnailUrl,
  is_thumbnail: true,
  sort_order: 1
}));

export let productVariants = products.flatMap((product) => product.variants);
export let defaultProducts = products.map((product) => ({ ...product, variants: [...product.variants] }));
export const PRODUCT_ADMIN_STATE_VERSION = "ni-sport-api-v1";

const params = new URLSearchParams(window.location.search);
let currentGender = params.get("gender") || "ALL";
let currentCategoryId = params.get("categoryId") || "all";
let currentPage = Number(params.get("page")) + 1 || 1;
let lastTotalPages = 1;
let isUsingApiProducts = false;
let appliedSidebarFilters = {
  categoryId: currentCategoryId,
  priceValue: "all",
  colors: [],
  sizes: []
};
const productsPerPage = window.location.pathname.endsWith("products.html") ? 8 : 10;

export function getProductAdminState() {
  const savedState = getData("niSportProductAdminState", {});
  if (savedState.version !== PRODUCT_ADMIN_STATE_VERSION) {
    const freshState = { version: PRODUCT_ADMIN_STATE_VERSION, customProducts: [], hiddenProductIds: [] };
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
  saveData("niSportProductAdminState", state);
}

export function refreshProductsFromAdminState() {
  if (isUsingApiProducts) return;
  const state = getProductAdminState();
  const customById = new Map(state.customProducts.map((product) => [product.id, normalizeProduct(product)]));
  const hiddenIds = new Set(state.hiddenProductIds);
  const mergedDefaults = defaultProducts
    .filter((product) => !hiddenIds.has(product.id))
    .map((product) => customById.get(product.id) || product);
  const customOnly = state.customProducts
    .filter((product) => !defaultProducts.some((item) => item.id === product.id))
    .map(normalizeProduct);
  products = [...mergedDefaults, ...customOnly].filter((product) => !hiddenIds.has(product.id));
}

export function getProductById(productId) {
  refreshProductsFromAdminState();
  return products.find((item) => Number(item.id) === Number(productId));
}

export function getProductColors(product) {
  return [...new Set((product?.variants || []).map((variant) => variant.color).filter(Boolean))];
}

export function getProductSizes(product) {
  return [...new Set((product?.variants || []).map((variant) => variant.size).filter(Boolean))];
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getSidebarFilters() {
  const categoryId = document.querySelector('input[name="sidebarCategory"]:checked')?.value || "all";
  const priceValue = document.querySelector('input[name="priceFilter"]:checked')?.value || "all";
  return {
    categoryId,
    priceValue,
    colors: getCheckedValues("colorFilter"),
    sizes: getCheckedValues("sizeFilter")
  };
}

function syncFilterControls() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn.dataset.categoryId !== undefined) {
      btn.classList.toggle("active", String(btn.dataset.categoryId) === String(appliedSidebarFilters.categoryId || "all"));
      return;
    }
    btn.classList.toggle("active", btn.dataset.gender === currentGender);
  });
  document.querySelectorAll('input[name="sidebarCategory"]').forEach((input) => {
    input.checked = input.value === String(appliedSidebarFilters.categoryId || "all");
  });
}

function resetSidebarFilters() {
  document.querySelector('input[name="priceFilter"][value="all"]')?.click();
  document.querySelectorAll('input[name="colorFilter"], input[name="sizeFilter"]').forEach((input) => {
    input.checked = false;
  });
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
  lastTotalPages = totalPages;

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="${page === currentPage ? "active" : ""}" onclick="goToProductPage(${page})">${page}</button>`;
  }).join("");

  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="goToProductPage(${currentPage - 1})">&lt;</button>
    ${pageButtons}
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="goToProductPage(${currentPage + 1})">&gt;</button>
  `;
}

function renderCategoryFilters() {
  const checked = appliedSidebarFilters.categoryId || "all";
  const firstCategoryInput = document.querySelector('input[name="sidebarCategory"]');
  const filterGroup = firstCategoryInput?.closest(".filter-group");
  if (!filterGroup) return;

  const title = filterGroup.querySelector("h4")?.outerHTML || "<h4>Loai san pham</h4>";
  const labels = [
    `<label><input type="radio" name="sidebarCategory" value="all" ${checked === "all" ? "checked" : ""}> Tat ca</label>`,
    ...productCategories.map((category) => `
      <label><input type="radio" name="sidebarCategory" value="${category.id}" ${String(category.id) === String(checked) ? "checked" : ""}> ${category.name}</label>
    `)
  ].join("");
  filterGroup.innerHTML = `${title}${labels}`;
}

function getPriceRange() {
  if (appliedSidebarFilters.priceValue === "all") return {};
  const [minPrice, maxPrice] = appliedSidebarFilters.priceValue.split("-").map(Number);
  return { minPrice, maxPrice };
}

function getApiProductQuery() {
  const searchInput = document.getElementById("productSearchInput") || document.getElementById("searchInput");
  const query = new URLSearchParams();
  const keyword = searchInput?.value?.trim();
  const price = getPriceRange();

  if (keyword) query.set("keyword", keyword);
  if (currentGender !== "ALL") query.set("gender", currentGender);
  if (appliedSidebarFilters.categoryId !== "all") query.set("categoryId", appliedSidebarFilters.categoryId);
  if (appliedSidebarFilters.colors.length) query.set("color", appliedSidebarFilters.colors[0]);
  if (appliedSidebarFilters.sizes.length) query.set("size", appliedSidebarFilters.sizes[0]);
  if (price.minPrice !== undefined) query.set("minPrice", price.minPrice);
  if (price.maxPrice !== undefined) query.set("maxPrice", price.maxPrice);
  query.set("page", Math.max(currentPage - 1, 0));
  query.set("size", productsPerPage);
  return query;
}

async function loadCategoriesFromApi() {
  try {
    const categories = await apiRequest("/categories", { auth: false });
    if (Array.isArray(categories) && categories.length) {
      productCategories = categories;
      renderCategoryFilters();
      return true;
    }
  } catch {
    renderCategoryFilters();
  }
  return false;
}

async function loadProductsFromApi() {
  const query = getApiProductQuery();
  const pageData = await apiRequest(`/products?${query.toString()}`, { auth: false });
  const content = Array.isArray(pageData) ? pageData : pageData?.content || [];
  const normalized = content.map(normalizeProduct);
  products = normalized;
  isUsingApiProducts = true;
  productImages = products.map((product) => ({ id: product.id, productId: product.id, image_url: product.thumbnailUrl, is_thumbnail: true, sort_order: 1 }));
  productVariants = products.flatMap((product) => product.variants || []);
  return {
    items: normalized,
    totalPages: Array.isArray(pageData) ? Math.ceil(normalized.length / productsPerPage) : pageData?.totalPages || 1,
    totalItems: Array.isArray(pageData) ? normalized.length : pageData?.totalElements ?? normalized.length
  };
}

function getLocalFilteredProducts() {
  refreshProductsFromAdminState();
  const searchInput = document.getElementById("searchInput");
  const keyword = normalizeText(searchInput?.value?.trim() || "");
  return products.filter((product) => {
    const matchGender = currentGender === "ALL" || product.gender === currentGender;
    const matchCategory = appliedSidebarFilters.categoryId === "all" || Number(product.categoryId) === Number(appliedSidebarFilters.categoryId);
    const matchSearch = !keyword || normalizeText(`${product.name} ${product.categoryName} ${product.description}`).includes(keyword);
    const matchPrice = appliedSidebarFilters.priceValue === "all" || (() => {
      const [min, max] = appliedSidebarFilters.priceValue.split("-").map(Number);
      return product.price >= min && product.price <= max;
    })();
    const matchColor = appliedSidebarFilters.colors.length === 0 || appliedSidebarFilters.colors.some((color) => getProductColors(product).includes(color));
    const matchSize = appliedSidebarFilters.sizes.length === 0 || appliedSidebarFilters.sizes.some((size) => getProductSizes(product).includes(size));
    return matchGender && matchCategory && matchSearch && matchPrice && matchColor && matchSize && product.status !== "HIDDEN";
  });
}

function createProductCard(product) {
  const card = document.createElement("article");
  const disabled = product.status === "STOPPED" || product.status === "HIDDEN" || product.status === "OUT_OF_STOCK";
  const rating = (4.4 + ((Number(product.id) || 1) % 5) / 10).toFixed(1);
  const stockText = Number(product.totalStock || 0) > 0 ? `Con ${product.totalStock} san pham` : "Tam het hang";
  card.className = "product-card";
  card.innerHTML = `
    <a class="product-image" href="${pageUrl("product-detail.html")}?id=${product.id}">
      <span class="product-tag">${product.tagLabel || product.tag || "NEW"}</span>
      <img src="${product.image}" alt="${product.name}">
    </a>
    <div class="product-info">
      <span class="product-category">${genderLabels[product.gender] || product.gender || "Unisex"} / ${product.categoryName}</span>
      <h3><a href="${pageUrl("product-detail.html")}?id=${product.id}">${product.name}</a></h3>
      <div class="product-rating" aria-label="Danh gia ${rating} tren 5">
        <span>★★★★★</span>
        <strong>${rating}</strong>
        <small>${stockText}</small>
      </div>
      <div class="price-row">
        <span class="price">${formatMoney(product.price)}</span>
        ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
      </div>
      <div class="product-actions">
        <a class="action-btn quick-btn" href="${pageUrl("product-detail.html")}?id=${product.id}">Chi tiet</a>
        <button class="action-btn add-btn" ${disabled ? "disabled" : ""} onclick="addToCart(${product.id})">${disabled ? "Tam het" : "Them gio"}</button>
      </div>
    </div>
  `;
  card.querySelector("img")?.addEventListener("error", (event) => handleProductImageError(event.currentTarget, product.id));
  return card;
}

function getSortValue() {
  return document.getElementById("productSortSelect")?.value || "featured";
}

function sortProductItems(items) {
  const sortValue = getSortValue();
  const sorted = [...items];
  if (sortValue === "price-asc") sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  if (sortValue === "price-desc") sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  if (sortValue === "name-asc") sorted.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi"));
  return sorted;
}

function updateProductResultCount(totalItems, shownItems) {
  const resultCount = document.getElementById("productResultCount");
  if (!resultCount) return;
  const total = Number(totalItems || 0);
  const shown = Number(shownItems || 0);
  resultCount.textContent = total > shown ? `Dang hien thi ${shown} / ${total} san pham` : `${shown} san pham phu hop`;
}

export async function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  const emptyMessage = document.getElementById("emptyMessage");
  if (!productGrid || !emptyMessage) return;

  productGrid.innerHTML = `<div class="product-loading">Dang tai san pham...</div>`;
  emptyMessage.style.display = "none";

  try {
    const { items, totalPages, totalItems } = await loadProductsFromApi();
    const visibleItems = sortProductItems(items);
    productGrid.innerHTML = "";
    updateProductResultCount(totalItems, visibleItems.length);
    if (visibleItems.length === 0) {
      emptyMessage.textContent = "Khong tim thay san pham phu hop.";
      emptyMessage.style.display = "block";
      renderProductPagination(0);
      return;
    }
    visibleItems.forEach((product) => productGrid.appendChild(createProductCard(product)));
    renderProductPagination(totalPages);
  } catch (error) {
    isUsingApiProducts = false;
    const filteredProducts = sortProductItems(getLocalFilteredProducts());
    productGrid.innerHTML = "";
    updateProductResultCount(filteredProducts.length, Math.min(filteredProducts.length, productsPerPage));
    if (filteredProducts.length === 0) {
      emptyMessage.textContent = "Khong tim thay san pham phu hop.";
      emptyMessage.style.display = "block";
      renderProductPagination(0);
      return;
    }
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * productsPerPage;
    filteredProducts.slice(startIndex, startIndex + productsPerPage).forEach((product) => productGrid.appendChild(createProductCard(product)));
    emptyMessage.textContent = "Backend chua san sang, dang hien thi du lieu mau.";
    emptyMessage.style.display = "block";
    renderProductPagination(totalPages);
  }
}

export function goToProductPage(page) {
  currentPage = Math.min(Math.max(page, 1), Math.max(lastTotalPages, 1));
  renderProducts();
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initProductFilters() {
  syncFilterControls();
  document.querySelectorAll(".filter-btn").forEach((button) => {
    if (button.dataset.categoryId !== undefined) {
      button.classList.toggle("active", String(button.dataset.categoryId) === String(appliedSidebarFilters.categoryId || "all"));
    } else {
      button.classList.toggle("active", button.dataset.gender === currentGender);
    }
    button.addEventListener("click", () => {
      if (button.dataset.gender !== undefined) currentGender = button.dataset.gender || "ALL";
      if (button.dataset.categoryId !== undefined) appliedSidebarFilters.categoryId = button.dataset.categoryId || "all";
      syncFilterControls();
      currentPage = 1;
      renderProducts();
    });
  });

  document.addEventListener("change", (event) => {
    if (event.target?.name === "sidebarCategory") {
      appliedSidebarFilters.categoryId = event.target.value;
      syncFilterControls();
    }
  });

  document.getElementById("applyProductFilters")?.addEventListener("click", () => {
    appliedSidebarFilters = getSidebarFilters();
    currentPage = 1;
    renderProducts();
  });

  document.getElementById("clearProductFilters")?.addEventListener("click", () => {
    currentGender = "ALL";
    appliedSidebarFilters.categoryId = "all";
    resetSidebarFilters();
    appliedSidebarFilters = getSidebarFilters();
    syncFilterControls();
    currentPage = 1;
    renderProducts();
  });

  const handleSearchInput = () => {
    currentPage = 1;
    renderProducts();
  };

  document.getElementById("searchInput")?.addEventListener("input", () => {
    const sidebarSearch = document.getElementById("productSearchInput");
    if (sidebarSearch) sidebarSearch.value = document.getElementById("searchInput")?.value || "";
    handleSearchInput();
  });
  document.getElementById("productSearchInput")?.addEventListener("input", handleSearchInput);
  document.getElementById("productSortSelect")?.addEventListener("change", () => renderProducts());
}

export function initCategoryCards() {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentGender = card.dataset.gender || "ALL";
      appliedSidebarFilters.categoryId = card.dataset.categoryId || "all";
      syncFilterControls();
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
        currentPage = 1;
        renderProducts();
      } else {
        const query = new URLSearchParams();
        if (currentGender !== "ALL") query.set("gender", currentGender);
        if (appliedSidebarFilters.categoryId !== "all") query.set("categoryId", appliedSidebarFilters.categoryId);
        window.location.href = `${pageUrl("products.html")}?${query.toString()}`;
      }
    });
  });
}

export async function initProductsPage() {
  initCommonLayout();
  initProductFilters();
  initCategoryCards();
  await loadCategoriesFromApi();
  await renderProducts();
  import("./cart.js").then(({ initCartControls }) => initCartControls());
}

window.goToProductPage = goToProductPage;

if (document.getElementById("productGrid")) {
  initProductsPage();
}
