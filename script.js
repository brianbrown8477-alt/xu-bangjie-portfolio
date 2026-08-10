const root = document.documentElement;
const media = window.portfolioMedia || { aigc: [], threeD: [], motion: [], ecommerce: [] };
const storedTheme = localStorage.getItem("portfolio-theme");
if (storedTheme) root.dataset.theme = storedTheme;

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
const encodeSrc = (value) => encodeURI(value);

function renderVideoCards(list, targetId, label) {
  const target = document.getElementById(targetId);
  target.innerHTML += list.map((item, index) => `<article class="video-card reveal ${item.cover ? "is-cover" : ""}" tabindex="0" data-type="video" data-src="${esc(item.src)}" data-title="${esc(item.title)}" data-meta="${label} · ${String(index + 1).padStart(2, "0")}"><div class="video-frame"><video data-autoplay muted loop playsinline webkit-playsinline preload="metadata"><source src="${encodeSrc(item.src)}" type="video/mp4"></video><span class="card-index">${String(index + 1).padStart(2, "0")}</span><span class="card-play">播放 ↗</span><button class="inline-play" type="button" aria-label="播放视频">▶</button></div><div class="card-copy"><span>${item.cover ? "封面视频" : label}</span><h3>${esc(item.title)}</h3></div></article>`).join("");
}

renderVideoCards(media.aigc, "aigcGrid", "AIGC Motion");
renderVideoCards(media.threeD, "threeDGrid", "3D Animation");
renderVideoCards(media.motion, "threeDGrid", "Motion Design");

const threeDGrid = document.getElementById("threeDGrid");
const motionStart = media.threeD.length;
media.motion.forEach((_, index) => {
  const card = threeDGrid.children[motionStart + index];
  if (card) card.classList.add("motion-item");
});

const ecommerceGrid = document.getElementById("ecommerceGrid");
ecommerceGrid.innerHTML = media.ecommerce.map((project, index) => {
  const cover = project.files[0];
  return `<article class="folder-card reveal" data-folder="${index}"><button class="folder-toggle" aria-expanded="false"><div class="folder-cover"><img src="${encodeSrc(cover.src)}" alt="${esc(project.title)}" loading="lazy"><span>${project.files.length} 张</span></div><div class="folder-copy"><small>PROJECT ${String(index + 1).padStart(2, "0")}</small><h3>${esc(project.title)}</h3><b>展开系列 ↗</b></div></button><div class="folder-drawer"><div class="image-grid">${project.files.map((file, imageIndex) => `<button class="image-item" data-type="image" data-src="${esc(file.src)}" data-title="${esc(project.title)}" data-meta="${String(imageIndex + 1).padStart(2, "0")} / ${project.files.length}"><img src="${encodeSrc(file.src)}" alt="${esc(file.title)}" loading="lazy"><span>${String(imageIndex + 1).padStart(2, "0")}</span></button>`).join("")}</div></div></article>`;
}).join("");

function openViewer(data) {
  const viewer = document.getElementById("viewer");
  const mediaBox = document.getElementById("viewerMedia");
  document.getElementById("viewerTitle").textContent = data.title || "作品预览";
  document.getElementById("viewerMeta").textContent = data.meta || "Portfolio Preview";
  mediaBox.replaceChildren();
  const element = document.createElement(data.type === "image" ? "img" : "video");
  element.src = encodeSrc(data.src); element.alt = data.title || "";
  if (data.type === "video") { element.controls = true; element.autoplay = true; element.muted = true; element.loop = true; element.playsInline = true; element.preload = "metadata"; }
  mediaBox.append(element); viewer.classList.add("open"); viewer.setAttribute("aria-hidden", "false"); document.body.classList.add("viewer-open");
}
function closeViewer() { const viewer = document.getElementById("viewer"); viewer.querySelector("video")?.pause(); viewer.classList.remove("open"); viewer.setAttribute("aria-hidden", "true"); document.body.classList.remove("viewer-open"); }

document.addEventListener("click", (event) => {
  const close = event.target.closest("[data-close]"); if (close) closeViewer();
  const folderButton = event.target.closest(".folder-toggle");
  if (folderButton) { const card = folderButton.closest(".folder-card"); const opening = !card.classList.contains("open"); document.querySelectorAll(".folder-card.open").forEach((other) => { other.classList.remove("open"); other.querySelector(".folder-toggle").setAttribute("aria-expanded", "false"); }); if (opening) { card.classList.add("open"); folderButton.setAttribute("aria-expanded", "true"); } }
  const work = event.target.closest("[data-type]"); if (work && !work.classList.contains("folder-toggle")) openViewer(work.dataset);
});
document.addEventListener("keydown", (event) => { if ((event.key === "Enter" || event.key === " ") && document.activeElement?.matches(".video-card")) openViewer(document.activeElement.dataset); if (event.key === "Escape") closeViewer(); });

const videoObserver = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => { if (isIntersecting) { target.muted = true; target.defaultMuted = true; target.setAttribute("muted", ""); target.load(); target.play().then(() => target.closest(".video-frame")?.classList.remove("needs-play")).catch(() => target.closest(".video-frame")?.classList.add("needs-play")); } else target.pause(); }), { threshold: 0.12, rootMargin: "180px 0px" });
document.querySelectorAll("video[data-autoplay]").forEach((video) => { video.autoplay = true; video.muted = true; video.defaultMuted = true; video.playsInline = true; video.setAttribute("autoplay", ""); video.setAttribute("muted", ""); video.setAttribute("playsinline", ""); video.setAttribute("webkit-playsinline", ""); videoObserver.observe(video); });
document.addEventListener("click", (event) => { const playButton = event.target.closest(".inline-play"); if (!playButton) return; event.stopPropagation(); const video = playButton.closest(".video-frame")?.querySelector("video"); if (!video) return; video.muted = true; video.play().then(() => video.closest(".video-frame")?.classList.remove("needs-play")).catch(() => {}); });
addEventListener("touchstart", () => document.querySelectorAll("video[data-autoplay]").forEach((video) => { if (video.paused) video.play().catch(() => {}); }), { once: true, passive: true });

const heroVideo = document.querySelector(".cover-video");
document.getElementById("soundButton").addEventListener("click", () => { heroVideo.muted = !heroVideo.muted; heroVideo.play().catch(() => {}); });
const sidebar = document.getElementById("sidebar"); const scrim = document.getElementById("scrim"); const mobileMenu = document.getElementById("mobileMenu");
function closeNav() { sidebar.classList.remove("open"); scrim.classList.remove("show"); mobileMenu.setAttribute("aria-expanded", "false"); }
mobileMenu.addEventListener("click", () => { const open = sidebar.classList.toggle("open"); scrim.classList.toggle("show", open); mobileMenu.setAttribute("aria-expanded", String(open)); }); scrim.addEventListener("click", closeNav); document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeNav));
document.getElementById("themeToggle").addEventListener("click", () => { const dark = root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches); root.dataset.theme = dark ? "light" : "dark"; localStorage.setItem("portfolio-theme", root.dataset.theme); });
const sections = [...document.querySelectorAll("main section[id]")]; const links = [...document.querySelectorAll(".nav-link")];
addEventListener("scroll", () => { const marker = scrollY + innerHeight * .3; let active = sections[0]; sections.forEach((section) => { if (section.offsetTop <= marker) active = section; }); links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${active.id}`)); }, { passive: true });
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); } }), { threshold: .08 }); document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
document.querySelectorAll(".copy-wechat").forEach((button) => button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(button.dataset.copy); } catch {} const toast = document.getElementById("toast"); toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1600); }));
