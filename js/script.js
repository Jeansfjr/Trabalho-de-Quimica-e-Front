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

(function setupprova()
  { var form = document.getElementById("prova-formulario");
    var resetButton = document.getElementById("prova-resetar");
    var resultBox = document.getElementById("prova-resultado");

    if (!form || !resetButton || !resultBox) {
      return;
    }

    var answerKey = {
      q1: "certo",
      q2: "certo",
      q3: "certo"
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var totalQuestions = Object.keys(answerKey).length;
      var correctCount = 0;
      var summaryLines = [];
      var allAnswered = true;

      Object.keys(answerKey).forEach(function (questionName) {
        var anyInput = form.querySelector('input[name="' + questionName + '"]');
        var fieldset = anyInput ? anyInput.closest("fieldset") : null;
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
          correctCount = correctCount + 1;
          fieldset.classList.add("is-correct");
        } else {
          fieldset.classList.add("is-incorrect");
        }

        var legend = fieldset.querySelector("legend");
        var questionLabel = legend ? legend.textContent : questionName;
        var chosenLabel = selected.parentElement
          ? selected.parentElement.textContent.trim()
          : selected.value;

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
        " corretas)</p><ul>" +
        summaryLines.join("") +
        "</ul>";

      resetButton.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    resetButton.addEventListener("click", function () {
      form.reset();
      resultBox.hidden = true;
      resultBox.innerHTML = "";
      resetButton.hidden = true;

      form.querySelectorAll("fieldset").forEach(function (fieldset) {
        fieldset.classList.remove("is-correct", "is-incorrect");
      });
    });
  }
)();
