import { apiRequest, getToken, resolveAssetUrl } from "./api.js";
import {
  formatMoney,
  getCurrentUser,
  getData,
  initCommonLayout,
  pageUrl,
  saveData,
  showCenterNotice,
  showToast
} from "./common.js";
import { genderLabels, getProductById, handleProductImageError, products, refreshProductsFromAdminState } from "./products.js";

export let cart = getData("niSportCartFallback", []);
let backendCart = null;

function requireLogin(message = "Vui long dang nhap de su dung gio hang.") {
  if (getToken()) return true;
  showToast(message);
  setTimeout(() => {
    window.location.href = pageUrl("login.html");
  }, 900);
  return false;
}

function cartItems(cartData = backendCart) {
  return cartData?.items || [];
}

function normalizeCartItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName || item.name,
    productSlug: item.productSlug || item.slug,
    thumbnailUrl: item.thumbnailUrl || item.image,
    variantId: item.variantId,
    size: item.size,
    color: item.color,
    sku: item.sku,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 0),
    subtotal: Number(item.subtotal || (Number(item.price || 0) * Number(item.quantity || 0)))
  };
}

function normalizeCart(cartData) {
  const items = (cartData?.items || []).map(normalizeCartItem);
  return {
    id: cartData?.id || null,
    userId: cartData?.userId || null,
    items,
    totalQuantity: Number(cartData?.totalQuantity ?? items.reduce((sum, item) => sum + item.quantity, 0)),
    totalAmount: Number(cartData?.totalAmount ?? items.reduce((sum, item) => sum + item.subtotal, 0))
  };
}

export function saveCart() {
  saveData("niSportCartFallback", cart);
}

export function getCart() {
  cart = getData("niSportCartFallback", []);
  return cart;
}

export function getCartKey(productId, size = "", color = "") {
  return `${productId}-${size || "default"}-${color || "default"}`;
}

function bindCartImages(scope = document) {
  scope.querySelectorAll("[data-product-img]").forEach((image) => {
    image.addEventListener("error", () => handleProductImageError(image, image.dataset.productId));
  });
}

export async function fetchCart({ silent = false } = {}) {
  if (!getToken()) {
    backendCart = normalizeCart({ items: [] });
    renderCart(backendCart);
    renderCartPage(backendCart);
    return backendCart;
  }

  try {
    backendCart = normalizeCart(await apiRequest("/cart"));
    renderCart(backendCart);
    renderCartPage(backendCart);
    return backendCart;
  } catch (error) {
    if (!silent) handleApiError(error, "Khong tai duoc gio hang.");
    backendCart = normalizeCart({ items: cart });
    renderCart(backendCart, true);
    renderCartPage(backendCart, true);
    return backendCart;
  }
}

function handleApiError(error, fallbackMessage) {
  if (error?.status === 401) {
    showToast("Phien dang nhap het han. Vui long dang nhap lai.");
    setTimeout(() => {
      window.location.href = pageUrl("login.html");
    }, 900);
    return;
  }
  if (error?.status === 403) {
    showToast("Ban khong co quyen thuc hien thao tac nay.");
    return;
  }
  showToast(error?.message || fallbackMessage);
}

export async function addToCart(productId, options = {}) {
  if (!requireLogin("Vui long dang nhap truoc khi them vao gio.")) return;

  let variantId = options.variantId;
  let quantity = Number(options.quantity || 1);

  if (!variantId) {
    const product = getProductById(productId);
    variantId = product?.variants?.[0]?.id;
  }

  if (!variantId) {
    showToast("Vui long chon size va mau tren trang chi tiet san pham.");
    setTimeout(() => {
      window.location.href = `${pageUrl("product-detail.html")}?id=${productId}`;
    }, 900);
    return;
  }
  if (!quantity || quantity < 1) quantity = 1;

  try {
    backendCart = normalizeCart(await apiRequest("/cart/items", {
      method: "POST",
      body: { productId: Number(productId), variantId: Number(variantId), quantity }
    }));
    renderCart(backendCart);
    renderCartPage(backendCart);
    showToast("Da them san pham vao gio hang.");
  } catch (error) {
    handleApiError(error, "Khong them duoc san pham vao gio.");
  }
}

export async function changeQuantity(itemId, amount) {
  if (!requireLogin()) return;
  const item = cartItems().find((cartItem) => String(cartItem.id) === String(itemId));
  if (!item) return;
  const quantity = Math.max(1, Number(item.quantity || 1) + amount);

  try {
    backendCart = normalizeCart(await apiRequest(`/cart/items/${itemId}`, {
      method: "PUT",
      body: { quantity }
    }));
    renderCart(backendCart);
    renderCartPage(backendCart);
  } catch (error) {
    handleApiError(error, "Khong cap nhat duoc so luong.");
  }
}

