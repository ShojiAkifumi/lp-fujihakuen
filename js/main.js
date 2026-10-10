'use strict';

// 予約システムのURL（既存予約システムのURLに差し替え）
const RESERVE_URL = '#';
const VACANCY_URL = '#';

// URL未設定の間は別タブで開かず、ページ内の予約セクションへ移動する
const setLink = (selector, url) => {
  document.querySelectorAll(selector).forEach((a) => {
    if (url === '#') {
      a.href = '#reserve';
      a.removeAttribute('target');
    } else {
      a.href = url;
    }
  });
};
setLink('.js-reserve', RESERVE_URL);
setLink('.js-vacancy', VACANCY_URL);

// ヘッダー：スクロールで背景を付ける
const header = document.getElementById('header');

const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ハンバーガーメニュー
const hamburger = document.querySelector('.hamburger');
const drawer = document.getElementById('drawer');

const setMenu = (open) => {
  hamburger.setAttribute('aria-expanded', open);
  hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', !open);
  document.body.classList.toggle('is-menu-open', open);
  document.body.classList.toggle('is-locked', open);
};
hamburger.addEventListener('click', () => setMenu(hamburger.getAttribute('aria-expanded') !== 'true'));
drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

// フェードイン（控えめに）
const fades = document.querySelectorAll('.fade');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  fades.forEach((el) => io.observe(el));
} else {
  fades.forEach((el) => el.classList.add('is-in'));
}

// ヒーロー：外観→客室→露天風呂→富士山 を切り替え
const slides = document.querySelectorAll('.hero__slide');
const dots = document.querySelectorAll('.hero__dots li');
const caption = document.querySelector('.hero__caption');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;

const FADE_MS = 2000;

const showSlide = (index) => {
  const prev = slides[current];
  prev.classList.remove('is-active');
  prev.classList.add('is-prev');
  dots[current].classList.remove('is-active');
  current = index;
  const next = slides[current];
  next.classList.add('is-active', 'is-zoom');
  // 新しいスライドが完全に表示されてから、前のスライドを隠してズームを初期位置へ戻す
  setTimeout(() => {
    prev.classList.remove('is-prev', 'is-zoom');
  }, FADE_MS + 100);
  // 進捗バーのアニメーションをやり直す
  void dots[current].offsetWidth;
  dots[current].classList.add('is-active');
  caption.textContent = slides[current].dataset.caption;
};

if (slides.length > 1 && !reduceMotion) {
  setInterval(() => showSlide((current + 1) % slides.length), 6000);
}
