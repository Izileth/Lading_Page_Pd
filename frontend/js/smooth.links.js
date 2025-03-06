// Captura todos os links de âncoras (links com href iniciando com '#')
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    // Impede o comportamento padrão de rolagem
    e.preventDefault();

    // Captura o destino do link (id do elemento)
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    // Rolagem suave até o elemento
    targetElement.scrollIntoView({
      behavior: 'smooth',  // Tipo de rolagem suave
      block: 'start'       // Posiciona o elemento no início da tela
    });
  });
});