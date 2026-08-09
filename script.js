const root = document.documentElement;
const storedTheme = localStorage.getItem("portfolio-theme");
if (storedTheme) root.dataset.theme = storedTheme;

const ecommerceProjects = [
  {title:"充电宝视觉系列",category:"数码家电",path:"电商/充电宝",files:["Desktop1_DeMain_0000.png","Desktop10_DeMain_0000.png","Desktop13_DeMain_0000.png","Desktop2_DeMain_0000.png","Desktop3_DeMain_0000.png","Desktop4_DeMain_0000.png","Desktop98_DeMain_005.png"]},
  {title:"花洒产品系列",category:"卫浴家居",path:"电商/花洒",files:["花洒1_DeMain_0000.jpg","花洒10_DeMain_0000.jpg","花洒11_DeMain_0000.jpg","花洒12_DeMain_0000.jpg","花洒13_DeMain_0000.jpg","花洒14_DeMain_0000.jpg","花洒17_DeMain_0000.jpg","花洒18_DeMain_0000.jpg","花洒2_DeMain_0000.jpg","花洒3_DeMain_0000.jpg","花洒4_DeMain_0000.jpg","花洒6_DeMain_0000.jpg","花洒7_DeMain_0000.jpg","花洒9_DeMain_0000.jpg"]},
  {title:"护肤品视觉系列",category:"美妆个护",path:"电商/化妆品",files:["000.jpg","1111.jpg","16911688-302d-4315-9cd3-2e1fe7ba7272.png","3beb144d-25e3-48f7-819b-6b7b384f6aa9.png","43f56ed6-c8ab-4a9d-9045-b0e9aad7190c.png","59429897-0075-4dfa-8cf7-ce3fbb7e0d83.png","5f61a02b-db58-43cf-b9c7-eb409769667c.png","62e269dffdeadafc3969fd9abb164ded.jpg","6eba107a-fc71-488a-9697-61485d0de23b.png","7f8b85fd-4083-4bb7-9ef6-2eb8bde604fb.png","8df831f6-146d-4b33-bbb3-35a96dd88eae.png","a9191294-50a0-43ab-b1a9-16698b1753b9.png","c2e43c76-651c-4ba4-82fb-b57872c0dfae.png","e4f1e2a9-8a61-4ddc-ab04-1f45d08a8729.png","martini - Image-67-05.jpg","martini - Image-68-04.jpg","martini - Image-70-06 拷贝.jpg","martini - Image-72-12.jpg","精华乳1_DeMain_0000.png","渲染图11142_DeMain_0000.png"]},
  {title:"麻将桌产品系列",category:"家居电器",path:"电商/麻将桌",files:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]},
  {title:"灭蚊灯视觉系列",category:"家居电器",path:"电商/灭蚊灯",files:["13314_DeMain_0000.png","133141_DeMain_0000.png","134_DeMain_0000.png","1345_DeMain_0000.png","13459_DeMain_0000.png","d_DeMain_0000.png","d5_DeMain_0000.png"]},
  {title:"汽车与快艇系列",category:"交通出行",path:"电商/汽车",files:["63d8a485799e4361f812a4871445044c.jpg","侧车1.jpg","侧车2.jpg","快艇1_DeMain_0000.jpg"]},
  {title:"伞具视觉系列",category:"生活用品",path:"电商/伞",files:["bilon_DeMain_0000.png","bilon1_DeMain_0000.png","wanq_DeMain_0000.png","wanqfv_DeMain_0000.png","wanqfvx_DeMain_0000.png","wanquan_DeMain_0000.png","伞架_DeMain_0000 - 副本.png","展开_DeMain_0000.png"]},
  {title:"婴儿车产品系列",category:"母婴用品",path:"电商/婴儿车",files:["yec10_DeMain_0000.jpg","yec12_DeMain_0000.jpg","yec13_DeMain_0000.jpg","yec14_DeMain_0000.jpg","yec15_DeMain_0000.jpg","yec16_DeMain_0000.jpg","yec17_DeMain_0000.jpg","yec9_DeMain_0000.jpg"]},
  {title:"NFC 果汁系列",category:"食品饮料",path:"电商/食品类/NFC橙汁主图-无盒",files:["主图800-1.jpg","主图800-2.jpg","主图800-3.jpg","主图800-4.jpg","主图800-5.jpg","主图800-6.jpg","主图800-7.jpg","主图800-8.jpg","主图800-9.png"]},
  {title:"鸡胸肉电商系列",category:"食品饮料",path:"电商/食品类/鸡胸肉",files:["800-1.jpg","800-1-1.jpg","800-2.jpg","800-2-1.jpg","800-2-2.jpg","800-3.jpg","800-4.jpg","800-5.jpg","800-6.jpg","800-7.jpg","800-8.jpg"]},
  {title:"牛肉饼电商系列",category:"食品饮料",path:"电商/食品类/牛肉饼",files:["800-1.jpg","800-2.jpg","800-3.jpg","800-4.jpg","800-5.jpg","800-6.jpg","800-7.jpg"]},
  {title:"牛肉干电商系列",category:"食品饮料",path:"电商/食品类/牛肉干",files:["800-1.jpg","800-1-1.jpg","800-2.jpg","800-2-1.jpg","800-2-2.jpg","800-3.jpg","800-4.jpg","800-5.jpg","800-6.jpg","800-7.jpg"]}
];

