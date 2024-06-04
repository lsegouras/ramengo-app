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
      broths.forEach((broth, index) => {
        createCard(broth, cardsContainer, broths, index);
      });

      const linkCard = document.createElement("link");
      linkCard.rel = "stylesheet";
      linkCard.href = "/src/css/card.css";
      document.head.appendChild(linkCard);

      createCarouselIndicators(broths.length);
      updateCarousel();
    })
    .catch((error) => console.error("Error fetching broth data:", error));
}

function createCard(broth, container, broths, index) {
  const card = document.createElement("div");
  card.classList.add("card-container");
  if (index === 0) card.classList.add('active');
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

  card.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card-container');
    cards.forEach((c) => {
      c.classList.remove('active');
      const inactiveBroth = broths.find(b => b.name === c.querySelector('.card-title h2').innerText);
      if (inactiveBroth) {
        c.querySelector('.card-icon img').src = inactiveBroth.imageInactive;
      }
    });
    card.classList.add('active');
    card.querySelector('.card-icon img').src = broth.imageActive;
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
  document.querySelector('#broth-container').appendChild(indicatorContainer);
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
