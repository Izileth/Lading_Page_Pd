function toggleMenu() {
    const hamburger = document.querySelector('.header-menu-hamburger');
    const mobileMenu = document.querySelector('.header-mobile-menu');

    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", function () {
    let evaluationCount = 0;
  
    const stars = document.querySelectorAll(".star");
    const evaluationText = document.querySelector(".rating-count");
    const avaliarBtn = document.querySelector(".avaliar-btn");
  
    avaliarBtn.addEventListener("click", function () {
      evaluationCount++; // Incrementa a contagem de avaliações
      const starCount = Math.floor(evaluationCount / 2); // Cada 2 avaliações = 1 estrela cheia
  
      // Atualiza visualmente as estrelas
      stars.forEach((star, index) => {
        if (index < starCount) {
          star.classList.add("active");
        } else {
          star.classList.remove("active");
        }
      });
  
      // Atualiza o texto de avaliação
      evaluationText.textContent = `(${evaluationCount} avaliação${evaluationCount > 1 ? 's' : ''})`;
  
      console.log(`Total de Avaliações: ${evaluationCount}`);
    });
  });
  