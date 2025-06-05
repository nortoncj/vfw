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
