// Tabela de Preços Atualizada para DOCERIA
const tabelaPrecos = {
    'Bolo de Pote Ninho c/ Nutella': 15.00,
    'Bolo de Pote Cenoura c/ Chocolate': 12.00,
    'Bolo de Pote Red Velvet': 14.00,
    'Copo da Felicidade Morango': 22.00,
    'Copo da Felicidade Brownie': 25.00,
    'Fatia Torta de Limão': 13.00,
    'Caixa 4 Brigadeiros Gourmet': 12.00,
    'Combo Parabéns': 119.90,
    
    // Acréscimos
    'Adicional Morango': 3.00,
    'Adicional Nutella': 4.50,
    'Adicional Kinder Bueno': 4.00,
    'Adicional Gotas de Chocolate': 2.50,
    
    // Bebidas
    'Água s/gás': 3.00,
    'Água c/gás': 3.50,
    'Coca-Cola Lata': 6.00,
    'Guaraná Lata': 6.00,
    'Suco Natural Laranja': 7.00
};

let carrinho = [];
let itemSendoMontado = { lanche: '', acrescimos: [], bebidas: [] };
let tipoEntrega = 'Entrega'; 

// Funções de Alertas e Erros mantidas iguais...
function mostrarAlerta(mensagem) {
    const modal = document.getElementById('custom-alert');
    document.getElementById('custom-alert-message').innerText = mensagem;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); document.getElementById('custom-alert-box').classList.remove('scale-95'); document.getElementById('custom-alert-box').classList.add('scale-100'); }, 10);
}

function fecharAlerta() {
    const modal = document.getElementById('custom-alert');
    modal.classList.add('opacity-0');
    document.getElementById('custom-alert-box').classList.remove('scale-100');
    document.getElementById('custom-alert-box').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300); 
}

function limparErros() {
    ['nome', 'rua', 'numero', 'bairro'].forEach(campo => {
        const input = document.getElementById(`input-${campo}`);
        if(input) input.classList.remove('border-red-500');
        const erro = document.getElementById(`erro-${campo}`);
        if(erro) erro.classList.add('hidden');
    });
}

function mostrarErro(campo, mensagem) {
    const input = document.getElementById(`input-${campo}`);
    if(input) input.classList.add('border-red-500');
    const erro = document.getElementById(`erro-${campo}`);
    if(erro) { erro.innerText = mensagem; erro.classList.remove('hidden'); }
}

// Carrinho
function iniciarPedido(nomeLanche) {
    itemSendoMontado = { lanche: nomeLanche, acrescimos: [], bebidas: [] };
    document.getElementById('nome-lanche-display').innerText = nomeLanche;
    document.querySelectorAll('.bebida-checkbox, .acrescimo-checkbox').forEach(cb => cb.checked = false);
    abrirGaveta();
    mostrarTelaAcompanhamentos();
}

function adicionarAoCarrinho() {
    itemSendoMontado.bebidas = Array.from(document.querySelectorAll('.bebida-checkbox:checked')).map(cb => cb.value);
    itemSendoMontado.acrescimos = Array.from(document.querySelectorAll('.acrescimo-checkbox:checked')).map(cb => cb.value);
    
    let valorItem = tabelaPrecos[itemSendoMontado.lanche] || 0;
    itemSendoMontado.acrescimos.forEach(item => valorItem += tabelaPrecos[item] || 0);
    itemSendoMontado.bebidas.forEach(item => valorItem += tabelaPrecos[item] || 0);
    
    itemSendoMontado.valorTotal = valorItem;
    carrinho.push(JSON.parse(JSON.stringify(itemSendoMontado))); 
    
    atualizarBotaoFlutuante();
    mostrarTelaCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarBotaoFlutuante();
    carrinho.length === 0 ? fecharGaveta() : mostrarTelaCarrinho(); 
}

function calcularTotalGeral() {
    return carrinho.reduce((total, item) => total + item.valorTotal, 0);
}

function atualizarBotaoFlutuante() {
    const btnFlutuante = document.getElementById('btn-floating-cart');
    if (carrinho.length > 0) {
        btnFlutuante.classList.remove('hidden');
        btnFlutuante.classList.add('flex');
        document.getElementById('cart-count').innerText = carrinho.length;
    } else {
        btnFlutuante.classList.add('hidden');
        btnFlutuante.classList.remove('flex');
    }
}

