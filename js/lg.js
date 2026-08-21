document.addEventListener("DOMContentLoaded", () => {

  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answerId = question.getAttribute("aria-controls");
      const answerElement = document.getElementById(answerId);
      const isExpanded = question.getAttribute("aria-expanded") === "true";

      faqQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== question) {
          otherQuestion.setAttribute("aria-expanded", "false");
          const otherAnswer = document.getElementById(
            otherQuestion.getAttribute("aria-controls")
          );
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
            otherAnswer.setAttribute("hidden", "");
          }
        }
      });

      question.setAttribute("aria-expanded", !isExpanded);

      if (!isExpanded) {
        answerElement.removeAttribute("hidden");
        answerElement.style.maxHeight = answerElement.scrollHeight + "px";
      } else {
        answerElement.style.maxHeight = null;
        setTimeout(() => {
          if (question.getAttribute("aria-expanded") === "false") {
            answerElement.setAttribute("hidden", "");
          }
        }, 350);
      }
    });
  });

  const btnLojas = document.querySelector(".btn-lojas-cascavel");
  const listaLojas = document.getElementById("lista-lojas-cascavel");

  if (btnLojas && listaLojas) {
    btnLojas.addEventListener("click", () => {
      const isExpanded = btnLojas.getAttribute("aria-expanded") === "true";

      btnLojas.setAttribute("aria-expanded", !isExpanded);

      if (!isExpanded) {
        listaLojas.removeAttribute("hidden");
        listaLojas.style.maxHeight = listaLojas.scrollHeight + "px";
      } else {
        listaLojas.style.maxHeight = null;
        setTimeout(() => {
          if (btnLojas.getAttribute("aria-expanded") === "false") {
            listaLojas.setAttribute("hidden", "");
          }
        }, 350);
      }
    });
  }

  const cardsFoto = document.querySelectorAll(".card-foto");

  cardsFoto.forEach((card) => {
    card.addEventListener("click", function () {
      if (this.classList.contains("active-touch")) {
        this.classList.remove("active-touch");
      } else {
        cardsFoto.forEach((c) => c.classList.remove("active-touch"));
        this.classList.add("active-touch");
      }
    });
  });

});