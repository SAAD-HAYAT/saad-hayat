(() => {
  "use strict";

  const profile = "SAAD-HAYAT";
  const featuredRepos = [
    "instagram-comment-generator-frontend",
    "author-venture",
    "my-doc-sage",
  ];

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
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
        const visible = filter === "all" || card.dataset.tags.includes(filter);
        card.classList.toggle("is-hidden", !visible);
        if (visible) visibleCount += 1;
      });

      if (filterStatus) {
        filterStatus.textContent = `Showing ${visibleCount} ${filter === "all" ? "projects" : `${filter} projects`}.`;
      }
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const showAll = () => revealItems.forEach((item) => item.classList.add("is-visible"));

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showAll();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // The page is fully useful offline. This non-blocking enhancement only adds
  // current primary-language metadata; it needs no token or server-side code.
  const repoUrl = (repo) => `https://api.github.com/repos/${profile}/${repo}`;
  Promise.all(featuredRepos.map((repo) => fetch(repoUrl(repo)).then((response) => response.ok ? response.json() : null)))
    .then((repos) => {
      repos.forEach((repo) => {
        if (!repo) return;
        const source = document.querySelector(`[href="${repo.html_url}"]`);
        const card = source ? source.closest(".project-card") : null;
        const tags = card ? card.querySelector(".tag-list") : null;
        if (repo.language && tags && ![...tags.children].some((tag) => tag.textContent === repo.language)) {
          const tag = document.createElement("li");
          tag.textContent = repo.language;
          tags.appendChild(tag);
        }
      });
    })
    .catch(() => { /* API enhancement intentionally stays non-blocking. */ });
})();
