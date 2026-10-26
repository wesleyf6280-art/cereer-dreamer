(() => {
  "use strict";

  const formulario = document.querySelector("#formulario-carreira");
  const campoNome = document.querySelector("#nome");
  const campoHobbies = document.querySelector("#hobbies");
  const campoInteresses = document.querySelector("#interesses");
  const botaoEnviar = document.querySelector("#botao-enviar");
  const mensagem = document.querySelector("#mensagem-formulario");
  const modal = document.querySelector("#modal-indisponivel");
  const botaoFecharModal = document.querySelector("#fechar-modal");

  const separarLista = (texto) => texto.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);

  botaoFecharModal.addEventListener("click", () => modal.close());

  campoNome.addEventListener("input", () => {
    campoNome.setCustomValidity("");
    mensagem.textContent = "";
  });

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagem.textContent = "";

    const nome = campoNome.value.trim().replace(/\s+/g, " ");
    if (nome.length < 2 || nome.length > 60 || !/^[\p{L}][\p{L}\p{M} '\-.]*$/u.test(nome)) {
      campoNome.setCustomValidity("Digite um nome válido com 2 a 60 caracteres.");
      campoNome.reportValidity();
      return;
    }
    campoNome.setCustomValidity("");

    const hobbies = separarLista(campoHobbies.value);
    const interesses = separarLista(campoInteresses.value);
    if (!hobbies.length || !interesses.length) {
      mensagem.textContent = "Preencha seus hobbies e interesses.";
      return;
    }

    if (typeof CONFIG === "undefined" || !CONFIG.API_URL.trim()) {
      modal.showModal();
      return;
    }

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Analisando seu perfil...";
    try {
      const resposta = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, hobbies, interests: interesses })
      });

      if (!resposta.ok) {
        throw new Error(`A API respondeu com status ${resposta.status}.`);
      }

      const resultado = await resposta.json();
      if (!resultado || typeof resultado !== "object" || !Array.isArray(resultado.recommended_careers)) {
        throw new Error("A resposta da API não está no formato esperado.");
      }

      sessionStorage.setItem("resultadoCarreira", JSON.stringify(resultado));
      window.location.href = "resultado.html";
    } catch (erro) {
      console.error("Erro ao buscar recomendações:", erro);
      mensagem.textContent = "Não foi possível gerar seu resultado agora. Confira a conexão e tente novamente.";
    } finally {
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = "Descobrir minha carreira";
    }
  });
})();
