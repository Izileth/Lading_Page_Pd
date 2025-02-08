document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('avaliarModal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = modal.querySelector('.modal-content');
    const avaliarForm = document.getElementById('avaliarForm');
    const closeModal = document.querySelector('.close');
    const stars = document.querySelectorAll('.star-rating .star');

    let selectedRating = 0;
    let currentPratoId = null;
    let editingCommentIndex = null; // Para rastrear o comentário sendo editado

    // Função para posicionar o modal próximo ao botão clicado
    function posicionarModal(botao) {
        const rect = botao.getBoundingClientRect();
        modalContent.style.top = `${rect.bottom + window.scrollY + 10}px`;
        modalContent.style.left = `${rect.left + window.scrollX}px`;
    }

    // Função para carregar avaliações e comentários
    function carregarDados(pratoId) {
        const prato = JSON.parse(localStorage.getItem(`prato_${pratoId}`)) || {
            totalRatings: 0,
            sumRatings: 0,
            comentarios: []
        };

        const averageRating = (prato.sumRatings / prato.totalRatings || 0).toFixed(1);
        const pratoElement = document.querySelector(`[data-prato-id="${pratoId}"]`);
        pratoElement.querySelector('.average-rating-value').textContent = averageRating;
        pratoElement.querySelector('.rating-count').textContent = `(${prato.totalRatings} avaliações)`;

        const comentariosList = pratoElement.querySelector('.comentarios-list');
        comentariosList.innerHTML = prato.comentarios.map((comentario, index) => `
            <div class="comentario">
                <div class="acoes">
                    <button onclick="editarComentario(${pratoId}, ${index})">Editar</button>
                    <button onclick="excluirComentario(${pratoId}, ${index})">Excluir</button>
                </div>
                <p class="autor">${comentario.nome}</p>
                <p>${comentario.comentario}</p>
                <p><em>Avaliação: ${comentario.rating} estrelas</em></p>
            </div>
        `).join('');
    }

    // Função para editar um comentário
    window.editarComentario = function(pratoId, index) {
        const prato = JSON.parse(localStorage.getItem(`prato_${pratoId}`));
        const comentario = prato.comentarios[index];

        // Preencher o modal com os dados do comentário
        document.getElementById('nome').value = comentario.nome;
        document.getElementById('comentario').value = comentario.comentario;
        selectedRating = comentario.rating;
        stars.forEach((star, i) => {
            if (i < selectedRating) star.classList.add('selected');
            else star.classList.remove('selected');
        });

        // Abrir o modal em modo de edição
        currentPratoId = pratoId;
        editingCommentIndex = index;
        modalTitle.textContent = `Editar Comentário`;
        modal.style.display = 'block';
    };

    // Função para excluir um comentário
    window.excluirComentario = function(pratoId, index) {
        const prato = JSON.parse(localStorage.getItem(`prato_${pratoId}`));
        prato.comentarios.splice(index, 1); // Remove o comentário
        prato.totalRatings--;
        prato.sumRatings -= prato.comentarios[index].rating;

        // Salvar no localStorage
        localStorage.setItem(`prato_${pratoId}`, JSON.stringify(prato));

        // Recarregar os dados na página
        carregarDados(pratoId);
    };

    // Abrir modal ao clicar em qualquer botão "Avaliar"
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('avaliar-btn')) {
            const botao = event.target;
            const pratoId = botao.closest('[data-prato-id]').getAttribute('data-prato-id');
            currentPratoId = pratoId;
            editingCommentIndex = null; // Resetar o índice de edição
            modalTitle.textContent = `Avaliar Prato ${pratoId}`;
            posicionarModal(botao); // Posicionar o modal próximo ao botão
            modal.style.display = 'block';
        }
    });


    // Fechar modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    // Selecionar estrelas
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }
        });
    });

    // Enviar avaliação e comentário
    avaliarForm.onsubmit = function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const comentario = document.getElementById('comentario').value;

        if (selectedRating === 0) {
            alert('Por favor, selecione uma avaliação.');
            return;
        }

        // Carregar dados existentes
        const prato = JSON.parse(localStorage.getItem(`prato_${currentPratoId}`)) || {
            totalRatings: 0,
            sumRatings: 0,
            comentarios: []
        };

        if (editingCommentIndex !== null) {
            // Editar comentário existente
            prato.comentarios[editingCommentIndex] = { nome, comentario, rating: selectedRating };
        } else {
            // Adicionar novo comentário
            prato.totalRatings++;
            prato.sumRatings += selectedRating;
            prato.comentarios.push({ nome, comentario, rating: selectedRating });
        }

        // Salvar no localStorage
        localStorage.setItem(`prato_${currentPratoId}`, JSON.stringify(prato));

        // Recarregar dados na página
        carregarDados(currentPratoId);

        // Fechar modal e limpar formulário
        modal.style.display = 'none';
        avaliarForm.reset();
        stars.forEach(s => s.classList.remove('selected'));
        selectedRating = 0;
        editingCommentIndex = null;
    };

    // Carregar dados para todos os pratos ao iniciar
    document.querySelectorAll('.grid-item').forEach(prato => {
        const pratoId = prato.getAttribute('data-prato-id');
        carregarDados(pratoId);
    });

    // Enviar pedido via WhatsApp
    document.querySelectorAll('.pedido-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pratoNome = this.closest('.grid-item').querySelector('h3').textContent;
            const mensagem = `Olá, gostaria de pedir um(a) ${pratoNome}.`;
            const url = `https://wa.me/SEUNUMERO?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
        });
    });
});