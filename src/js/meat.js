export function loadMeatComponent() {
  const meatContainer = document.getElementById("meat");

  fetch("/src/components/Meat/meat.html")
    .then((response) => response.text())
    .then((data) => {
      meatContainer.innerHTML = data;

      const linkMeat = document.createElement("link");
      linkMeat.rel = "stylesheet";
      linkMeat.href = "/src/css/meat.css";
      document.head.appendChild(linkMeat);

      fetchMeatData();
    })
    .catch((error) => console.error("Error loading Meat component:", error));
}

function fetchMeatData() {
  fetch("https://api.tech.redventures.com.br/proteins", {
    headers: {
      "x-api-key": "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf"
    }
  })
    .then((response) => response.json())
    .then((proteins) => {
      const meatContainer = document.getElementById("meat-container");
      const cardsContainer = meatContainer.querySelector(".cards");
      proteins.forEach((protein, index) => {
        createCard(protein, cardsContainer, proteins, index);
      });

      const linkCard = document.createElement("link");
      linkCard.rel = "stylesheet";
      linkCard.href = "/src/css/card.css";
      document.head.appendChild(linkCard);

      createCarouselIndicators(proteins.length);
      updateCarousel();
    })
    .catch((error) => console.error("Error fetching meat data:", error));
}

function createCard(protein, container, proteins, index) {
  const card = document.createElement("div");
  card.classList.add("card-container");
  if (index === 0) card.classList.add('active');
  card.innerHTML = `
    <div class="card-icon">
      <img src="${protein.imageInactive}" alt="${protein.name} Icon">
    </div>
    <div class="card-title">
      <h2>${protein.name}</h2>
    </div>
    <div class="card-description">
      <p>${protein.description}</p>
    </div>
    <div class="card-price">
      <p>$${protein.price}</p>
    </div>
  `;
  container.appendChild(card);

  card.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card-container');
    cards.forEach((c) => {
      c.classList.remove('active');
      const inactiveProtein = proteins.find(p => p.name === c.querySelector('.card-title h2').innerText);
      if (inactiveProtein) {
        c.querySelector('.card-icon img').src = inactiveProtein.imageInactive;
      }
    });
    card.classList.add('active');
    card.querySelector('.card-icon img').src = protein.imageActive;
    updateCarousel();
  });
}

function createCarouselIndicators(count) {
  const indicatorContainer = document.createElement('div');
  indicatorContainer.classList.add('indicator-carousel');
  for (let i = 0; i < count; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
      setActiveCard(i);
    });
    indicatorContainer.appendChild(indicator);
  }
  document.querySelector('#meat-container').appendChild(indicatorContainer);
}

function setActiveCard(index) {
  const cards = document.querySelectorAll('.card-container');
  cards.forEach((card, i) => {
    card.classList.remove('active');
    if (i === index) {
      card.classList.add('active');
      card.querySelector('.card-icon img').src = card.querySelector('.card-icon img').src.replace('inactive', 'active');
    } else {
      card.querySelector('.card-icon img').src = card.querySelector('.card-icon img').src.replace('active', 'inactive');
    }
  });
  updateCarousel();
}

function updateCarousel() {
  const activeCard = document.querySelector('.card-container.active');
  const cards = Array.from(document.querySelectorAll('.card-container'));
  const indicators = document.querySelectorAll('.indicator');

  const activeIndex = cards.indexOf(activeCard);
  cards.forEach((card, index) => {
    if (window.innerWidth <= 425) {
      card.style.display = index === activeIndex ? 'flex' : 'none';
      card.style.transform = `translateX(${(index - activeIndex) * 100}%)`;
    } else {
      card.style.display = 'flex';
      card.style.transform = 'none';
    }
  });

  indicators.forEach((indicator, index) => {
    if (index === activeIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

window.addEventListener('resize', updateCarousel);
