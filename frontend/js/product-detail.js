import { apiRequest, resolveAssetUrl } from "./api.js";
import { formatMoney, initCommonLayout, pageUrl, showToast } from "./common.js";
import { addToCart, initCartControls } from "./cart.js";
import {
  genderLabels,
  getProductById,
  getProductColors,
  getProductSizes,
  handleProductImageError,
  products,
  refreshProductsFromAdminState
} from "./products.js";

const detailSpecsMap = {
  "Ao bong da": [
    ["Chat lieu", "Vai the thao thoang khi"],
    ["Form", "Regular fit, de van dong"],
    ["Tinh nang", "Nhanh kho, nhe, han che bam mo hoi"],
    ["Phu hop", "Thi dau, tap luyen, co vu"],
    ["Bao quan", "Giat mat trai, khong say nhiet cao"]
  ],
  "Quan bong da": [
    ["Chat lieu", "Poly the thao nhe"],
    ["Form", "Lung thun, day rut chac"],
    ["Tinh nang", "Co gian, thoat mo hoi"],
    ["Phu hop", "San 5, san 7, tap luyen"],
    ["Bao quan", "Giat may che do nhe"]
  ],
  "Bo do bong da": [
    ["Bao gom", "Ao thi dau va quan dong bo"],
    ["Chat lieu", "Vai the thao nhanh kho"],
    ["Tinh nang", "De in ten so"],
    ["Phu hop", "Doi bong, nhom ban, giai phong trao"],
    ["Bao quan", "Khong dung chat tay manh"]
  ],
  "Do tap bong da": [
    ["Chat lieu", "Vai co gian linh hoat"],
    ["Form", "Gon, ho tro van dong"],
    ["Tinh nang", "Ho tro training, gym, khoi dong"],
    ["Phu hop", "Tap the luc va di chuyen den san"],
    ["Bao quan", "Phoi noi thoang mat"]
  ],
  "Phu kien": [
    ["Ung dung", "Ho tro thi dau va tap luyen"],
    ["Kich thuoc", "Tuy mau san pham"],
    ["Tinh nang", "Gon nhe, de mang ra san"],
    ["Phu hop", "Cau thu phong trao va doi bong"],
    ["Bao quan", "Giu kho sau khi su dung"]
  ]
};

function bindProductImage(image, productId) {
  image?.addEventListener("error", () => handleProductImageError(image, productId));
}

function normalizeDetailProduct(product) {
  if (!product) return null;
  const categoryName = product.categoryName || product.category?.name || "Ao bong da";
  const thumbnail = product.thumbnailUrl || product.images?.find((item) => item.isThumbnail)?.imageUrl || product.images?.[0]?.imageUrl || `assets/products/product-${product.id}.jpg`;
  const images = product.images?.length ? product.images : [{ id: product.id, imageUrl: thumbnail, isThumbnail: true, sortOrder: 1 }];
  return {
    ...product,
    categoryId: product.categoryId || product.category?.id || 1,
    categoryName,
    category: product.category || null,
    oldPrice: product.oldPrice || 0,
    tag: product.tag || "NEW",
    status: product.status || "SELLING",
    totalStock: product.totalStock ?? (product.variants || []).reduce((sum, item) => sum + Number(item.stock || 0), 0),
    thumbnailUrl: thumbnail,
    image: resolveAssetUrl(thumbnail, `assets/products/product-${product.id}.jpg`),
    images,
    variants: product.variants || []
  };
}

async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const slug = params.get("slug");

  try {
    const endpoint = slug ? `/products/slug/${encodeURIComponent(slug)}` : `/products/${Number(id) || 1}`;
    return normalizeDetailProduct(await apiRequest(endpoint, { auth: false }));
  } catch {
    refreshProductsFromAdminState();
    return normalizeDetailProduct(getProductById(id) || products[0]);
  }
}

async function loadRelatedProducts(product) {
  try {
    const related = await apiRequest(`/products/${product.id}/related`, { auth: false });
    return (related || []).map((item) => ({
      ...item,
      image: resolveAssetUrl(item.thumbnailUrl, `assets/products/product-${item.id}.jpg`)
    }));
  } catch {
    return products
      .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
      .slice(0, 4);
  }
}

