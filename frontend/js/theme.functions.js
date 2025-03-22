
function aplicarTemaAutomatico() {
    const hora = new Date().getHours();
    const tema = (hora >= 6 && hora < 18) ? "light" : "dark"; // Claro das 6h às 18h, escuro à noite
    document.documentElement.setAttribute("data-theme", tema);
}

aplicarTemaAutomatico();

// Atualiza o tema a cada hora
setInterval(aplicarTemaAutomatico, 60 * 60 * 1000);
