document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.closest('.faq-item');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('open');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    item.querySelector('.faq-answer').setAttribute('hidden', '');
                }
            });

            const isOpen = currentItem.classList.toggle('open');
            question.setAttribute('aria-expanded', isOpen);
            
            const answer = currentItem.querySelector('.faq-answer');
            if (isOpen) {
                answer.removeAttribute('hidden');
            } else {
                answer.setAttribute('hidden', '');
            }
        });
    });
});
