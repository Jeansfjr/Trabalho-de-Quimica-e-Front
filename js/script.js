"use strict";

// ANIMAÇÃO AO ROLAR A PÁGINA
(function setupScrollReveal() {
  var items = document.querySelectorAll(".reveal");

  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

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

  // Gabarito da prova
  var answerKey = {
    q1: "certo",
    q2: "certo",
    q3: "certo"
  };

  // Corrige a prova
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var totalQuestions = Object.keys(answerKey).length;
    var correctCount = 0;
    var summaryLines = [];
    var allAnswered = true;

    Object.keys(answerKey).forEach(function (questionName) {
      var input = form.querySelector(
        'input[name="' + questionName + '"]'
      );

      var fieldset = input ? input.closest("fieldset") : null;

      var selected = form.querySelector(
        'input[name="' + questionName + '"]:checked'
      );

      if (!fieldset) {
        return;
      }

      fieldset.classList.remove("is-correct", "is-incorrect");

      if (!selected) {
        allAnswered = false;
        return;
      }

      var isCorrect = selected.value === answerKey[questionName];

      if (isCorrect) {
        correctCount++;
        fieldset.classList.add("is-correct");
      } else {
        fieldset.classList.add("is-incorrect");
      }

      var legend = fieldset.querySelector("legend");
      var questionLabel = legend
        ? legend.textContent
        : questionName;

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

    if (!allAnswered) {
      resultBox.hidden = false;
      resultBox.innerHTML =
        "<p>Responda todas as perguntas antes de corrigir a prova.</p>";
      return;
    }

    var grade = ((correctCount / totalQuestions) * 10).toFixed(1);

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

  // Limpa a prova
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
