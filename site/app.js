const state = { manifest: null, viewerGroup: null, viewerIndex: 0 };
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

function iconFor(video) { return video.muted ? '⌁' : '◉'; }

function silenceOthers(except) {
  $$('video').forEach(video => {
    if (video !== except) video.muted = true;
  });
  $$('.sound-control, .sound-toggle').forEach(button => {
    const video = document.getElementById(button.dataset.soundTarget || '');
    if (video && video !== except) {
      $('.sound-label', button).textContent = '开启声音';
      const icon = $('.sound-icon', button);
      if (icon) icon.textContent = '⌁';
      button.setAttribute('aria-label', '开启声音');
    }
  });
}

function bindSoundButton(button) {
  button.addEventListener('click', async event => {
    event.stopPropagation();
    const video = document.getElementById(button.dataset.soundTarget);
    if (!video) return;
    const enable = video.muted;
    if (enable) silenceOthers(video);
    video.muted = !enable;
    if (video.paused) {
      try { await video.play(); } catch (_) {}
    }
    const label = $('.sound-label', button);
    if (label) label.textContent = enable ? '关闭声音' : '开启声音';
    const icon = $('.sound-icon', button);
    if (icon) icon.textContent = iconFor(video);
    button.setAttribute('aria-label', enable ? '关闭声音' : '开启声音');
  });
}

function createHero(item) {
  if (!item) return;
  const video = document.createElement('video');
  video.id = 'hero-video';
  video.src = item.src;
  video.poster = item.poster;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('aria-label', '2026 作品集封面视频');
  $('#hero-media').prepend(video);
  bindSoundButton($('.sound-toggle'));
}

function createVideoCard(item, index) {
  const article = document.createElement('article');
  article.className = 'video-card';
  const id = `work-video-${index}`;
  article.innerHTML = `
    <div class="video-frame">
      <video id="${id}" preload="none" muted loop playsinline poster="${item.poster}" data-src="${item.src}" aria-label="${item.title}"></video>
      <div class="video-controls">
        <button class="round-control play-control" type="button" aria-label="播放 ${item.title}">▶</button>
        ${item.audio ? `<button class="round-control sound-control" type="button" data-sound-target="${id}" aria-label="开启声音"><span class="sound-icon">⌁</span><span class="sound-label">开启声音</span></button>` : '<span></span>'}
      </div>
    </div>
    <div class="video-meta"><div><h3>${item.title}</h3><p>${item.type}</p></div><time>${formatDuration(item.duration)}</time></div>`;
  const video = $('video', article);
  video.addEventListener('loadedmetadata', () => article.classList.toggle('landscape', video.videoWidth > video.videoHeight));
  const frame = $('.video-frame', article);
  const play = $('.play-control', article);
  const ensureVideoLoaded = () => {
    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
  };
  const togglePlayback = async () => {
    ensureVideoLoaded();
    if (video.paused) { try { await video.play(); play.textContent = 'Ⅱ'; frame.classList.add('is-playing'); } catch (_) {} }
    else { video.pause(); play.textContent = '▶'; frame.classList.remove('is-playing'); }
  };
  play.addEventListener('click', togglePlayback);
  frame.addEventListener('dblclick', togglePlayback);
  const sound = $('.sound-control', article);
  if (sound) bindSoundButton(sound);
  return article;
}

function renderVideos(items, target, offset) {
  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => fragment.append(createVideoCard(item, offset + index)));
  target.replaceChildren(fragment);
}

