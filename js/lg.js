/* ==========================================================================
   LOGICA JAVASCRIPT: ACORDEÃO DE FAQ SEGURO E ACESSÍVEL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answerId = question.getAttribute('aria-controls');
            const answerElement = document.getElementById(answerId);
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Fecha outros painéis que possam estar abertos (opcional para efeito solo)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = document.getElementById(otherQuestion.getAttribute('aria-controls'));
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.setAttribute('hidden', '');
                }
            });

            // Altera o estado de expansão atual
            question.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                answerElement.removeAttribute('hidden');
                // Define a altura máxima dinamicamente baseado no tamanho do texto interno
                answerElement.style.maxHeight = answerElement.scrollHeight + 'px';
            } else {
                answerElement.style.maxHeight = null;
                // Aguarda o término da animação CSS para ocultar completamente do leitor de tela
                setTimeout(() => {
                    if (question.getAttribute('aria-expanded') === 'false') {
                        answerElement.setAttribute('hidden', '');
                    }
                }, 350);
            }
        });
    });
});
