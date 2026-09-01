"use strict";

// Animação dos elementos ao rolar a página
(function () {
  var items = document.querySelectorAll(".reveal");

  if (!items.length) {
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();


// Formulário da prova
(function () {
  var form = document.getElementById("prova-formulario");
  var resetButton = document.getElementById("prova-resetar");
  var resultBox = document.getElementById("prova-resultado");

  if (!form || !resetButton || !resultBox) {
    return;
  }

  // Respostas corretas
  var respostas = {
    q1: "certo",
    q2: "certo",
    q3: "certo"
  };

  // Quando clicar em "Corrigir prova"
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var acertos = 0;
    var total = 3;
    var resultado = "";
    var respondeuTudo = true;

    for (var pergunta in respostas) {
      var selecionada = form.querySelector(
        'input[name="' + pergunta + '"]:checked'
      );

      var primeiraOpcao = form.querySelector(
        'input[name="' + pergunta + '"]'
      );

      var questao = primeiraOpcao
        ? primeiraOpcao.closest("fieldset")
        : null;

      if (!questao) {
        continue;
      }

      questao.classList.remove("is-correct", "is-incorrect");

      if (!selecionada) {
        respondeuTudo = false;
        continue;
      }

      // Verifica a resposta
      if (selecionada.value === respostas[pergunta]) {
        acertos++;
        questao.classList.add("is-correct");
      } else {
        questao.classList.add("is-incorrect");
      }

      var titulo = questao.querySelector("legend");
      var resposta = selecionada.parentElement.textContent.trim();

      resultado +=
        "<li>" +
        titulo.textContent +
        " — sua resposta: " +
        resposta +
        (selecionada.value === respostas[pergunta] ? " ✅" : " ❌") +
        "</li>";
    }

    // Verifica se respondeu todas
    if (!respondeuTudo) {
      resultBox.hidden = false;
      resultBox.innerHTML =
        "<p>Responda todas as perguntas antes de corrigir a prova.</p>";
      return;
    }

    // Calcula a nota
    var nota = ((acertos / total) * 10).toFixed(1);

    // Mostra o resultado
    resultBox.hidden = false;
    resultBox.innerHTML =
      "<p><strong>Nota: " +
      nota +
      " / 10</strong> (" +
      acertos +
      " de " +
      total +
      " corretas)</p>" +
      "<ul>" +
      resultado +
      "</ul>";

    resetButton.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });


  // Botão "Responder novamente"
  resetButton.addEventListener("click", function () {
    form.reset();

    resultBox.hidden = true;
    resultBox.innerHTML = "";
    resetButton.hidden = true;

    form.querySelectorAll("fieldset").forEach(function (questao) {
      questao.classList.remove("is-correct", "is-incorrect");
    });
  });
})();