function createShopCard(group, groupIndex) {
  const article = document.createElement('article');
  article.className = 'shop-card';
  article.tabIndex = 0;
  const mid = (group.images.length - 1) / 2;
  article.innerHTML = `<div class="shop-meta"><div><h3>${group.title}</h3><p>${group.type}</p></div><span class="shop-count">${group.images.length.toString().padStart(2, '0')} 张</span></div><div class="image-stack" role="group" aria-label="${group.title} 图片组"></div>`;
  const stack = $('.image-stack', article);
  group.images.forEach((image, imageIndex) => {
    const img = document.createElement('img');
    img.className = 'stack-image';
    img.src = image.src;
    img.alt = `${group.title} · ${image.title}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.style.setProperty('--i', imageIndex);
    img.style.setProperty('--mid', mid);
    img.style.setProperty('--offset', imageIndex - mid);
    img.style.zIndex = imageIndex + 1;
    img.addEventListener('click', event => { event.stopPropagation(); openViewer(group, imageIndex); });
    stack.append(img);
  });
  article.addEventListener('click', () => article.classList.toggle('is-expanded'));
  article.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); article.classList.toggle('is-expanded'); }
  });
  return article;
}

function renderShop(groups) {
  const fragment = document.createDocumentFragment();
  groups.forEach((group, index) => fragment.append(createShopCard(group, index)));
  $('#shop-grid').replaceChildren(fragment);
}

function updateViewer() {
  const item = state.viewerGroup.images[state.viewerIndex];
  const viewer = $('#image-viewer');
  $('img', viewer).src = item.src;
  $('img', viewer).alt = `${state.viewerGroup.title} · ${item.title}`;
  $('figcaption', viewer).textContent = `${state.viewerGroup.title} · ${item.title}`;
  $('.viewer-count', viewer).textContent = `${state.viewerIndex + 1} / ${state.viewerGroup.images.length}`;
}

function openViewer(group, index) {
  state.viewerGroup = group; state.viewerIndex = index; updateViewer(); $('#image-viewer').showModal();
}

function shiftViewer(delta) {
  const count = state.viewerGroup?.images.length || 0;
  if (!count) return;
  state.viewerIndex = (state.viewerIndex + delta + count) % count; updateViewer();
}

function setupViewer() {
  const viewer = $('#image-viewer');
  $('.viewer-close', viewer).addEventListener('click', () => viewer.close());
  $('.viewer-prev', viewer).addEventListener('click', () => shiftViewer(-1));
  $('.viewer-next', viewer).addEventListener('click', () => shiftViewer(1));
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  document.addEventListener('keydown', event => {
    if (!viewer.open) return;
    if (event.key === 'ArrowLeft') shiftViewer(-1);
    if (event.key === 'ArrowRight') shiftViewer(1);
  });
}

function setupLazyVideos() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && !video.src) { video.src = video.dataset.src; video.load(); }
    if (!entry.isIntersecting && !video.paused) video.pause();
  }), { rootMargin: '280px 0px', threshold: .01 });
  $$('video[data-src]').forEach(video => observer.observe(video));
}

function setupTheme() {
  const toggle = $('#theme-toggle');
  document.documentElement.dataset.theme = 'dark';
  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
  });
}

function setupNav() {
  const links = $$('.topbar nav a');
  const menu = $('#mobile-menu');
  const topbar = $('.topbar');
  menu.addEventListener('click', () => {
    const open = topbar.classList.toggle('mobile-open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '收起导航' : '展开导航');
  });
  links.forEach(link => link.addEventListener('click', () => {
    topbar.classList.remove('mobile-open');
    menu.setAttribute('aria-expanded', 'false');
  }));
  const sections = links.map(link => $(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-35% 0px -60%', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

function setupCopy() {
  $('.copy-wechat').addEventListener('click', async event => {
    await navigator.clipboard.writeText(event.currentTarget.dataset.copy);
    const toast = $('.toast'); toast.textContent = '微信号已复制'; toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });
}

async function init() {
  setupTheme(); setupViewer(); setupNav(); setupCopy();
  try {
    state.manifest = window.__PORTFOLIO_ASSETS__ || null;
    try {
      const response = await fetch('assets.json', { cache: 'no-store' });
      if (response.ok) state.manifest = await response.json();
    } catch (_) {}
    if (!state.manifest) throw new Error('assets manifest unavailable');
    createHero(state.manifest.hero);
    renderVideos(state.manifest.aigc, $('#aigc-grid'), 0);
    renderVideos(state.manifest.three_d, $('#three-d-grid'), 100);
    renderShop(state.manifest.shop);
    renderBrand(state.manifest.brand_ip || [], $('#brand-grid'));
    setupLazyVideos();
  } catch (error) {
    console.error(error);
    $$('.video-grid, .shop-grid').forEach(grid => grid.innerHTML = '<div class="loading">作品载入失败，请刷新页面重试。</div>');
  }
}

/* Revised media presentation: the cover is an explicit right-hand video card,
   work videos autoplay on pointer hover, and shop images open into a tidy grid. */
function createHero(item) {
  if (!item) return;
  const video = document.createElement('video');
  video.id = 'hero-video';
  video.className = 'hero-cover-video';
  video.src = item.src;
  video.poster = item.poster;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('aria-label', '2026 作品集封面视频');
  const coverCard = document.createElement('div');
  coverCard.className = 'hero-cover-card glass';
  coverCard.append(video);
  $('#hero-media').append(coverCard);
  bindSoundButton($('.sound-toggle'));
}

function createVideoCard(item, index) {
  const article = document.createElement('article');
  article.className = 'video-card';
  const id = `work-video-${index}`;
  article.innerHTML = `
    <div class="video-frame">
      <video id="${id}" preload="none" muted loop playsinline poster="${item.poster}" data-src="${item.src}" aria-label="${item.title}"></video>
      <div class="video-controls">
        <button class="round-control play-control" type="button" aria-label="播放 ${item.title}">▶</button>
        ${item.audio ? `<button class="round-control sound-control" type="button" data-sound-target="${id}" aria-label="开启声音"><span class="sound-icon">⌁</span><span class="sound-label">开启声音</span></button>` : '<span></span>'}
        <button class="round-control fullscreen-control" type="button" aria-label="全屏播放 ${item.title}">⛶</button>
      </div>
    </div>
    <div class="video-meta"><div><h3>${item.title}</h3><p>${item.type}</p></div><time>${formatDuration(item.duration)}</time></div>`;
  const video = $('video', article);
  const frame = $('.video-frame', article);
  const play = $('.play-control', article);
  const ensureLoaded = () => {
    if (!video.src && video.dataset.src) { video.src = video.dataset.src; video.load(); }
  };
  const pauseOthers = () => $$('video').forEach(other => { if (other !== video) other.pause(); });
  const playVideo = async () => {
    ensureLoaded(); pauseOthers();
    try { await video.play(); play.textContent = 'Ⅱ'; frame.classList.add('is-playing'); } catch (_) {}
  };
  const pauseVideo = () => { video.pause(); play.textContent = '▶'; frame.classList.remove('is-playing'); };
  play.addEventListener('click', async event => { event.stopPropagation(); if (video.paused) await playVideo(); else pauseVideo(); });
  frame.addEventListener('mouseenter', playVideo);
  frame.addEventListener('mouseleave', pauseVideo);
  const fullscreen = $('.fullscreen-control', article);
  fullscreen.addEventListener('click', async event => {
    event.stopPropagation(); ensureLoaded();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (video.requestFullscreen) await video.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch (_) {}
  });
  const sound = $('.sound-control', article);
  if (sound) bindSoundButton(sound);
  return article;
}

function createShopCard(group, groupIndex) {
  const article = document.createElement('article');
  article.className = 'shop-card';
  article.tabIndex = 0;
  const columns = 5;
  const rows = Math.ceil(group.images.length / columns);
  const centerCol = (Math.min(group.images.length, columns) - 1) / 2;
  const centerRow = (rows - 1) / 2;
  article.innerHTML = `<div class="shop-meta"><div><h3>${group.title}</h3><p>${group.type}</p></div><span class="shop-count">${group.images.length.toString().padStart(2, '0')} 张</span></div><div class="image-stack" role="group" aria-label="${group.title} 图片组"></div>`;
  const stack = $('.image-stack', article);
  group.images.forEach((image, imageIndex) => {
    const img = document.createElement('img');
    img.className = 'stack-image';
    img.src = image.src;
    img.alt = `${group.title} · ${image.title}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.style.setProperty('--i', imageIndex);
    img.style.setProperty('--offset', imageIndex - (group.images.length - 1) / 2);
    img.style.setProperty('--col', imageIndex % columns);
    img.style.setProperty('--row', Math.floor(imageIndex / columns));
    img.style.setProperty('--center-col', centerCol);
    img.style.setProperty('--center-row', centerRow);
    img.style.zIndex = imageIndex + 1;
    img.addEventListener('click', event => { event.stopPropagation(); openViewer(group, imageIndex); });
    stack.append(img);
  });
  article.addEventListener('click', () => article.classList.toggle('is-expanded'));
  article.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); article.classList.toggle('is-expanded'); }
  });
  return article;
}

