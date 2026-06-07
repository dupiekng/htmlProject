const searchData = [
  { label:'6-Year-Old Horse Dies at Belmont Park', cat:'Race' },
  { label:'Savilia Blunk Embraces Longer Season', cat:'Cycling' },
  { label:'Ryan Garcia fighting on social media', cat:'Boxing' },
  { label:'Ethiopian runners took the top four spots', cat:'Athletics' },
  { label:'IndyCar Detroit: Dixon quickest in second practice', cat:'IndyCar' },
  { label:'Lionel Messi Leaving Paris Saint-Germain', cat:'Football' },
  { label:'NBA Finals: Heat take Game 1 in overtime', cat:'Basketball' },
  { label:'Baku 2023 World Taekwondo Championships', cat:'Taekwondo' },
  { label:'Open Championship Royal Liverpool Golf', cat:'Golf' },
  { label:'Ireland Tour of England Test 2023', cat:'Cricket' },
  { label:'Golden Knights out to fulfill owner\'s quest', cat:'Hockey' },
  { label:'Outdoor Badminton Gets Support From Federation', cat:'Badminton' },
];

const sliderState = { current:0, total:4, timer:null, delay:5000 };

function throttle(fn, ms) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } };
}

function initSlider() {
  const slides = document.querySelectorAll('.featured-slide');
  const dots   = document.querySelectorAll('.slider-controls .slider-dot');
  const prev   = document.getElementById('featuredPrev');
  const next   = document.getElementById('featuredNext');
  if (!slides.length) return;

  function go(idx) {
    slides[sliderState.current].classList.remove('active');
    dots[sliderState.current].classList.remove('active');
    sliderState.current = (idx + sliderState.total) % sliderState.total;
    slides[sliderState.current].classList.add('active');
    dots[sliderState.current].classList.add('active');
  }
  function reset() { clearInterval(sliderState.timer); sliderState.timer = setInterval(() => go(sliderState.current + 1), sliderState.delay); }

  next?.addEventListener('click', () => { go(sliderState.current + 1); reset(); });
  prev?.addEventListener('click', () => { go(sliderState.current - 1); reset(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); reset(); }));
  reset();
}

function initArticles() {
  const prev = document.getElementById('articlesPrev');
  const next = document.getElementById('articlesNext');
  const cards = document.querySelectorAll('.article-card');
  function animate() {
    cards.forEach((c, i) => {
      c.style.opacity = '0'; c.style.transform = 'translateY(14px)';
      setTimeout(() => { c.style.transition = 'opacity .3s ease, transform .3s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 60);
    });
  }
  prev?.addEventListener('click', animate);
  next?.addEventListener('click', animate);
}

function initFooter() {
  const prev = document.getElementById('footerPrev');
  const next = document.getElementById('footerNext');
  const dots = document.querySelectorAll('.footer__pagination .slider-dot');
  let cur = 0;
  function go(i) { dots[cur].classList.remove('active'); cur = (i + dots.length) % dots.length; dots[cur].classList.add('active'); }
  prev?.addEventListener('click', () => go(cur - 1));
  next?.addEventListener('click', () => go(cur + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
}

function initNewsletter() {
  const btn   = document.querySelector('.newsletter__btn');
  const input = document.querySelector('.newsletter__input');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      input.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}], {duration:300});
      return;
    }
    input.value = '';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    btn.style.background = '#2d9b5a';
    setTimeout(() => {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      btn.style.background = '';
    }, 3000);
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
}

function initSearch() {
  const modal      = document.getElementById('searchModal');
  const backdrop   = document.getElementById('searchBackdrop');
  const closeBtn   = document.getElementById('searchClose');
  const openBtn    = document.getElementById('openSearch');
  const headerInput = document.getElementById('headerSearchInput');
  const modalInput = document.getElementById('searchModalInput');
  const clearBtn   = document.getElementById('searchClear');
  const results    = document.getElementById('searchResults');
  const tags       = document.querySelectorAll('.search-modal__tag');
  if (!modal) return;

  function open() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalInput.focus(), 100);
  }
  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalInput.value = '';
    results.innerHTML = '';
  }

  openBtn?.addEventListener('click', open);
  headerInput?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) return;
    const filtered = searchData.filter(item => item.label.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q));
    if (!filtered.length) {
      results.innerHTML = `<p style="padding:16px 20px;color:#aaa;font-size:13px">No results for "${query}"</p>`;
      return;
    }
    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;color:#ccc">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10.5 10.5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <div><div class="search-result-item__label">${item.label}</div><div class="search-result-item__cat">${item.cat}</div></div>`;
      div.addEventListener('click', () => close());
      results.appendChild(div);
    });
  }

  modalInput.addEventListener('input', function() {
    clearBtn.style.opacity = this.value ? '1' : '0';
    renderResults(this.value);
  });
  clearBtn.style.opacity = '0';
  clearBtn.addEventListener('click', () => { modalInput.value = ''; results.innerHTML = ''; clearBtn.style.opacity = '0'; modalInput.focus(); });

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      modalInput.value = tag.textContent;
      clearBtn.style.opacity = '1';
      renderResults(tag.textContent);
    });
  });
}

function initBurger() {
  const burger = document.getElementById('navBurger');
  const nav    = document.getElementById('mainNav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  const onScroll = throttle(() => {
    let cur = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 80) cur = s.id; });
    links.forEach(l => {
      l.classList.remove('nav__link--active');
      if (l.getAttribute('href') === `#${cur}`) l.classList.add('nav__link--active');
    });
  }, 100);
  window.addEventListener('scroll', onScroll);
}

function initReveal() {
  const els = document.querySelectorAll('.trending__item,.article-card,.sidebar__card,.recent__item,.ranking__table tbody tr');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; obs.unobserve(e.target); }
    });
  }, { threshold:.1, rootMargin:'0px 0px -30px 0px' });
  els.forEach((el, i) => {
    el.style.opacity = '0'; el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .4s ease ${i * .04}s, transform .4s ease ${i * .04}s`;
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initArticles();
  initFooter();
  initNewsletter();
  initSearch();
  initBurger();
  initScrollSpy();
  initReveal();
});
