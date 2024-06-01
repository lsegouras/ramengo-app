export function loadHeroComponent() {
  const heroContainer = document.getElementById("hero");
  fetch("/src/components/Hero/hero.html")
    .then((response) => response.text())
    .then((data) => {
      heroContainer.innerHTML = data;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/src/css/hero.css";
      document.head.appendChild(link);
    })
    .catch((error) => console.error("Error loading Hero component:", error));
}
