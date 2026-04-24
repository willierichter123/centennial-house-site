const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const pageMain = document.querySelector("main.page");
const homeGalleryTrack = document.querySelector(".home-gallery-track");
const homeGalleryViewport = document.querySelector(".home-gallery-viewport");
const homeGalleryShell = document.querySelector(".home-gallery-shell");
const bookingBarWrap = document.querySelector(".booking-bar-wrap");
const bookingBar = bookingBarWrap?.querySelector(".booking-bar");
const featureMediaPanels = document.querySelectorAll(".feature-media");
const scrollFadeTargets = document.querySelectorAll(
  [
    ".content .section-kicker",
    ".content .welcome-note h2",
    ".content .welcome-note-body p",
    ".content .welcome-signoff",
    ".content .feature-copy h2",
    ".content .feature-copy p",
    ".content .feature-media",
    ".content .home-gallery-header .section-kicker",
    ".content .home-gallery-header h2",
    ".content .home-gallery-section .cta",
    ".content .home-gallery-card",
    ".content .room-detail-heading .section-kicker",
    ".content .room-detail-heading h2",
    ".content .room-spec",
    ".content .room-detail-summary",
    ".content .room-detail-copy p",
    ".content .room-detail-booking .cta",
    ".content .room-photo-card",
    ".content .section-header h2",
    ".content .section > div > .cta",
    ".content .room-link img",
    ".content .room-card .room-meta",
    ".content .room-card h3",
    ".content .room-card p",
  ].join(", "),
);

if (pageMain) {
  if (!pageMain.id) {
    pageMain.id = "main-content";
  }
  if (!pageMain.hasAttribute("tabindex")) {
    pageMain.setAttribute("tabindex", "-1");
  }

  if (!document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = `#${pageMain.id}`;
    skipLink.textContent = "Skip to content";
    document.body.prepend(skipLink);
  }
}

function makeScrollableRegion(element, label) {
  if (!element) return;
  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "0");
  }
  if (!element.hasAttribute("role")) {
    element.setAttribute("role", "region");
  }
  if (label && !element.hasAttribute("aria-label")) {
    element.setAttribute("aria-label", label);
  }
}

function addHorizontalScrollKeys(element) {
  if (!element) return;
  element.addEventListener("keydown", (event) => {
    const distance = Math.max(120, Math.round(element.clientWidth * 0.8));

    if (event.key === "ArrowRight") {
      event.preventDefault();
      element.scrollBy({ left: distance, behavior: "smooth" });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      element.scrollBy({ left: -distance, behavior: "smooth" });
    } else if (event.key === "Home") {
      event.preventDefault();
      element.scrollTo({ left: 0, behavior: "smooth" });
    } else if (event.key === "End") {
      event.preventDefault();
      element.scrollTo({ left: element.scrollWidth, behavior: "smooth" });
    }
  });
}

