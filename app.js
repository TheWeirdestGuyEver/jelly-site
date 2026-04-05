const items = document.querySelectorAll(".item");
const categories = document.querySelector(".categories");
const videos = document.querySelectorAll(".bg-video");
const menuToggle = document.getElementById("menuToggle");
const menuWrap = document.querySelector(".menu-wrap");
const jellyLogos = document.querySelectorAll(".jelly-logo");
const defaultVideoId = "video-showcase";

let activeCategoryId = null;

function isMobileViewport() {
  return window.innerWidth <= 768;
}

function getVideoSource(video) {
  return isMobileViewport() ? video.dataset.mobile : video.dataset.desktop;
}

function assignResponsiveSources() {
  videos.forEach((video) => {
    const correctSrc = getVideoSource(video);

    if (video.getAttribute("src") !== correctSrc) {
      const wasActive = video.classList.contains("active");
      video.setAttribute("src", correctSrc);
      video.load();

      if (wasActive) {
        video.play().catch(() => {});
      }
    }
  });
}

function setActiveVideo(videoId) {
  videos.forEach((video) => {
    const isActive = video.id === videoId;
    video.classList.toggle("active", isActive);

    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

function clearActiveText() {
  items.forEach((item) => item.classList.remove("active-text"));
}

function resetToShowcase() {
  activeCategoryId = null;
  clearActiveText();

  if (categories) {
    categories.classList.remove("hovering");
  }

  setActiveVideo(defaultVideoId);
}

function activateCategory(item, targetId) {
  activeCategoryId = targetId;
  categories.classList.add("hovering");
  clearActiveText();
  item.classList.add("active-text");
  setActiveVideo(targetId);
}

function setupCategoryInteractions() {
  if (!items.length || !categories || !videos.length) return;

  items.forEach((item) => {
    const targetId = item.dataset.target;

    item.addEventListener("mouseenter", () => {
      if (isMobileViewport()) return;
      activateCategory(item, targetId);
    });

    item.addEventListener("click", (event) => {
      if (!isMobileViewport()) return;

      event.stopPropagation();

      if (activeCategoryId === targetId) {
        resetToShowcase();
        return;
      }

      activateCategory(item, targetId);
    });
  });

  categories.addEventListener("mouseleave", () => {
    if (isMobileViewport()) return;
    resetToShowcase();
  });

  document.addEventListener("click", (event) => {
    if (!isMobileViewport()) return;
    if (!categories) return;

    const clickedInsideCategories = categories.contains(event.target);
    const clickedInsideMenu = menuWrap && menuWrap.contains(event.target);

    if (!clickedInsideCategories && !clickedInsideMenu) {
      resetToShowcase();
    }
  });
}

function setupMenu() {
  if (!menuToggle || !menuWrap) return;

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menuWrap.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  const menuLink = menuWrap.querySelector(".menu-link");
  if (menuLink) {
    menuLink.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("click", (event) => {
    if (!menuWrap.contains(event.target)) {
      menuWrap.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function triggerWobble(logo) {
  logo.classList.remove("wobble");
  void logo.offsetWidth;
  logo.classList.add("wobble");
}

function setupLogoBehaviour() {
  jellyLogos.forEach((logo) => {
    logo.addEventListener("click", (event) => {
      const isHomePage = document.body.classList.contains("home-page");
      const isContactPage = document.body.classList.contains("contact-page");
      const href = logo.getAttribute("href");

      if (isHomePage) {
        event.preventDefault();
        triggerWobble(logo);
      }

      if (isContactPage) {
        event.preventDefault();
        triggerWobble(logo);

        setTimeout(() => {
          window.location.href = href || "./index.html";
        }, 520);
      }
    });

    logo.addEventListener("animationend", () => {
      logo.classList.remove("wobble");
    });
  });
}

function initVideos() {
  assignResponsiveSources();

  videos.forEach((video) => {
    if (video.classList.contains("active")) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const activeVideo = document.querySelector(".bg-video.active");
    const activeId = activeVideo ? activeVideo.id : defaultVideoId;

    assignResponsiveSources();
    setActiveVideo(activeId);
  }, 150);
});

setupCategoryInteractions();
setupMenu();
setupLogoBehaviour();
initVideos();