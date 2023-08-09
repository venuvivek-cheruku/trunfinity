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
  let dotsContainer;
  let carouselStyles;
  let imageGap;
  let totalImages = images.length;

  if (carousel) {
    carouselStyles = window.getComputedStyle(carousel);
    imageGap = parseFloat(carouselStyles.gap);
  }

  //Set up options
  const {
    endless = false,
    autoplay = false,
    arrowButtonsControls = false,
    touchSwipe = false,
    keyboardControls = false,
    autoplaySpeed = 3000,
    cursorArrows = false,
    mouseDrag = false,
    hoverSwipe = false,
    dynamicDots = false,
    autoplayPauseOnHover = false,
    resetOnInteraction = true,
  } = options;

  if (endless && totalImages > 1) {
    images.forEach((logo, index) => {
      const clone = logo.cloneNode(true);
      carousel.appendChild(clone);
      images.push(clone);
      totalImages = images.length;
      logo.classList.add("original-slide");
      clone.classList.add("cloned-slide");
    });

    prevIndex = currentIndex = 0;
  }

  function handleLeftArrowClick() {
    if (!endless && currentIndex === 0) {
      return;
    }

    if (totalImages <= 1 || isTransitioning) return; // Prevent double click during transition
    isTransitioning = true;

    prevIndex = currentIndex;
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;

    const imageWidth = images[currentIndex].offsetWidth;
    const totalWidth = imageWidth + imageGap;

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
    if (!endless && currentIndex + currentIndex + 1 == totalImages) {
      return;
    }

    if (totalImages <= 1 || isTransitioning) return; // Prevent double click during transition
    isTransitioning = true;

    prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % totalImages;

    if (carousel) {
      const imageWidth = images[prevIndex].offsetWidth;
      const totalWidth = imageWidth + imageGap;

      carousel.style.transform = `translateX(-${totalWidth}px)`;
      carousel.style.transition = "transform 0.5s ease-in-out";

      setTimeout(() => {
        carousel.appendChild(images[prevIndex]);
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
      isDragging = true;
      startX = event.clientX;
      images.forEach((image) => {
        image.style.cursor = "grabbing";
        image.style.userSelect = "none";
      });
    }

    function handleMouseMove(event) {
      if (!isDragging) return;
      endX = event.clientX;
    }

    function handleMouseUp() {
      isDragging = false;
      // Reset the cursor style to "grab" when the drag ends
      images.forEach((image) => {
        image.style.cursor = "grab";
      });

      if (isTransitioning) return; // Prevent double swipe during transition

      const mouseDiff = endX - startX;

      if (mouseDiff > 0) {
        handleLeftArrowClick();
      } else if (mouseDiff < 0) {
        handleRightArrowClick();
      }

      if (autoplay && resetOnInteraction) {
        resetAutoplay(); // Add resetAutoplay function call
      }
    }

    if (carousel) {
      carousel.addEventListener("mousedown", handleMouseDown, false);
      carousel.addEventListener("mousemove", handleMouseMove, false);
      carousel.addEventListener("mouseup", handleMouseUp, false);
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
      isDragging = true;
      startX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      if (!isDragging) return;
      endX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
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
      carousel.addEventListener("touchstart", handleTouchStart, false);
      carousel.addEventListener("touchmove", handleTouchMove, false);
      carousel.addEventListener("touchend", handleTouchEnd, false);
    }
  }

  // Arrow Keys functionality

  function addArrowKeyButtons() {
    const leftArrow = document.querySelector(prevBtn);
    const rightArrow = document.querySelector(nextBtn);
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

  // Arrow Keys functionality
  if (arrowButtonsControls) {
    addArrowKeyButtons();
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

  // Keyboard controls
  if (keyboardControls) {
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
