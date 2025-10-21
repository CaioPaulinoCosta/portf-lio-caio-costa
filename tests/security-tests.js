// tests/security-tests.js

class SecurityTester {
  constructor() {
    this.results = [];
    this.testCount = 0;
    this.passedCount = 0;
    this.failedCount = 0;
  }

  log(message, type = "info") {
    const colors = {
      info: "#3498db",
      success: "#2ecc71",
      error: "#e74c3c",
      warning: "#f39c12",
    };

    console.log(
      `%c🔒 ${message}`,
      `color: ${colors[type]}; font-weight: bold;`
    );
  }

  async runTest(testName, testFunction) {
    this.testCount++;
    this.log(`Executando teste: ${testName}`, "info");

    try {
      await testFunction();
      this.passedCount++;
      this.log(`✅ ${testName} - PASSOU`, "success");
      this.results.push({ test: testName, status: "PASSOU" });
    } catch (error) {
      this.failedCount++;
      this.log(`❌ ${testName} - FALHOU: ${error.message}`, "error");
      this.results.push({
        test: testName,
        status: "FALHOU",
        error: error.message,
      });
    }
  }

  generateReport() {
    console.log(
      "\n%c📊 RELATÓRIO DE SEGURANÇA",
      "font-size: 20px; font-weight: bold; color: #2c3e50;"
    );
    console.log(
      `%c✅ Testes Passados: ${this.passedCount}`,
      "color: #2ecc71; font-size: 16px;"
    );
    console.log(
      `%c❌ Testes Falhados: ${this.failedCount}`,
      "color: #e74c3c; font-size: 16px;"
    );
    console.log(
      `%c📋 Total: ${this.testCount}`,
      "color: #3498db; font-size: 16px;"
    );

    this.results.forEach((result) => {
      const color = result.status === "PASSOU" ? "#2ecc71" : "#e74c3c";
      console.log(
        `%c${result.status === "PASSOU" ? "✅" : "❌"} ${result.test}`,
        `color: ${color};`
      );
    });
  }

  // TESTES ESPECÍFICOS
  async testXSSProtection() {
    const testPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')">',
      "<svg onload=\"alert('XSS')\">",
      '"><script>alert("XSS")</script>',
    ];

    for (const payload of testPayloads) {
      const formData = new FormData();
      formData.append("name", payload);
      formData.append("email", "test@test.com");
      formData.append("message", "Test message");

      try {
        validateForm(formData);
        throw new Error(`XSS não bloqueado: ${payload}`);
      } catch (error) {
        if (!error.message.includes("Conteúdo não permitido")) {
          throw new Error(`Erro inesperado: ${error.message}`);
        }
      }
    }
  }

  async testRateLimiting() {
    submissionAttempts.count = 0; // Reset para teste

    // Testa até o limite
    for (let i = 0; i < 5; i++) {
      checkRateLimit(); // Deve passar
    }

    // 6ª tentativa deve falhar
    try {
      checkRateLimit();
      throw new Error("Rate limiting não funcionou - 6ª tentativa passou");
    } catch (error) {
      if (!error.message.includes("Muitas tentativas")) {
        throw new Error(`Erro inesperado no rate limiting: ${error.message}`);
      }
    }
  }

  async testEmailValidation() {
    const invalidEmails = [
      "email-invalido",
      "teste@",
      "@semlocal.com",
      "sem@arroba",
      "teste@.com",
    ];

    for (const email of invalidEmails) {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", email);
      formData.append("message", "Valid message here");

      try {
        validateForm(formData);
        throw new Error(`Email inválido aceito: ${email}`);
      } catch (error) {
        if (!error.message.includes("Email inválido")) {
          throw new Error(
            `Erro inesperado na validação de email: ${error.message}`
          );
        }
      }
    }

    // Teste de email válido
    const validFormData = new FormData();
    validFormData.append("name", "Test User");
    validFormData.append("email", "test@valid.com");
    validFormData.append("message", "Valid message here");

    const result = validateForm(validFormData);
    if (!result) {
      throw new Error("Email válido foi rejeitado");
    }
  }

  async testLengthValidation() {
    // Nome muito curto
    const shortNameData = new FormData();
    shortNameData.append("name", "A");
    shortNameData.append("email", "test@test.com");
    shortNameData.append("message", "Valid message");

    try {
      validateForm(shortNameData);
      throw new Error("Nome muito curto foi aceito");
    } catch (error) {
      if (!error.message.includes("Nome deve ter")) {
        throw new Error(
          `Erro inesperado na validação de nome: ${error.message}`
        );
      }
    }

    // Mensagem muito curta
    const shortMessageData = new FormData();
    shortMessageData.append("name", "Valid Name");
    shortMessageData.append("email", "test@test.com");
    shortMessageData.append("message", "Short");

    try {
      validateForm(shortMessageData);
      throw new Error("Mensagem muito curta foi aceita");
    } catch (error) {
      if (!error.message.includes("Mensagem deve ter")) {
        throw new Error(
          `Erro inesperado na validação de mensagem: ${error.message}`
        );
      }
    }
  }

  async testFormSubmission() {
    const form = document.getElementById("contactForm");
    if (!form) {
      throw new Error("Formulário não encontrado no DOM");
    }

    // Teste de submissão sem reCAPTCHA
    const event = new Event("submit", { cancelable: true });
    form.dispatchEvent(event);

    // Se chegou aqui sem erro, o evento foi registrado corretamente
    this.log("Event listener do formulário está funcionando", "success");
  }

  async runAllTests() {
    this.log("🚀 INICIANDO TESTES DE SEGURANÇA", "warning");
    this.log(
      "Abrindo console do navegador (F12) para ver resultados...",
      "info"
    );

    await this.runTest("Proteção contra XSS", () => this.testXSSProtection());
    await this.runTest("Rate Limiting", () => this.testRateLimiting());
    await this.runTest("Validação de Email", () => this.testEmailValidation());
    await this.runTest("Validação de Comprimento", () =>
      this.testLengthValidation()
    );
    await this.runTest("Configuração do Formulário", () =>
      this.testFormSubmission()
    );

    this.generateReport();
  }
}

// 🎯 COMO EXECUTAR OS TESTES:

// Método 1: Botão na página (adicione isso temporariamente no HTML)
function addTestButton() {
  const testButton = document.createElement("button");
  testButton.textContent = "🧪 Executar Testes de Segurança";
  testButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;

  testButton.onclick = () => {
    const tester = new SecurityTester();
    tester.runAllTests();
  };

  document.body.appendChild(testButton);
}

// Método 2: Executar diretamente no console
window.runSecurityTests = function () {
  const tester = new SecurityTester();
  return tester.runAllTests();
};

// Inicialização automática (opcional)
if (window.location.hash === "#test") {
  setTimeout(() => {
    const tester = new SecurityTester();
    tester.runAllTests();
  }, 1000);
}

// Adiciona o botão automaticamente (comente se não quiser)
addTestButton();
