import {
  formatMoney,
  getCurrentUser,
  getData,
  getOrders,
  initCommonLayout,
  saveData,
  saveOrders,
  showCenterNotice,
  showToast
} from "./common.js";
import { getProductById, products, refreshProductsFromAdminState } from "./products.js";

export let cart = getData("lunaCart", []);

export function saveCart() {
  saveData("lunaCart", cart);
}

export function getCart() {
  cart = getData("lunaCart", []);
  return cart;
}

export function getCartKey(productId, size = "", color = "") {
  return `${productId}-${size || "default"}-${color || "default"}`;
}

export function addToCart(productId, options = {}) {
  const product = getProductById(productId);
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

export function changeQuantity(cartKey, amount) {
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

export function removeFromCart(cartKey) {
  cart = cart.filter((item) => (item.cartKey || getCartKey(item.id, item.size, item.color)) !== String(cartKey));
  saveCart();
  renderCart();
  renderCartPage();
  showToast("Đã xóa sản phẩm khỏi giỏ hàng.");
}

export function renderCart() {
  cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalMoney = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartCount) cartCount.textContent = totalQuantity;
  if (cartTotal) cartTotal.textContent = formatMoney(totalMoney);
  if (!cartItems) return;

  cartItems.innerHTML = cart.length ? cart.map((item) => {
    const key = item.cartKey || getCartKey(item.id, item.size, item.color);
    const variantText = [item.size ? `Size ${item.size}` : "", item.color ? `Màu ${item.color}` : ""].filter(Boolean).join(" | ");
    return `
      <div class="cart-item">
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
      </div>
    `;
  }).join("") : `<p class="empty-cart">Giỏ hàng đang trống.</p>`;
}

export function renderCartPage() {
  const cartPageItems = document.getElementById("cartPageItems");
  if (!cartPageItems) return;

  const cartPageCount = document.getElementById("cartPageCount");
  const cartPageSubtotal = document.getElementById("cartPageSubtotal");
  const cartPageShipping = document.getElementById("cartPageShipping");
  const cartPageTotal = document.getElementById("cartPageTotal");
  const cartPageNotice = document.getElementById("cartPageNotice");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  if (cartPageCount) cartPageCount.textContent = `(${totalQuantity} sản phẩm)`;
  if (cartPageSubtotal) cartPageSubtotal.textContent = formatMoney(subtotal);
  if (cartPageShipping) cartPageShipping.textContent = shipping === 0 ? "Miễn phí" : formatMoney(shipping);
  if (cartPageTotal) cartPageTotal.textContent = formatMoney(total);
  if (cartPageNotice) {
    cartPageNotice.textContent = totalQuantity
      ? `Bạn đang có ${totalQuantity} sản phẩm trong giỏ hàng.`
      : "Bạn đang có 0 sản phẩm trong giỏ hàng.";
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
        <div class="cart-page-line-total"><strong>${formatMoney(itemTotal)}</strong></div>
        <div class="cart-page-remove">
          <button onclick="removeFromCart('${key}')" aria-label="Xóa ${item.name}">⌫<span>Xóa</span></button>
        </div>
      </article>
    `;
  }).join("");
}

export function createOrderFromCart() {
  if (cart.length === 0) {
    showToast("Giỏ hàng đang trống.");
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("Vui lòng đăng nhập trước khi thanh toán.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
    return;
  }

  if (currentUser.role === "admin") {
    showCenterNotice("Tài khoản admin chỉ dùng để quản trị, không thể đặt đơn hàng.", "error");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const order = {
    id: Date.now(),
    customerId: currentUser.id,
    customerName: `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim(),
    email: currentUser.email,
    phone: currentUser.phone || "",
    address: currentUser.address || "",
    items: cart,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "Đang xử lí",
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

export function openQuickView(productId) {
  refreshProductsFromAdminState();
  const product = products.find((item) => Number(item.id) === Number(productId));
  const quickViewBody = document.getElementById("quickViewBody");
  const quickModal = document.getElementById("quickModal");
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
        <button class="btn btn-primary" onclick="addToCart(${product.id}); closeQuickView();">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  `;
  quickModal.classList.add("show");
}

export function closeQuickView() {
  document.getElementById("quickModal")?.classList.remove("show");
}

function closeCartDrawer() {
  document.getElementById("cartDrawer")?.classList.remove("show");
  document.getElementById("overlay")?.classList.remove("show");
}

export function initCartControls() {
  const cartOpenBtn = document.getElementById("cartOpenBtn");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const quickCloseBtn = document.getElementById("quickCloseBtn");
  const overlay = document.getElementById("overlay");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutMainBtn = document.querySelector(".checkout-main-btn");
  const cartClearBtn = document.querySelector(".cart-clear-btn");

  if (cartOpenBtn && cartOpenBtn.dataset.cartReady !== "true") {
    cartOpenBtn.dataset.cartReady = "true";
    cartOpenBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
    });
  }
  if (cartCloseBtn && cartCloseBtn.dataset.cartReady !== "true") {
    cartCloseBtn.dataset.cartReady = "true";
    cartCloseBtn.addEventListener("click", closeCartDrawer);
  }
  if (quickCloseBtn && quickCloseBtn.dataset.cartReady !== "true") {
    quickCloseBtn.dataset.cartReady = "true";
    quickCloseBtn.addEventListener("click", closeQuickView);
  }
  if (overlay && overlay.dataset.cartReady !== "true") {
    overlay.dataset.cartReady = "true";
    overlay.addEventListener("click", () => {
      closeCartDrawer();
      closeQuickView();
    });
  }
  if (checkoutBtn && checkoutBtn.dataset.cartReady !== "true") {
    checkoutBtn.dataset.cartReady = "true";
    checkoutBtn.addEventListener("click", () => {
      showToast(cart.length ? "Chức năng thanh toán đang được phát triển." : "Giỏ hàng đang trống.");
    });
  }
  if (checkoutMainBtn && checkoutMainBtn.dataset.cartReady !== "true") {
    checkoutMainBtn.dataset.cartReady = "true";
    checkoutMainBtn.addEventListener("click", createOrderFromCart);
  }
  if (cartClearBtn && cartClearBtn.dataset.cartReady !== "true") {
    cartClearBtn.dataset.cartReady = "true";
    cartClearBtn.addEventListener("click", () => {
      cart = [];
      saveCart();
      renderCart();
      renderCartPage();
    });
  }
  if (document.body.dataset.cartEscapeReady !== "true") {
    document.body.dataset.cartEscapeReady = "true";
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCartDrawer();
        closeQuickView();
      }
    });
  }

  renderCart();
  renderCartPage();
}

export function initCartPage() {
  initCommonLayout();
  initCartControls();
}

window.addToCart = addToCart;
window.renderCart = renderCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;

if (document.getElementById("cartPageItems")) {
  initCartPage();
}
