class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.mobileMenu = document.getElementById("mobileMenu");
    this.mobileOverlay = document.getElementById("mobileOverlay");
    this.hamburger = document.getElementById("hamburger");
    this.body = document.body;

    this.init();
  }

  init() {
    this.addEventListeners();
    this.handleResize();
  }

  addEventListeners() {
    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Close menu on window resize to desktop
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // Prevent scroll on touch devices when menu is open
    this.mobileOverlay.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.mobileMenu.classList.add("active");
    this.mobileOverlay.classList.add("active");
    this.hamburger.classList.add("open");
    this.body.classList.add("menu-open");

    // Focus trap
    this.trapFocus();
  }

  close() {
    this.isOpen = false;
    this.mobileMenu.classList.remove("active");
    this.mobileOverlay.classList.remove("active");
    this.hamburger.classList.remove("open");
    this.body.classList.remove("menu-open");

    // Return focus to toggle button
    document.querySelector(".mobile-menu-toggle").focus();
  }

  handleResize() {
    // Close mobile menu if window is resized to desktop
    if (window.innerWidth > 768 && this.isOpen) {
      this.close();
    }
  }

  trapFocus() {
    const focusableElements = this.mobileMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    this.mobileMenu.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

// Initialize mobile navigation
const mobileNav = new MobileNavigation();

// Global functions for inline event handlers
function toggleMobileMenu() {
  mobileNav.toggle();
}

function closeMobileMenu() {
  mobileNav.close();
}

// Close menu when clicking outside on desktop
document.addEventListener("click", (e) => {
  const isClickInsideMenu = document
    .getElementById("mobileMenu")
    .contains(e.target);
  const isClickOnToggle = document
    .querySelector(".mobile-menu-toggle")
    .contains(e.target);

  if (mobileNav.isOpen && !isClickInsideMenu && !isClickOnToggle) {
    mobileNav.close();
  }
});

// Spotlight Carousel JavaScript
// This script controls the functionality of the spotlight carousel, including slide transitions, autoplay, and user interactions.
class SpotlightCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".spotlight-item");
    this.totalSlides = this.slides.length;
    this.track = document.getElementById("carouselTrack");
    this.indicators = document.querySelectorAll(".carousel-indicator");
    this.progressBar = document.getElementById("progressBar");
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.isPlaying = true;
    this.autoplayInterval = null;
    this.progressInterval = null;

    this.init();
  }

  init() {
    this.updateCarousel();
    this.startAutoplay();
    this.addKeyboardControls();
    this.addTouchControls();
  }

  changeSlide(direction) {
    this.currentSlide += direction;

    if (this.currentSlide >= this.totalSlides) {
      this.currentSlide = 0;
    } else if (this.currentSlide < 0) {
      this.currentSlide = this.totalSlides - 1;
    }

    this.updateCarousel();
    this.resetProgress();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
    this.resetProgress();
  }

  updateCarousel() {
    // Update track position
    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });

    // Update slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlide);
    });

    // Reset animations
    this.resetAnimations();
  }

  resetAnimations() {
    const currentSlideEl = this.slides[this.currentSlide];
    const elements = currentSlideEl.querySelectorAll("h3, p, img");

    elements.forEach((el) => {
      el.style.animation = "none";
      el.offsetHeight; // Trigger reflow
      el.style.animation = null;
    });
  }

  startAutoplay() {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
    if (this.progressInterval) clearInterval(this.progressInterval);

    this.autoplayInterval = setInterval(() => {
      if (this.isPlaying) {
        this.changeSlide(1);
      }
    }, 5000);

    this.startProgress();
  }

  startProgress() {
    this.progressBar.classList.remove("active");
    setTimeout(() => {
      this.progressBar.classList.add("active");
    }, 50);

    this.progressInterval = setInterval(() => {
      if (this.isPlaying) {
        this.progressBar.classList.remove("active");
        setTimeout(() => {
          this.progressBar.classList.add("active");
        }, 50);
      }
    }, 5000);
  }

  resetProgress() {
    this.progressBar.classList.remove("active");
    if (this.isPlaying) {
      setTimeout(() => {
        this.progressBar.classList.add("active");
      }, 50);
    }
  }

  toggleAutoplay() {
    this.isPlaying = !this.isPlaying;
    this.playPauseBtn.textContent = this.isPlaying ? "⏸" : "▶";
    this.playPauseBtn.setAttribute(
      "aria-label",
      this.isPlaying ? "Pause autoplay" : "Start autoplay"
    );

    if (this.isPlaying) {
      this.resetProgress();
    } else {
      this.progressBar.classList.remove("active");
    }
  }

  addKeyboardControls() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.changeSlide(-1);
      } else if (e.key === "ArrowRight") {
        this.changeSlide(1);
      } else if (e.key === " ") {
        e.preventDefault();
        this.toggleAutoplay();
      }
    });
  }

  addTouchControls() {
    let startX = 0;
    let endX = 0;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.track.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.changeSlide(1);
        } else {
          this.changeSlide(-1);
        }
      }
    });
  }
}

// Global functions for inline event handlers
let carousel;

function changeSlide(direction) {
  carousel.changeSlide(direction);
}

function goToSlide(index) {
  carousel.goToSlide(index);
}

function toggleAutoplay() {
  carousel.toggleAutoplay();
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  carousel = new SpotlightCarousel();
});

// Pause autoplay when page is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden && carousel.isPlaying) {
    carousel.toggleAutoplay();
  }
});