export async function renderRelatedProducts(product, relatedGrid) {
  const relatedProducts = await loadRelatedProducts(product);
  relatedGrid.innerHTML = relatedProducts.map((item) => `
    <article class="product-card">
      <a class="product-image" href="${pageUrl("product-detail.html")}?id=${item.id}">
        <span class="product-tag">${item.tagLabel || item.tag || "NEW"}</span>
        <img data-product-img data-product-id="${item.id}" src="${item.image}" alt="${item.name}">
      </a>
      <div class="product-info">
        <span class="product-category">${genderLabels[item.gender] || item.gender || "Unisex"} / ${item.categoryName}</span>
        <h3><a href="${pageUrl("product-detail.html")}?id=${item.id}">${item.name}</a></h3>
        <div class="price-row">
          <span class="price">${formatMoney(item.price)}</span>
          ${item.oldPrice ? `<span class="old-price">${formatMoney(item.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <a class="action-btn add-btn" href="${pageUrl("product-detail.html")}?id=${item.id}">Xem chi tiet</a>
        </div>
      </div>
    </article>
  `).join("");
  relatedGrid.querySelectorAll("[data-product-img]").forEach((image) => bindProductImage(image, image.dataset.productId));
}

function renderGallery(product, detailImage) {
  const thumbs = document.querySelector(".vertical-thumbs");
  const images = [...product.images]
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .map((image) => resolveAssetUrl(image.imageUrl || image.image_url, product.image));

  if (detailImage) {
    detailImage.src = images[0] || product.image;
    detailImage.alt = product.name;
    bindProductImage(detailImage, product.id);
  }
  if (!thumbs) return;

  thumbs.innerHTML = images.map((image, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button" data-image="${image}">
      <img src="${image}" alt="${product.name}">
    </button>
  `).join("");

  thumbs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      thumbs.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (detailImage) detailImage.src = button.dataset.image;
    });
  });
  thumbs.querySelectorAll("img").forEach((image) => bindProductImage(image, product.id));
}

function initDetailTabs() {
  document.querySelectorAll("[data-detail-tab]").forEach((tab) => {
    if (tab.dataset.ready === "true") return;
    tab.dataset.ready = "true";
    tab.addEventListener("click", () => {
      const target = tab.dataset.detailTab;
      document.querySelectorAll("[data-detail-tab]").forEach((item) => item.classList.toggle("active", item === tab));
      document.querySelectorAll("[data-detail-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.detailPanel === target);
      });
    });
  });
}

function initQuantityControls(quantityInput) {
  document.querySelectorAll("[data-qty-action]").forEach((button) => {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => {
      const currentValue = Math.max(1, Number(quantityInput?.value || 1));
      quantityInput.value = button.dataset.qtyAction === "increase" ? currentValue + 1 : Math.max(1, currentValue - 1);
    });
  });
}

function initZoomButton(detailImage) {
  document.querySelector(".detail-zoom-btn")?.addEventListener("click", () => {
    if (detailImage?.src) window.open(detailImage.src, "_blank", "noopener,noreferrer");
  }, { once: true });
}