export async function removeFromCart(itemId) {
  if (!requireLogin()) return;
  try {
    backendCart = normalizeCart(await apiRequest(`/cart/items/${itemId}`, { method: "DELETE" }));
    renderCart(backendCart);
    renderCartPage(backendCart);
    showToast("Da xoa san pham khoi gio hang.");
  } catch (error) {
    handleApiError(error, "Khong xoa duoc san pham.");
  }
}

export async function clearCart() {
  if (!requireLogin()) return;
  try {
    backendCart = normalizeCart(await apiRequest("/cart", { method: "DELETE" }));
    renderCart(backendCart);
    renderCartPage(backendCart);
    showToast("Da xoa toan bo gio hang.");
  } catch (error) {
    handleApiError(error, "Khong xoa duoc gio hang.");
  }
}

export function renderCart(cartData = backendCart, isFallback = false) {
  const data = normalizeCart(cartData || { items: [] });
  const cartItemsEl = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (cartCount) cartCount.textContent = getToken() ? data.totalQuantity : "0";
  if (cartTotal) cartTotal.textContent = formatMoney(data.totalAmount);
  if (!cartItemsEl) return;

  if (!getToken()) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Vui long dang nhap de xem gio hang.</p>`;
    return;
  }

  cartItemsEl.innerHTML = data.items.length ? data.items.map((item) => `
    <div class="cart-item">
      <img data-product-img data-product-id="${item.productId}" src="${resolveAssetUrl(item.thumbnailUrl)}" alt="${item.productName}">
      <div>
        <h4>${item.productName}</h4>
        <small>Size ${item.size || "M"} | Mau ${item.color || "Black"}</small>
        <p>${formatMoney(item.price)}</p>
        <div class="qty-row">
          <button onclick="changeQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}', 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')">Xoa</button>
        </div>
      </div>
    </div>
  `).join("") : `<p class="empty-cart">${isFallback ? "Dang hien fallback local." : "Gio hang dang trong."}</p>`;
  bindCartImages(cartItemsEl);
}

export function renderCartPage(cartData = backendCart, isFallback = false) {
  const cartPageItems = document.getElementById("cartPageItems");
  if (!cartPageItems) return;

  const data = normalizeCart(cartData || { items: [] });
  const cartPageCount = document.getElementById("cartPageCount");
  const cartPageSubtotal = document.getElementById("cartPageSubtotal");
  const cartPageShipping = document.getElementById("cartPageShipping");
  const cartPageTotal = document.getElementById("cartPageTotal");
  const cartPageNotice = document.getElementById("cartPageNotice");
  const checkoutButton = document.querySelector(".checkout-main-btn");
  const shipping = data.totalAmount >= 500000 || data.totalAmount === 0 ? 0 : 30000;
  const total = data.totalAmount + shipping;

  if (cartPageCount) cartPageCount.textContent = `${data.totalQuantity} san pham`;
  if (cartPageSubtotal) cartPageSubtotal.textContent = formatMoney(data.totalAmount);
  if (cartPageShipping) cartPageShipping.textContent = shipping === 0 ? "Miễn phí" : formatMoney(shipping);
  if (cartPageTotal) cartPageTotal.textContent = formatMoney(total);
  if (cartPageNotice) {
    cartPageNotice.textContent = !getToken()
      ? "Vui long dang nhap de thanh toan."
      : isFallback
        ? "Backend loi, dang hien fallback local."
        : `Ban dang co ${data.totalQuantity} san pham trong gio hang.`;
  }
  if (checkoutButton) checkoutButton.disabled = !getToken() || data.items.length === 0;

  if (!getToken()) {
    cartPageItems.innerHTML = `
      <div class="cart-page-empty">
        <p>Vui long dang nhap de xem gio hang backend.</p>
        <a class="btn btn-primary" href="${pageUrl("login.html")}">Dang nhap</a>
      </div>
    `;
    return;
  }

  if (data.items.length === 0) {
    cartPageItems.innerHTML = `
      <div class="cart-page-empty">
        <p>Gio hang dang trong.</p>
        <a class="btn btn-primary" href="${pageUrl("products.html")}">Tiep tuc mua sam</a>
      </div>
    `;
    return;
  }

  cartPageItems.innerHTML = data.items.map((item) => `
    <article class="cart-page-item">
      <div class="cart-page-product">
        <a class="cart-page-image" href="${pageUrl("product-detail.html")}?id=${item.productId}">
          <img data-product-img data-product-id="${item.productId}" src="${resolveAssetUrl(item.thumbnailUrl)}" alt="${item.productName}">
        </a>
        <div class="cart-page-info">
          <h3><a href="${pageUrl("product-detail.html")}?id=${item.productId}">${item.productName}</a></h3>
          <p class="cart-page-sku">SKU: ${item.sku || "NI"}</p>
          <div class="cart-page-tags">
            <span class="cart-page-tag">Size: ${item.size || "M"}</span>
            <span class="cart-page-tag">Màu: ${item.color || "Black"}</span>
          </div>
        </div>
      </div>
      <div class="cart-page-price"><strong>${formatMoney(item.price)}</strong></div>
      <div class="cart-page-qty">
        <button onclick="changeQuantity('${item.id}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity('${item.id}', 1)">+</button>
      </div>
      <div class="cart-page-line-total"><strong>${formatMoney(item.subtotal)}</strong></div>
      <div class="cart-page-remove"><button onclick="removeFromCart('${item.id}')" aria-label="Xóa ${item.productName}">Xóa</button></div>
    </article>
  `).join("");
  bindCartImages(cartPageItems);
}

function fillCheckoutFromUser() {
  const user = getCurrentUser();
  const receiverName = document.getElementById("receiverName");
  const receiverPhone = document.getElementById("receiverPhone");
  const receiverAddress = document.getElementById("receiverAddress");
  if (receiverName && !receiverName.value) receiverName.value = user?.fullName || "";
  if (receiverPhone && !receiverPhone.value) receiverPhone.value = user?.phone || "";
  if (receiverAddress && !receiverAddress.value) receiverAddress.value = user?.address || "";
}

export async function createOrderFromCart(event) {
  event?.preventDefault();
  if (!requireLogin("Vui long dang nhap truoc khi dat hang.")) return;
  const data = backendCart || await fetchCart({ silent: true });
  if (!data.items.length) {
    showToast("Gio hang dang trong.");
    return;
  }

  const receiverName = document.getElementById("receiverName")?.value.trim();
  const receiverPhone = document.getElementById("receiverPhone")?.value.trim();
  const receiverAddress = document.getElementById("receiverAddress")?.value.trim();
  const note = document.getElementById("orderNote")?.value.trim() || "";

  if (!receiverName || !receiverPhone || !receiverAddress) {
    showToast("Vui long nhap day du ten, so dien thoai va dia chi.");
    return;
  }

  try {
    await apiRequest("/orders", {
      method: "POST",
      body: { receiverName, receiverPhone, receiverAddress, note, paymentMethod: "COD" }
    });
    backendCart = normalizeCart({ items: [] });
    renderCart(backendCart);
    renderCartPage(backendCart);
    showCenterNotice("Dat hang thanh cong.", "success", () => {
      window.location.href = pageUrl("orders.html");
    });
  } catch (error) {
    handleApiError(error, "Khong tao duoc don hang. Hay kiem tra ton kho.");
  }
}

export function openQuickView(productId) {
  refreshProductsFromAdminState();
  const product = products.find((item) => Number(item.id) === Number(productId));
  const quickViewBody = document.getElementById("quickViewBody");
  const quickModal = document.getElementById("quickModal");
  if (!product || !quickViewBody || !quickModal) return;

  quickViewBody.innerHTML = `
    <div class="quick-view">
      <img data-product-img data-product-id="${product.id}" src="${product.image}" alt="${product.name}">
      <div>
        <span class="product-category">${genderLabels[product.gender] || product.gender} / ${product.categoryName}</span>
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
        </div>
        <p>${product.description || ""}</p>
        <a class="btn btn-primary" href="${pageUrl("product-detail.html")}?id=${product.id}">Chon size va mau</a>
      </div>
    </div>
  `;
  bindCartImages(quickViewBody);
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
  const checkoutForm = document.getElementById("checkoutForm");
  const cartClearBtn = document.querySelector(".cart-clear-btn");

  if (cartOpenBtn && cartOpenBtn.dataset.cartReady !== "true") {
    cartOpenBtn.dataset.cartReady = "true";
    cartOpenBtn.addEventListener("click", () => {
      window.location.href = pageUrl("cart.html");
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
  checkoutBtn?.addEventListener("click", () => {
    window.location.href = pageUrl("cart.html");
  });
  checkoutForm?.addEventListener("submit", createOrderFromCart);
  cartClearBtn?.addEventListener("click", clearCart);

  fillCheckoutFromUser();
  fetchCart({ silent: true });
}

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;

if (document.getElementById("cartItems") || document.getElementById("cartPageItems")) {
  initCommonLayout();
  initCartControls();
}
