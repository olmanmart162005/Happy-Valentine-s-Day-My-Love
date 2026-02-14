const $ = (s) => document.querySelector(s);
const PHOTOS_FOLDER = "assets/photos/img/";

const phrases = [
  "“Feliz San Valentín, mi amor. Te amo muchísimo.”",
  "“En lo simple contigo, todo es perfecto.”",
  "“Gracias por tu cariño, por tu paciencia y por estar.”",
  "“Te elijo con calma, con respeto y con ternura.”",
  "“Con vos, la vida se ve más bonita.”",
  "“En lo bueno y en lo difícil… contigo.”"
];

const categories = [
  {
    id: "portadas",
    label: "Portadas",
    title: "Portadas",
    desc: "Nuestros inicios y fotos favoritas. Lo bonito de tenerte cerca.",
    files: ["portada.jpg","portada2.jpg","portada3.jpg","portada5.jpg"]
  },
  {
    id: "salidas",
    label: "Salidas",
    title: "Salidas juntos",
    desc: "No importa a dónde… si es contigo, es especial.",
    files: ["salidas.jpg","salidas2.jpg","salidas5.jpg"]
  },
  {
    id: "juegos",
    label: "Juegos",
    title: "Juegos",
    desc: "Me encanta cuando nos reímos y nos divertimos como niños.",
    files: ["Juegos.jpg","Juegos2.jpg"]
  },
  {
    id: "locuras",
    label: "Locuras",
    title: "Locuras bonitas",
    desc: "Las locuras contigo son mis favoritas. Gracias por tu energía.",
    files: ["locuras.jpg"]
  },
  {
    id: "cocinando",
    label: "Cocinando",
    title: "Cocinando",
    desc: "Pequeños momentos que se sienten hogar.",
    files: ["Cocinando.jpg","Cocinando2.jpg"]
  },
  {
    id: "enfermedades",
    label: "En lo difícil",
    title: "Enfermedades (cuidarnos)",
    desc: "Porque amarte también es cuidarte. En lo bueno y en lo difícil, aquí estoy.",
    files: ["enfermedades.jpg","enfermedades2.jpg","enfermedades3.jpg","enfermedades4.jpg"]
  },
  {
    id: "momentos",
    label: "Momentos",
    title: "Otros momentos",
    desc: "Un álbum de recuerdos: cada foto guarda un “te amo”.",
    files: [
      "IMG_0213 Copy.jpg",
      "IMG_1906.jpg",
      "IMG_2916.jpg",
      "IMG_4173.jpg",
      "IMG_4268.jpg",
      "IMG_4910.jpg",
      "IMG_4929.jpg",
      "IMG_5643.jpg",
      "IMG_5677.jpg",
      "IMG_5723.jpg",
      "IMG_6284_polarr.jpg",
      "IMG_6879.jpg",
      "IMG_7268_polarr.jpg",
      "IMG-20241211-WA0013.jpg",
      "IMG-20250101-WA0185.jpg",
      "IMG-20250106-WA0145.jpg",
      "IMG-20250222-WA0072.jpg",
      "IMG-20250329-WA0050.jpg",
      "P-IMG-20240128-WA0068.jpg",
      "P-IMG-20240129-WA0018.jpg",
      "P-IMG-20240129-WA0033.jpg"
    ]
  }
];

let currentCat = 0;
let cursor = 0;
let toast;
let musicOn = false;

function photoPath(file){ return `${PHOTOS_FOLDER}${file}`; }

function showToast(msg){
  $("#toastText").textContent = msg;
  if(!toast) toast = new bootstrap.Toast($("#toastLove"), { delay: 2400 });
  toast.show();
}

document.addEventListener("DOMContentLoaded", () => {
  // Buttons scroll
  $("#btnGoCarta").addEventListener("click", () => $("#carta").scrollIntoView({behavior:"smooth"}));
  $("#btnGoMomentos").addEventListener("click", () => $("#momentos").scrollIntoView({behavior:"smooth"}));
  $("#btnGoFinal").addEventListener("click", () => $("#final").scrollIntoView({behavior:"smooth"}));

  // Hero images default
  $("#heroImg").src = photoPath("portada.jpg");

  // phrase
  $("#miniMessage").textContent = randomItem(phrases);
  $("#btnChangeMsg").addEventListener("click", () => {
    $("#miniMessage").textContent = randomItem(phrases);
  });

  // hearts
  $("#btnHearts").addEventListener("click", () => {
    heartBurst(18);
    showToast("Para vos, mi amor 🖤");
  });

  // build tabs
  buildTabs();
  setCategory(0);

  // viewer controls
  $("#btnPrev").addEventListener("click", () => move(-1));
  $("#btnNext").addEventListener("click", () => move(1));
  $("#btnShuffle").addEventListener("click", () => {
    shuffle(categories[currentCat].files);
    cursor = 0;
    renderViewer();
    renderGrid();
    showToast("Mezclé este momento ✨");
  });

  // lightbox
  const modal = new bootstrap.Modal($("#lightboxModal"));
  $("#btnOpenLightbox").addEventListener("click", () => {
    $("#lightboxImg").src = photoPath(categories[currentCat].files[cursor]);
    modal.show();
  });

  // final
  $("#btnYes").addEventListener("click", () => {
    $("#yesResult").classList.remove("d-none");
    confettiHearts(180);
    showToast("AAAA 😭💖 Te amo, mi amor");
  });
  $("#btnMore").addEventListener("click", () => showToast(randomItem(phrases)));

  // music
  $("#btnMusic").addEventListener("click", toggleMusic);
});

