function createCarousel(
  containerSelector,
  slideSelector,
  prevBtn,
  nextBtn,
  options
) {
  const carousel = document.querySelector(containerSelector);
  const images = Array.from(document.querySelectorAll(slideSelector));
  const leftArrow = document.querySelector(prevBtn);
  const rightArrow = document.querySelector(nextBtn);
  let currentIndex = 0;
  let prevIndex;
  let isTransitioning = false; // Flag to track transition state
  let dotsContainer;
  let carouselStyles;
  let imageGap;
  let totalImages = images.length;
  let isLastSlide = false;
  if (carousel) {
    carouselStyles = window.getComputedStyle(carousel);
    if (parseFloat(carouselStyles.gap) > 0) {
      imageGap = parseFloat(carouselStyles.gap);
    } else {
      imageGap = 0;
    }
  }

  //Set up options
  const {
    endless = false,
    autoplay = false,
    arrowButtons = false,
    touchSwipe = false,
    keyboardKeys = false,
    autoplaySpeed = 3000,
    cursorArrows = false,
    mouseDrag = false,
    hoverSwipe = false,
    dynamicDots = false,
    autoplayPauseOnHover = false,
    resetOnInteraction = true,
    sliderVertical = false,
  } = options;

  //data attributes
  images.forEach((slide, index) => {
    slide.dataset.slideIndex = index; // Store the slide index in a data attribute
  });

  if (endless && totalImages > 1) {
    images.forEach((slide, index) => {
      const clone = slide.cloneNode(true);
      carousel.appendChild(clone);
      images.push(clone);
      totalImages = images.length;
    });

    prevIndex = currentIndex = 0;
  }

  function updateArrowButtons() {
    if (arrowButtons && (leftArrow || rightArrow)) {
      if (currentIndex === 0 && !endless) {
        leftArrow.style.opacity = 0.5;
        leftArrow.style.cursor = "not-allowed";
      } else {
        leftArrow.style.opacity = 1;
        leftArrow.style.cursor = "pointer";
      }

      if (isLastSlide && !endless) {
        rightArrow.style.opacity = 0.5;
        rightArrow.style.cursor = "not-allowed";
      } else {
        rightArrow.style.opacity = 1;
        rightArrow.style.cursor = "pointer";
      }
    }
  }

  function isLastSlideFullyVisible() {
    if (!carousel || !images || images.length === 0) {
      return false;
    }

    const lastSlideIndex = images.length - 1;
    const lastSlide = images[lastSlideIndex];

    const containerRect = carousel.getBoundingClientRect();
    const lastSlideRect = lastSlide.getBoundingClientRect();

    if (sliderVertical) {
      isLastSlide = lastSlideRect.top <= containerRect.bottom + imageGap;
    } else {
      isLastSlide = lastSlideRect.left <= containerRect.right + imageGap;
    }

    return isLastSlide;
  }

  window.addEventListener("resize", () => {
    isLastSlideFullyVisible();
  });

  window.addEventListener("load", () => {
    isLastSlideFullyVisible();
  });

  function handleLeftArrowClick() {
    if (!endless && currentIndex === 0) {
      updateArrowButtons();
      return;
    }

    isLastSlide = false;

    if (totalImages <= 1 || isTransitioning) return; // Prevent double click during transition
    isTransitioning = true;

    prevIndex = currentIndex;
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;

    const imageWidth = images[currentIndex].offsetWidth;
    const totalWidth = imageWidth + imageGap;

    if (carousel) {
      if (sliderVertical) {
        const imageHeight = images[currentIndex].offsetHeight;
        const totalHeight = imageHeight + imageGap;
        carousel.style.transform = `translateY(-${totalHeight}px)`;
      } else {
        carousel.style.transform = `translateX(-${totalWidth}px)`;
      }
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
      if (!endless) {
        updateArrowButtons();
      }
    }, 500);
  }

  function handleRightArrowClick() {
    if (!endless && currentIndex === totalImages - 1) {
      return;
    }
    if (!endless && isLastSlide) {
      updateArrowButtons();
      return;
    }
    isLastSlideFullyVisible();

    if (totalImages <= 1 || isTransitioning) return;
    isTransitioning = true;

    prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % totalImages;

    if (carousel) {
      const imageWidth = images[prevIndex].offsetWidth;
      const totalWidth = imageWidth + imageGap;
      if (sliderVertical) {
        const imageHeight = images[prevIndex].offsetHeight;
        const totalHeight = imageHeight + imageGap;
        carousel.style.transform = `translateY(-${totalHeight}px)`;
      } else {
        carousel.style.transform = `translateX(-${totalWidth}px)`;
      }
      carousel.style.transition = "transform 0.5s ease-in-out";

      setTimeout(() => {
        carousel.appendChild(images[prevIndex]);
        carousel.style.transition = "none";
        carousel.style.transform = "";
        isTransitioning = false;
        if (!endless) {
          updateArrowButtons();
        }
        if (dynamicDots) {
          updateDots();
        }
      }, 500);
    }
  }

  // Create and update dynamic dots

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

      if (autoplay && resetOnInteraction) {
        resetAutoplay();
      }
    }

    images.forEach((_, index) => {
      // Skip creating dots for cloned slides
      if (index >= totalImages / 2) {
        return;
      }
      createDot(index);
    });

    updateDots();

    function updateDots() {
      const activeDot = dotsContainer.querySelector(".active-dot");
      if (activeDot) activeDot.classList.remove("active-dot");

      let targetIndex = currentIndex % (totalImages / 2); // Use modulo to get index within non-cloned slides

      if (targetIndex < 0 && !endless) {
        targetIndex += totalImages / 2; // Adjust negative index
      }

      const currentDot = dotsContainer.children[targetIndex];
      if (currentDot) currentDot.classList.add("active-dot");
    }
  }

  // Drag swipe
  function addDragSwipe() {
    let isDragging = false;
    let startX = 0;
    let endX = 0;

    function handleMouseDown(event) {
      isDragging = false; // Reset isDragging to false on touch start
      startX = event.clientX;
      images.forEach((slide) => {
        const imageElements = slide.querySelectorAll("img");
        if (imageElements.length > 0) {
          imageElements.forEach((imageElement) => {
            if (imageElement) {
              imageElement.style.pointerEvents = "none";
              imageElement.style.userSelect = "none";
            }
          });
        } else {
          slide.style.userSelect = "none";
        }
      });
    }

    function handleMouseMove(event) {
      if (!isDragging) {
        const diff = Math.abs(event.clientX - startX);
        if (diff > 10) {
          isDragging = true;
        }
      }
      if (isDragging) {
        endX = event.clientX;
      }
    }

    function handleMouseUp() {
      if (!isDragging) {
        return;
      }
      isDragging = false;
      images.forEach((slide) => {
        const imageElements = slide.querySelectorAll("img");
        imageElements.forEach((imageElement) => {
          if (imageElement) {
            imageElement.style.pointerEvents = "auto";
            imageElement.style.userSelect = "default";
          }
        });
        slide.style.cursor = "grab";
      });

      if (isTransitioning) return; // Prevent double swipe during transition

      const diff = endX - startX;

      if (diff > 0) {
        handleLeftArrowClick();
      } else if (diff < 0) {
        handleRightArrowClick();
      }

      if (autoplay && resetOnInteraction) {
        resetAutoplay(); // Add resetAutoplay function call
      }
    }

    //touchDrag

    function handleTouchStart(event) {
      isDragging = false; // Reset isDragging to false on touch start
      startX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      if (!isDragging) {
        const touchDiff = Math.abs(event.touches[0].clientX - startX);
        if (touchDiff > 10) {
          isDragging = true;
        }
      }

      if (isDragging) {
        endX = event.touches[0].clientX;
      }
    }

    function handleTouchEnd() {
      if (!isDragging) {
        // Handle tap/click action here if needed
        return;
      }

      isDragging = false;

      if (isTransitioning) return; // Prevent double swipe during transition

      const touchDiff = endX - startX;

      if (touchDiff > 0) {
        handleLeftArrowClick();
      } else if (touchDiff < 0) {
        handleRightArrowClick();
      }

      if (autoplay && resetOnInteraction) {
        resetAutoplay(); // Add resetAutoplay function call
      }
    }

    if (carousel) {
      carousel.addEventListener("mousedown", handleMouseDown, {
        passive: true,
      });
      carousel.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      carousel.addEventListener("mouseup", handleMouseUp, { passive: true });

      carousel.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      carousel.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      carousel.addEventListener("touchend", handleTouchEnd, { passive: true });
    }
  }

  //onHover arrows
  function addHoverSwipe() {
    const getCarouselWidth = carousel.getBoundingClientRect();
    const halfCarouselWidth = getCarouselWidth.width / 2;

    carousel.addEventListener("mousemove", function (e) {
      const xPos = e.pageX - carousel.offsetLeft;
      this.classList.remove("cursor-prev", "cursor-next");
      if (xPos > halfCarouselWidth) {
        this.classList.add("cursor-next");
        handleRightArrowClick();
        if (autoplay && resetOnInteraction) {
          resetAutoplay(); // Add resetAutoplay function call
        }
      } else {
        this.classList.add("cursor-prev");
        handleLeftArrowClick();
        if (autoplay && resetOnInteraction) {
          resetAutoplay(); // Add resetAutoplay function call
        }
      }
    });
  }

  //Click Cursor Arrows
  function addCursorArrows() {
    if (carousel) {
      const getCarouselWidth = carousel.getBoundingClientRect();
      const halfCarouselWidth = getCarouselWidth.width / 2;
      let activeEventListener = null;
      carousel.addEventListener("mousemove", function (e) {
        const xPos = e.pageX - carousel.offsetLeft;
        this.classList.remove("cursor-prev", "cursor-next");

        if (activeEventListener) {
          carousel.removeEventListener("click", activeEventListener, false);
        }

        if (xPos > halfCarouselWidth) {
          this.classList.add("cursor-next");
          activeEventListener = handleRightArrowClick;
        } else {
          this.classList.add("cursor-prev");
          activeEventListener = handleLeftArrowClick;
        }

        carousel.addEventListener("click", activeEventListener, false);

        if (autoplay && resetOnInteraction) {
          resetAutoplay();
        }
      });
    }
  }

  // Touch swipe
  function addTouchSwipe() {
    let isDragging = false;
    let startX = 0;
    let endX = 0;

    function handleTouchStart(event) {
      isDragging = false; // Reset isDragging to false on touch start
      startX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      if (!isDragging) {
        const touchDiff = Math.abs(event.touches[0].clientX - startX);
        if (touchDiff > 10) {
          // Adjust the threshold to differentiate between swipe and tap
          isDragging = true;
        }
      }

      if (isDragging) {
        endX = event.touches[0].clientX;
      }
    }

    function handleTouchEnd() {
      if (!isDragging) {
        // Handle tap/click action here if needed
        return;
      }

      isDragging = false;

      if (isTransitioning) return; // Prevent double swipe during transition

      const touchDiff = endX - startX;

      if (touchDiff > 0) {
        handleLeftArrowClick();
      } else if (touchDiff < 0) {
        handleRightArrowClick();
      }

      if (autoplay && resetOnInteraction) {
        resetAutoplay(); // Add resetAutoplay function call
      }
    }

    if (carousel) {
      carousel.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      carousel.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      carousel.addEventListener("touchend", handleTouchEnd, { passive: true });
    }
  }

  // Arrow Keys functionality

  function addArrowKeyButtons() {
    if (leftArrow && rightArrow) {
      leftArrow.addEventListener("click", () => {
        handleLeftArrowClick();
        if (autoplay && resetOnInteraction) {
          resetAutoplay(); // Add resetAutoplay function call
        }
      });
      rightArrow.addEventListener("click", () => {
        handleRightArrowClick();
        if (autoplay && resetOnInteraction) {
          resetAutoplay(); // Add resetAutoplay function call
        }
      });
    }
  }

  // Keyboard controls
  function addKeyboardKeys() {
    document.addEventListener("keydown", (event) => {
      if (isTransitioning) return; // Prevent double keydown during transition

      handleKeyDown(event);
      if (autoplay && resetOnInteraction) {
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

  // Arrow Keys functionality
  if (arrowButtons) {
    addArrowKeyButtons();
  }

  // Keyboard Keys functionality
  if (keyboardKeys) {
    addKeyboardKeys();
  }

  // drag functionality
  if (mouseDrag) {
    addDragSwipe();
  }

  // swipe functionality
  if (touchSwipe) {
    addTouchSwipe();
  }

  // cursorArrows functionality
  if (cursorArrows) {
    addCursorArrows();
  }

  // hoverSwipe functionality
  if (hoverSwipe) {
    addHoverSwipe();
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
}
