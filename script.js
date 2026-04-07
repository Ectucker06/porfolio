// ===== MAIN SCRIPT =====
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // ===== Mobile Menu Toggle =====
  const menuToggle = $(".menu-toggle");
  const navMenu = $("nav ul");
  const toggleIcon = menuToggle ? $("i", menuToggle) : null;

  if (menuToggle && navMenu && toggleIcon) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      toggleIcon.classList.toggle("fa-bars");
      toggleIcon.classList.toggle("fa-times");
    });

    $$("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        toggleIcon.classList.add("fa-bars");
        toggleIcon.classList.remove("fa-times");
      });
    });
  }

  // ===== Typing Text Effect =====
  const texts = ["Frontend Designer", "Data Scientist", "Software Developer", "Musician"];
  const typingElement = $(".typing-text");
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    if (!typingElement) return;

    const current = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = current.substring(0, charIndex--);
    } else {
      typingElement.textContent = current.substring(0, ++charIndex);
    }

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === current.length) {
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
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetID = anchor.getAttribute("href");
      const target = targetID ? $(targetID) : null;
      if (!target || targetID === "#") return;

      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    });
  });

  // ===== Reveal on Scroll =====
  const revealEls = $$(".reveal");

  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("show", entry.isIntersecting);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // ===== Carousel Helper =====
  function initCarousel(trackSelector, prevSelector, nextSelector, cardSelector = ".media-card, .info-slide, .community-card") {
    const track = $(trackSelector);
    const prevBtn = $(prevSelector);
    const nextBtn = $(nextSelector);
    if (!track || !prevBtn || !nextBtn) return;

    const cards = $$(cardSelector, track);
    if (!cards.length) return;

    function setCenterHighlight() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = null;
      let closestDist = Infinity;

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        card.classList.remove("is-center");

        if (dist < closestDist) {
          closestDist = dist;
          closest = card;
        }
      });

      if (closest) closest.classList.add("is-center");
    }

    function scrollByOne(dir) {
      const cardW = cards[0].getBoundingClientRect().width;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.gap) || parseFloat(styles.columnGap) || 18;

      track.scrollBy({
        left: dir * (cardW + gap),
        behavior: "smooth",
      });

      setTimeout(setCenterHighlight, 250);
    }

    prevBtn.addEventListener("click", () => scrollByOne(-1));
    nextBtn.addEventListener("click", () => scrollByOne(1));
    track.addEventListener("scroll", () => requestAnimationFrame(setCenterHighlight));
    window.addEventListener("resize", setCenterHighlight);

    setTimeout(setCenterHighlight, 120);
  }

  // ===== Initialize Carousels =====
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

  initCarousel(
    "#experienceTrack",
    '.carousel-btn.prev[data-carousel="experience"]',
    '.carousel-btn.next[data-carousel="experience"]'
  );

  initCarousel(
    "#volunteeringTrack",
    '.carousel-btn.prev[data-carousel="volunteering"]',
    '.carousel-btn.next[data-carousel="volunteering"]'
  );

  // ===== Shared Lightbox =====
  const lightbox = $("#lightbox");
  const lightboxContent = $("#lightboxContent");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  const artItems = $$("#artTrack .art-card");
  let currentArtIndex = 0;
  let lightboxMode = null;

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function openLightbox(html, mode = null, showArrows = false) {
    if (!lightbox || !lightboxContent) return;

    lightboxMode = mode;
    lightboxContent.innerHTML = html;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxPrev) lightboxPrev.style.display = showArrows ? "grid" : "none";
    if (lightboxNext) lightboxNext.style.display = showArrows ? "grid" : "none";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxContent) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxContent.innerHTML = "";
    document.body.style.overflow = "";

    if (lightboxPrev) lightboxPrev.style.display = "grid";
    if (lightboxNext) lightboxNext.style.display = "grid";
  }

  function attachCaptionToggle() {
    const wrap = $("#lightboxMediaWrap");
    if (!wrap) return;

    wrap.addEventListener("click", (e) => {
      if (!isMobileView()) return;
      e.stopPropagation();
      wrap.classList.toggle("caption-visible");
    });
  }

  // ===== Art Lightbox =====
  function getArtData(item) {
    const img = $(".media-thumb", item);
    const title =
      $(".art-overlay-preview h3", item)?.textContent ||
      $(".art-data", item)?.dataset.title ||
      img?.alt ||
      "Artwork";

    const description = $(".art-data", item)?.dataset.description || "";

    return {
      src: img?.src || "",
      alt: img?.alt || "Artwork",
      title,
      description,
    };
  }

  function renderArtLightbox(index) {
    const art = getArtData(artItems[index]);

    openLightbox(
      `
      <div class="lightbox-media-wrap" id="lightboxMediaWrap">
        <img class="lightbox-media" src="${art.src}" alt="${art.alt}">
        <div class="lightbox-caption">
          <h3>${art.title}</h3>
          <p>${art.description}</p>
        </div>
      </div>
      `,
      "art",
      true
    );

    attachCaptionToggle();
  }

  function showNextArt(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (lightboxMode !== "art" || !artItems.length) return;

    currentArtIndex = (currentArtIndex + 1) % artItems.length;
    renderArtLightbox(currentArtIndex);
  }

  function showPrevArt(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (lightboxMode !== "art" || !artItems.length) return;

    currentArtIndex = (currentArtIndex - 1 + artItems.length) % artItems.length;
    renderArtLightbox(currentArtIndex);
  }

  artItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      currentArtIndex = index;
      renderArtLightbox(currentArtIndex);
    });
  });

  // ===== Community Lightbox =====
  function openCommunityLightbox(card) {
    const img = $("img", card);
    const data = $(".community-data", card);
    const title = data?.dataset.title || img?.alt || "Community Highlight";
    const description = data?.dataset.description || "";

    openLightbox(
      `
      <div class="lightbox-media-wrap" id="lightboxMediaWrap">
        <img class="lightbox-media" src="${img?.src || ""}" alt="${img?.alt || "Community photo"}">
        <div class="lightbox-caption">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      </div>
      `,
      "community",
      false
    );

    attachCaptionToggle();
  }

  $$(".community-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCommunityLightbox(card);
    });
  });

  // ===== Media Lightbox =====
  function openMediaLightbox(media) {
    if (!lightbox || !lightboxContent) return;

    const clone = media.cloneNode(true);

    if (clone.tagName === "VIDEO") {
      clone.controls = true;
      clone.autoplay = true;
      clone.muted = false;
      clone.playsInline = true;
    }

    lightboxContent.innerHTML = "";
    lightboxContent.appendChild(clone);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxPrev) lightboxPrev.style.display = "none";
    if (lightboxNext) lightboxNext.style.display = "none";

    lightboxMode = "media";
  }

  $$("#musicTrack .media-thumb").forEach((media) => {
    media.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMediaLightbox(media);
    });
  });

  // ===== Lightbox Events =====
  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click", showNextArt);
  lightboxPrev?.addEventListener("click", showPrevArt);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNextArt();
    if (e.key === "ArrowLeft") showPrevArt();
  });

  // ===== Email Reveal =====
  const emailBtn = $("#emailBtn");
  const emailReveal = $("#emailReveal");

  if (emailBtn && emailReveal) {
    emailBtn.addEventListener("click", () => {
      emailReveal.style.display = "block";
    });
  }
});