(() => {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    const setMenu = (open, restoreFocus = false) => {
      navToggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (restoreFocus) navToggle.focus();
    };

    navToggle.addEventListener("click", () => {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
        // Move keyboard focus out of a menu that is about to be hidden.
        const target = document.querySelector(link.hash);
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true);
      }
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        setMenu(false, nav.contains(document.activeElement));
      }
    });
    nav.addEventListener("focusout", (event) => {
      if (!nav.contains(event.relatedTarget) && event.relatedTarget !== navToggle) setMenu(false);
    });
    window.matchMedia("(max-width: 560px)").addEventListener("change", () => {
      setMenu(false, nav.contains(document.activeElement) && window.innerWidth <= 560);
    });
    // Navigation stays available in the HTML until its controls are ready.
    navToggle.hidden = false;
    navToggle.closest(".nav-wrap").classList.add("nav-ready");
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  const filterStatus = document.querySelector("#filter-status");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      projectCards.forEach((card) => {
        const visible = filter === "all" || card.dataset.tags.split(" ").includes(filter);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (filterStatus) {
        const label = filter === "ai" ? "AI" : "Web";
        filterStatus.textContent = `Showing ${visibleCount} ${filter === "all" ? "projects" : `${label} projects`}.`;
      }
    });
  });
  const filters = document.querySelector(".project-filters");
  if (filters) filters.hidden = false;
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
