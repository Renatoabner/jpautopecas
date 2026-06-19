const ICONS = {
  spring:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4c4 0 4 4 8 4s4-4 8-4M4 10c4 0 4 4 8 4s4-4 8-4M4 16c4 0 4 4 8 4s4-4 8-4"/></svg>',
  brake:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',
  filter:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16l-6 8v6l-4 2v-8L4 4z"/></svg>',
  belt:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M8 8a4 4 0 0 1 0 8M16 8a4 4 0 0 1 0 8"/></svg>',
  spark:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 5 14h5l-1 8 8-12h-5l1-8z"/></svg>',
  oil:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
  battery:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M9 7V5h6v2M7 12h2M15 12h2M11 12h2"/></svg>',
  spray:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 2h3v3H9zM10 5h2l2 3v13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l2-3z"/><path d="M14 9h3M15 12h3M14 15h3"/></svg>',
};

function whatsappLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function categoryCard(cat, withLink = true) {
  const icon = ICONS[cat.icon] || "";
  const inner = `
    <div class="card-icon">${icon}</div>
    <h3>${cat.name}</h3>
    <div class="brands">${cat.brands.join(" · ")}</div>
    <p>${cat.description}</p>
    ${
      withLink
        ? `<a class="btn btn-outline btn-small" target="_blank" rel="noopener"
            href="${whatsappLink(`Olá! Quero consultar preço de ${cat.name}.`)}">Consultar no WhatsApp</a>`
        : ""
    }
  `;
  return `<div class="card" data-category="${cat.id}">${inner}</div>`;
}

function renderCategoryGrid(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const list = limit ? CATEGORIES.slice(0, limit) : CATEGORIES;
  el.innerHTML = list.map((c) => categoryCard(c)).join("");
}

function renderBrandStrip(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const brands = Array.from(new Set(CATEGORIES.flatMap((c) => c.brands)));
  el.innerHTML = brands.map((b) => `<span class="brand-pill">${b}</span>`).join("");
}

function renderFilters(containerId, gridId) {
  const filterEl = document.getElementById(containerId);
  const gridEl = document.getElementById(gridId);
  if (!filterEl || !gridEl) return;

  const buttons = [
    `<button class="filter-btn active" data-filter="all">Todas</button>`,
    ...CATEGORIES.map(
      (c) => `<button class="filter-btn" data-filter="${c.id}">${c.name}</button>`
    ),
  ];
  filterEl.innerHTML = buttons.join("");

  filterEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    gridEl.querySelectorAll(".card").forEach((card) => {
      card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
    });
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

function setupFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupFooterYear();
  renderCategoryGrid("home-categories", 8);
  renderBrandStrip("brand-strip");
  renderCategoryGrid("products-grid");
  renderFilters("product-filters", "products-grid");
});
