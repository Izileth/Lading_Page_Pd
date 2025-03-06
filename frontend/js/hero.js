// Script para funcionalidades do header da Padaria de Esquina

// Função que verifica se o restaurante está aberto ou fechado
function verificarStatusRestaurante() {
    const horaAtual = new Date();
    const hora = horaAtual.getHours();
    const minutos = horaAtual.getMinutes();
    
    // Converte hora atual para minutos desde meia-noite
    const tempoAtualEmMinutos = hora * 60 + minutos;
    
    // Horário de funcionamento: 10:00 às 22:00
    const horarioAbertura = 10 * 60; // 10:00 em minutos
    const horarioFechamento = 22 * 60; // 22:00 em minutos
    
    // Elemento do horário
    const elementoHorario = document.querySelector('.hr-sc-hr p');
 
    if (tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento) {
        // Restaurante aberto
        elementoHorario.innerHTML = 'Abrimos das 10:00 às 22:00 <span class="status-aberto">ABERTO AGORA</span>';
        elementoHorario.classList.add('aberto');
        elementoHorario.classList.remove('fechado');
    } else {
        // Restaurante fechado
        elementoHorario.innerHTML = 'Abrimos das 10:00 às 22:00 <span class="status-fechado">FECHADO AGORA</span>';
        elementoHorario.classList.add('fechado');
        elementoHorario.classList.remove('aberto');
    }
}

// Função que calcula tempo até abrir ou fechar
function atualizarTempoRestante() {
    const horaAtual = new Date();
    const hora = horaAtual.getHours();
    const minutos = horaAtual.getMinutes();
    
    // Converte hora atual para minutos desde meia-noite
    const tempoAtualEmMinutos = hora * 60 + minutos;
    
    // Horário de funcionamento: 10:00 às 22:00
    const horarioAbertura = 10 * 60; // 10:00 em minutos
    const horarioFechamento = 22 * 60; // 22:00 em minutos
    
    let mensagem = "";
    let tempoRestante = 0;
    
    if (tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento) {
        // Restaurante aberto - calcular tempo até fechar
        tempoRestante = horarioFechamento - tempoAtualEmMinutos;
        const horasRestantes = Math.floor(tempoRestante / 60);
        const minutosRestantes = tempoRestante % 60;
        
        if (horasRestantes > 0) {
            mensagem = `Fechamos em ${horasRestantes}h e ${minutosRestantes}min`;
        } else {
            mensagem = `Fechamos em ${minutosRestantes}min`;
        }
    } else {
        // Restaurante fechado - calcular tempo até abrir
        if (tempoAtualEmMinutos < horarioAbertura) {
            tempoRestante = horarioAbertura - tempoAtualEmMinutos;
        } else {
            // Já passou do horário de fechamento, aberto no próximo dia
            tempoRestante = (24 * 60 - tempoAtualEmMinutos) + horarioAbertura;
        }
        
        const horasRestantes = Math.floor(tempoRestante / 60);
        const minutosRestantes = tempoRestante % 60;
        
        if (horasRestantes > 0) {
            mensagem = `Abrimos em ${horasRestantes}h e ${minutosRestantes}min`;
        } else {
            mensagem = `Abrimos em ${minutosRestantes}min`;
        }
    }
    
    // Adicionar a mensagem de tempo restante como tooltip
    const elementoHorario = document.querySelector('.hr-sc-hr p');
    elementoHorario.setAttribute('title', mensagem);
    
    // Se quiser mostrar o tempo também na interface:
    const elementoTempoRestante = document.querySelector('.tempo-restante');
    if (elementoTempoRestante) {
        elementoTempoRestante.textContent = mensagem;
    } else {
        const novoElemento = document.createElement('div');
        novoElemento.className = 'tempo-restante';
        novoElemento.textContent = mensagem;
        document.querySelector('.hr-sc-hr').appendChild(novoElemento);
    }
}

// Adicionar efeitos de hover nos botões
function adicionarEfeitosNosBotoes() {
    const botoes = document.querySelectorAll('.hr-sc-if a');
    
    botoes.forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        botao.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
        
        botao.addEventListener('click', function(e) {
            // Adicionar efeito de clique
            this.classList.add('click-effect');
            
            // Se for o botão de contato, mostrar modal
            if (this.textContent.trim() === 'Contato') {
                e.preventDefault();
                mostrarModalContato();
            }
            
            // Se for o botão de menu, scrollar para a seção do menu
            if (this.textContent.trim() === 'Menu') {
                e.preventDefault();
                scrollParaMenu();
            }
            
            // Remover efeito após 300ms
            setTimeout(() => {
                this.classList.remove('click-effect');
            }, 300);
        });
    });
}

// Função para mostrar modal de contato
function mostrarModalContato() {
    // Verificar se o modal já existe
    let modal = document.getElementById('modal-contato');
    
    if (!modal) {
        // Criar modal
        modal = document.createElement('div');
        modal.id = 'modal-contato';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Entre em Contato</h2>
                <div class="social-links">
                    <a href="#" class="social-icon">Instagram</a>
                    <a href="#" class="social-icon">Facebook</a>
                    <a href="#" class="social-icon">WhatsApp</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adicionar evento de fechar
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show-modal');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }
    
    // Exibir modal com animação
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show-modal');
    }, 10);
}

// Função para rolar até a seção de menu
function scrollParaMenu() {
    const menuSection = document.querySelector('.menu-section') || document.getElementById('cardapio');
    
    if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Se não encontrar seção de menu, criar toast informando
        mostrarToast('Em breve nosso cardápio estará disponível online!');
    }
}

// Função para mostrar toast (mensagem temporária)
function mostrarToast(mensagem) {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensagem;
    toast.className = 'toast';
    
    setTimeout(() => {
        toast.className = 'toast show';
    }, 10);
    
    setTimeout(() => {
        toast.className = 'toast';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Inicializar todas as funcionalidades
function iniciarFuncionalidades() {
    // Verificar status do restaurante
    verificarStatusRestaurante();
    
    // Atualizar tempo restante
    atualizarTempoRestante();
    
    // Adicionar efeitos nos botões
    adicionarEfeitosNosBotoes();
    
    // Atualizar a cada minuto
    setInterval(() => {
        verificarStatusRestaurante();
        atualizarTempoRestante();
    }, 60000); // 60000ms = 1 minuto
}

// Executar quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', iniciarFuncionalidades);