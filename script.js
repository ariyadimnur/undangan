const splash = document.getElementById("splash");
const content = document.getElementById("content");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const backToTop = document.getElementById("backToTop");

let isPlaying = false;

// Buka undangan
openBtn.addEventListener("click", () => {
  splash.style.display = "none";
  content.classList.remove("hidden");
  music.play().catch(e => console.log("Autoplay gagal", e));
  isPlaying = true;
  musicBtn.textContent = "🔊";

  // Inisialisasi AOS
  AOS.init({once:true, duration:1000});
});

// Toggle musik
musicBtn.addEventListener("click", () => {
  if(isPlaying){ 
    music.pause(); 
    isPlaying=false; 
    musicBtn.textContent="🔈"; 
  }
  else{ 
    music.play().catch(e=>console.log("Autoplay gagal",e)); 
    isPlaying=true; 
    musicBtn.textContent="🔊"; 
  }
});

// Countdown acara
const eventDate = new Date("2026-01-31T08:00:00").getTime();
setInterval(() => {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance < 0) {
    document.getElementById("countdown").innerHTML = "<p>Acara Sedang Berlangsung 🎉</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}, 1000);

// Firebase Config (isi dengan config project om)
const firebaseConfig = {
    apiKey: "AIzaSyBGYAJwb0XlGwP_sGN7vY0IT8XD9N9aafU",
    authDomain: "undangan-digital-e55c1.firebaseapp.com",
    projectId: "undangan-digital-e55c1",
    storageBucket: "undangan-digital-e55c1.firebasestorage.app",
    messagingSenderId: "143539331921",
    appId: "1:143539331921:web:732effa4b8abe3e487a970"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Handle RSVP form
const rsvpForm = document.getElementById("rsvpForm");
const successMsg = document.getElementById("successMsg");

if(rsvpForm){
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const kehadiran = document.getElementById("kehadiran").value;
    const pesan = document.getElementById("pesan").value.trim();

    if(!nama || !kehadiran){
      alert("Harap isi nama dan kehadiran!");
      return;
    }

    try {
      await db.collection("rsvp").add({
        nama,
        kehadiran,
        pesan,
        timestamp: new Date()
      });

      rsvpForm.reset();
      successMsg.style.display = "block";
      setTimeout(()=> successMsg.style.display = "none", 4000);
    } catch (err) {
      console.error("Gagal kirim RSVP", err);
      alert("Terjadi kesalahan saat mengirim RSVP!");
    }
  });
}

// Referensi daftar tamu
const guestList = document.getElementById("guestList");

// Ambil data RSVP dari Firestore dan tampilkan
function loadRSVPs() {
  db.collection("rsvp")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      guestList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `<strong>${data.nama}</strong> - ${data.kehadiran} <br><em>${data.pesan || ""}</em>`;
        guestList.appendChild(li);
      });
    });
}
loadRSVPs();

// =======================
// Efek Bunga Berjatuhan
// =======================
let flowerInterval; // supaya bisa diubah kecepatannya

function createFlower() {
  const flower = document.createElement("div");
  flower.classList.add("flower");

  // daftar emoji bunga
  const flowers = ["🌸", "🌹", "🌺", "💐", "🌼"];
  flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];

  // posisi acak
  flower.style.left = Math.random() * 100 + "vw";
  flower.style.animationDuration = (Math.random() * 3 + 3) + "s"; // 3–6 detik
  flower.style.fontSize = (Math.random() * 10 + 20) + "px"; // ukuran 20–30px

  // warna acak
  const colors = ["#ff7eb9", "#ff4d6d", "#ffc93c", "#9b5de5", "#00bbf9"];
  flower.style.color = colors[Math.floor(Math.random() * colors.length)];

  document.getElementById("falling-flowers").appendChild(flower);

  // hapus setelah animasi selesai
  setTimeout(() => flower.remove(), 6000);
}

// jalan pelan2 dari splash
window.addEventListener("load", () => {
  flowerInterval = setInterval(createFlower, 800); // lambat (1 bunga/0.8s)
});

// setelah splash hilang -> lebih meriah
function startMainFlowers() {
  clearInterval(flowerInterval);
  flowerInterval = setInterval(createFlower, 300); // cepat (1 bunga/0.3s)
}

// setelah splash dibuka, tambah rame
openBtn.addEventListener("click", () => {
  splash.style.display = "none";
  content.classList.remove("hidden");

  // stop interval lama
  clearInterval(flowerInterval);
  // bikin interval baru lebih cepat
  flowerInterval = setInterval(createFlower, 300); 
});

// contoh trigger: ketika splash selesai ditutup
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  if (splash) {
    setTimeout(() => {
      splash.style.display = "none";
      startMainFlowers();
    }, 600000); // misalnya splash hilang 4 detik
  }
});

// Efek bunga berjatuhan
function createFlower() {
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.innerHTML = "🌸"; // bisa diganti 🌺 💮 🌹 dll
  flower.style.left = Math.random() * 100 + "vw";
  flower.style.fontSize = Math.random() * 15 + 15 + "px";
  flower.style.animationDuration = (Math.random() * 3 + 3) + "s"; // 3–6 detik

  document.getElementById("falling-flowers").appendChild(flower);

  // hapus setelah animasi selesai
  setTimeout(() => {
    flower.remove();
  }, 6000);
}

// jalan otomatis tiap 300ms
setInterval(createFlower, 300);

