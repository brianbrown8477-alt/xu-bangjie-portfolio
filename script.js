const root = document.documentElement;
const themeToggle = document.querySelector('#themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) root.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentDark = root.dataset.theme ? root.dataset.theme === 'dark' : systemDark;
  root.dataset.theme = currentDark ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', root.dataset.theme);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .08, rootMargin: '0px 0px -45px' });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-item')];
let navTicking = false;
function syncActiveNav() {
  const marker = window.scrollY + Math.min(window.innerHeight * .36, 280);
  let current = sections[0];
  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = section;
  });
  navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${current.id}`));
  navTicking = false;
}
window.addEventListener('scroll', () => {
  if (!navTicking) { navTicking = true; requestAnimationFrame(syncActiveNav); }
}, { passive: true });
window.addEventListener('resize', syncActiveNav);
syncActiveNav();

const sidebar = document.querySelector('#sidebar');
const mobileMenu = document.querySelector('#mobileMenu');
const sidebarScrim = document.querySelector('#sidebarScrim');
function closeMenu() {
  sidebar.classList.remove('open');
  sidebarScrim.classList.remove('show');
  mobileMenu.setAttribute('aria-expanded', 'false');
}
mobileMenu.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  sidebarScrim.classList.toggle('show', open);
  mobileMenu.setAttribute('aria-expanded', String(open));
});
sidebarScrim.addEventListener('click', closeMenu);
navItems.forEach((item) => item.addEventListener('click', closeMenu));

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-selected', String(active));
    });
    const category = button.dataset.filter;
    document.querySelectorAll('.work-card').forEach((card) => {
      const visible = category === 'all' || card.dataset.category === category;
      card.classList.toggle('hidden', !visible);
    });
  });
});

const motionQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
if (motionQuery.matches) {
  document.querySelectorAll('.work-card video').forEach((video) => {
    const card = video.closest('.work-card');
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}

const viewer = document.querySelector('#viewer');
const viewerStage = document.querySelector('#viewerStage');
const viewerTitle = document.querySelector('#viewerTitle');
const viewerMeta = document.querySelector('#viewerMeta');
function openViewer(card) {
  const { type, src, title, meta } = card.dataset;
  viewerTitle.textContent = title;
  viewerMeta.textContent = meta;
  viewerStage.replaceChildren();
  let media;
  if (type === 'video') {
    media = document.createElement('video');
    media.src = src;
    media.controls = true;
    media.autoplay = true;
    media.playsInline = true;
  } else {
    media = document.createElement('img');
    media.src = src;
    media.alt = title;
  }
  viewerStage.append(media);
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('viewer-open');
  document.querySelector('[data-close-viewer]').focus();
}
function closeViewer() {
  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-open');
  const video = viewerStage.querySelector('video');
  if (video) video.pause();
  setTimeout(() => viewerStage.replaceChildren(), 260);
}
document.querySelectorAll('.work-card').forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openViewer(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openViewer(card); }
  });
});
document.querySelectorAll('[data-close-viewer]').forEach((element) => element.addEventListener('click', closeViewer));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && viewer.classList.contains('open')) closeViewer(); });

const heroVideo = document.querySelector('.hero-media video');
const heroSound = document.querySelector('#heroSound');
heroSound.addEventListener('click', () => {
  heroVideo.muted = !heroVideo.muted;
  heroSound.classList.toggle('on', !heroVideo.muted);
  heroSound.setAttribute('aria-label', heroVideo.muted ? '开启声音' : '关闭声音');
});

const toast = document.querySelector('#toast');
let toastTimer;
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      toast.textContent = '已复制微信号';
    } catch {
      toast.textContent = `微信号：${button.dataset.copy}`;
    }
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  });
});
