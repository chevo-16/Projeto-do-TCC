document.addEventListener('DOMContentLoaded', () => {

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

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-categoria');
      if (categoria) {
        window.location.href = `${categoria}.html`;
      }
    });
  });

  const cardTop = document.querySelector('.side-card:nth-child(1)');
  const cardBottom = document.querySelector('.side-card:nth-child(2)');
  
  const imgTop = document.getElementById('side-img-1');
  const imgBottom = document.getElementById('side-img-2');

  const topBanners = [
    { img: '../images/vestido.png', bg: 'linear-gradient(90deg, #369374 0%, #FC78E1 100%)' },
    { img: '../images/blusa2.png', bg: 'linear-gradient(90deg, #369374 0%, #0866FF 100%)' }
  ];

  const bottomBanners = [
    { img: '../images/tenis2.png', bg: 'linear-gradient(90deg, #369374 0%, #4ade80 100%)' },
    { img: '../images/infantil2.png', bg: 'linear-gradient(90deg, #369374 0%, #FC78E1 50%, #38bdf8 100%)' }
  ];

  let currentIdx = 0;

  if (cardTop && cardBottom) {
    setInterval(() => {

      if (imgTop) imgTop.classList.add('fade-out');
      if (imgBottom) imgBottom.classList.add('fade-out');

      setTimeout(() => {

        currentIdx = (currentIdx + 1) % topBanners.length;


        cardTop.style.background = topBanners[currentIdx].bg;
        cardBottom.style.background = bottomBanners[currentIdx].bg;


        if (imgTop) imgTop.src = topBanners[currentIdx].img;
        if (imgBottom) imgBottom.src = bottomBanners[currentIdx].img;


        if (imgTop) imgTop.classList.remove('fade-out');
        if (imgBottom) imgBottom.classList.remove('fade-out');
      }, 400);

    }, 3000);
  }

});