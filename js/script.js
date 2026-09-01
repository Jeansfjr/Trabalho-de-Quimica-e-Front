(function () {
  var form = document.getElementById("prova-formulario");
  var resetButton = document.getElementById("prova-resetar");
  var resultBox = document.getElementById("prova-resultado");

  if (!form || !resetButton || !resultBox) {
    return;
  }

  var respostas = {
    q1: "certo",
    q2: "certo",
    q3: "certo"
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var pontos = 0;
    var total = 3;
    var resultado = "";

    for (var pergunta in respostas) {
      var resposta = form.querySelector(
        'input[name="' + pergunta + '"]:checked'
      );

      if (!resposta) {
        resultBox.hidden = false;
        resultBox.innerHTML =
          "<p>Responda todas as perguntas antes de corrigir.</p>";
        return;
      }

      if (resposta.value === respostas[pergunta]) {
        pontos++;
        resultado += "<p>" + pergunta + ": correta ✅</p>";
      } else {
        resultado += "<p>" + pergunta + ": incorreta ❌</p>";
      }
    }

    var nota = (pontos / total) * 10;

    resultBox.hidden = false;
    resultBox.innerHTML =
      "<p><strong>Nota: " + nota.toFixed(1) + " / 10</strong></p>" +
      resultado;

    resetButton.hidden = false;
  });

  resetButton.addEventListener("click", function () {
    form.reset();
    resultBox.hidden = true;
    resultBox.innerHTML = "";
    resetButton.hidden = true;
  });
})();
