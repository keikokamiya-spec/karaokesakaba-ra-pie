// Header navigation
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "メニューを開く");
    }
  });
}

// Hero slideshow
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));

if (heroSlides.length > 1) {
  let currentSlide = 0;

  window.setInterval(() => {
    heroSlides[currentSlide].classList.remove("is-active");
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add("is-active");
  }, 5200);
}

// Footer year
const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}