/* Orientation-aware collection and the automatic e-commerce carousel. */
function createVideoCard(item, index) {
  const article = document.createElement('article');
  article.className = `video-card ${item.orientation || 'landscape'}`;
  const id = `work-video-${index}`;
  article.innerHTML = `
    <div class="video-frame">
      <video id="${id}" preload="none" muted loop playsinline poster="${item.poster}" data-src="${item.src}" aria-label="${item.title}"></video>
      <div class="video-controls">
        <button class="round-control play-control" type="button" aria-label="播放 ${item.title}">▶</button>
        ${item.audio ? `<button class="round-control sound-control" type="button" data-sound-target="${id}" aria-label="开启声音"><span class="sound-icon">⌁</span><span class="sound-label">开启声音</span></button>` : '<span></span>'}
        <button class="round-control fullscreen-control" type="button" aria-label="全屏播放 ${item.title}">⛶</button>
      </div>
    </div>
    <div class="video-meta"><div><h3>${item.title}</h3><p>${item.type}</p></div><time>${formatDuration(item.duration)}</time></div>`;
  const video = $('video', article);
  const frame = $('.video-frame', article);
  const play = $('.play-control', article);
  const ensureLoaded = () => {
    if (!video.src && video.dataset.src) { video.src = video.dataset.src; video.load(); }
  };
  const pauseOthers = () => $$('video').forEach(other => { if (other !== video) other.pause(); });
  const playVideo = async () => { ensureLoaded(); pauseOthers(); try { await video.play(); play.textContent = 'Ⅱ'; frame.classList.add('is-playing'); } catch (_) {} };
  const pauseVideo = () => { video.pause(); play.textContent = '▶'; frame.classList.remove('is-playing'); };
  play.addEventListener('click', async event => { event.stopPropagation(); if (video.paused) await playVideo(); else pauseVideo(); });
  frame.addEventListener('mouseenter', playVideo);
  frame.addEventListener('mouseleave', pauseVideo);
  $('.fullscreen-control', article).addEventListener('click', async event => {
    event.stopPropagation(); ensureLoaded();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (video.requestFullscreen) await video.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch (_) {}
  });
  const sound = $('.sound-control', article);
  if (sound) bindSoundButton(sound);
  return article;
}

