// ===== MAIN SCRIPT =====

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  // =========================================================
  // MOBILE MENU
  // =========================================================

  const menuToggle = $(".menu-toggle");
  const navMenu = $("nav ul");
  const toggleIcon = menuToggle ? $("i", menuToggle) : null;

  if (menuToggle && navMenu && toggleIcon) {
    function setMenuOpen(isOpen) {
      navMenu.classList.toggle("active", isOpen);
      toggleIcon.classList.toggle("fa-bars", !isOpen);
      toggleIcon.classList.toggle("fa-times", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    menuToggle.addEventListener("click", () => {
      setMenuOpen(!navMenu.classList.contains("active"));
    });

    $$("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });
  }


  // =========================================================
  // TYPING EFFECT
  // =========================================================

  const texts = [
    "Software Engineer",
    "Full-Stack Developer",
    "AI & API Developer",
    "Technology Problem Solver"
  ];

  const typingElement = $(".typing-text");

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeText() {
    if (!typingElement) return;

    const currentText = texts[textIndex];

    if (isDeleting) {
      charIndex--;
      typingElement.textContent =
        currentText.substring(0, charIndex);
    } else {
      charIndex++;
      typingElement.textContent =
        currentText.substring(0, charIndex);
    }

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      delay = 1200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;

      textIndex =
        (textIndex + 1) % texts.length;

      delay = 450;
    }

    setTimeout(typeText, delay);
  }

  if (typingElement) {
    setTimeout(typeText, 600);
  }


  // =========================================================
  // SMOOTH SCROLL
  // =========================================================

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetID =
        anchor.getAttribute("href");

      if (!targetID || targetID === "#") {
        return;
      }

      const target =
        $(targetID);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = $("header")?.getBoundingClientRect().height || 0;

      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - headerHeight - 12,
        behavior: "smooth"
      });
    });
  });


  // =========================================================
  // REVEAL ON SCROLL
  // =========================================================

  const revealElements =
    $$(".reveal");

  if (
    revealElements.length &&
    "IntersectionObserver" in window
  ) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle(
              "show",
              entry.isIntersecting
            );
          });
        },
        {
          threshold: 0.18,
          rootMargin:
            "0px 0px -12% 0px"
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("show");
    });
  }


  // =========================================================
  // GENERIC CAROUSEL
  // =========================================================

  function initCarousel(
    trackSelector,
    prevSelector,
    nextSelector,
    cardSelector =
      ".media-card, .info-slide, .community-card"
  ) {
    const track =
      $(trackSelector);

    const prevButton =
      $(prevSelector);

    const nextButton =
      $(nextSelector);

    if (
      !track ||
      !prevButton ||
      !nextButton
    ) {
      return;
    }

    const cards =
      $$(cardSelector, track);

    if (!cards.length) {
      return;
    }


    function setCenterHighlight() {
      const center =
        track.scrollLeft +
        track.clientWidth / 2;

      let closestCard = null;
      let closestDistance =
        Infinity;

      cards.forEach((card) => {
        const cardCenter =
          card.offsetLeft +
          card.offsetWidth / 2;

        const distance =
          Math.abs(
            center - cardCenter
          );

        card.classList.remove(
          "is-center"
        );

        if (
          distance <
          closestDistance
        ) {
          closestDistance =
            distance;

          closestCard =
            card;
        }
      });

      if (closestCard) {
        closestCard.classList.add(
          "is-center"
        );
      }
    }


    function scrollByOne(
      direction
    ) {
      const cardWidth =
        cards[0]
          .getBoundingClientRect()
          .width;

      const styles =
        getComputedStyle(track);

      const gap =
        parseFloat(styles.gap) ||
        parseFloat(
          styles.columnGap
        ) ||
        18;

      track.scrollBy({
        left:
          direction *
          (cardWidth + gap),

        behavior: "smooth"
      });

      setTimeout(
        setCenterHighlight,
        300
      );
    }


    prevButton.addEventListener(
      "click",
      () => {
        scrollByOne(-1);
      }
    );

    nextButton.addEventListener(
      "click",
      () => {
        scrollByOne(1);
      }
    );

    track.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(
          setCenterHighlight
        );
      }
    );

    window.addEventListener(
      "resize",
      setCenterHighlight
    );

    setTimeout(
      setCenterHighlight,
      120
    );
  }


  // =========================================================
  // INITIALIZE CAROUSELS
  // =========================================================

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

  initCarousel(
    "#communityTrack",
    '.carousel-btn.prev[data-carousel="community"]',
    '.carousel-btn.next[data-carousel="community"]'
  );

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


  // =========================================================
  // LIGHTBOX SETUP
  // =========================================================

  const lightbox =
    $("#lightbox");

  const lightboxContent =
    $("#lightboxContent");

  const lightboxClose =
    $("#lightboxClose");

  const lightboxPrev =
    $("#lightboxPrev");

  const lightboxNext =
    $("#lightboxNext");

  const artItems =
    $$("#artTrack .art-card");

  let currentArtIndex = 0;
  let lightboxMode = null;


  function isMobileView() {
    return window.innerWidth <= 768;
  }


  function openLightbox(
    html,
    mode = null,
    showArrows = false
  ) {
    if (
      !lightbox ||
      !lightboxContent
    ) {
      return;
    }

    lightboxMode = mode;

    lightboxContent.innerHTML =
      html;

    lightbox.classList.add(
      "open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    if (lightboxPrev) {
      lightboxPrev.style.display =
        showArrows
          ? "grid"
          : "none";
    }

    if (lightboxNext) {
      lightboxNext.style.display =
        showArrows
          ? "grid"
          : "none";
    }
  }


  function closeLightbox() {
    if (
      !lightbox ||
      !lightboxContent
    ) {
      return;
    }

    lightbox.classList.remove(
      "open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    lightboxContent.innerHTML =
      "";

    document.body.style.overflow =
      "";

    lightboxMode = null;
  }


  function attachCaptionToggle() {
    const wrapper =
      $("#lightboxMediaWrap");

    if (!wrapper) {
      return;
    }

    wrapper.addEventListener(
      "click",
      (event) => {
        if (!isMobileView()) {
          return;
        }

        event.stopPropagation();

        wrapper.classList.toggle(
          "caption-visible"
        );
      }
    );
  }


  // =========================================================
  // ART LIGHTBOX
  // =========================================================

  function getArtData(item) {
    if (!item) {
      return {
        src: "",
        alt: "Artwork",
        title: "Artwork",
        description: ""
      };
    }

    const image =
      $(".media-thumb", item);

    const data =
      $(".art-data", item);

    const previewTitle =
      $(
        ".art-overlay-preview h3",
        item
      );

    const title =
      previewTitle?.textContent ||
      data?.dataset.title ||
      image?.alt ||
      "Artwork";

    const description =
      data?.dataset.description ||
      "";

    return {
      src:
        image?.src || "",

      alt:
        image?.alt ||
        "Artwork",

      title,

      description
    };
  }


  function renderArtLightbox(
    index
  ) {
    if (!artItems.length) {
      return;
    }

    const art =
      getArtData(
        artItems[index]
      );

    openLightbox(
      `
        <div
          class="lightbox-media-wrap"
          id="lightboxMediaWrap"
        >

          <img
            class="lightbox-media"
            src="${art.src}"
            alt="${art.alt}"
          >

          <div
            class="lightbox-caption"
          >
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


  function showNextArt(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (
      lightboxMode !== "art" ||
      !artItems.length
    ) {
      return;
    }

    currentArtIndex =
      (currentArtIndex + 1) %
      artItems.length;

    renderArtLightbox(
      currentArtIndex
    );
  }


  function showPreviousArt(
    event
  ) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (
      lightboxMode !== "art" ||
      !artItems.length
    ) {
      return;
    }

    currentArtIndex =
      (
        currentArtIndex -
        1 +
        artItems.length
      ) %
      artItems.length;

    renderArtLightbox(
      currentArtIndex
    );
  }


  artItems.forEach(
    (item, index) => {
      item.addEventListener(
        "click",
        () => {
          currentArtIndex =
            index;

          renderArtLightbox(
            currentArtIndex
          );
        }
      );
    }
  );


  // =========================================================
  // COMMUNITY LIGHTBOX
  // =========================================================

  function openCommunityLightbox(
    card
  ) {
    const image =
      $("img", card);

    const data =
      $(".community-data", card);

    const title =
      data?.dataset.title ||
      image?.alt ||
      "Community Highlight";

    const description =
      data?.dataset.description ||
      "";

    openLightbox(
      `
        <div
          class="lightbox-media-wrap"
          id="lightboxMediaWrap"
        >

          <img
            class="lightbox-media"
            src="${image?.src || ""}"
            alt="${
              image?.alt ||
              "Community photo"
            }"
          >

          <div
            class="lightbox-caption"
          >
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


  $$(".community-card").forEach(
    (card) => {
      card.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          openCommunityLightbox(
            card
          );
        }
      );
    }
  );


  // =========================================================
  // MUSIC / VIDEO LIGHTBOX
  // =========================================================

  function openMediaLightbox(
    media
  ) {
    if (
      !lightbox ||
      !lightboxContent
    ) {
      return;
    }

    const clone =
      media.cloneNode(true);

    if (
      clone.tagName === "VIDEO"
    ) {
      clone.controls = true;
      clone.autoplay = true;
      clone.muted = false;
      clone.playsInline = true;
    }

    lightboxContent.innerHTML =
      "";

    lightboxContent.appendChild(
      clone
    );

    lightbox.classList.add(
      "open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    if (lightboxPrev) {
      lightboxPrev.style.display =
        "none";
    }

    if (lightboxNext) {
      lightboxNext.style.display =
        "none";
    }

    lightboxMode = "media";
  }


  $$(
    "#musicTrack .media-thumb"
  ).forEach((media) => {
    media.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        openMediaLightbox(
          media
        );
      }
    );
  });


  // =========================================================
  // LIGHTBOX EVENTS
  // =========================================================

  lightboxClose?.addEventListener(
    "click",
    closeLightbox
  );

  lightboxNext?.addEventListener(
    "click",
    showNextArt
  );

  lightboxPrev?.addEventListener(
    "click",
    showPreviousArt
  );


  lightbox?.addEventListener(
    "click",
    (event) => {
      if (
        event.target === lightbox
      ) {
        closeLightbox();
      }
    }
  );


  document.addEventListener(
    "keydown",
    (event) => {
      if (
        !lightbox?.classList.contains(
          "open"
        )
      ) {
        return;
      }

      if (
        event.key === "Escape"
      ) {
        closeLightbox();
      }

      if (
        event.key ===
          "ArrowRight" &&
        lightboxMode === "art"
      ) {
        showNextArt();
      }

      if (
        event.key ===
          "ArrowLeft" &&
        lightboxMode === "art"
      ) {
        showPreviousArt();
      }
    }
  );


  // =========================================================
  // EMAIL REVEAL
  // =========================================================

  const emailBtn =
    $("#emailBtn");

  const emailReveal =
    $("#emailReveal");

  if (
    emailBtn &&
    emailReveal
  ) {
    emailBtn.addEventListener(
      "click",
      () => {
        emailReveal.style.display =
          "block";
      }
    );
  }
});