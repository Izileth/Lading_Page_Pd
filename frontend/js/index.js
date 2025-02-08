function toggleMenu() {
    const hamburger = document.querySelector('.header-menu-hamburger');
    const mobileMenu = document.querySelector('.header-mobile-menu');

    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
}
