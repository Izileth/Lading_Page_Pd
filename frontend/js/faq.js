document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('open');
            const answer = this.nextElementSibling;
            answer.classList.toggle('open');
        });
    });
});