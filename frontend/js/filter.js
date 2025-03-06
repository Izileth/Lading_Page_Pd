document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os botões de filtro (imagens e textos)
    const filterImgs = document.querySelectorAll(".im-item");
    const filterTexts = document.querySelectorAll(".ct-it");
    // Seleciona todas as seções da página
    const sections = document.querySelectorAll(".section");
    
    // Função para mostrar todas as seções inicialmente
    function showAllSections() {
        sections.forEach(section => {
            section.style.display = "block";
        });
    }
    
    // Função para filtrar seções com base na categoria
    function filterSections(filter) {
        if (filter === "all") {
            showAllSections();
        } else {
            sections.forEach(section => {
                // Verifica se a seção tem o data-category igual ao filtro
                if (section.dataset.category === filter) {
                    section.style.display = "block";
                    
                    // Scroll suave para a seção
                    section.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    section.style.display = "none";
                }
            });
        }
    }
    
    // Função para sincronizar a seleção ativa entre imagens e textos
    function syncActiveState(filter) {
        // Reseta todos os estados ativos
        filterImgs.forEach(img => img.classList.remove("active"));
        filterTexts.forEach(text => text.classList.remove("active"));
        
        // Ativa o filtro correspondente nas imagens
        const activeImg = document.querySelector(`.im-item[data-filter="${filter}"]`);
        if (activeImg) activeImg.classList.add("active");
        
        // Ativa o filtro correspondente nos textos
        const activeText = document.querySelector(`.ct-it[data-filter="${filter}"]`);
        if (activeText) activeText.classList.add("active");
        
        // Em mobile, centraliza o item selecionado no scroll
        if (window.innerWidth < 768 && activeImg) {
            const container = document.querySelector('.cd-bar-ig');
            const scrollLeft = activeImg.offsetLeft - (container.clientWidth / 2) + (activeImg.clientWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }
    
    // Adiciona eventos de clique para cada imagem de filtro
    filterImgs.forEach(img => {
        img.addEventListener("click", function () {
            const filter = this.dataset.filter;
            syncActiveState(filter);
            filterSections(filter);
        });
    });
    
    // Adiciona eventos de clique para cada texto de filtro
    filterTexts.forEach(text => {
        text.addEventListener("click", function () {
            const filter = this.dataset.filter;
            syncActiveState(filter);
            filterSections(filter);
        });
    });
    
    // Inicializa com todas as seções visíveis e "Todos" selecionado
    showAllSections();
    syncActiveState("all");
    
    // Detecta redimensionamento da janela para ajustes responsivos
    window.addEventListener('resize', function() {
        // Ajusta o layout se necessário
        const activeFilter = document.querySelector('.im-item.active')?.dataset.filter || 'all';
        syncActiveState(activeFilter);
    });
});