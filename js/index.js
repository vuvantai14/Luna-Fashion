import { initCommonLayout } from "./common.js";
import { initCartControls } from "./cart.js";
import "./products.js";

const heroBanners = [
  "../assets/banner-1.jpg",
  "../assets/banner-2.jpg"
];

let currentHeroBanner = 0;

function setHeroBanner(index) {
  const heroBannerImage = document.getElementById("heroBannerImage");
  const heroTextContent = document.getElementById("heroTextContent");
  const heroDots = document.querySelectorAll("#heroDots button");
  if (!heroBannerImage || heroBanners.length === 0) return;

  currentHeroBanner = (index + heroBanners.length) % heroBanners.length;
  heroBannerImage.style.display = "block";
  heroBannerImage.src = heroBanners[currentHeroBanner];
  heroBannerImage.alt = `Banner Luna Fashion ${currentHeroBanner + 1}`;
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentHeroBanner);
  });
  heroTextContent?.classList.toggle("hide", currentHeroBanner !== 0);
}

export function initHeroBanner() {
  const heroBannerImage = document.getElementById("heroBannerImage");
  const heroPrevBtn = document.getElementById("heroPrevBtn");
  const heroNextBtn = document.getElementById("heroNextBtn");
  const heroDots = document.querySelectorAll("#heroDots button");
  if (!heroBannerImage) return;

  heroBannerImage.addEventListener("error", () => {
    heroBannerImage.style.display = "none";
  });
  heroPrevBtn?.addEventListener("click", () => setHeroBanner(currentHeroBanner - 1));
  heroNextBtn?.addEventListener("click", () => setHeroBanner(currentHeroBanner + 1));
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => setHeroBanner(index));
  });

  setHeroBanner(0);
  setInterval(() => setHeroBanner(currentHeroBanner + 1), 5500);
}

export function initIndexPage() {
  initCommonLayout();
  initCartControls();
  initHeroBanner();
}

initIndexPage();