export async function renderProductDetail() {
  const detailTitle = document.getElementById("detailTitle");
  if (!detailTitle) return;

  detailTitle.textContent = "Dang tai san pham...";
  const product = await loadProductDetail();
  if (!product) {
    detailTitle.textContent = "Khong tim thay san pham";
    return;
  }

  const detailCategory = document.getElementById("detailCategory");
  const detailImage = document.getElementById("detailImage");
  const detailPrice = document.getElementById("detailPrice");
  const detailOldPrice = document.getElementById("detailOldPrice");
  const detailDescription = document.getElementById("detailDescription");
  const detailLongDescription = document.getElementById("detailLongDescription");
  const detailSpecs = document.getElementById("detailSpecs");
  const detailRouteName = document.getElementById("detailRouteName");
  const discountBadge = document.getElementById("detailDiscount");
  const statusBadge = document.getElementById("detailStatusBadge");
  const stockText = document.getElementById("detailStockText");
  const ratingText = document.getElementById("detailRatingText");
  const soldText = document.getElementById("detailSoldText");
  const colorOptions = document.getElementById("colorOptions");
  const sizeOptions = document.getElementById("sizeOptions");
  const detailAddBtn = document.getElementById("detailAddBtn");
  const relatedGrid = document.getElementById("relatedGrid");
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const specs = detailSpecsMap[product.categoryName] || detailSpecsMap["Ao bong da"];
  const rating = (4.6 + ((Number(product.id) || 1) % 3) / 10).toFixed(1);
  const sold = 80 + ((Number(product.id) || 1) * 23) % 380;

  document.title = `${product.name} - Ni Sport`;
  detailTitle.textContent = product.name;
  if (detailCategory) detailCategory.textContent = `${genderLabels[product.gender] || product.gender || "Unisex"} / ${product.categoryName}`;
  if (detailRouteName) detailRouteName.textContent = product.name;
  if (detailPrice) detailPrice.textContent = formatMoney(product.price);
  if (detailOldPrice) {
    detailOldPrice.textContent = product.oldPrice ? formatMoney(product.oldPrice) : "";
    detailOldPrice.style.display = product.oldPrice ? "inline" : "none";
  }
  if (detailDescription) detailDescription.textContent = product.description || "San pham Ni Sport cho tap luyen va thi dau.";
  if (detailLongDescription) detailLongDescription.textContent = product.description || "Thiet ke the thao, de phoi do va phu hop san co.";
  if (detailSpecs) detailSpecs.innerHTML = specs.map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join("");
  if (discountBadge) {
    discountBadge.textContent = discount ? `-${discount}%` : product.tag || "NEW";
    discountBadge.style.display = "inline-flex";
  }
  if (statusBadge) statusBadge.textContent = product.tag || (product.status === "SELLING" ? "NEW" : product.status);
  if (stockText) stockText.textContent = Number(product.totalStock || 0) > 0 ? `Con hang: ${product.totalStock}` : "Tam het hang";
  if (ratingText) ratingText.textContent = `${rating} (120 danh gia)`;
  if (soldText) soldText.textContent = `Da ban ${sold}`;

  renderGallery(product, detailImage);
  initZoomButton(detailImage);
  initDetailTabs();

  const colors = getProductColors(product);
  if (colorOptions) {
    colorOptions.innerHTML = (colors.length ? colors : ["Black"]).map((color, index) => `
      <button class="${index === 0 ? "active" : ""}" type="button" data-color="${color}">${color}</button>
    `).join("");
    colorOptions.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        colorOptions.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  const sizes = getProductSizes(product);
  if (sizeOptions) {
    sizeOptions.innerHTML = (sizes.length ? sizes : ["M"]).map((size, index) => `
      <button class="${index === 0 ? "active" : ""}" type="button" data-size="${size}">${size}</button>
    `).join("");
    sizeOptions.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        sizeOptions.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  const quantityInput = document.getElementById("detailQuantity");
  initQuantityControls(quantityInput);

  if (detailAddBtn) {
    detailAddBtn.onclick = () => {
      const selectedSize = sizeOptions?.querySelector("button.active")?.dataset.size;
      const selectedColor = colorOptions?.querySelector("button.active")?.dataset.color;
      const selectedVariant = product.variants.find((variant) => {
        const matchSize = !selectedSize || variant.size === selectedSize;
        const matchColor = !selectedColor || variant.color === selectedColor;
        return matchSize && matchColor;
      });
      const quantity = Math.max(1, Number(quantityInput?.value || 1));

      if (!selectedVariant) {
        showToast("Vui long chon size va mau con hang.");
        return;
      }
      addToCart(product.id, { variantId: selectedVariant.id, quantity });
    };
  }

  if (relatedGrid) await renderRelatedProducts(product, relatedGrid);
}

export function initProductDetailPage() {
  initCommonLayout();
  initCartControls();
  renderProductDetail();
}

if (document.getElementById("detailTitle")) {
  initProductDetailPage();
}
