# Trunfinity

Trunfinity is a powerful and versatile carousel plugin that allows you to create stunning carousels with endless turning functionality. It offers a wide range of customisable options and features to enhance your carousel experience.

## Installation

To use the Trunfinity Carousel, you'll need to include the necessary CSS and JavaScript files in your project. You can download the files from the official Trunfinity Carousel website or include them via a CDN.

```html
<!-- Include the Trunfinity Carousel CSS file -->
<link rel="stylesheet" href="path/to/trunfinity-carousel.css">

<!-- Include the Trunfinity Carousel JavaScript file -->
<script src="path/to/trunfinity-carousel.js"></script>
```

## Usage

To create a Trunfinity Carousel, you need to initialise it with a few configuration options. Here's an example of how you can create a carousel using the provided options:

```javascript
createCarousel(".slider", ".slide", ".prevBtn", ".nextBtn", {
  endless: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrowButtons: true,
  touchSwipe: true,
  keyboardControls: true,
  dynamicDots: false,
  autoplayPauseOnHover: true,
  resetOnInteraction: false,
});
```

In the example above, you can create a carousel with the following options:
- `endless: true` or `endless: false` enables/disables the endless turning functionality.
- `autoplay: true` or `autoplay: false` enables/disables the automatic start of the carousel rotation.
- `autoplaySpeed: 5000` sets the speed of autoplay to 5000 milliseconds (5 seconds) or your choice.
- `arrowButtons: true` or `arrowButtons: false` displays/hides the arrow buttons for navigation.
- `touchSwipe: true` or `touchSwipe: false` enables/disables the swipe gestures for touch devices.
- `keyboardControls: true` or `keyboardControls: false` enables/disables the keyboard arrow left and arrow right navigation.
- `dynamicDots: true` or `dynamicDots: false` enables/disables the dynamic creation of pagination dots.
- `autoplayPauseOnHover: true` or `autoplayPauseOnHover: false` enables/disables pausing autoplay on hover. It only works when the autoplay option is set to `true`.
- `resetOnInteraction: true` or `resetOnInteraction: false` enables/disables maintaining the carousel state after user interactions.

Here are the class names for the Trunfinity Carousel:

- `.slider`: Represents the carousel container element. You can use this class name or replace it with any other appropriate class name for your carousel container.
- `.slide`: Represents each individual slide element within the carousel. You can use this class name or replace it with any other appropriate class name for your slide elements.
- `.prevBtn`: Represents the class name for the previous button element. You can use this class name or replace it with any other appropriate class name for your previous button element.
- `.nextBtn`: Represents the class name for the next button element. You can use this class name or replace it with any other appropriate class name for your next button element.

Feel free to modify these options and class names based on your project's requirements.
