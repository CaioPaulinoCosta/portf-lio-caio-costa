// Navegação responsiva
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  });
});

// Mudar estilo da navbar ao scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
  }
});

// Formulário de contato
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const originalText = submitBtn.textContent;

    // Mostrar loading
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    // Enviar para Netlify
    fetch("/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Sucesso!
          successMessage.classList.remove("hidden");
          contactForm.reset();

          // Esconder mensagem após 5 segundos
          setTimeout(() => {
            successMessage.classList.add("hidden");
          }, 5000);
        } else {
          throw new Error("Erro no envio");
        }
      })
      .catch((error) => {
        alert(
          "Erro ao enviar mensagem. Você pode me contatar diretamente em caiopaulinocostadev@outlook.com"
        );
        console.error("Error:", error);
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

// Ativar animação das barras de habilidades quando a seção estiver visível
const skillBars = document.querySelectorAll(".skill-progress");

const animateSkillBars = () => {
  skillBars.forEach((bar) => {
    const level = bar.getAttribute("data-level");
    bar.style.width = `${level}%`;
  });
};

// Observador de interseção para animar elementos quando ficam visíveis
const observerOptions = {
  threshold: 0.3,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("skills-section")) {
        animateSkillBars();
      }
      entry.target.classList.add("animated");
    }
  });
}, observerOptions);

// Observar todas as seções
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});
