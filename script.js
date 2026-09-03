// mark JS as active — CSS only hides .reveal elements when this class is present
document.documentElement.classList.add('js-enabled');

// measure the real header/footer height instead of guessing it in CSS — keeps the scroll
// track (and its start/end thumb) flush with zero gap against both, at any viewport size
const headerEl = document.querySelector('header');
const footerEl = document.querySelector('footer');
function updateChromeHeights(){
  if(headerEl) document.documentElement.style.setProperty('--header-h', headerEl.getBoundingClientRect().height + 'px');
  if(footerEl) document.documentElement.style.setProperty('--footer-h', footerEl.getBoundingClientRect().height + 'px');
}
updateChromeHeights();
window.addEventListener('resize', updateChromeHeights);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(updateChromeHeights);

// on touch devices a hover-only reveal needs a hold — one tap should be enough, so mirror
// the :hover state as a class toggled by tap (CSS only applies it under @media(hover:none))
const landingEl = document.querySelector('.landing');
if(landingEl){
  function setLandingTap(side){
    landingEl.classList.remove('tap-a', 'tap-b');
    if(side) landingEl.classList.add('tap-' + side);
  }
  landingEl.querySelectorAll('.half-a, .cap-a').forEach(el => el.addEventListener('click', () => {
    setLandingTap(landingEl.classList.contains('tap-a') ? null : 'a');
  }));
  landingEl.querySelectorAll('.half-b, .cap-b').forEach(el => el.addEventListener('click', () => {
    setLandingTap(landingEl.classList.contains('tap-b') ? null : 'b');
  }));
}

// scroll progress indicator — injected so it appears on every page automatically
const scrollTrack = document.createElement('div');
scrollTrack.className = 'scroll-indicator';
scrollTrack.innerHTML = '<div class="scroll-indicator-fill" id="scrollFill"><span class="scroll-thumb"></span></div>';
document.body.appendChild(scrollTrack);
const scrollFill = document.getElementById('scrollFill');
function updateScrollIndicator(){
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
  scrollFill.style.height = pct + '%';
}
updateScrollIndicator();
window.addEventListener('scroll', updateScrollIndicator, {passive:true});
window.addEventListener('resize', updateScrollIndicator);

// homepage only: "práce" only lights up in the nav once you've actually scrolled to that
// section — not while still looking at the hero
const praceMarker = document.getElementById('prace');
const navPrace = document.getElementById('navPrace');
if(praceMarker && navPrace){
  function updatePraceActive(){
    const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
    navPrace.classList.toggle('active', praceMarker.getBoundingClientRect().top <= headerH + 1);
  }
  updatePraceActive();
  window.addEventListener('scroll', updatePraceActive, {passive:true});
  window.addEventListener('resize', updatePraceActive);
}

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// skill bars — fill to their data-pct width once scrolled into view
const skillFills = document.querySelectorAll('.skill-fill');
if(skillFills.length){
  const skillIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.width = e.target.dataset.pct + '%';
        skillIo.unobserve(e.target);
      }
    });
  }, {threshold:0.3});
  skillFills.forEach(el => skillIo.observe(el));
}

// filtering + search (works for both list rows and grid cards — any element with data-cat)
const buttons = document.querySelectorAll('#filters button');
const rows = document.querySelectorAll('[data-cat]');
const rowcount = document.getElementById('rowcount');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
let activeFilter = 'all';

function applyFilters(){
  const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let visible = 0;
  rows.forEach(row => {
    const catMatch = activeFilter === 'all' || row.dataset.cat === activeFilter;
    const textMatch = !q || row.dataset.search.includes(q);
    const match = catMatch && textMatch;
    row.classList.toggle('hidden', !match);
    if(match) visible++;
  });
  rowcount.textContent = visible + (visible === 1 ? ' záznam' : (visible < 5 ? ' záznamy' : ' záznamov'));
  emptyState.classList.toggle('show', visible === 0);
}

if(buttons.length){
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });
  if(searchInput) searchInput.addEventListener('input', applyFilters);
}

// expand/collapse project detail on click
rows.forEach(row => {
  row.addEventListener('click', () => {
    const detail = row.nextElementSibling;
    if(!detail || !detail.classList.contains('index-detail')) return;
    const isOpen = detail.classList.contains('open');
    document.querySelectorAll('.index-detail.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.index-row.open').forEach(r => r.classList.remove('open'));
    if(!isOpen){ detail.classList.add('open'); row.classList.add('open'); }
  });
});

// LIGHTBOX — every image link in a gallery/drawings/sketch/photo-grid section becomes one
// browsable sequence per page, so a visitor can arrow through all of them without ever
// returning to the page to click the next thumbnail
const lbLinks = Array.from(document.querySelectorAll('.gallery a, .drawing-item a, .sketch-block a, .photo-grid a'));
if(lbLinks.length){
  const lbOverlay = document.createElement('div');
  lbOverlay.className = 'lightbox';
  lbOverlay.innerHTML =
    '<button class="lb-close" aria-label="Zavrieť">✕</button>' +
    '<button class="lb-prev" aria-label="Predchádzajúci obrázok">←</button>' +
    '<img class="lb-img" src="" alt="">' +
    '<button class="lb-next" aria-label="Nasledujúci obrázok">→</button>' +
    '<div class="lb-caption"></div>';
  document.body.appendChild(lbOverlay);

  const lbImg = lbOverlay.querySelector('.lb-img');
  const lbCaption = lbOverlay.querySelector('.lb-caption');
  let lbIndex = 0;

  function lbShow(i){
    lbIndex = (i + lbLinks.length) % lbLinks.length;
    const link = lbLinks[lbIndex];
    const alt = link.querySelector('img')?.alt || '';
    lbImg.src = link.getAttribute('href');
    lbImg.alt = alt;
    lbCaption.textContent = alt;
  }
  function lbOpen(i){
    lbShow(i);
    lbOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function lbClose(){
    lbOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  lbLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      lbOpen(i);
    });
  });

  lbOverlay.querySelector('.lb-close').addEventListener('click', lbClose);
  lbOverlay.querySelector('.lb-prev').addEventListener('click', () => lbShow(lbIndex - 1));
  lbOverlay.querySelector('.lb-next').addEventListener('click', () => lbShow(lbIndex + 1));
  lbOverlay.addEventListener('click', (e) => { if(e.target === lbOverlay) lbClose(); });

  document.addEventListener('keydown', (e) => {
    if(!lbOverlay.classList.contains('open')) return;
    if(e.key === 'Escape') lbClose();
    if(e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if(e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });

  // swipe left/right to move through images on touch devices — no need to hit the arrows
  let lbTouchX = null, lbTouchY = null;
  lbOverlay.addEventListener('touchstart', (e) => {
    lbTouchX = e.touches[0].clientX;
    lbTouchY = e.touches[0].clientY;
  }, {passive:true});
  lbOverlay.addEventListener('touchend', (e) => {
    if(lbTouchX === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchX;
    const dy = e.changedTouches[0].clientY - lbTouchY;
    lbTouchX = null;
    if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  }, {passive:true});
}

// cursor preview (desktop only)
const preview = document.getElementById('cursorPreview');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if(canHover && preview){
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      preview.textContent = 'Klik pre viac →';
      preview.classList.add('show');
    });
    row.addEventListener('mousemove', (e) => {
      preview.style.transform = `translate(${e.clientX + 18}px, ${e.clientY - 50}px)`;
    });
    row.addEventListener('mouseleave', () => preview.classList.remove('show'));
  });
}
