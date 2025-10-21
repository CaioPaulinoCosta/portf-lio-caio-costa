// Animação de digitação para o título
const typeWriter = (element, text, speed = 100) => {
  let i = 0;
  element.innerHTML = "";

  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
};

// Iniciar animação de digitação quando a página carregar
window.addEventListener("DOMContentLoaded", () => {
  const homeTitle = document.querySelector(".home-title");
  const originalText = homeTitle.textContent;

  // Apenas animar se a tela for grande o suficiente
  if (window.innerWidth > 768) {
    typeWriter(homeTitle, originalText, 150);
  }
});

// Efeito parallax para elementos
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".parallax");

  parallaxElements.forEach((element) => {
    const speed = element.dataset.speed;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Animação de contador para estatísticas
const animateCounters = () => {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / 200;

    // Se já está no target, não faz nada
    if (count === target) return;

    const updateCounter = () => {
      const currentCount = +counter.innerText;

      if (currentCount < target) {
        counter.innerText = Math.ceil(currentCount + increment);
        setTimeout(updateCounter, 1);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  });
};
// Iniciar animação de contadores quando a seção sobre estiver visível
const aboutSection = document.querySelector(".about-section");
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      aboutObserver.unobserve(aboutSection);
    }
  });
});

aboutObserver.observe(aboutSection);