// Telas e Gaveta
function abrirGaveta() {
    document.getElementById('drawer-overlay').classList.add('active');
    document.getElementById('drawer-content').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharGaveta() {
    document.getElementById('drawer-overlay').classList.remove('active');
    document.getElementById('drawer-content').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function mostrarTelaAcompanhamentos() {
    document.getElementById('tela-acompanhamentos').classList.remove('hidden');
    document.getElementById('tela-carrinho').classList.add('hidden');
    document.getElementById('tela-checkout').classList.add('hidden');
}

function mostrarTelaCarrinho() {
    const container = document.getElementById('itens-carrinho');
    container.innerHTML = '';
    
    carrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="font-bold text-bakery-cocoa">${item.lanche}</h4>
                    <p class="text-[10px] text-slate-500">${item.acrescimos.join(', ') || 'Sem adicionais'}</p>
                    <p class="text-[10px] text-slate-500">${item.bebidas.join(', ') || 'Sem bebidas'}</p>
                </div>
                <button onclick="removerDoCarrinho(${index})" class="text-red-500 text-xs font-bold uppercase tracking-widest">Remover</button>
            </div>
            <div class="text-right font-black text-bakery-terracotta text-sm">R$ ${item.valorTotal.toFixed(2)}</div>
        `;
        container.appendChild(div);
    });

    document.getElementById('total-carrinho').innerText = `R$ ${calcularTotalGeral().toFixed(2)}`;
    document.getElementById('tela-acompanhamentos').classList.add('hidden');
    document.getElementById('tela-carrinho').classList.remove('hidden');
    document.getElementById('tela-checkout').classList.add('hidden');
}

function irParaCheckout() {
    if (carrinho.length === 0) return mostrarAlerta('Seu carrinho está vazio!');
    document.getElementById('tela-acompanhamentos').classList.add('hidden');
    document.getElementById('tela-carrinho').classList.add('hidden');
    document.getElementById('tela-checkout').classList.remove('hidden');
    atualizarCamposEndereco();
}

function selecionarEntrega(tipo) {
    tipoEntrega = tipo;
    const btnEntrega = document.getElementById('btn-entrega');
    const btnRetirada = document.getElementById('btn-retirada');
    
    if (tipo === 'Entrega') {
        btnEntrega.classList.add('bg-bakery-cocoa', 'text-white');
        btnEntrega.classList.remove('bg-bakery-linen', 'text-bakery-cocoa');
        btnRetirada.classList.remove('bg-bakery-cocoa', 'text-white');
        btnRetirada.classList.add('bg-bakery-linen', 'text-bakery-cocoa');
    } else {
        btnRetirada.classList.add('bg-bakery-cocoa', 'text-white');
        btnRetirada.classList.remove('bg-bakery-linen', 'text-bakery-cocoa');
        btnEntrega.classList.remove('bg-bakery-cocoa', 'text-white');
        btnEntrega.classList.add('bg-bakery-linen', 'text-bakery-cocoa');
    }
    atualizarCamposEndereco();
}

function atualizarCamposEndereco() {
    const campos = document.getElementById('campos-endereco');
    campos.style.display = tipoEntrega === 'Entrega' ? 'block' : 'none';
}

function finalizarPedido() {
    limparErros();
    const nome = document.getElementById('input-nome').value;
    const rua = document.getElementById('input-rua').value;
    const numero = document.getElementById('input-numero').value;
    const bairro = document.getElementById('input-bairro').value;
    const pagamento = document.getElementById('input-pagamento').value;

    if (!nome) return mostrarErro('nome', 'Por favor, digite seu nome.');
    if (tipoEntrega === 'Entrega') {
        if (!rua) return mostrarErro('rua', 'Digite sua rua.');
        if (!numero) return mostrarErro('numero', 'Digite o número.');
        if (!bairro) return mostrarErro('bairro', 'Digite seu bairro.');
    }

    let msg = `*NOVO PEDIDO - BELLA DOCERIA*\n\n`;
    msg += `👤 *Cliente:* ${nome}\n`;
    msg += `🛵 *Tipo:* ${tipoEntrega}\n`;
    if (tipoEntrega === 'Entrega') {
        msg += `📍 *Endereço:* ${rua}, ${numero} - ${bairro}\n`;
    }
    msg += `💳 *Pagamento:* ${pagamento}\n\n`;
    msg += `🛒 *Itens:*\n`;

    carrinho.forEach(item => {
        msg += `\n*${item.lanche}*\n`;
        if (item.acrescimos.length) msg += `  - Adicionais: ${item.acrescimos.join(', ')}\n`;
        if (item.bebidas.length) msg += `  - Bebidas: ${item.bebidas.join(', ')}\n`;
        msg += `  - Subtotal: R$ ${item.valorTotal.toFixed(2)}\n`;
    });

    msg += `\n💰 *TOTAL GERAL: R$ ${calcularTotalGeral().toFixed(2)}*\n\n`;
    msg += `_Olá! Acabei de montar meu pedido no site. Pode confirmar para mim?_`;

    document.getElementById('desktop-msg').innerText = msg;
    document.getElementById('mobile-msg').innerText = msg;
    fecharGaveta();
    
    // Setup redirection on click
    document.getElementById('wa-simulator-overlay').onclick = () => {
        if (typeof openWhatsApp === 'function') {
            openWhatsApp(msg);
        } else {
            window.open(`https://wa.me/5531980159559?text=${encodeURIComponent(msg)}`, '_blank');
        }
    };
    
    document.getElementById('wa-simulator-overlay').classList.add('active');
}

function fecharSimulator() {
    document.getElementById('wa-simulator-overlay').classList.remove('active');
}