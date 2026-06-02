const body = document.body;
const menu = document.querySelector(".m-menu");
const menuButton = document.querySelector(".js-menuBtn");
const reserve = document.querySelector(".m-reserve");
const reserveOpeners = document.querySelectorAll(".js-open_reserve");
const reserveClose = document.querySelector(".js-reserve-close");
const year = document.querySelector("#year");

body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
  }, 600);
});

const smoothScrollTo = (targetId) => {
  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#reserve") {
      return;
    }

    event.preventDefault();
    closeMenu();
    smoothScrollTo(href);
  });
});

const openMenu = () => {
  menu?.classList.add("is-open");
  menu?.setAttribute("aria-hidden", "false");
  menuButton?.classList.add("is-active");
  menuButton?.setAttribute("aria-expanded", "true");
  body.classList.add("is-menu-open");
};

const closeMenu = () => {
  menu?.classList.remove("is-open");
  menu?.setAttribute("aria-hidden", "true");
  menuButton?.classList.remove("is-active");
  menuButton?.setAttribute("aria-expanded", "false");
  body.classList.remove("is-menu-open");
};

menuButton?.addEventListener("click", () => {
  if (menu?.classList.contains("is-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.querySelectorAll(".js-menu-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const openReserve = (event) => {
  event?.preventDefault();
  closeMenu();
  reserve?.classList.add("is-open");
  reserve?.setAttribute("aria-hidden", "false");
  body.classList.add("is-reserve-open");
};

const closeReserve = () => {
  reserve?.classList.remove("is-open");
  reserve?.setAttribute("aria-hidden", "true");
  body.classList.remove("is-reserve-open");
};

reserveOpeners.forEach((opener) => {
  opener.addEventListener("click", openReserve);
});

reserveClose?.addEventListener("click", closeReserve);

reserve?.addEventListener("click", (event) => {
  if (event.target === reserve || event.target.classList.contains("m-reserve_bg")) {
    closeReserve();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeReserve();
  }
});

const startSlideshow = (selector, interval) => {
  const slides = Array.from(document.querySelectorAll(selector));

  if (slides.length <= 1) {
    return;
  }

  let current = 0;

  window.setInterval(() => {
    slides[current].classList.remove("is-active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("is-active");
  }, interval);
};

startSlideshow(".food-slide", 4200);

const revealTargets = document.querySelectorAll(".js-reveal, .js-h2ttl, .js-maskImg, .js-maskImg_text");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}
