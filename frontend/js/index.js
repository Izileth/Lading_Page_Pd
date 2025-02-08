// Abre o Menu
function toggleMenu() {
    const hamburger = document.querySelector('.header-menu-hamburger');
    const mobileMenu = document.querySelector('.header-mobile-menu');

    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
}

// Redireciona o usuário para uma seção do site

const nextInBtn = document.getElementById('nextIn');


nextInBtn.addEventListener('click', () => {
    // Seleciona o elemento pelo ID
    const destino = document.getElementById("about");
    
    // Scroll suave até o elemento
    destino.scrollIntoView({ behavior: "smooth" });

    nextInBtn.disabled = true; // Disable the button while the new tab is loading.

    setTimeout(() => {
        signInBtn.disabled = false; // Re-enable the button after 5 seconds.
    }, 2500); // 2.5 seconds delay before re-enabling the button.
});

const  instaBtn = document.getElementById('instaBtn');

instaBtn.addEventListener('click', () => {
    // Abre a janela com a URL do Instagram
    window.open('https://www.instagram.com/padoca_brigadeiro/', '_blank');
});