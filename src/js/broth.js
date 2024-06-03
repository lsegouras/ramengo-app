
export function loadBrothComponent() {
  const brothContainer = document.getElementById("broth");

  fetch("/src/components/Broth/broth.html")
    .then((response) => response.text())
    .then((data) => {
      brothContainer.innerHTML = data;

      const linkBroth = document.createElement("link");
      linkBroth.rel = "stylesheet";
      linkBroth.href = "/src/css/broth.css";
      document.head.appendChild(linkBroth);

      fetchBrothData();
    })
    .catch((error) => console.error("Error loading Broth component:", error));
}

function fetchBrothData() {
  fetch("https://api.tech.redventures.com.br/broths", {
    headers: {
      "x-api-key": "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf"
    }
  })
    .then((response) => response.json())
    .then((broths) => {
      const cardsContainer = document.querySelector(".cards");
      broths.forEach((broth) => {
        createCard(broth, cardsContainer);
      });

      const linkCard = document.createElement("link");
      linkCard.rel = "stylesheet";
      linkCard.href = "/src/css/card.css";
      document.head.appendChild(linkCard);
    })
    .catch((error) => console.error("Error fetching broth data:", error));
}

function createCard(broth, container) {
  const card = document.createElement("div");
  card.classList.add("card-container");
  card.innerHTML = `
    <div class="card-icon">
      <img src="${broth.imageInactive}" alt="${broth.name} Icon">
    </div>
    <div class="card-title">
      <h2>${broth.name}</h2>
    </div>
    <div class="card-description">
      <p>${broth.description}</p>
    </div>
    <div class="card-price">
      <p>$${broth.price}</p>
    </div>
  `;
  container.appendChild(card);
}