function renderVideos(items, target, offset) {
  const fragment = document.createDocumentFragment();
  [['portrait', '竖屏作品', 'PORTRAIT / 9:16'], ['landscape', '横屏作品', 'LANDSCAPE / 16:9']].forEach(([orientation, label, meta]) => {
    const groupItems = items.filter(item => (item.orientation || 'landscape') === orientation);
    if (!groupItems.length) return;
    const group = document.createElement('section');
    group.className = 'video-subsection';
    group.innerHTML = `<div class="video-subheading"><strong>${label}</strong><span>${meta} · ${groupItems.length.toString().padStart(2, '0')} WORKS</span></div><div class="video-grid"></div>`;
    const grid = $('.video-grid', group);
    groupItems.forEach((item, index) => grid.append(createVideoCard(item, offset + index + (orientation === 'landscape' ? 50 : 0))));
    fragment.append(group);
  });
  target.replaceChildren(fragment);
}

function createShopCard(group, groupIndex) {
  const article = document.createElement('article');
  article.className = 'shop-card';
  article.tabIndex = 0;
  article.innerHTML = `<div class="shop-meta"><div><h3>${group.title}</h3><p>${group.type}</p></div><span class="shop-count">${group.images.length.toString().padStart(2, '0')} 张</span></div><div class="shop-carousel" role="region" aria-label="${group.title} 自动轮播"></div>`;
  const carousel = $('.shop-carousel', article);
  const slides = group.images.map((image, imageIndex) => {
    const img = document.createElement('img');
    img.className = `carousel-slide${imageIndex === 0 ? ' is-active' : ''}`;
    img.src = image.src; img.alt = `${group.title} · ${image.title}`; img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('click', event => { event.stopPropagation(); openViewer(group, imageIndex); });
    carousel.append(img); return img;
  });
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.innerHTML = `<button class="carousel-arrow carousel-prev" type="button" aria-label="上一张">‹</button><div class="carousel-dots"></div><button class="carousel-arrow carousel-next" type="button" aria-label="下一张">›</button>`;
  carousel.append(controls);
  const dots = $('.carousel-dots', controls);
  let active = 0; let timer;
  const setActive = next => {
    active = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === active));
    $$('.carousel-dot', dots).forEach((dot, index) => dot.classList.toggle('is-active', index === active));
  };
  slides.forEach((_, index) => { const dot = document.createElement('button'); dot.className = `carousel-dot${index === 0 ? ' is-active' : ''}`; dot.type = 'button'; dot.setAttribute('aria-label', `查看第 ${index + 1} 张`); dot.addEventListener('click', event => { event.stopPropagation(); setActive(index); }); dots.append(dot); });
  $('.carousel-prev', controls).addEventListener('click', event => { event.stopPropagation(); setActive(active - 1); });
  $('.carousel-next', controls).addEventListener('click', event => { event.stopPropagation(); setActive(active + 1); });
  const start = () => { clearInterval(timer); timer = setInterval(() => setActive(active + 1), 3600); };
  const stop = () => clearInterval(timer);
  article.addEventListener('mouseenter', stop); article.addEventListener('mouseleave', start); article.addEventListener('focusin', stop); article.addEventListener('focusout', start); start();
  return article;
}

