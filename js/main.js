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

// Rate Limiting
const submissionAttempts = {
  count: 0,
  lastAttempt: 0,
  resetTime: 5 * 60 * 1000, // 5 minutos
};

function checkRateLimit() {
  const now = Date.now();

  if (now - submissionAttempts.lastAttempt > submissionAttempts.resetTime) {
    submissionAttempts.count = 0;
  }

  if (submissionAttempts.count >= 5) {
    throw new Error("Muitas tentativas. Tente novamente em 5 minutos.");
  }

  submissionAttempts.count++;
  submissionAttempts.lastAttempt = now;
}

// Validação de Segurança
function validateForm(formData) {
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  // 1. Validação de comprimento
  if (name.length < 2 || name.length > 100) {
    throw new Error("Nome deve ter entre 2 e 100 caracteres");
  }

  if (message.length < 10 || message.length > 1000) {
    throw new Error("Mensagem deve ter entre 10 e 1000 caracteres");
  }

  // 2. Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }

  // 3. Proteção contra XSS
  const xssPatterns = /<script|javascript:|onclick|onload|onerror/gi;
  if (xssPatterns.test(name) || xssPatterns.test(message)) {
    throw new Error("Conteúdo não permitido detectado");
  }

  return true;
}

// Event Listener Principal
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const formData = new FormData(this);

    // Loading
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    try {
      checkRateLimit();
      validateForm(formData);

      // Envio para Netlify
      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Mensagem enviada com sucesso!");
        this.reset();

        // Reset do contador de tentativas em sucesso
        submissionAttempts.count = 0;
      } else {
        throw new Error("Erro no servidor");
      }
    } catch (error) {
      console.error("Erro de segurança:", error);
      alert(`❌ ${error.message || "Erro ao enviar mensagem."}`);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

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
