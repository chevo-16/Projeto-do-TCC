document.addEventListener('DOMContentLoaded', () => {

  // 1. ABRIR E FECHAR MODAL DE CATEGORIAS
  const btnOpen = document.getElementById('btn-open-cat');
  const btnClose = document.getElementById('btn-close-cat');
  const modal = document.getElementById('modal-categorias');
  const catButtons = document.querySelectorAll('.cat-button');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // Redirecionamento das Categorias
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-categoria');
      if (categoria) {
        window.location.href = `${categoria}.html`;
      }
    });
  });

  // 2. TROCA DE CORES E IMAGENS DOS CARDS
  const cardTop = document.querySelector('.side-card:nth-child(1)');
  const cardBottom = document.querySelector('.side-card:nth-child(2)');
  
  const imgTop = document.getElementById('side-img-1');
  const imgBottom = document.getElementById('side-img-2');

  // Banners e suas cores
  const topBanners = [
    { img: '../images/destaque-rosa.png', bg: 'linear-gradient(90deg, #a4e693 0%, #f472b6 100%)' },
    { img: '../images/destaque-roxo.png', bg: 'linear-gradient(90deg, #a4e693 0%, #a78bfa 100%)' }
  ];

  const bottomBanners = [
    { img: '../images/destaque-verde.png', bg: 'linear-gradient(90deg, #a4e693 0%, #4ade80 100%)' },
    { img: '../images/destaque-azul.png', bg: 'linear-gradient(90deg, #a4e693 0%, #38bdf8 100%)' }
  ];

  let currentIdx = 0;

  if (cardTop && cardBottom) {
    setInterval(() => {
      if (imgTop) imgTop.classList.add('fade-out');
      if (imgBottom) imgBottom.classList.add('fade-out');

      setTimeout(() => {
        currentIdx = (currentIdx + 1) % topBanners.length;

        // Mudar cores de fundo dos cards
        cardTop.style.background = topBanners[currentIdx].bg;
        cardBottom.style.background = bottomBanners[currentIdx].bg;

        // Mudar fontes de imagens
        if (imgTop) imgTop.src = topBanners[currentIdx].img;
        if (imgBottom) imgBottom.src = bottomBanners[currentIdx].img;

        if (imgTop) imgTop.classList.remove('fade-out');
        if (imgBottom) imgBottom.classList.remove('fade-out');
      }, 400);

    }, 3000); // Troca a cada 3 segundos
  }

});