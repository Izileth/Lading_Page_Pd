document.addEventListener('DOMContentLoaded', () => {
    // Cache de elementos DOM para melhorar performance
    const cartCounts = document.querySelectorAll('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-popup-items');
    const cartPopup = document.querySelector('.cart-popup');
    const cartIcons = document.querySelectorAll('.cart-icon');
    const closeCart = document.querySelector('.close-cart');
    const sendOrderBtn = document.querySelector('.cart-popup-btn .btn');
    
    // Número de WhatsApp do estabelecimento
    const whatsappNumber = '5591993961874'; // Substitua pelo seu número
    
    // Carrega o carrinho do localStorage com técnica de debounce para melhorar performance
    let cart = [];
    let loadCartTimeout;
    
    const loadCart = () => {
        clearTimeout(loadCartTimeout);
        loadCartTimeout = setTimeout(() => {
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
                updateCartCount();
            } catch (e) {
                console.error('Erro ao carregar carrinho:', e);
                cart = [];
            }
        }, 100);
    };
    
    loadCart();
    
    // Produtos com preços numéricos para facilitar cálculos
    const products = [
        { id: 1, name: 'Torta de Doce De Leite', price: 20.00, image: '', liked: false },
        { id: 2, name: 'Torta de Morango', price: 24.00, image:   '', liked: false },
        { id: 3, name: 'Torta de Franboesa', price: 18.00, image: '.', liked: false },
        { id: 4, name: 'Torta de Banana', price: 14.00, image: '', liked: false },
        { id: 5, name: 'Hamburguer Completo', price: 19.00, image: '', liked: false },
        { id: 6, name: 'Pizza Completa', price: 34.00, image: '', liked: false },
        { id: 7, name: 'Empada de Frangi', price: 9.00, image: '', liked: false },
        { id: 8, name: 'Coxinha de Catupiry', price: 7.50, image: '', liked: false },
        { id: 9, name: 'Cupcake de Oreo', price: 8.00, image: '', liked: false },
        { id: 10, name: 'Torta de Maracujá', price: 31.00, image: '', liked: false },
        { id: 11, name: 'Torta de Trufas Vemelhas', price: 38.00, image: '', liked: false },
        { id: 12, name: 'Torta de Caramelo', price: 27.00, image: '', liked: false },
        { id: 13, name: 'Taça de Frutas Caramelizadas', price: 14.00, image: '', liked: false },
        { id: 14, name: 'Taça de Chantily', price: 15.00, image: '', liked: false },
        { id: 15, name: 'Taça de Framboesa', price: 10.00, image: '', liked: false },
        { id: 16, name: 'Taça de Morango Cristalizado', price: 12.00, image: '', liked: false },
        { id: 17, name: 'Combo de Taças', price: 92.00, image: '', liked: false },
        { id: 18, name: 'Combo de Hamburguers', price: 72.00, image: '', liked: false },
        { id: 19, name: 'Combo de doces', price: 84.00, image: '', liked: false },
        { id: 20, name: 'Taça de Pizzas', price: 62.00, image: '', liked: false },
        // Adicione mais produtos aqui
    ];
    
    // Função para salvar o carrinho no localStorage com técnica de throttle
    let saveCartTimeout;
    function saveCart() {
        clearTimeout(saveCartTimeout);
        saveCartTimeout = setTimeout(() => {
            localStorage.setItem('cart', JSON.stringify(cart));
        }, 300);
    }
    
    // Função para atualizar o contador do carrinho
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounts.forEach(cartCount => {
            cartCount.textContent = count;
        });
    }
    
    // Função para calcular o total do carrinho
    function calculateCartTotal() {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Função para formatar preço
    function formatPrice(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }
    
    // Função para atualizar os itens no modal do carrinho com lazy loading
    function updateCartModal() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="item-p">Nenhum item no carrinho</p>';
        } else {
            const fragment = document.createDocumentFragment(); // Usa DocumentFragment para melhor performance
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                const subtotal = item.price * item.quantity;
                
                cartItem.innerHTML = `
                    <div class="item-details">
                        <p class="item-name">${item.name}</p>
                        <p class="item-price">${formatPrice(item.price)} (un)</p>
                        <p class="item-subtotal">Subtotal: ${formatPrice(subtotal)}</p>
                        <div class="quantity-controls">
                            <button class="quantity-decrease" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remover</button>
                `;
                
                fragment.appendChild(cartItem);
            });
            
            // Calcular e exibir o total
            const total = calculateCartTotal();
            const totalElement = document.createElement('div');
            totalElement.classList.add('cart-total');
            totalElement.innerHTML = `
                <p>Subtotal: ${formatPrice(total)}</p>
                <p class="cart-total-value">Total: ${formatPrice(total)}</p>
            `;
            
            fragment.appendChild(totalElement);
            cartItemsContainer.appendChild(fragment);
        }
        
        showRelatedProducts();
    }
    
    // Função para mostrar notificações com animação
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        // Adiciona ícone conforme o tipo de notificação
        const icon = document.createElement('i');
        icon.classList.add('fa', type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
        notification.prepend(icon);
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        setTimeout(() => {
            // Animação de saída
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, 3000);
    }
    
    // Função para animar a abertura/fechamento do modal com performance melhorada
    function toggleModal(open) {
        if (open) {
            cartPopup.style.display = 'block';
            requestAnimationFrame(() => {
                cartPopup.classList.add('open');
                updateCartModal();
            });
        } else {
            cartPopup.classList.remove('open');
            cartPopup.addEventListener('transitionend', function handler() {
                cartPopup.removeEventListener('transitionend', handler);
                cartPopup.style.display = 'none';
            }, { once: true });
        }
    }
    
    // Adicionar evento de clique para curtir usando delegação de eventos para melhor performance
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-heart') || e.target.closest('.btn.fa-heart')) {
            const button = e.target.classList.contains('fa-heart') ? e.target : e.target.closest('.btn.fa-heart');
            e.preventDefault();
            button.classList.toggle('liked');
            
            const productId = parseInt(button.closest('.card').dataset.id);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                product.liked = !product.liked;
                showNotification(product.liked ? 'Produto curtido!' : 'Curtida removida!');
            }
        }
    });
    
    // Adicionar evento de clique para adicionar ao carrinho usando delegação de eventos
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-fav') || e.target.closest('.btn-fav')) {
            const button = e.target.classList.contains('btn-fav') ? e.target : e.target.closest('.btn-fav');
            e.preventDefault();
            
            const card = button.closest('.card');
            const productId = parseInt(card.dataset.id);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                
                saveCart();
                updateCartCount();
                showNotification(`${product.name} adicionado ao carrinho!`);
                
                // Animação do item voando para o carrinho
                const productImg = card.querySelector('img');
                if (productImg) {
                    const flyingImg = productImg.cloneNode();
                    const rect = productImg.getBoundingClientRect();
                    const cartIcon = document.querySelector('.cart-icon');
                    const cartRect = cartIcon.getBoundingClientRect();
                    
                    flyingImg.style.position = 'fixed';
                    flyingImg.style.width = '50px';
                    flyingImg.style.left = `${rect.left}px`;
                    flyingImg.style.top = `${rect.top}px`;
                    flyingImg.style.zIndex = '9999';
                    flyingImg.style.transition = 'all 0.8s ease-in-out';
                    
                    document.body.appendChild(flyingImg);
                    
                    setTimeout(() => {
                        flyingImg.style.transform = 'scale(0.5)';
                        flyingImg.style.left = `${cartRect.left}px`;
                        flyingImg.style.top = `${cartRect.top}px`;
                        flyingImg.style.opacity = '0.5';
                        
                        flyingImg.addEventListener('transitionend', () => {
                            flyingImg.remove();
                        }, { once: true });
                    }, 10);
                }
            }
        }
    });
    
    // Abrir modal do carrinho ao clicar em qualquer ícone de carrinho
    cartIcons.forEach(cartIcon => {
        cartIcon.addEventListener('click', () => {
            toggleModal(true);
        });
    });
    
    // Fechar modal do carrinho
    closeCart.addEventListener('click', () => {
        toggleModal(false);
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === cartPopup) {
            toggleModal(false);
        }
    });
    
    // Usar delegação de eventos para todos os eventos do carrinho
    cartItemsContainer.addEventListener('click', (e) => {
        // Remover item do carrinho
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.dataset.id);
            const index = cart.findIndex(item => item.id === itemId);
            
            if (index !== -1) {
                const removedItem = cart[index];
                cart.splice(index, 1);
                saveCart();
                updateCartCount();
                updateCartModal();
                showNotification(`${removedItem.name} removido do carrinho!`);
            }
        }
        
        // Aumentar quantidade
        if (e.target.classList.contains('quantity-increase')) {
            const itemId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                item.quantity += 1;
                saveCart();
                updateCartCount();
                updateCartModal();
            }
        }
        
        // Diminuir quantidade
        if (e.target.classList.contains('quantity-decrease')) {
            const itemId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    saveCart();
                    updateCartCount();
                    updateCartModal();
                } else {
                    // Se a quantidade for 1, perguntar se deseja remover
                    const shouldRemove = confirm(`Deseja remover ${item.name} do carrinho?`);
                    
                    if (shouldRemove) {
                        const index = cart.findIndex(i => i.id === itemId);
                        cart.splice(index, 1);
                        saveCart();
                        updateCartCount();
                        updateCartModal();
                        showNotification(`${item.name} removido do carrinho!`);
                    }
                }
            }
        }
    });
    
    // Função para criar mensagem de WhatsApp com o pedido
    function createWhatsAppMessage() {
        let message = '*Novo Pedido*\n\n';
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `*${item.quantity}x* ${item.name} - ${formatPrice(item.price)} un. = ${formatPrice(subtotal)}\n`;
        });
        
        const total = calculateCartTotal();
        message += `\n*Total:* ${formatPrice(total)}`;
        
        return encodeURIComponent(message);
    }
    
    // Botão "Enviar Pedido" agora envia para WhatsApp
    sendOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (cart.length > 0) {
            const message = createWhatsAppMessage();
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
            
            // Verificar se é mobile ou desktop
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Em dispositivos móveis, abre direto
                window.location.href = whatsappURL;
            } else {
                // Em desktop, abre em nova janela
                window.open(whatsappURL, '_blank');
            }
            
            showNotification('Redirecionando para WhatsApp...', 'success');
            
            // Limpa o carrinho após envio com delay
            setTimeout(() => {
                cart = [];
                saveCart();
                updateCartCount();
                toggleModal(false);
                showNotification('Pedido enviado com sucesso!', 'success');
            }, 1000);
        } else {
            showNotification('Adicione itens ao carrinho antes de enviar o pedido.', 'error');
        }
    });
    
    // Botão "Cancelar Pedido"
    const cancelOrderButton = document.createElement('button');
    cancelOrderButton.textContent = 'Cancelar Pedido';
    cancelOrderButton.classList.add('btn', 'btn-cancel');
    
    cancelOrderButton.addEventListener('click', () => {
        if (cart.length > 0) {
            const confirmed = confirm('Tem certeza que deseja cancelar o pedido?');
            
            if (confirmed) {
                cart = [];
                saveCart();
                updateCartCount();
                updateCartModal();
                showNotification('Pedido cancelado!', 'error');
            }
        } else {
            showNotification('Não há itens no carrinho para cancelar.', 'error');
        }
    });
    
    document.querySelector('.cart-popup-btn').appendChild(cancelOrderButton);
    
    // Sugestões de produtos relacionados com lazy loading
    function showRelatedProducts() {
        // Remover container anterior se existir
        const existingRelatedContainer = cartItemsContainer.querySelector('.related-products');
        if (existingRelatedContainer) {
            existingRelatedContainer.remove();
        }
        
        // Pegar IDs dos produtos no carrinho
        const cartProductIds = cart.map(item => item.id);
        
        // Filtrar produtos relacionados (não estão no carrinho)
        const relatedProducts = products.filter(p => !cartProductIds.includes(p.id));
        
        if (relatedProducts.length > 0) {
            const relatedContainer = document.createElement('div');
            relatedContainer.classList.add('related-products');
            relatedContainer.innerHTML = '<h3>Você também pode gostar:</h3>';
            
            const fragment = document.createDocumentFragment();
            
            // Mostrar 3 produtos aleatórios para sugestões mais variadas
            const shuffled = [...relatedProducts].sort(() => 0.5 - Math.random());
            shuffled.slice(0, 3).forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('related-product');
                productElement.dataset.id = product.id;
                
                productElement.innerHTML = `
                    <div>
                        <p class="product-name">${product.name}</p>
                        <p class="product-price">${formatPrice(product.price)}</p>
                        <button class="add-related-btn" data-id="${product.id}">Adicionar</button>
                    </div>
                `;
                
                fragment.appendChild(productElement);
            });
            
            relatedContainer.appendChild(fragment);
            cartItemsContainer.appendChild(relatedContainer);
            
            // Adicionar evento para os botões de adicionar produto relacionado
            relatedContainer.querySelectorAll('.add-related-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = parseInt(btn.dataset.id);
                    const product = products.find(p => p.id === productId);
                    
                    if (product) {
                        cart.push({ ...product, quantity: 1 });
                        saveCart();
                        updateCartCount();
                        updateCartModal();
                        showNotification(`${product.name} adicionado ao carrinho!`, 'success');
                    }
                });
            });
        }
    }
    
    // Implementação de busca de produtos (opcional)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const productCards = document.querySelectorAll('.card');
                
                if (searchTerm === '') {
                    productCards.forEach(card => {
                        card.style.display = 'block';
                    });
                    return;
                }
                
                productCards.forEach(card => {
                    const productName = card.querySelector('.card-title').textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 300);
        });
    }
    
    // Inicialização - atualizar contagem no carregamento
    updateCartCount();
});