document.addEventListener("DOMContentLoaded", () => {
  // ===== Mobile Menu Toggle =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");
  const toggleIcon = menuToggle ? menuToggle.querySelector("i") : null;

  if (menuToggle && navMenu && toggleIcon) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      toggleIcon.classList.toggle("fa-bars");
      toggleIcon.classList.toggle("fa-times");
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        toggleIcon.classList.add("fa-bars");
        toggleIcon.classList.remove("fa-times");
      });
    });
  }

  // ===== Typing Text Effect =====
  const texts = ["Frontend Designer", "Data Scientist", "Software Developer", "Musician"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typingElement = document.querySelector(".typing-text");

  function type() {
    if (!typingElement) return;

    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      delay = 1200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 450;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 600);

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetID = anchor.getAttribute("href");
      if (!targetID || targetID === "#") return;

      const targetElement = document.querySelector(targetID);
      if (!targetElement) return;

      e.preventDefault();

      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    });
  });

  // ===== Reveal on Scroll (fade in AND fade out) =====
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
          else entry.target.classList.remove("show");
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px", // fade out a bit earlier
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // ===== Carousel (supports multiple: music + art) =====
function initCarousel(trackSelector, prevSelector, nextSelector) {
  const track = document.querySelector(trackSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll(".media-card"));

  function pauseVideos() {
    track.querySelectorAll("video").forEach((v) => {
      if (!v.paused) v.pause();
    });
  }

  function setCenterHighlight() {
    if (!cards.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;

    let closest = null;
    let closestDist = Infinity;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = card;
      }
    });

    cards.forEach((c) => c.classList.remove("is-center"));
    if (closest) closest.classList.add("is-center");
  }

  function scrollByOne(dir) {
    if (!cards.length) return;

    const cardW = cards[0].getBoundingClientRect().width;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.gap) || parseFloat(styles.columnGap) || 18;

    pauseVideos();
    track.scrollBy({ left: dir * (cardW + gap), behavior: "smooth" });

    setTimeout(setCenterHighlight, 250);
  }

  prevBtn.addEventListener("click", () => scrollByOne(-1));
  nextBtn.addEventListener("click", () => scrollByOne(1));

  track.addEventListener("scroll", () => {
    requestAnimationFrame(setCenterHighlight);
  });

  window.addEventListener("resize", () => {
    setCenterHighlight();
  });

  // ✅ Force start at FIRST item (fixes art-02 being centered)
  window.addEventListener("load", () => {
    track.scrollTo({ left: 0, behavior: "auto" });
    setTimeout(setCenterHighlight, 80);
  });

  // Initial highlight
  setTimeout(setCenterHighlight, 120);
}

// Music carousel
initCarousel(
  "#musicTrack",
  '.carousel-btn.prev[data-carousel="music"]',
  '.carousel-btn.next[data-carousel="music"]'
);

// Art carousel
initCarousel(
  "#artTrack",
  '.carousel-btn.prev[data-carousel="art"]',
  '.carousel-btn.next[data-carousel="art"]'
);

  // ===== Click-to-Fullscreen Lightbox (images + videos) =====
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(node) {
  if (!lightbox || !lightboxContent) return;

  lightboxContent.innerHTML = "";

  // Clone the clicked media so we don't move it out of the carousel
  const clone = node.cloneNode(true);

  // Make video behave nicely in the modal
  if (clone.tagName === "VIDEO") {
    clone.controls = true;
    clone.autoplay = true;
    clone.muted = false;
    clone.playsInline = true;
  }

  lightboxContent.appendChild(clone);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxContent) return;

  // stop video audio when closing
  const v = lightboxContent.querySelector("video");
  if (v) v.pause();

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxContent.innerHTML = "";
}

// Click images/videos in galleries
document.querySelectorAll(".media-thumb").forEach((media) => {
  media.style.cursor = "pointer";
  media.addEventListener("click", () => openLightbox(media));
});

// Close actions
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
});