const folderGrid = document.querySelector("#folderGrid");
const imagePath = (project,file) => project.path + "/" + file;
folderGrid.innerHTML = ecommerceProjects.map((project,index) => {
  const covers = project.files.slice(0,3).reverse().map(file => '<span class="folder-sheet"><img src="' + imagePath(project,file) + '" alt="' + project.title + '" loading="lazy"></span>').join("");
  return '<article class="folder-project reveal" data-project="' + index + '"><button class="folder-button" aria-expanded="false"><div class="folder-stack">' + covers + '</div><div class="folder-label"><div><small>' + project.category + '</small><h3>' + project.title + '</h3></div><span class="folder-count"><svg viewBox="0 0 24 24"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2.5h5.5A2.5 2.5 0 0 1 20 10v8.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5z"/></svg>' + project.files.length + '</span></div></button><div class="folder-drawer"><div></div></div></article>';
}).join("");

function openViewer(work) {
  const viewer = document.querySelector("#viewer");
  const viewerMedia = document.querySelector("#viewerMedia");
  document.querySelector("#viewerTitle").textContent = work.title || "";
  document.querySelector("#viewerMeta").textContent = work.meta || "作品预览";
  viewerMedia.replaceChildren();
  const media = document.createElement(work.type === "image" ? "img" : "video");
  media.src = work.src;
  media.alt = work.title || "";
  if (work.type === "video") {
    media.controls = true;
    media.playsInline = true;
    media.muted = true;
    media.autoplay = true;
    media.preload = "metadata";
    const hint = document.createElement("span");
    hint.className = "viewer-tap";
    hint.textContent = "如未播放，请点按播放键";
    viewerMedia.append(hint);
    media.addEventListener("canplay",() => media.play().catch(() => hint.classList.add("show")),{once:true});
  }
  viewerMedia.prepend(media);
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden","false");
  document.body.classList.add("viewer-open");
}
function closeViewer() {
  const viewer = document.querySelector("#viewer");
  viewer.querySelector("video")?.pause();
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden","true");
  document.body.classList.remove("viewer-open");
  setTimeout(() => document.querySelector("#viewerMedia").replaceChildren(),260);
}

ecommerceProjects.forEach((project,index) => {
  const projectElement = folderGrid.querySelector('[data-project="' + index + '"]');
  projectElement.querySelector(".folder-button").addEventListener("click",() => {
    const willOpen = !projectElement.classList.contains("open");
    folderGrid.querySelectorAll(".folder-project.open").forEach(other => {
      other.classList.remove("open");
      other.querySelector(".folder-button").setAttribute("aria-expanded","false");
    });
    if (!willOpen) return;
    const drawer = projectElement.querySelector(".folder-drawer > div");
    if (!drawer.dataset.loaded) {
      drawer.className = "drawer-inner";
      drawer.innerHTML = project.files.map((file,fileIndex) => '<button class="drawer-image" data-image="' + imagePath(project,file) + '" data-title="' + project.title + '" data-meta="' + project.category + ' · 系列详情 ' + (fileIndex + 1) + '/' + project.files.length + '" aria-label="查看 ' + project.title + ' 第 ' + (fileIndex + 1) + ' 张"><img src="' + imagePath(project,file) + '" alt="' + project.title + ' 系列详情 ' + (fileIndex + 1) + '" loading="lazy"><span>' + String(fileIndex + 1).padStart(2,"0") + '</span></button>').join("");
      drawer.dataset.loaded = "true";
      drawer.querySelectorAll(".drawer-image").forEach(button => button.addEventListener("click",() => openViewer({type:"image",src:button.dataset.image,title:button.dataset.title,meta:button.dataset.meta})));
    }
    projectElement.classList.add("open");
    projectElement.querySelector(".folder-button").setAttribute("aria-expanded","true");
    setTimeout(() => projectElement.scrollIntoView({behavior:"smooth",block:"nearest"}),100);
  });
});

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
}),{threshold:.08,rootMargin:"0px 0px -42px"});
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const themeSwitch = document.querySelector("#themeSwitch");
themeSwitch.addEventListener("click",() => {
  const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = root.dataset.theme ? root.dataset.theme === "dark" : systemDark;
  root.dataset.theme = isDark ? "light" : "dark";
  localStorage.setItem("portfolio-theme",root.dataset.theme);
});

