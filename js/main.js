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

// Sistema de notificações
class NotificationSystem {
  constructor() {
    this.container = document.getElementById("notificationContainer");
    if (!this.container) {
      this.createContainer();
    }
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.id = "notificationContainer";
    this.container.className = "notification-container";
    document.body.appendChild(this.container);
  }

  show({ title, message, type = "info", duration = 5000 }) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };

    notification.innerHTML = `
            <i class="notification-icon ${icons[type]}"></i>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

    this.container.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 100);

    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => this.close(notification));

    if (duration > 0) {
      setTimeout(() => this.close(notification), duration);
    }

    return notification;
  }

  close(notification) {
    notification.classList.remove("show");
    notification.classList.add("hide");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  success(message, title = "Sucesso!") {
    return this.show({ title, message, type: "success" });
  }

  error(message, title = "Erro!") {
    return this.show({ title, message, type: "error" });
  }

  warning(message, title = "Atenção!") {
    return this.show({ title, message, type: "warning" });
  }
}

// Sistema de segurança
const submissionAttempts = {
  count: 0,
  lastAttempt: 0,
  resetTime: 5 * 60 * 1000,
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

function validateForm(formData) {
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  if (name.length < 2 || name.length > 100) {
    throw new Error("Nome deve ter entre 2 e 100 caracteres");
  }
  if (message.length < 10 || message.length > 1000) {
    throw new Error("Mensagem deve ter entre 10 e 1000 caracteres");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }

  const xssPatterns = /<script|javascript:|onclick|onload|onerror/gi;
  if (xssPatterns.test(name) || xssPatterns.test(message)) {
    throw new Error("Conteúdo não permitido detectado");
  }

  return true;
}

// Validação de campos em tempo real
function setupFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      const formGroup = this.closest(".form-group");
      formGroup.classList.remove("error", "success");
      const existingError = formGroup.querySelector(".field-error");
      if (existingError) existingError.remove();
    });

    input.addEventListener("blur", function () {
      validateField(this);
    });
  });
}

function validateField(field) {
  const formGroup = field.closest(".form-group");
  const value = field.value.trim();

  formGroup.classList.remove("error", "success");
  const existingError = formGroup.querySelector(".field-error");
  if (existingError) existingError.remove();

  let isValid = true;
  let errorMessage = "";

  if (field.type === "text" && field.name === "name") {
    if (value.length < 2)
      errorMessage = "Nome deve ter pelo menos 2 caracteres";
    else if (value.length > 100)
      errorMessage = "Nome muito longo (máx. 100 caracteres)";
  } else if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) errorMessage = "Email inválido";
  } else if (field.name === "message") {
    if (value.length < 10)
      errorMessage = "Mensagem muito curta (mín. 10 caracteres)";
    else if (value.length > 1000)
      errorMessage = "Mensagem muito longa (máx. 1000 caracteres)";
  }

  if (errorMessage) {
    isValid = false;
    formGroup.classList.add("error");
    const errorElement = document.createElement("div");
    errorElement.className = "field-error";
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
    formGroup.appendChild(errorElement);
  } else if (value !== "") {
    formGroup.classList.add("success");
  }
}

// Event listener principal
function initializeFormHandler() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  // ✅ APENAS UM event listener!
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    const formData = new FormData(this);

    // Validar todos os campos antes do envio
    let allValid = true;
    const inputs = this.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      validateField(input);
      if (input.closest(".form-group").classList.contains("error")) {
        allValid = false;
      }
    });

    if (!allValid) {
      notify.error(
        "Por favor, corrija os erros no formulário antes de enviar."
      );
      return;
    }

    // Loading state
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    try {
      checkRateLimit();
      validateForm(formData);

      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        notify.success(
          "Mensagem enviada com sucesso! Entrarei em contato em breve.",
          "Obrigado!"
        );
        this.reset();

        // Reset visual
        this.querySelectorAll(".form-group").forEach((group) => {
          group.classList.remove("success");
        });

        submissionAttempts.count = 0;
      } else {
        throw new Error("Erro no servidor");
      }
    } catch (error) {
      console.error("Erro:", error);

      if (error.message.includes("Muitas tentativas")) {
        notify.warning(error.message, "Atenção");
      } else if (
        error.message.includes("Email inválido") ||
        error.message.includes("deve ter")
      ) {
        notify.error(error.message, "Dados inválidos");
      } else {
        notify.error(
          "Erro ao enviar mensagem. Você pode me contatar diretamente em caiopaulinocostadev@outlook.com",
          "Erro de envio"
        );
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Inicialização
const notify = new NotificationSystem();

document.addEventListener("DOMContentLoaded", function () {
  setupFormValidation();
  initializeFormHandler();
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
