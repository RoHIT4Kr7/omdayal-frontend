var start = 1;

function set_time() {
  // Change images every 2.5 seconds
  setInterval(image_show, 2500);

  // Auto scroll the testimonials every 2.5 seconds
  initializeTestimonialsScroll(); // Setup scroll (cloning + tracking)
  setInterval(auto_scroll, 2500); // Start auto-scroll
}

function image_show() {
  var image_data = "./assets/images/testmo5.png";
  var img_data = "./assets/images/head7.png";

  if (start == 1) {
    image_data = "./assets/images/testmo1.png";
  } else if (start == 2) {
    image_data = "./assets/images/testmo2.png";
  } else if (start == 3) {
    image_data = "./assets/images/testmo3.png";
  } else if (start == 4) {
    image_data = "./assets/images/testmo4.png";
  } else {
    start = 1;
  }

  if (start == 1) {
    img_data = "./assets/images/head9.png";
  } else if (start == 2) {
    img_data = "./assets/images/head3.png";
  } else if (start == 3) {
    img_data = "./assets/images/banner-img.png";
  } else if (start == 4) {
    img_data = "./assets/images/head8.png";
  } else if (start == 5) {
    img_data = "./assets/images/head1.png";
  } else {
    start = 1;
  }

  document.getElementById("testmo").src = "" + image_data;
  document.getElementById("banner-img-main").src = "" + img_data;
  start++;
}

// ================================
// Infinite Scroll for Testimonials
// ================================

let container;
let cardWidth;
let scrollPosition = 0;
let cloneCount;

function initializeTestimonialsScroll() {
  container = document.getElementById("testimonials-container");

  const cards = container.querySelectorAll(".testimonials-card");
  if (!cards.length) return;

  cardWidth = cards[0].offsetWidth;
  cloneCount = cards.length;

  // Clone the original cards and append them
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    container.appendChild(clone);
  });
}

function auto_scroll() {
  if (!container) return;

  scrollPosition += cardWidth;

  if (scrollPosition >= cardWidth * cloneCount) {
    // Jump instantly to start for seamless loop
    container.scrollLeft = 0;
    scrollPosition = cardWidth;
  }

  container.scrollTo({
    left: scrollPosition,
    behavior: "smooth"
  });
}

// Start everything on page load
window.onload = set_time;
