// Seletores
const menuBar = document.querySelector('.menu-mobile');
const iconMenu = document.querySelector('.icon-menu');
const cartIcon = document.querySelector('.cart-icon');
const cartPopup = document.querySelector('.cart-popup');
const closeCart = document.querySelector('.close-cart');

// Abrir e fechar o menu móvel
iconMenu.addEventListener('click', () => {
    // Alternar a classe 'active' no ícone do menu
    iconMenu.classList.toggle('active');
    // Alternar a visibilidade do menu móvel
    menuBar.classList.toggle('active');
});

// Fechar o menu ao clicar em um link
menuBar.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        // Fechar o menu móvel
        menuBar.classList.remove('active');
        // Remover a classe 'active' do ícone do menu
        iconMenu.classList.remove('active');
    }
});
