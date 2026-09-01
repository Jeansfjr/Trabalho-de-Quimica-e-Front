"use strict";

// MENU
(function setupNavToggle() {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// ANIMAÇÃO AO ROLAR A PÁGINA
(function setupScrollReveal() {
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

// FORMULÁRIO DA PROVA
(function setupprova() {
  var form = document.getElementById("prova-formulario");
  var resetButton = document.getElementById("prova-resetar");
  var resultBox = document.getElementById("prova-resultado");

  if (!form || !resetButton || !resultBox) {
    return;
  }

  // Gabarito
  var answerKey = {
    q1: "certo",
    q2: "certo",
    q3: "certo"
  };

  // Quando o formulário for enviado
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var correctCount = 0;
    var totalQuestions = Object.keys(answerKey).length;
    var allAnswered = true;
    var summaryLines = [];

    Object.keys(answerKey).forEach(function (questionName) {
      var selected = form.querySelector(
        'input[name="' + questionName + '"]:checked'
      );

      var input = form.querySelector(
        'input[name="' + questionName + '"]'
      );

      var fieldset = input ? input.closest("fieldset") : null;

      if (!fieldset) {
        return;
      }

      fieldset.classList.remove("is-correct", "is-incorrect");

      // Verifica se respondeu
      if (!selected) {
        allAnswered = false;
        return;
      }

      // Verifica se acertou
      var isCorrect = selected.value === answerKey[questionName];

      if (isCorrect) {
        correctCount++;
        fieldset.classList.add("is-correct");
      } else {
        fieldset.classList.add("is-incorrect");
      }

      // Mostra a pergunta e a resposta escolhida
      var legend = fieldset.querySelector("legend");
      var questionLabel = legend ? legend.textContent : questionName;
      var chosenLabel = selected.parentElement.textContent.trim();

      summaryLines.push(
        "<li>" +
          questionLabel +
          " — sua resposta: " +
          chosenLabel +
          (isCorrect ? " ✅" : " ❌") +
        "</li>"
      );
    });

    // Se alguma pergunta ficou sem resposta
    if (!allAnswered) {
      resultBox.hidden = false;
      resultBox.innerHTML =
        "<p>Responda todas as perguntas antes de corrigir a prova.</p>";
      return;
    }

    // Calcula a nota
    var grade = ((correctCount / totalQuestions) * 10).toFixed(1);

    // Mostra o resultado
    resultBox.hidden = false;
    resultBox.innerHTML =
      "<p><strong>Nota: " +
      grade +
      " / 10</strong> (" +
      correctCount +
      " de " +
      totalQuestions +
      " corretas)</p>" +
      "<ul>" +
      summaryLines.join("") +
      "</ul>";

    resetButton.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });

  // Botão para resetar a prova
  resetButton.addEventListener("click", function () {
    form.reset();

    resultBox.hidden = true;
    resultBox.innerHTML = "";
    resetButton.hidden = true;

    form.querySelectorAll("fieldset").forEach(function (fieldset) {
      fieldset.classList.remove("is-correct", "is-incorrect");
    });
  });
})();
