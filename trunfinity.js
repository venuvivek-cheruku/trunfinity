function createCarousel(
  containerSelector,
  slideSelector,
  prevBtn,
  nextBtn,
  options
) {
  const carousel = document.querySelector(containerSelector);
  const images = Array.from(document.querySelectorAll(slideSelector));
  let currentIndex = 0;
  let prevIndex;
  let isTransitioning = false; // Flag to track transition state

  let totalImages = images.length;
  let imageGap = 0; // Adjust the gap between images as needed

  /// Set up options (including the new option for dynamic dots)
  const {
    endless = false,
    autoplay = false,
    arrowButtons = false,
    touchSwipe = false,
    keyboardControls = false,
    autoplaySpeed = 3000,
    dynamicDots = false,
    autoplayPauseOnHover = false,
    resetOnInteraction = false,
  } = options;

  if (endless && totalImages > 1) {
    // Duplicate the logos to create a seamless loop
    images.forEach((logo, index) => {
      const clone = logo.cloneNode(true);
      carousel.appendChild(clone);
      images.push(clone); // Add the cloned slide to the 'images' array

      totalImages = images.length; // Update the totalSlides count
      // Add class names to differentiate original and cloned images
      logo.classList.add("original-slide");
      clone.classList.add("cloned-slide");
    });

    console.log(totalImages);

    prevIndex = currentIndex = 0;
  }

  function handleLeftArrowClick() {
    if (totalImages <= 1 || isTransitioning) return; // Prevent double click during transition
    isTransitioning = true;

    const imageWidth = images[0].offsetWidth;
    const totalWidth = imageWidth + imageGap;

    prevIndex = currentIndex;
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    if (carousel) {
      carousel.style.transform = `translateX(-${totalWidth}px)`;
      carousel.insertBefore(images[currentIndex], carousel.firstChild);
    }
    setTimeout(() => {
      carousel.style.transform = "";
      carousel.style.transition = "transform 0.5s ease-in-out";
      if (dynamicDots) {
        updateDots();
      }
    }, 50);
    setTimeout(() => {
      carousel.style.transition = "none";
      isTransitioning = false;
    }, 500);
  }

  function handleRightArrowClick() {
    if (totalImages <= 1 || isTransitioning) return; // Prevent double click during transition
    isTransitioning = true;

    prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % totalImages;
    if (carousel) {
      const imageWidth = images[0].offsetWidth;
      const totalWidth = imageWidth + imageGap;
      carousel.style.transition = "transform 0.5s ease-in-out";
      carousel.style.transform = `translateX(-${totalWidth}px)`;
      setTimeout(() => {
        carousel.appendChild(images[prevIndex]);
        console.log(carousel.firstChild);
        carousel.style.transition = "none";
        carousel.style.transform = "";
        isTransitioning = false;
        if (dynamicDots) {
          updateDots();
        }
      }, 500);
    }
  }

  // Create and update dynamic dots
  let dotsContainer;

  if (dynamicDots) {
    dotsContainer = document.createElement("div");
    dotsContainer.classList.add("dots-container");
    carousel.parentNode.insertBefore(dotsContainer, carousel.nextSibling);

    function createDot(index) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        if (isTransitioning) return;
        handleDotClick(index);
      });
      dotsContainer.appendChild(dot);
    }

    function handleDotClick(index) {
      if (isTransitioning || index === currentIndex) return;
      const diff = index - currentIndex;

      if (diff > 0) {
        handleRightArrowClick(diff);
      } else if (diff < 0) {
        handleLeftArrowClick(-diff);
      }

      if (autoplay) {
        resetAutoplay();
      }
    }

    images.forEach((_, index) => {
      createDot(index);
    });

    updateDots();

    function updateDots() {
      const activeDot = dotsContainer.querySelector(".active-dot");
      if (activeDot) activeDot.classList.remove("active-dot");

      let targetIndex = currentIndex % (totalImages / 2); // Use modulo to get index within non-cloned slides

      if (targetIndex < 0) {
        targetIndex += totalImages / 2; // Adjust negative index
      }

      const currentDot = dotsContainer.children[targetIndex];
      if (currentDot) currentDot.classList.add("active-dot");
    }
  }
  // Arrow Keys
  if (arrowButtons) {
    const leftArrow = document.querySelector(prevBtn);
    const rightArrow = document.querySelector(nextBtn);
    if (leftArrow && rightArrow) {
      leftArrow.addEventListener("click", () => {
        handleLeftArrowClick();
        if (autoplay) {
          resetAutoplay(); // Add resetAutoplay function call
        }
      });
      rightArrow.addEventListener("click", () => {
        handleRightArrowClick();
        if (autoplay) {
          resetAutoplay(); // Add resetAutoplay function call
        }
      });
      if (resetOnInteraction) {
        leftArrow.addEventListener("click", resetAutoplay);
        rightArrow.addEventListener("click", resetAutoplay);
      }
    }
  }

  // Touch swipe
  if (touchSwipe) {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event) {
      touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
      if (isTransitioning) return; // Prevent double swipe during transition

      const touchDiff = touchEndX - touchStartX;

      if (touchDiff > 0) {
        handleLeftArrowClick();
      } else if (touchDiff < 0) {
        handleRightArrowClick();
      }

      if (autoplay) {
        resetAutoplay(); // Add resetAutoplay function call
      }
    }
    if (carousel) {
      carousel.addEventListener("touchstart", handleTouchStart, false);
      carousel.addEventListener("touchmove", handleTouchMove, false);
      carousel.addEventListener("touchend", handleTouchEnd, false);
    }
  }

  // Keyboard controls
  if (keyboardControls) {
    document.addEventListener("keydown", (event) => {
      if (isTransitioning) return; // Prevent double keydown during transition

      handleKeyDown(event);
      if (autoplay) {
        resetAutoplay(); // Add resetAutoplay function call
      }
    });

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        handleLeftArrowClick();
      } else if (event.key === "ArrowRight") {
        handleRightArrowClick();
      }
    }
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Autoplay
  let autoplayInterval;

  function startAutoplay() {
    clearInterval(autoplayInterval); // Clear previous interval
    autoplayInterval = setInterval(() => {
      handleRightArrowClick();
    }, autoplaySpeed);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function pauseAutoplay() {
    clearInterval(autoplayInterval);
  }

  if (autoplayPauseOnHover) {
    if (carousel) {
      carousel.addEventListener("mouseover", pauseAutoplay);
      carousel.addEventListener("mouseout", startAutoplay);
    }
  }

  if (autoplay) {
    startAutoplay();
  }

  //reset on Interaction
  if (resetOnInteraction) {
    const carouselItems = carousel.querySelectorAll(slideSelector, ".dot");
    carouselItems.forEach((item) => {
      item.addEventListener("click", resetAutoplay);
    });
  }
}

// Usage:
createCarousel(".client-logos", ".client-logo", ".prev", ".next", {
  endless: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrowButtons: true,
  touchSwipe: true,
  keyboardControls: true,
  dynamicDots: false,
  autoplayPauseOnHover: false,
  resetOnInteraction: false,
});
