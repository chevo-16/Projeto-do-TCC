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
            otherQuestion.getAttribute("aria-controls"),
          );
          otherAnswer.style.maxHeight = null;
          otherAnswer.setAttribute("hidden", "");
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
});