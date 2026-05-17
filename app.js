const PRODUCTS = [
  { id: "p1", name: "Nebula X Headphones", category: "Headphones", price: 249, oldPrice: 319, count: 18, accent: "from-cyan-400 to-blue-500", icon: "headphones", description: "Spatial audio headphones with metallic neon finish and adaptive noise isolation." },
  { id: "p2", name: "Titan Edge Phone", category: "Electronics", price: 899, oldPrice: 999, count: 11, accent: "from-slate-300 to-slate-600", icon: "phone", description: "Dark titanium flagship phone with cinematic display and pro camera array." },
  { id: "p3", name: "Pulse Time Watch", category: "Smart Watches", price: 329, oldPrice: 379, count: 9, accent: "from-emerald-400 to-cyan-500", icon: "watch", description: "Aero-grade smartwatch with AMOLED face, 10-day battery, and wellness suite." },
  { id: "p4", name: "Aether Carry Bag", category: "Bags and Wallets", price: 189, oldPrice: 229, count: 14, accent: "from-amber-400 to-orange-500", icon: "bag", description: "Structured premium commuter bag with water-resistant panels and smart pockets." },
  { id: "p5", name: "Velocity Sneakers", category: "Footwear", price: 159, oldPrice: 199, count: 23, accent: "from-pink-400 to-rose-500", icon: "shoe", description: "Lightweight performance sneakers with sculpted sole and futuristic upper." },
  { id: "p6", name: "Noir Essence", category: "Perfumes", price: 129, oldPrice: 149, count: 16, accent: "from-fuchsia-400 to-violet-500", icon: "perfume", description: "Bold evening fragrance with amber, saffron, cedar, and smoky musk." },
  { id: "p7", name: "Orbit Speaker", category: "Electronics", price: 219, oldPrice: 269, count: 20, accent: "from-blue-400 to-violet-500", icon: "speaker", description: "360-degree wireless speaker with immersive bass and ambient light halo." },
  { id: "p8", name: "Arc Wallet", category: "Bags and Wallets", price: 89, oldPrice: 109, count: 28, accent: "from-yellow-400 to-amber-500", icon: "wallet", description: "Slim RFID wallet crafted with soft-touch finish and magnetic closure." },
  { id: "p9", name: "Luna Smartwatch", category: "Smart Watches", price: 279, oldPrice: 329, count: 12, accent: "from-purple-400 to-pink-500", icon: "watch", description: "Elegant smartwatch with customizable watch faces and health monitoring." },   
  { id: "p10", name: "Stratus Earbuds", category: "Headphones", price: 149, oldPrice: 199, count: 25, accent: "from-cyan-400 to-blue-500", icon: "headphones", description: "True wireless earbuds with active noise cancellation and touch controls." }
];

const STORAGE_KEYS = {
  wishlist: "shopsphere-wishlist",
  cart: "shopsphere-cart",
  orders: "shopsphere-orders",
};

const state = {
  search: "",
  category: "All",
  view: "cart",
  wishlist: loadState(STORAGE_KEYS.wishlist, []),
  cart: loadState(STORAGE_KEYS.cart, []),
  orders: loadState(STORAGE_KEYS.orders, []),
};

