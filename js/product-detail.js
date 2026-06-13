import { formatMoney, initCommonLayout, showToast } from "./common.js";
import { addToCart, initCartControls } from "./cart.js";
import { getProductById, products, refreshProductsFromAdminState } from "./products.js";

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

export function renderRelatedProducts(product, relatedGrid) {
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

export function renderProductDetail() {
  const detailTitle = document.getElementById("detailTitle");
  if (!detailTitle) return;

  refreshProductsFromAdminState();
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  const product = getProductById(id) || products[0];
  const specs = detailSpecsMap[product.category] || detailSpecsMap["Đầm"];
  const detailCategory = document.getElementById("detailCategory");
  const detailImage = document.getElementById("detailImage");
  const detailPrice = document.getElementById("detailPrice");
  const detailOldPrice = document.getElementById("detailOldPrice");
  const detailDescription = document.getElementById("detailDescription");
  const detailSpecs = document.getElementById("detailSpecs");
  const detailRouteName = document.getElementById("detailRouteName");
  const discountBadge = document.getElementById("detailDiscount");
  const colorOptions = document.getElementById("colorOptions");
  const sizeOptions = document.getElementById("sizeOptions");
  const detailAddBtn = document.getElementById("detailAddBtn");
  const relatedGrid = document.getElementById("relatedGrid");
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  document.title = `${product.name} - Luna Fashion`;
  detailTitle.textContent = product.name;
  if (detailCategory) detailCategory.textContent = product.category;
  if (detailRouteName) detailRouteName.textContent = product.name;
  if (detailImage) {
    detailImage.src = product.image;
    detailImage.alt = product.name;
    detailImage.onerror = () => {
      detailImage.onerror = null;
      detailImage.src = "../assets/product-1.jpg";
    };
  }
  if (detailPrice) detailPrice.textContent = formatMoney(product.price);
  if (detailOldPrice) {
    detailOldPrice.textContent = product.oldPrice ? formatMoney(product.oldPrice) : "";
    detailOldPrice.style.display = product.oldPrice ? "inline" : "none";
  }
  if (detailDescription) detailDescription.textContent = product.description;
  if (detailSpecs) {
    detailSpecs.innerHTML = specs.map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join("");
  }
  if (discountBadge) discountBadge.textContent = discount ? `Tiết kiệm ${discount}%` : "Hàng mới";

  document.querySelectorAll(".vertical-thumbs button").forEach((button, index) => {
    const image = index === 0 ? product.image : button.dataset.image;
    button.dataset.image = image;
    const thumbImage = button.querySelector("img");
    if (index === 0 && thumbImage) thumbImage.src = product.image;

    button.addEventListener("click", () => {
      document.querySelectorAll(".vertical-thumbs button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (detailImage) detailImage.src = button.dataset.image;
    });
  });

  colorOptions?.querySelectorAll("button").forEach((button) => {
    button.dataset.image = product.image;
    const image = button.querySelector("img");
    if (image) {
      image.src = product.image;
      image.alt = button.dataset.color || product.name;
      image.onerror = () => {
        image.onerror = null;
        image.src = "../assets/product-1.jpg";
      };
    }
  });

  colorOptions?.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      colorOptions.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  sizeOptions?.querySelectorAll("button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => {
      sizeOptions.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  detailAddBtn?.addEventListener("click", () => {
    const selectedSize = sizeOptions?.querySelector("button.active")?.dataset.size;
    const selectedColor = colorOptions?.querySelector("button.active")?.dataset.color || "Pastel Pink";
    if (!selectedSize) {
      showToast("Vui lòng chọn size trước khi thêm vào giỏ.");
      return;
    }

    addToCart(product.id, { size: selectedSize, color: selectedColor });
    window.location.href = "cart.html";
  });

  if (relatedGrid) renderRelatedProducts(product, relatedGrid);
}

export function initProductDetailPage() {
  initCommonLayout();
  initCartControls();
  renderProductDetail();
}

if (document.getElementById("detailTitle")) {
  initProductDetailPage();
}
