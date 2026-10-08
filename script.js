const products = [
  {
    id: 1,
    name: "Nova Echo Headset",
    category: "tech",
    price: 129,
    rating: 4.9,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description: "Immersive sound and all-day comfort for work and travel."
  },
  {
    id: 2,
    name: "Luma Smart Watch",
    category: "tech",
    price: 199,
    rating: 4.8,
    badge: "New",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Track performance, steps, heart rate, and your style anywhere."
  },
  {
    id: 3,
    name: "Aster Glass Bottle",
    category: "home",
    price: 39,
    rating: 4.7,
    badge: "Eco",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
    description: "Reusable daily bottle with a sleek matte finish and thermal layer."
  },
  {
    id: 4,
    name: "Velora Leather Tote",
    category: "accessories",
    price: 89,
    rating: 4.9,
    badge: "Best",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    description: "A premium everyday carry bag built for effortless daily movement."
  },
  {
    id: 5,
    name: "Horizon Knit Set",
    category: "fashion",
    price: 109,
    rating: 4.8,
    badge: "New",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    description: "Soft texture and modern silhouette designed for city comfort."
  },
  {
    id: 6,
    name: "Contour Lamp",
    category: "home",
    price: 74,
    rating: 4.6,
    badge: "Warm",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Minimal lighting with a warm glow for evening focus and relaxation."
  },
  {
    id: 7,
    name: "Orbit Sling Bag",
    category: "accessories",
    price: 64,
    rating: 4.7,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "Compact structure, adjustable strap, and enough room for essentials."
  },
  {
    id: 8,
    name: "Astra Running Shoes",
    category: "fashion",
    price: 149,
    rating: 4.9,
    badge: "Trend",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight performance design with a premium cushioning system."
  }
];

const cart = JSON.parse(localStorage.getItem("tasuzCart")) || [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartDrawer = document.getElementById("cartDrawer");
const cartBadge = document.getElementById("cartBadge");
const floatingCount = document.getElementById("floatingCount");
const floatingTotal = document.getElementById("floatingTotal");
const subtotalValue = document.getElementById("subtotalValue");
const deliveryValue = document.getElementById("deliveryValue");
const totalValue = document.getElementById("totalValue");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function currency(n) {
  return `$${Number(n).toFixed(2)}`;
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function saveCart() {
  localStorage.setItem("tasuzCart", JSON.stringify(cart));
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <span class="product-badge">${product.badge}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-body">
            <div class="product-row">
              <h3>${product.name}</h3>
              <span class="price">${currency(product.price)}</span>
            </div>
            <p>${product.description}</p>
            <div class="product-footer">
              <span class="rating">★ ${product.rating}</span>
              <button class="secondary-btn" data-add-to-cart="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.addToCart)));
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const found = cart.find((item) => item.id === productId);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  renderProducts();
  showToast(`${product.name} added to cart`);
}

function updateCartItem(productId, change) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    const index = cart.findIndex((entry) => entry.id === productId);
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeCartItem(productId) {
  const index = cart.findIndex((entry) => entry.id === productId);
  if (index >= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart">Your cart is empty.</div>`;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <h4>${item.name}</h4>
              <div class="item-meta">
                <span>${currency(item.price)}</span>
                <span>${item.category}</span>
              </div>
              <div class="item-controls">
                <button class="qty-btn" data-decrease="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-increase="${item.id}">+</button>
              </div>
            </div>
            <div class="item-price">
              <strong>${currency(item.quantity * item.price)}</strong>
              <button class="remove-btn" data-remove="${item.id}">Remove</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  const subtotal = getCartSubtotal();
  const delivery = subtotal > 0 ? 12 : 0;
  const total = subtotal + delivery;

  cartBadge.textContent = getCartCount();
  floatingCount.textContent = `${getCartCount()} item${getCartCount() === 1 ? "" : "s"}`;
  floatingTotal.textContent = currency(total);

  subtotalValue.textContent = currency(subtotal);
  deliveryValue.textContent = currency(delivery);
  totalValue.textContent = currency(total);

  document.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => updateCartItem(Number(button.dataset.increase), 1));
  });

  document.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => updateCartItem(Number(button.dataset.decrease), -1));
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeCartItem(Number(button.dataset.remove)));
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

const openCartBtn = document.getElementById("openCartBtn");
const floatingCartBtn = document.getElementById("floatingCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");

openCartBtn.addEventListener("click", openCart);
floatingCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();

  if (!name || !phone || !address || !cart.length) {
    showToast("Please fill in all fields and add a product");
    return;
  }

  const total = getCartSubtotal() + (getCartSubtotal() > 0 ? 12 : 0);
  showToast(`PayMe demo payment of ${currency(total)} accepted`);
  cart.length = 0;
  saveCart();
  renderCart();
  form.reset();
  closeCart();
});

renderProducts();
renderCart();
