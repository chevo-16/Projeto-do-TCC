const btnCat = document.getElementById('btn-categorias');
const overlay = document.getElementById('category-overlay');
const btnClose = document.getElementById('close-cat');

// Abrir categorias
btnCat.addEventListener('click', () => {
    overlay.classList.remove('hidden');
});

// Fechar categorias
btnClose.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

// Fechar ao clicar fora da caixa branca
overlay.addEventListener('click', (e) => {
    if(e.target === overlay) overlay.classList.add('hidden');
});