const app = document.getElementById("app");

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function productById(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function cartQuantity(id) {
  const item = state.cart.find((entry) => entry.id === id);
  return item ? item.quantity : 0;
}

function cartItemsDetailed() {
  return state.cart
    .map((item) => {
      const product = productById(item.id);
      if (!product) return null;
      return { ...product, quantity: item.quantity, lineTotal: product.price * item.quantity };
    })
    .filter(Boolean);
}

function cartSubtotal() {
  return cartItemsDetailed().reduce((sum, item) => sum + item.lineTotal, 0);
}

function iconMarkup(type) {
  const icons = {
    headphones: '<path d="M7 12v2a2 2 0 0 0 2 2h1"></path><path d="M17 12v2a2 2 0 0 1-2 2h-1"></path><path d="M7 12a5 5 0 1 1 10 0"></path><path d="M9 16h6"></path>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"></rect><path d="M11 18h2"></path>',
    watch: '<rect x="7" y="6" width="10" height="12" rx="3"></rect><path d="M9 2h6"></path><path d="M9 22h6"></path><path d="M12 10v3l2 1"></path>',
    bag: '<path d="M7 8V6a5 5 0 0 1 10 0v2"></path><path d="M5 8h14l-1 11H6L5 8Z"></path>',
    shoe: '<path d="M4 15c2.5 0 4.4-1.2 6-3 1 2.5 3.1 4 6 4h4v3H4v-4Z"></path><path d="M13 11h2"></path>',
    perfume: '<path d="M10 4h4"></path><path d="M9 4v6l-3 7a2 2 0 0 0 1.9 2.7h8.2A2 2 0 0 0 18 17l-3-7V4"></path><path d="M8 11h8"></path>',
    speaker: '<rect x="7" y="4" width="10" height="16" rx="3"></rect><circle cx="12" cy="9" r="1.5"></circle><circle cx="12" cy="15" r="3"></circle>',
    wallet: '<path d="M4 8a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"></path><path d="M15 13h4"></path>',
    sunglasses: '<path d="M4 12a4 4 0 0 1 8 0v1a4 4 0 0 1-8 0v-1Z"></path><path d="M12 12a4 4 0 0 1 8 0v1a4 4 0 0 1-8 0v-1Z"></path><path d="M5.5 16h3m7-3h3"></path>',
  };
  return icons[type] || icons.phone;
}

function filteredProducts() {
  const query = state.search.trim().toLowerCase();
  return PRODUCTS.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
}

function categories() {
  return ["All", ...new Set(PRODUCTS.map((product) => product.category))];
}

function emptyState(title, text) {
  return `
    <div class="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 px-6 py-10 text-center">
      <p class="text-lg font-semibold">${title}</p>
      <p class="mt-2 text-sm leading-6 text-slate-400">${text}</p>
    </div>
  `;
}

function renderProducts() {
  const products = filteredProducts();
  if (!products.length) {
    return `
      <div class="md:col-span-2 xl:col-span-3">
        ${emptyState("No products match this search.", "Try a different keyword or switch categories.")}
      </div>
    `;
  }

  return products
    .map((product) => {
      const wished = state.wishlist.includes(product.id);
      return `
        <article class="rounded-[1.85rem] border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl">
          <div class="flex items-start justify-between gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.accent} text-slate-950 shadow-neon">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconMarkup(product.icon)}</svg>
            </div>
            <button data-action="toggle-wishlist" data-id="${product.id}" class="rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              wished ? "border-pink-400/40 bg-pink-400/15 text-pink-200" : "border-white/10 bg-white/5 text-slate-300 hover:border-pink-400/40"
            }">${wished ? "Saved" : "Wishlist"}</button>
          </div>
          <div class="mt-5">
            <p class="text-sm text-slate-400">${product.category}</p>
            <h3 class="mt-1 text-xl font-semibold">${product.name}</h3>
            <p class="mt-3 min-h-[72px] text-sm leading-6 text-slate-300">${product.description}</p>
          </div>
          <div class="mt-5 flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold">${currency(product.price)}</p>
              <p class="text-sm text-slate-500 line-through">${currency(product.oldPrice)}</p>
            </div>
            <span class="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs text-slate-300">${product.count} in stock</span>
          </div>
          <div class="mt-5 flex items-center gap-3">
            <button data-action="add-cart" data-id="${product.id}" class="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-neon">Add to Cart</button>
            <div class="min-w-[72px] rounded-full border border-white/10 bg-slate-950/45 px-4 py-3 text-center text-sm text-slate-300">${cartQuantity(product.id)} in cart</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCartView(items) {
  if (!items.length) return emptyState("Your cart is empty.", "Add products from the catalog to start checkout.");
  return `
    <div class="space-y-4">
      ${items
        .map(
          (item) => `
        <div class="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-slate-400">${item.category}</p>
              <h3 class="mt-1 font-semibold">${item.name}</h3>
              <p class="mt-2 text-sm text-slate-300">${currency(item.price)} each</p>
            </div>
            <button data-action="remove-cart" data-id="${item.id}" class="text-sm text-rose-300 hover:text-rose-200">Remove</button>
          </div>
          <div class="mt-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button data-action="decrease-cart" data-id="${item.id}" class="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-lg">-</button>
              <span class="min-w-[2rem] text-center">${item.quantity}</span>
              <button data-action="increase-cart" data-id="${item.id}" class="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-lg">+</button>
            </div>
            <p class="text-lg font-semibold">${currency(item.lineTotal)}</p>
          </div>
        </div>
      `
        )
        .join("")}
      <div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div class="flex items-center justify-between text-sm text-slate-300"><span>Subtotal</span><span class="font-semibold text-white">${currency(cartSubtotal())}</span></div>
        <div class="mt-2 flex items-center justify-between text-sm text-slate-300"><span>Shipping</span><span class="font-semibold text-white">Free</span></div>
        <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-base"><span>Total</span><span class="font-bold text-white">${currency(cartSubtotal())}</span></div>
      </div>
    </div>
  `;
}

function renderWishlistView() {
  const items = state.wishlist.map(productById).filter(Boolean);
  if (!items.length) return emptyState("No saved products yet.", "Tap Wishlist on any product card to keep it here.");
  return `
    <div class="space-y-4">
      ${items
        .map(
          (item) => `
        <div class="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-slate-400">${item.category}</p>
              <h3 class="mt-1 font-semibold">${item.name}</h3>
              <p class="mt-2 text-sm text-slate-300">${currency(item.price)}</p>
            </div>
            <button data-action="toggle-wishlist" data-id="${item.id}" class="text-sm text-rose-300 hover:text-rose-200">Remove</button>
          </div>
          <button data-action="add-cart" data-id="${item.id}" class="mt-4 w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950">Move to Cart</button>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderCheckoutView(items) {
  if (!items.length) return emptyState("Checkout is waiting for products.", "Add something to the cart before placing an order.");
  return `
    <form id="checkoutForm" class="space-y-4">
      <div class="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <p class="font-semibold">Order Summary</p>
        <div class="mt-3 space-y-2 text-sm text-slate-300">
          ${items.map((item) => `<div class="flex items-center justify-between"><span>${item.name} x ${item.quantity}</span><span>${currency(item.lineTotal)}</span></div>`).join("")}
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-4 font-semibold"><span>Total</span><span>${currency(cartSubtotal())}</span></div>
      </div>
      <div class="grid gap-4">
        <input name="fullName" required placeholder="Full name" class="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none" />
        <input name="email" type="email" required placeholder="Email address" class="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none" />
        <input name="address" required placeholder="Shipping address" class="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none" />
        <div class="grid grid-cols-2 gap-4">
          <input name="city" required placeholder="City" class="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none" />
          <input name="postalCode" required placeholder="Postal code" class="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none" />
        </div>
      </div>
      <button type="submit" class="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-neon">Place Order</button>
      <p class="text-xs text-slate-500">Demo checkout only. No real payment processing is included.</p>
    </form>
  `;
}

function renderOrdersView() {
  if (!state.orders.length) return emptyState("No orders yet.", "Placed orders will appear here with their saved shipping details.");
  return `
    <div class="space-y-4">
      ${state.orders
        .slice()
        .reverse()
        .map(
          (order) => `
        <div class="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-slate-500">${order.id}</p>
              <p class="mt-2 font-semibold">${order.customer.fullName}</p>
              <p class="mt-1 text-sm text-slate-400">${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}</p>
              <p class="mt-1 text-sm text-slate-400">${order.customer.email}</p>
            </div>
            <div class="text-right">
              <p class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Confirmed</p>
              <p class="mt-3 text-sm text-slate-400">${new Date(order.createdAt).toLocaleString()}</p>
              <p class="mt-1 text-lg font-semibold">${currency(order.total)}</p>
            </div>
          </div>
          <div class="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
            ${order.items.map((item) => `<div class="flex items-center justify-between py-1"><span>${item.name} x ${item.quantity}</span><span>${currency(item.lineTotal)}</span></div>`).join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderPanel() {
  const cartItems = cartItemsDetailed();
  const views = {
    cart: { title: "Cart", meta: `${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items`, html: renderCartView(cartItems) },
    wishlist: { title: "Wishlist", meta: `${state.wishlist.length} saved`, html: renderWishlistView() },
    checkout: { title: "Checkout", meta: cartItems.length ? currency(cartSubtotal()) : "Cart empty", html: renderCheckoutView(cartItems) },
    orders: { title: "Orders", meta: `${state.orders.length} placed`, html: renderOrdersView() },
  };
  const current = views[state.view];
  return `
    <section class="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Workspace</p>
          <h2 class="mt-2 text-2xl font-bold">${current.title}</h2>
        </div>
        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">${current.meta}</span>
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        ${["cart", "wishlist", "checkout", "orders"]
          .map(
            (view) => `
          <button data-view-target="${view}" class="rounded-full border px-4 py-2 text-sm transition ${
            state.view === view ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/35"
          }">${view.charAt(0).toUpperCase() + view.slice(1)}</button>
        `
          )
          .join("")}
      </div>
      <div class="mt-6">${current.html}</div>
    </section>
  `;
}

function renderLayout() {
  return `
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"></div>
        <div class="absolute right-[-6%] top-10 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>
      </div>
      <main class="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <nav class="rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4 shadow-glass backdrop-blur-xl">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-neon">
                <svg class="h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M6 7h13l-1.5 8.5H8.5L6 4H3"></path><circle cx="9" cy="19" r="1.4"></circle><circle cx="17" cy="19" r="1.4"></circle>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-extrabold tracking-tight">Shop<span class="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">Sphere</span></p>
                <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Modern commerce app</p>
              </div>
            </div>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div class="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-300">
                <svg class="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
                <input id="searchInput" type="search" placeholder="Search products, categories or tags" value="${state.search}" class="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
                <span class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold tracking-[0.2em] text-slate-300">CTRL K</span>
              </div>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button data-view-target="wishlist" class="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-400/40">Wishlist <span class="ml-1 text-cyan-300">${state.wishlist.length}</span></button>
                <button data-view-target="cart" class="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-400/40">Cart <span class="ml-1 text-cyan-300">${state.cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button>
                <button data-view-target="checkout" class="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-400/40">Checkout</button>
                <button data-view-target="orders" class="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-400/40">Orders</button>
              </div>
            </div>
          </div>
        </nav>

        <section class="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div class="space-y-8">
            <section class="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl sm:p-8">
              <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
                <div class="max-w-2xl">
                  <span class="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200">Operational Ecommerce</span>
                  <h1 class="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
                    Shop Modern Products With
                    <span class="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">Elegant Style</span>
                  </h1>
                  <p class="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">Browse premium products, save favorites, manage your cart, place mock checkouts, and revisit your order history in one polished single-page app.</p>
                  <div class="mt-8 flex flex-wrap gap-3">
                    <button data-scroll-target="catalog" class="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-neon">Shop Now</button>
                    <button data-view-target="orders" class="rounded-full border border-white/15 bg-slate-950/35 px-6 py-3 text-sm font-semibold text-white">View Orders</button>
                  </div>
                </div>
                <div class="relative mx-auto h-[280px] w-full max-w-[280px]">
                  <div class="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/25 via-violet-500/25 to-fuchsia-500/10 blur-3xl"></div>
                  <div class="absolute inset-x-6 bottom-6 h-16 rounded-full bg-cyan-400/15 blur-2xl"></div>
                  <div class="absolute inset-x-5 bottom-10 h-8 rounded-full border border-cyan-300/15 bg-white/10 backdrop-blur-md"></div>
                  <div class="absolute left-5 top-20 h-36 w-24 -rotate-[18deg] rounded-[1.9rem] border border-white/10 bg-gradient-to-b from-slate-700 to-slate-950 p-[1px]"><div class="h-full w-full rounded-[1.8rem] bg-gradient-to-br from-slate-950 via-slate-800 to-slate-900"></div></div>
                  <div class="absolute left-1/2 top-6 h-28 w-28 -translate-x-1/2 rounded-full border-[14px] border-cyan-300/80 shadow-[0_0_35px_rgba(56,189,248,0.55)]"></div>
                  <div class="absolute left-[28%] top-[35%] h-24 w-10 rounded-[999px] bg-gradient-to-b from-cyan-300 via-sky-500 to-slate-900"></div>
                  <div class="absolute right-[28%] top-[35%] h-24 w-10 rounded-[999px] bg-gradient-to-b from-cyan-300 via-sky-500 to-slate-900"></div>
                  <div class="absolute left-1/2 top-[44%] h-20 w-24 -translate-x-1/2 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-200/20 via-sky-500/35 to-slate-900"></div>
                  <div class="absolute right-4 top-24 flex h-32 w-24 rotate-[12deg] flex-col rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-3"><div class="rounded-[1.2rem] border border-white/5 bg-slate-950/80 px-2 py-3 text-center"><p class="text-[10px] uppercase tracking-[0.3em] text-slate-500">Now</p><p class="mt-2 text-2xl font-bold">10:09</p></div></div>
                  <div class="absolute right-0 top-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl"><p class="text-xs uppercase tracking-[0.28em] text-slate-400">Special Offer</p><p class="mt-2 text-xl font-bold">Up to 30% Off</p></div>
                </div>
              </div>
            </section>
            <section id="catalog" class="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl sm:p-8">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><p class="text-sm uppercase tracking-[0.35em] text-slate-400">Catalog</p><h2 class="mt-2 text-3xl font-bold tracking-tight">Featured Products</h2></div>
                <div class="flex flex-wrap gap-2">
                  ${categories()
                    .map(
                      (category) => `
                    <button data-category="${category}" class="rounded-full border px-4 py-2 text-sm transition ${
                      state.category === category ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/35"
                    }">${category}</button>
                  `
                    )
                    .join("")}
                </div>
              </div>
              <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">${renderProducts()}</div>
            </section>
          </div>
          <aside class="space-y-6">
            ${renderPanel()}
            <section class="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div class="rounded-2xl border border-white/5 bg-slate-950/35 p-4"><p class="text-sm text-slate-400">Premium Quality</p><p class="mt-1 font-semibold">Curated gadgets and luxury accessories.</p></div>
                <div class="rounded-2xl border border-white/5 bg-slate-950/35 p-4"><p class="text-sm text-slate-400">Secure Checkout</p><p class="mt-1 font-semibold">No payment gateway required for demo flow.</p></div>
                <div class="rounded-2xl border border-white/5 bg-slate-950/35 p-4"><p class="text-sm text-slate-400">Order History</p><p class="mt-1 font-semibold">Orders persist with local browser storage.</p></div>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  `;
}

function toggleWishlist(id) {
  state.wishlist = state.wishlist.includes(id)
    ? state.wishlist.filter((itemId) => itemId !== id)
    : [id, ...state.wishlist];
  saveState(STORAGE_KEYS.wishlist, state.wishlist);
  render();
}

function addToCart(id) {
  const found = state.cart.find((item) => item.id === id);
  if (found) found.quantity += 1;
  else state.cart.push({ id, quantity: 1 });
  saveState(STORAGE_KEYS.cart, state.cart);
  state.view = "cart";
  render();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  saveState(STORAGE_KEYS.cart, state.cart);
  render();
}

function updateCartQuantity(id, delta) {
  state.cart = state.cart
    .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
    .filter((item) => item.quantity > 0);
  saveState(STORAGE_KEYS.cart, state.cart);
  render();
}

function handleCheckout(event) {
  event.preventDefault();
  const items = cartItemsDetailed();
  const formData = new FormData(event.currentTarget);
  const order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    customer: Object.fromEntries(formData.entries()),
    items,
    total: cartSubtotal(),
  };
  state.orders.push(order);
  state.cart = [];
  saveState(STORAGE_KEYS.orders, state.orders);
  saveState(STORAGE_KEYS.cart, state.cart);
  state.view = "orders";
  render();
}

function attachEvents() {
  app.querySelector("#searchInput").addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });

  app.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.viewTarget;
      render();
    });
  });

  app.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelector(`#${button.dataset.scrollTarget}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  app.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      render();
    });
  });

  app.querySelectorAll("[data-action='toggle-wishlist']").forEach((button) => {
    button.addEventListener("click", () => toggleWishlist(button.dataset.id));
  });

  app.querySelectorAll("[data-action='add-cart']").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.id));
  });

  app.querySelectorAll("[data-action='remove-cart']").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.id));
  });

  app.querySelectorAll("[data-action='increase-cart']").forEach((button) => {
    button.addEventListener("click", () => updateCartQuantity(button.dataset.id, 1));
  });

  app.querySelectorAll("[data-action='decrease-cart']").forEach((button) => {
    button.addEventListener("click", () => updateCartQuantity(button.dataset.id, -1));
  });

  const checkoutForm = app.querySelector("#checkoutForm");
  if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckout);
}

function render() {
  app.innerHTML = renderLayout();
  attachEvents();
}

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const input = document.getElementById("searchInput");
    if (input) input.focus();
  }
});

render();
