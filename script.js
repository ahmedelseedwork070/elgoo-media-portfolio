/* ==========================================================================
   E L G O O   M E D I A - Main JavaScript
   Author / Designer: Ahmed Elsaeed
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. PAGE SCROLL RESTORATION & INIT
       ========================================================================== */
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  });

  /* ==========================================================================
       2. BACK TO TOP BUTTON
       ========================================================================== */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 400) {
          backToTop.classList.add("show");
        } else {
          backToTop.classList.remove("show");
        }
      },
      { passive: true },
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ==========================================================================
       3. AUTOMATIC IMAGE SLIDER
       ========================================================================== */
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let sliderInterval = null;

  function showSlide(index) {
    if (!slides.length || !dots.length) return;

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => {
      dot.classList.remove("active");
      dot.setAttribute("aria-selected", "false");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    dots[index].setAttribute("aria-selected", "true");
  }

  function nextSlide() {
    if (!slides.length) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 0 && dots.length > 0) {
    sliderInterval = setInterval(nextSlide, 4000);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);

        // Reset timer on manual interaction
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 4000);
      });
    });

    // Pause slider when tab is hidden to save performance
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(sliderInterval);
      } else {
        sliderInterval = setInterval(nextSlide, 4000);
      }
    });
  }

  /* ==========================================================================
       4. COUNTER ANIMATION (IntersectionObserver)
       ========================================================================== */
  const counters = document.querySelectorAll(".counter");
  const statsSection = document.querySelector("#stats");
  let counterStarted = false;

  function startCounters() {
    if (counterStarted || !counters.length) return;
    counterStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const prefix = counter.dataset.prefix || "";
      const suffix = counter.dataset.suffix || "";
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function (easeOutQuart)
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easedProgress * target);

        counter.textContent =
          prefix + currentValue.toLocaleString("en-US") + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent =
            prefix + target.toLocaleString("en-US") + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if (statsSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            counterObserver.unobserve(statsSection);
          }
        });
      },
      { threshold: 0.2 },
    );
    counterObserver.observe(statsSection);
  }

  /* ==========================================================================
       5. MOBILE NAVIGATION & ACCESSIBILITY
       ========================================================================== */
  const menuBtn = document.getElementById("menuBtn");
  const navbar = document.getElementById("navbar");

  if (menuBtn && navbar) {
    const menuIcon = menuBtn.querySelector("i");

    function toggleMenu(forceClose = false) {
      const isOpen = forceClose ? false : navbar.classList.toggle("active");

      menuBtn.setAttribute("aria-expanded", isOpen);
      menuBtn.setAttribute(
        "aria-label",
        isOpen ? "إغلاق القائمة الرئيسية" : "فتح القائمة الرئيسية",
      );

      if (menuIcon) {
        menuIcon.classList.toggle("fa-bars", !isOpen);
        menuIcon.classList.toggle("fa-xmark", isOpen);
      }
    }

    menuBtn.addEventListener("click", () => toggleMenu());

    // Close menu when clicking navigation links
    navbar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => toggleMenu(true));
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target) && !menuBtn.contains(event.target)) {
        toggleMenu(true);
      }
    });

    // Close menu on ESC key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        toggleMenu(true);
      }
    });
  }

  /* ==========================================================================
       6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
       ========================================================================== */
  const revealElements = document.querySelectorAll(
    ".service-card, .stat-card, .contact-content, .hero-content, .hero-images",
  );

  if (revealElements.length > 0) {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      revealElements.forEach((el) => (el.style.opacity = "1"));
    } else {
      // Add base reveal class via JS for graceful degradation
      revealElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(25px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }
});
