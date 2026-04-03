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

  // ===== Reveal on Scroll =====
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
        rootMargin: "0px 0px -12% 0px",
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // ===== Carousel (music + art) =====
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

    window.addEventListener("load", () => {
      track.scrollTo({ left: 0, behavior: "auto" });
      setTimeout(setCenterHighlight, 80);
    });

    setTimeout(setCenterHighlight, 120);
  }

  initCarousel(
    "#musicTrack",
    '.carousel-btn.prev[data-carousel="music"]',
    '.carousel-btn.next[data-carousel="music"]'
  );

  initCarousel(
    "#artTrack",
    '.carousel-btn.prev[data-carousel="art"]',
    '.carousel-btn.next[data-carousel="art"]'
  );

    // ===== Shared Lightbox =====
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const artItems = Array.from(document.querySelectorAll("#artTrack .art-card"));
  let currentArtIndex = 0;
  let lightboxMode = null; // "art" | "community" | "media"

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function getArtData(item) {
    const img = item.querySelector(".media-thumb");
    const previewTitle = item.querySelector(".art-overlay-preview h3");
    const data = item.querySelector(".art-data");

    return {
      src: img ? img.getAttribute("src") : "",
      alt: img ? img.getAttribute("alt") : "Artwork",
      title:
        (data && data.dataset.title) ||
        (previewTitle && previewTitle.textContent) ||
        (img && img.getAttribute("alt")) ||
        "Artwork",
      description: (data && data.dataset.description) || "",
    };
  }

  function buildArtLightboxMarkup(art) {
    return `
      <div class="lightbox-media-wrap" id="lightboxMediaWrap">
        <img class="lightbox-media" src="${art.src}" alt="${art.alt}">
        <div class="lightbox-caption" id="lightboxCaption">
          <h3>${art.title}</h3>
          <p>${art.description}</p>
        </div>
      </div>
    `;
  }

  function buildCommunityLightboxMarkup(src, alt) {
    return `
      <div class="lightbox-media-wrap community-lightbox-wrap">
        <img class="lightbox-media" src="${src}" alt="${alt || "Community photo"}">
      </div>
    `;
  }

  function attachArtLightboxEvents() {
    const mediaWrap = document.getElementById("lightboxMediaWrap");
    if (!mediaWrap) return;

    mediaWrap.addEventListener("click", (e) => {
      if (!isMobileView()) return;
      e.stopPropagation();
      mediaWrap.classList.toggle("caption-visible");
    });
  }

  function renderArtLightboxItem(index) {
    const item = artItems[index];
    if (!item || !lightboxContent) return;

    const art = getArtData(item);
    lightboxContent.innerHTML = buildArtLightboxMarkup(art);
    attachArtLightboxEvents();
  }

  function openArtLightbox(index) {
    if (!lightbox || !lightboxContent || !artItems.length) return;

    lightboxMode = "art";
    currentArtIndex = index;
    renderArtLightboxItem(currentArtIndex);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxPrev) lightboxPrev.style.display = "grid";
    if (lightboxNext) lightboxNext.style.display = "grid";
  }

  function openCommunityLightbox(photo) {
    if (!lightbox || !lightboxContent) return;

    lightboxMode = "community";
    lightboxContent.innerHTML = buildCommunityLightboxMarkup(
      photo.getAttribute("src"),
      photo.getAttribute("alt")
    );

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxPrev) lightboxPrev.style.display = "none";
    if (lightboxNext) lightboxNext.style.display = "none";
  }

  function openMediaLightbox(media) {
    if (!lightbox || !lightboxContent) return;

    lightboxMode = "media";
    lightboxContent.innerHTML = "";

    const clone = media.cloneNode(true);
    if (clone.tagName === "VIDEO") {
      clone.controls = true;
      clone.autoplay = true;
      clone.muted = false;
      clone.playsInline = true;
    }

    lightboxContent.appendChild(clone);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxPrev) lightboxPrev.style.display = "none";
    if (lightboxNext) lightboxNext.style.display = "none";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxContent) return;

    const v = lightboxContent.querySelector("video");
    if (v) v.pause();

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxContent.innerHTML = "";
    document.body.style.overflow = "";
    lightboxMode = null;

    if (lightboxPrev) lightboxPrev.style.display = "grid";
    if (lightboxNext) lightboxNext.style.display = "grid";
  }

  function showNextArt(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (lightboxMode !== "art" || !artItems.length) return;

    currentArtIndex = (currentArtIndex + 1) % artItems.length;
    renderArtLightboxItem(currentArtIndex);
  }

  function showPrevArt(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (lightboxMode !== "art" || !artItems.length) return;

    currentArtIndex = (currentArtIndex - 1 + artItems.length) % artItems.length;
    renderArtLightboxItem(currentArtIndex);
  }

  // Art click
  artItems.forEach((item, index) => {
    item.addEventListener("click", () => openArtLightbox(index));
  });

  // Community click
  document.querySelectorAll(".photo-chip").forEach((photo) => {
    photo.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCommunityLightbox(photo);
    });
  });

  // Music click
  document.querySelectorAll("#musicTrack .media-thumb").forEach((media) => {
    media.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMediaLightbox(media);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click", showNextArt);
  lightboxPrev?.addEventListener("click", showPrevArt);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNextArt();
    if (e.key === "ArrowLeft") showPrevArt();
  });

  // ===== Email Reveal =====
  const emailBtn = document.getElementById("emailBtn");
  const emailReveal = document.getElementById("emailReveal");

  if (emailBtn && emailReveal) {
    emailBtn.addEventListener("click", () => {
      emailReveal.style.display = "block";
    });
  }
});