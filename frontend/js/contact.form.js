document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form');
    const statusMessage = document.getElementById('statusMessage');
    const whatsappNumber = '+5591993961874';

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('phone').value.trim();

        if (!nome || !telefone) {
            statusMessage.textContent = 'Por favor, preencha todos os campos.';
            statusMessage.className = 'error';
            return;
        }

        const mensagem = encodeURIComponent(`*Novo Formulário Recebido!*\n\n📋 *Nome:* ${nome}\n📞 *Telefone:* ${telefone}`);
        const url = `https://wa.me/${whatsappNumber}?text=${mensagem}`;

        try {
            window.open(url, '_blank');
            statusMessage.textContent = 'Informações Enviadas com sucesso para o WhatsApp!';
            statusMessage.className = 'success';
            form.reset();
        } catch (error) {
            statusMessage.textContent = 'Erro ao enviar o formulário. Tente novamente.';
            statusMessage.className = 'error';
            console.error('Erro ao enviar formulário para o WhatsApp:', error);
        }
    });
});