const sidebar = document.querySelector("#sidebar");
const navScrim = document.querySelector("#navScrim");
const mobileNavTrigger = document.querySelector("#mobileNavTrigger");
function closeNav(){sidebar.classList.remove("open");navScrim.classList.remove("show");mobileNavTrigger.setAttribute("aria-expanded","false")}
mobileNavTrigger.addEventListener("click",() => {const open=sidebar.classList.toggle("open");navScrim.classList.toggle("show",open);mobileNavTrigger.setAttribute("aria-expanded",String(open))});
navScrim.addEventListener("click",closeNav);

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
let navFrame;
function syncNav(){
  const marker=scrollY+Math.min(innerHeight*.35,275);
  let active=sections[0];
  sections.forEach(section => {if(section.offsetTop<=marker) active=section});
  navLinks.forEach(link => link.classList.toggle("active",link.getAttribute("href")==="#" + active.id));
  navFrame=0;
}
addEventListener("scroll",() => {if(!navFrame) navFrame=requestAnimationFrame(syncNav)},{passive:true});
addEventListener("resize",syncNav);
navLinks.forEach(link => link.addEventListener("click",closeNav));
syncNav();

const playObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const video=entry.target;
  if(entry.isIntersecting) {
    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => video.setAttribute("data-playback-hint","tap-to-play"));
  } else video.pause();
}),{threshold:.2,rootMargin:"120px 0px"});
document.querySelectorAll("video[data-autoplay]").forEach(video => {
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("muted","");
  video.setAttribute("autoplay","");
  video.setAttribute("playsinline","");
  const attemptPlayback = () => {
    const rect = video.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0) video.play().catch(() => {});
  };
  video.addEventListener("loadeddata",attemptPlayback,{once:true});
  video.addEventListener("canplay",attemptPlayback,{once:true});
  video.addEventListener("touchstart",() => video.play().catch(() => {}),{passive:true});
  playObserver.observe(video);
});

const heroVideo=document.querySelector(".hero-display video");
const heroSound=document.querySelector("#heroSound");
heroSound.addEventListener("click",() => {
  heroVideo.muted=!heroVideo.muted;
  heroSound.classList.toggle("playing",!heroVideo.muted);
  heroSound.setAttribute("aria-label",heroVideo.muted?"打开视频声音":"关闭视频声音");
  heroVideo.play().catch(() => {});
});

const viewer=document.querySelector("#viewer");
document.querySelectorAll(".motion-card").forEach(card => {
  const show=() => openViewer(card.dataset);
  card.addEventListener("click",show);
  card.addEventListener("keydown",event => {if(event.key==="Enter"||event.key===" "){event.preventDefault();show()}});
});
document.querySelectorAll("[data-close-viewer]").forEach(element => element.addEventListener("click",closeViewer));
document.addEventListener("keydown",event => {if(event.key==="Escape"&&viewer.classList.contains("open")) closeViewer()});

const toast=document.querySelector("#toast");
let toastTimer;
document.querySelectorAll(".copy-button").forEach(button => button.addEventListener("click",async() => {
  try{await navigator.clipboard.writeText(button.dataset.copy);toast.textContent="已复制微信号"}catch{toast.textContent="微信号："+button.dataset.copy}
  toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(() => toast.classList.remove("show"),1800);
}));