function renderBrand(images, target) {
  if (!images.length) { target.innerHTML = '<div class="loading">品牌作品载入中</div>'; return; }
  target.innerHTML = `<div class="brand-main"><img alt=""><div class="brand-caption"><span>SKYWORTH / CHARACTER SYSTEM</span><strong></strong></div></div><div class="brand-thumbs" role="list"></div>`;
  const main = $('.brand-main img', target);
  const title = $('.brand-caption strong', target);
  const thumbs = $('.brand-thumbs', target);
  let active = images.length - 1;
  const select = index => {
    active = index;
    main.src = images[index].src;
    main.alt = `创维 IP · ${images[index].title}`;
    title.textContent = images[index].title;
    $$('.brand-thumb', thumbs).forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === index));
  };
  images.forEach((image, index) => {
    const button = document.createElement('button');
    button.className = `brand-thumb${index === images.length - 1 ? ' is-active' : ''}`;
    button.type = 'button'; button.setAttribute('role', 'listitem'); button.setAttribute('aria-label', `查看 ${image.title}`);
    button.innerHTML = `<img src="${image.src}" alt="${image.title}" loading="lazy"><span>${String(index + 1).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => select(index));
    thumbs.append(button);
  });
  main.addEventListener('click', () => openViewer({ title: '创维 IP 视觉', images }, active));
  select(active);
}

function renderBrand(images, target) {
  if (!images.length) { target.innerHTML = '<div class="loading">品牌作品载入中</div>'; return; }
  const ordered = images.map((image, index) => ({ ...image, index })).sort((a, b) => Number(b.title.includes('桌面')) - Number(a.title.includes('桌面')));
  target.innerHTML = '<div class="brand-collage" role="list"></div>';
  const collage = $('.brand-collage', target);
  ordered.forEach((image, visualIndex) => {
    const tile = document.createElement('button');
    tile.type = 'button'; tile.className = `brand-tile brand-tile-${visualIndex}${visualIndex === 0 ? ' is-render' : ''}`;
    tile.setAttribute('role', 'listitem'); tile.setAttribute('aria-label', `查看创维 IP ${image.title}`);
    tile.innerHTML = `<img src="${image.src}" alt="创维 IP · ${image.title}" loading="lazy"><span>${visualIndex === 0 ? 'SKYWORTH IP / 3D CHARACTER' : `CHARACTER STUDY 0${visualIndex}`}</span>`;
    tile.addEventListener('click', () => openViewer({ title: '创维 IP 视觉', images }, image.index));
    collage.append(tile);
  });
}

init();
