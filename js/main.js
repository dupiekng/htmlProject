const siteData = {
  slider: {
    current: 0,
    total: 4,
    autoplayInterval: null,
    autoplayDelay: 5000
  },
  articles: {
    current: 0,
    perPage: 3
  }
};

/**
 * @param {Function} fn
 * @param {number} delay
 */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * @param {Element} el
 * @param {string} cls
 */
function animateClass(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth; // reflow
  el.classList.add(cls);
}


function initFeaturedSlider() {
  const slides = document.querySelectorAll('.featured-slide');
  const dots = document.querySelectorAll('.slider-controls .slider-dot');
  const prevBtn = document.getElementById('featuredPrev');
  const nextBtn = document.getElementById('featuredNext');

  if (!slides.length) return;

  function goToSlide(index) {
    slides[siteData.slider.current].classList.remove('active');
    dots[siteData.slider.current].classList.remove('active');

    siteData.slider.current = (index + siteData.slider.total) % siteData.slider.total;

    slides[siteData.slider.current].classList.add('active');
    dots[siteData.slider.current].classList.add('active');
  }

  function next() { goToSlide(siteData.slider.current + 1); }
  function prev() { goToSlide(siteData.slider.current - 1); }

  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
  });

  function startAutoplay() {
    siteData.slider.autoplayInterval = setInterval(next, siteData.slider.autoplayDelay);
  }

  function resetAutoplay() {
    clearInterval(siteData.slider.autoplayInterval);
    startAutoplay();
  }

  startAutoplay();
}

function initArticlesPagination() {
  const prevBtn = document.getElementById('articlesPrev');
  const nextBtn = document.getElementById('articlesNext');
  const cards = document.querySelectorAll('.article-card');

  if (!prevBtn || !nextBtn || !cards.length) return;

  function animateCards() {
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });
  }

  prevBtn.addEventListener('click', animateCards);
  nextBtn.addEventListener('click', animateCards);
}


function initSearch() {
  const input = document.querySelector('.search-box__input');
  if (!input) return;

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const query = this.value.trim();
      if (query) {
        // In a real project, this would navigate to search results
        console.log('Searching for:', query);
        this.value = '';
        this.blur();
      }
    }
  });
}

function initNewsletter() {
  const btn = document.querySelector('.newsletter__btn');
  const input = document.querySelector('.newsletter__input');
  if (!btn || !input) return;

  btn.addEventListener('click', function () {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      shakeElement(input);
      return;
    }
    input.value = '';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
    btn.style.background = '#2d9b5a';
    setTimeout(() => {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      btn.style.background = '';
    }, 3000);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btn.click();
  });
}

/**
 * @param {Element} el
 */
function shakeElement(el) {
  el.style.transition = 'none';
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(0)' }
  ];
  el.animate(keyframes, { duration: 350, easing: 'ease-in-out' });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const onScroll = throttle(() => {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 80) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav__link--active');
      }
    });
  }, 100);

  window.addEventListener('scroll', onScroll);
}

function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.trending__item, .article-card, .sidebar__card, .recent__item, .ranking__table tbody tr'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
    observer.observe(el);
  });
}

function initFooterPagination() {
  const prev = document.getElementById('footerPrev');
  const next = document.getElementById('footerNext');
  const dots = document.querySelectorAll('.footer__pagination .slider-dot');
  let current = 0;

  function go(index) {
    dots[current].classList.remove('active');
    current = (index + dots.length) % dots.length;
    dots[current].classList.add('active');
  }

  prev && prev.addEventListener('click', () => go(current - 1));
  next && next.addEventListener('click', () => go(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
}

document.addEventListener('DOMContentLoaded', function () {
  initFeaturedSlider();
  initArticlesPagination();
  initSearch();
  initNewsletter();
  initScrollSpy();
  initScrollReveal();
  initFooterPagination();

  console.log('Sport News initialised ✓');
});