function buildTabs(){
  const wrap = $("#tabs");
  wrap.innerHTML = "";
  categories.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "tab-btn";
    b.textContent = c.label;
    b.addEventListener("click", () => setCategory(i));
    wrap.appendChild(b);
  });
}

function setCategory(index){
  currentCat = index;
  cursor = 0;

  // active tab
  const btns = Array.from($("#tabs").children);
  btns.forEach((b, i) => b.classList.toggle("active", i === index));

  // header
  $("#catKicker").textContent = "Álbum";
  $("#catTitle").textContent = categories[index].title;
  $("#catDesc").textContent = categories[index].desc;

  // total
  $("#viewerTotal").textContent = String(categories[index].files.length);

  renderViewer();
  renderGrid();

  // small toast depending category
  if(categories[index].id === "enfermedades"){
    showToast("En lo difícil también: cuidarte es amarte 💖");
  } else {
    showToast(`Momento: ${categories[index].title} ✨`);
  }
}

function renderViewer(){
  const files = categories[currentCat].files;
  const file = files[cursor];

  const img = $("#viewerImg");
  img.src = photoPath(file);
  img.onerror = () => {
    // if missing, skip
    move(1);
  };

  $("#viewerIndex").textContent = String(cursor + 1);
  $("#viewerName").textContent = file;
}

function renderGrid(){
  const grid = $("#grid");
  grid.innerHTML = "";

  const files = categories[currentCat].files;

  files.forEach((file, idx) => {
    const item = document.createElement("div");
    item.className = "photo-item";

    const img = document.createElement("img");
    img.src = photoPath(file);
    img.alt = file;
    img.onerror = () => item.remove();

    const badge = document.createElement("div");
    badge.className = "photo-badge";
    badge.textContent = `#${idx + 1}`;

    item.appendChild(img);
    item.appendChild(badge);

    item.addEventListener("click", () => {
      cursor = idx;
      renderViewer();
      heartBurst(10);
      showToast("Qué bonito recuerdo, mi amor 💞");
    });

    grid.appendChild(item);
  });
}

function move(dir){
  const files = categories[currentCat].files;
  cursor = (cursor + dir + files.length) % files.length;
  renderViewer();
}

/* helpers */
function randomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* music */
function toggleMusic(){
  const audio = $("#audio");
  musicOn = !musicOn;
  $("#musicState").textContent = musicOn ? "ON" : "OFF";

  if(musicOn){
    audio.play().then(() => showToast("Música ON 🎶")).catch(() => {
      musicOn = false;
      $("#musicState").textContent = "OFF";
      showToast("Poné tu canción en assets/song.mp3 😅");
    });
  } else {
    audio.pause();
    showToast("Música OFF 🌙");
  }
}

/* hearts */
function heartBurst(n=12){
  for(let i=0;i<n;i++){
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = "💖";
    h.style.left = `${Math.random()*100}vw`;
    h.style.top = `${70 + Math.random()*20}vh`;
    h.style.fontSize = `${16 + Math.random()*22}px`;
    h.style.opacity = `${0.8 + Math.random()*0.2}`;
    document.body.appendChild(h);

    const driftX = (Math.random()*2 - 1) * 80;
    const driftY = 140 + Math.random()*160;

    const anim = h.animate(
      [
        { transform: "translate(0,0) rotate(0deg)" },
        { transform: `translate(${driftX}px, -${driftY}px) rotate(${(Math.random()*80-40)}deg)` },
      ],
      { duration: 1200 + Math.random()*900, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    anim.onfinish = () => h.remove();
  }
}

/* confetti hearts */
function confettiHearts(count=120){
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const w = canvas.width = Math.floor(window.innerWidth * dpr);
  const h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  const particles = Array.from({length: count}, () => ({
    x: Math.random()*w,
    y: -Math.random()*h*0.3,
    r: (6 + Math.random()*10)*dpr,
    vy: (2 + Math.random()*5)*dpr,
    vx: (-1 + Math.random()*2)*dpr,
    rot: Math.random()*Math.PI,
    vr: (-0.08 + Math.random()*0.16),
    life: 160 + Math.random()*120
  }));

  let frame = 0;
  const draw = () => {
    frame++;
    ctx.clearRect(0,0,w,h);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life/220));

      ctx.beginPath();
      const s = p.r;
      ctx.moveTo(0, s/4);
      ctx.bezierCurveTo(0, -s/2, -s, -s/2, -s, s/6);
      ctx.bezierCurveTo(-s, s, 0, s*1.1, 0, s*1.5);
      ctx.bezierCurveTo(0, s*1.1, s, s, s, s/6);
      ctx.bezierCurveTo(s, -s/2, 0, -s/2, 0, s/4);
      ctx.closePath();

      const grad = ctx.createLinearGradient(-s, -s, s, s);
      grad.addColorStop(0, "rgba(255,77,166,0.95)");
      grad.addColorStop(1, "rgba(167,139,250,0.95)");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    const alive = particles.some(p => p.life > 0 && p.y < h + 40);
    if(alive && frame < 420) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,w,h);
  };
  draw();
}