document.querySelectorAll(".room-filters").forEach((filters) => {
  const existingLabel = filters.getAttribute("aria-label") || "Filter options";
  const label = existingLabel.includes("Scroll horizontally")
    ? existingLabel
    : `${existingLabel}. Scroll horizontally to browse all filters.`;

  makeScrollableRegion(filters, label);
  addHorizontalScrollKeys(filters);
});

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMenu() {
  if (!header || !menuToggle) return;
  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

if (menuToggle && nav && header) {
  menuToggle.addEventListener("click", () => {
    const willOpen = !header.classList.contains("menu-open");
    header.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      bookingBarWrap?.classList.remove("is-offer-open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (featureMediaPanels.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function syncFeatureParallax() {
    if (prefersReducedMotion) {
      featureMediaPanels.forEach((panel) => {
        panel.style.setProperty("--feature-parallax-offset", "0px");
      });
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    const maxOffset = window.innerWidth <= 720 ? 16 : 28;
    const movementFactor = window.innerWidth <= 720 ? -0.05 : -0.08;

    featureMediaPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const panelCenter = rect.top + rect.height / 2;
      const distanceFromCenter = panelCenter - viewportCenter;
      const offset = Math.max(
        -maxOffset,
        Math.min(maxOffset, distanceFromCenter * movementFactor),
      );
      panel.style.setProperty("--feature-parallax-offset", `${offset}px`);
    });
  }

  syncFeatureParallax();
  window.addEventListener("scroll", syncFeatureParallax, { passive: true });
  window.addEventListener("resize", syncFeatureParallax);
}

if (scrollFadeTargets.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const shouldAnimateScrollFade =
    !prefersReducedMotion &&
    "IntersectionObserver" in window;

  if (shouldAnimateScrollFade) {
    const scrollFadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    scrollFadeTargets.forEach((element, index) => {
      element.classList.add("scroll-fade");
      element.style.setProperty("--scroll-fade-delay", `${(index % 3) * 90}ms`);
      scrollFadeObserver.observe(element);
    });
  } else {
    scrollFadeTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
  }
}

if (bookingBarWrap && bookingBar) {
  const arriveInput = bookingBar.querySelector('input[name="arrive"]');
  const departInput = bookingBar.querySelector('input[name="depart"]');

  function openBookingOffer() {
    bookingBarWrap.classList.add("is-offer-open");
  }

  function closeBookingOffer() {
    bookingBarWrap.classList.remove("is-offer-open");
  }

  function syncBookingOffer() {
    if (departInput?.value) {
      openBookingOffer();
    } else {
      closeBookingOffer();
    }
  }

  departInput?.addEventListener("change", syncBookingOffer);
  departInput?.addEventListener("input", syncBookingOffer);
  arriveInput?.addEventListener("change", syncBookingOffer);

  bookingBar.addEventListener("focusout", () => {
    window.setTimeout(syncBookingOffer, 0);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!bookingBarWrap.contains(event.target)) {
      syncBookingOffer();
    }
  });
}

document.querySelectorAll(".room-carousel-track").forEach((track) => {
  const section =
    track.closest("[data-room-carousel-section]") ||
    track.closest(
      ".room-showcase-section, .room-detail-gallery-section, .more-rooms-section",
    );
  const prevButton = section?.querySelector('[data-room-carousel="prev"]');
  const nextButton = section?.querySelector('[data-room-carousel="next"]');
  const parentLabel =
    track.parentElement?.getAttribute("aria-label") || "Scrollable carousel";
  const regionLabel = parentLabel.includes("Scroll horizontally")
    ? parentLabel
    : `${parentLabel}. Scroll horizontally to browse more items.`;

  makeScrollableRegion(track, regionLabel);
  addHorizontalScrollKeys(track);

  function scrollRooms(direction) {
    const firstCard =
      track.querySelector(".room-carousel-card, .room-photo-card") ||
      track.firstElementChild;
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width
      : track.clientWidth * 0.8;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16");
    const distance = cardWidth + gap;

    track.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  }

  prevButton?.addEventListener("click", () => {
    scrollRooms(-1);
  });

  nextButton?.addEventListener("click", () => {
    scrollRooms(1);
  });
});

document.querySelectorAll(".ch-messages").forEach((messages) => {
  makeScrollableRegion(
    messages,
    "Chat conversation history. Scroll vertically to review earlier messages.",
  );
});

if (homeGalleryTrack) {
  const prevButton = document.querySelector('[data-home-gallery="prev"]');
  const nextButton = document.querySelector('[data-home-gallery="next"]');
  const dots = Array.from(
    document.querySelectorAll("[data-home-gallery-dot]"),
  );
  const cards = Array.from(homeGalleryTrack.querySelectorAll(".home-gallery-card"));
  let activeGalleryIndex = 0;
  let galleryScrollFrame = 0;
  let galleryTouchAxis = null;
  let galleryTouchStartX = 0;
  let galleryTouchStartY = 0;
  let galleryTouchStartScrollLeft = 0;
  let galleryTouchPendingScrollLeft = 0;
  let galleryTouchScrollFrame = 0;
  let galleryTouchLastX = 0;
  let galleryTouchLastTime = 0;
  let galleryTouchVelocity = 0;

  function isMobileGalleryLayout() {
    return window.innerWidth <= 720;
  }

  function centerGalleryCard(index, behavior = "smooth") {
    const card = cards[index];
    if (!card || !homeGalleryViewport) return;

    const targetLeft =
      card.offsetLeft - (homeGalleryViewport.clientWidth - card.clientWidth) / 2;

    homeGalleryTrack.scrollTo({
      left: targetLeft,
      behavior,
    });
  }

  function syncGalleryDots(index) {
    activeGalleryIndex = index;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function findClosestGalleryCard(scrollLeft = homeGalleryTrack.scrollLeft) {
    if (!homeGalleryViewport || !cards.length) return 0;

    const viewportCenter = scrollLeft + homeGalleryViewport.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function handleGalleryScroll() {
    if (galleryScrollFrame) window.cancelAnimationFrame(galleryScrollFrame);
    galleryScrollFrame = window.requestAnimationFrame(() => {
      syncGalleryDots(findClosestGalleryCard());
    });
  }

  function flushGalleryTouchScroll() {
    homeGalleryTrack.scrollLeft = galleryTouchPendingScrollLeft;
    galleryTouchScrollFrame = 0;
  }

  function settleMobileGallerySwipe() {
    if (!isMobileGalleryLayout()) return;

    const projectedScrollLeft =
      homeGalleryTrack.scrollLeft - galleryTouchVelocity * 180;
    const targetIndex = findClosestGalleryCard(projectedScrollLeft);
    centerGalleryCard(targetIndex);
    syncGalleryDots(targetIndex);
  }

  function scrollHomeGallery(direction) {
    const nextIndex = Math.max(
      0,
      Math.min(cards.length - 1, activeGalleryIndex + direction),
    );
    centerGalleryCard(nextIndex);
  }

  prevButton?.addEventListener("click", () => {
    scrollHomeGallery(-1);
  });

  nextButton?.addEventListener("click", () => {
    scrollHomeGallery(1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      centerGalleryCard(index);
      syncGalleryDots(index);
    });
  });

  homeGalleryTrack.addEventListener("scroll", handleGalleryScroll, {
    passive: true,
  });

  homeGalleryShell?.addEventListener(
    "touchstart",
    (event) => {
      if (!isMobileGalleryLayout() || event.touches.length !== 1) return;
      if (event.target.closest("button, a")) return;
      const touch = event.touches[0];
      galleryTouchAxis = null;
      galleryTouchStartX = touch.clientX;
      galleryTouchStartY = touch.clientY;
      galleryTouchStartScrollLeft = homeGalleryTrack.scrollLeft;
      galleryTouchPendingScrollLeft = homeGalleryTrack.scrollLeft;
      galleryTouchLastX = touch.clientX;
      galleryTouchLastTime = performance.now();
      galleryTouchVelocity = 0;
    },
    { passive: true },
  );

  homeGalleryShell?.addEventListener(
    "touchmove",
    (event) => {
      if (!isMobileGalleryLayout() || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const deltaX = touch.clientX - galleryTouchStartX;
      const deltaY = touch.clientY - galleryTouchStartY;

      if (!galleryTouchAxis) {
        if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
        galleryTouchAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      }

      if (galleryTouchAxis !== "x") return;

      event.preventDefault();
      galleryTouchPendingScrollLeft = galleryTouchStartScrollLeft - deltaX;

      const now = performance.now();
      const deltaTime = Math.max(1, now - galleryTouchLastTime);
      const instantVelocity = (touch.clientX - galleryTouchLastX) / deltaTime;
      galleryTouchVelocity = galleryTouchVelocity * 0.7 + instantVelocity * 0.3;
      galleryTouchLastX = touch.clientX;
      galleryTouchLastTime = now;

      if (!galleryTouchScrollFrame) {
        galleryTouchScrollFrame = window.requestAnimationFrame(
          flushGalleryTouchScroll,
        );
      }
    },
    { passive: false },
  );

  homeGalleryShell?.addEventListener(
    "touchend",
    () => {
      if (galleryTouchScrollFrame) {
        window.cancelAnimationFrame(galleryTouchScrollFrame);
        flushGalleryTouchScroll();
      }
      if (galleryTouchAxis === "x") {
        settleMobileGallerySwipe();
      }
      galleryTouchAxis = null;
      syncGalleryDots(findClosestGalleryCard());
    },
    { passive: true },
  );

  homeGalleryShell?.addEventListener(
    "touchcancel",
    () => {
      if (galleryTouchScrollFrame) {
        window.cancelAnimationFrame(galleryTouchScrollFrame);
        galleryTouchScrollFrame = 0;
      }
      galleryTouchAxis = null;
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    centerGalleryCard(activeGalleryIndex, "auto");
  });

  syncGalleryDots(1);

  window.addEventListener("load", () => {
    if (window.scrollY < 8) {
      centerGalleryCard(1, "auto");
    }
  });
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "auto";
}

const roomFilters = document.querySelectorAll("[data-room-filter]");
const roomGrid = document.querySelector("[data-room-grid]");
if (roomFilters.length && roomGrid) {
  const cards = Array.from(roomGrid.querySelectorAll(".room-card"));
  roomFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.roomFilter;
      roomFilters.forEach((b) => {
        const active = b === button;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      cards.forEach((card) => {
        const tags = (card.dataset.roomTags || "").split(/\s+/);
        const show = filter === "all" || tags.includes(filter);
        card.hidden = !show;
      });
    });
  });
}
