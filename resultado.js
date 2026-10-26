(() => {
  "use strict";

  const conteudo = document.querySelector("#conteudo-resultado");
  const estadoVazio = document.querySelector("#estado-vazio");
  const titulo = document.querySelector("#titulo-resultado");
  const sintese = document.querySelector("#sintese");
  const listaCarreiras = document.querySelector("#lista-carreiras");

  const criarElemento = (tag, classe, texto) => {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  };

  const criarListaSimples = (itens, classe) => {
    const lista = criarElemento("ul", classe);
    (Array.isArray(itens) ? itens : []).forEach((item) => {
      lista.appendChild(criarElemento("li", "", String(item)));
    });
    return lista;
  };

  function criarCartaoCarreira(carreira, indice) {
    const cartao = criarElemento("li", `carreira${indice === 0 ? " carreira--principal" : ""}`);
    if (indice === 0) cartao.appendChild(criarElemento("span", "carreira__selo", "Maior compatibilidade"));

    const topo = criarElemento("div", "carreira__topo");
    topo.appendChild(criarElemento("h3", "carreira__titulo", carreira.title || "Carreira sugerida"));

    const nota = criarElemento("p", "carreira__nota");
    nota.appendChild(criarElemento("span", "carreira__percentual", `${Math.max(0, Math.min(100, Number(carreira.match_score) || 0))}%`));
    nota.appendChild(document.createTextNode(" de compatibilidade"));
    topo.appendChild(nota);
    cartao.appendChild(topo);

    const percentual = Math.max(0, Math.min(100, Number(carreira.match_score) || 0));
    const barra = criarElemento("div", "barra");
    barra.setAttribute("role", "progressbar");
    barra.setAttribute("aria-label", `Compatibilidade com ${carreira.title || "a carreira"}`);
    barra.setAttribute("aria-valuemin", "0");
    barra.setAttribute("aria-valuemax", "100");
    barra.setAttribute("aria-valuenow", String(percentual));
    const nivel = criarElemento("span", "barra__nivel");
    nivel.style.setProperty("--nivel", `${percentual}%`);
    barra.appendChild(nivel);
    cartao.appendChild(barra);

    cartao.appendChild(criarElemento("p", "carreira__resumo", carreira.summary || "Não há resumo disponível."));
    cartao.appendChild(criarElemento("h4", "", "Competências importantes"));
    cartao.appendChild(criarListaSimples(carreira.key_skills, "chips"));
    cartao.appendChild(criarElemento("h4", "", "Seu roteiro de aprendizagem"));
    cartao.appendChild(criarListaSimples(carreira.learning_path, "roteiro"));
    return cartao;
  }

  let resultado = null;
  const exemploSolicitado = new URLSearchParams(window.location.search).has("exemplo");
  if (exemploSolicitado) {
    resultado = window.DADOS_EXEMPLO;
  } else {
    try {
      const salvo = sessionStorage.getItem("resultadoCarreira");
      if (salvo) resultado = JSON.parse(salvo);
    } catch (erro) {
      console.error("Não foi possível ler o resultado salvo:", erro);
    }
  }

  if (!resultado || !Array.isArray(resultado.recommended_careers) || resultado.recommended_careers.length === 0) {
    estadoVazio.hidden = false;
    conteudo.hidden = true;
    return;
  }

  titulo.textContent = `Seu resultado${resultado.user_name ? `, ${resultado.user_name}` : ""}`;
  sintese.textContent = resultado.career_identity_statement || "Estas são algumas possibilidades para você explorar.";
  resultado.recommended_careers.forEach((carreira, indice) => {
    listaCarreiras.appendChild(criarCartaoCarreira(carreira, indice));
  });
  conteudo.hidden = false;
})();
