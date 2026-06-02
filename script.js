const body = document.body;
const menu = document.querySelector(".m-menu");
const menuButton = document.querySelector(".js-menuBtn");
const reserve = document.querySelector(".m-reserve");
const reserveOpeners = document.querySelectorAll(".js-open_reserve");
const reserveClose = document.querySelector(".js-reserve-close");
const year = document.querySelector("#year");
const notesContainer = document.querySelector("#js-notes");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

body.classList.add("is-loading");

const createNote = () => {
  if (!notesContainer || body.classList.contains("is-loading")) {
    return;
  }

  const note = document.createElement("span");
  const size = Math.floor(11 + Math.random() * 8);
  const drift = Math.floor((Math.random() - 0.5) * 180);
  const duration = (6 + Math.random() * 5).toFixed(1);
  const rotate = Math.floor(90 + Math.random() * 220);
  const notes = ["♪", "♩", "🎵"];
  const colors = [
    "rgba(208, 67, 55, 0.24)",
    "rgba(189, 139, 61, 0.3)",
    "rgba(234, 219, 203, 0.42)",
  ];

  note.className = "falling-note";
  note.textContent = notes[Math.floor(Math.random() * notes.length)];
  note.style.left = `${Math.random() * 100}%`;
  note.style.setProperty("--size", `${size}px`);
  note.style.setProperty("--drift", `${drift}px`);
  note.style.setProperty("--duration", `${duration}s`);
  note.style.setProperty("--rotate", `${rotate}deg`);
  note.style.color = colors[Math.floor(Math.random() * colors.length)];
  notesContainer.appendChild(note);

  note.addEventListener("animationend", () => note.remove(), { once: true });
};

const startNotes = () => {
  if (prefersReducedMotion || !notesContainer) {
    return;
  }

  createNote();
  window.setInterval(createNote, 980);
};

window.addEventListener("load", () => {
  window.setTimeout(() => {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
    startNotes();
  }, 980);
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

const foodSlider = document.querySelector("[data-food-slider]");

if (foodSlider) {
  const track = foodSlider.querySelector("[data-food-track]");
  const slides = Array.from(foodSlider.querySelectorAll(".food-slide"));
  const prevButton = foodSlider.querySelector("[data-food-prev]");
  const nextButton = foodSlider.querySelector("[data-food-next]");
  const dotsWrap = foodSlider.querySelector("[data-food-dots]");
  let current = 0;
  let startX = 0;
  let diffX = 0;
  let isDragging = false;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${index + 1}枚目のメニュー写真を表示`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  const getSlideStep = () => {
    if (slides.length < 2) {
      return slides[0]?.getBoundingClientRect().width || 0;
    }

    return slides[1].offsetLeft - slides[0].offsetLeft;
  };

  const getMaxOffset = () => Math.max(0, track.scrollWidth - foodSlider.clientWidth);

  const updateSlider = () => {
    const offset = Math.min(current * getSlideStep(), getMaxOffset());
    track.style.transform = `translateX(${-offset}px)`;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
    dots.forEach((dot, index) => dot.classList.toggle("is-active", index === current));
  };

  const goToSlide = (index) => {
    current = (index + slides.length) % slides.length;
    updateSlider();
  };

  const moveSlide = (direction) => {
    goToSlide(current + direction);
  };

  prevButton?.addEventListener("click", () => moveSlide(-1));
  nextButton?.addEventListener("click", () => moveSlide(1));

  foodSlider.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    diffX = 0;
    foodSlider.classList.add("is-dragging");
    foodSlider.setPointerCapture(event.pointerId);
  });

  foodSlider.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    diffX = event.clientX - startX;
  });

  foodSlider.addEventListener("pointerup", (event) => {
    if (!isDragging) {
      return;
    }

    foodSlider.releasePointerCapture(event.pointerId);
    foodSlider.classList.remove("is-dragging");
    isDragging = false;

    if (Math.abs(diffX) > 48) {
      moveSlide(diffX < 0 ? 1 : -1);
    }
  });

  foodSlider.addEventListener("pointercancel", () => {
    foodSlider.classList.remove("is-dragging");
    isDragging = false;
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();
}

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
