/* =========================================
   DATA & VARIABEL
========================================= */

let selectedSeats = [];
let currentDetailFilm = "";
let favorites = JSON.parse(localStorage.getItem("xxiFavorites")) || [];

const occupiedSeats = [
  "A2",
  "A5",
  "B3",
  "C6",
  "D1",
  "D4",
  "E2",
  "F5"
];


/* =========================================
   MODAL
========================================= */

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}


document.querySelectorAll(".modal-overlay").forEach(modal => {

  modal.addEventListener("click", function (e) {

    if (e.target === modal) {
      modal.classList.remove("open");
    }

  });

});


/* =========================================
   BOOKING
========================================= */

function openBooking(film) {

  document.getElementById("fFilm").value = film;

  document.getElementById("fNama").value = "";

  document.getElementById("fTanggal").value = "";

  document.getElementById("fJam").value = "";

  selectedSeats = [];

  document.getElementById("bookingFormView").style.display = "block";

  document.getElementById("confirmView").classList.remove("show");

  generateSeats();

  openModal("bookingModal");
}


function generateSeats() {

  const grid = document.getElementById("seatGrid");

  grid.innerHTML = "";

  const rows = ["A", "B", "C", "D", "E", "F"];

  rows.forEach(row => {

    for (let i = 1; i <= 6; i++) {

      const seatName = row + i;

      const button = document.createElement("button");

      button.className = "seat";

      button.textContent = seatName;

      if (occupiedSeats.includes(seatName)) {

        button.classList.add("occupied");

        button.disabled = true;

      } else {

        button.onclick = () =>
          selectSeat(seatName, button);

      }

      grid.appendChild(button);

    }

  });

}


function selectSeat(seat, button) {

  if (selectedSeats.includes(seat)) {

    selectedSeats =
      selectedSeats.filter(s => s !== seat);

    button.classList.remove("selected");

  } else {

    if (selectedSeats.length >= 4) {

      showToast(
        "Maksimal 4 Kursi",
        "Kamu hanya dapat memilih maksimal 4 kursi."
      );

      return;
    }

    selectedSeats.push(seat);

    button.classList.add("selected");

  }

  document.getElementById("selectedSeatText").textContent =
    selectedSeats.length
      ? selectedSeats.join(", ")
      : "Belum ada";

}


function submitBooking() {

  const film =
    document.getElementById("fFilm").value;

  const nama =
    document.getElementById("fNama").value;

  const tanggal =
    document.getElementById("fTanggal").value;

  const jam =
    document.getElementById("fJam").value;


  if (!film) {

    showToast(
      "Pilih Film",
      "Silakan pilih film terlebih dahulu."
    );

    return;
  }


  if (!nama || !tanggal || !jam) {

    showToast(
      "Data Belum Lengkap",
      "Silakan lengkapi data pemesanan."
    );

    return;
  }


  if (selectedSeats.length === 0) {

    showToast(
      "Pilih Kursi",
      "Silakan pilih minimal satu kursi."
    );

    return;
  }


  document.getElementById("cFilm").textContent = film;

  document.getElementById("cNama").textContent = nama;

  document.getElementById("cTanggal").textContent = tanggal;

  document.getElementById("cJam").textContent = jam;

  document.getElementById("cKursi").textContent =
    selectedSeats.join(", ");


  document.getElementById("bookingFormView").style.display =
    "none";

  document.getElementById("confirmView").classList.add("show");


  showToast(
    "Pesanan Berhasil",
    "Tiket berhasil dipesan."
  );

}


/* =========================================
   DETAIL FILM
========================================= */

function openDetail(
  title,
  genre,
  rating,
  duration,
  description
) {

  currentDetailFilm = title;

  document.getElementById("detailTitle").textContent =
    title;

  document.getElementById("detailGenre").textContent =
    genre;

  document.getElementById("detailRating").textContent =
    rating;

  document.getElementById("detailDuration").textContent =
    duration;

  document.getElementById("detailDesc").textContent =
    description;

  openModal("detailModal");

}


function bookFromDetail() {

  closeModal("detailModal");

  openBooking(currentDetailFilm);

}


/* =========================================
   TRAILER (baru ditambahkan supaya tombol
   "Play Now" / "Mulai Nonton" / trailer di
   Detail Modal beneran berfungsi)
========================================= */

function openTrailer(title) {

  document.getElementById("trailerTitle").textContent =
    title || "Trailer Film";

  document.getElementById("trailerText").textContent =
    "Klik tombol play untuk memulai trailer.";

  openModal("trailerModal");

}


function playTrailer() {

  document.getElementById("trailerText").textContent =
    "Sedang memutar trailer... (sambungkan file video asli di sini nanti)";

  showToast(
    "Trailer Diputar",
    "Trailer sedang berjalan."
  );

}


/* =========================================
   DOWNLOAD (baru ditambahkan supaya tombol
   "Download Video" di navbar tidak error)
========================================= */

function toggleDownload() {

  showToast(
    "Download",
    "Fitur download akan segera tersedia. Hubungkan tombol ini ke file video asli kamu."
  );

}


/* =========================================
   FAVORITE / MY LIST
========================================= */

function toggleFavorite(event, button, film) {

  event.stopPropagation();

  if (favorites.includes(film)) {

    favorites =
      favorites.filter(item => item !== film);

    button.classList.remove("active");

    button.textContent = "♡";

    showToast(
      "Dihapus",
      film + " dihapus dari My List."
    );

  } else {

    favorites.push(film);

    button.classList.add("active");

    button.textContent = "♥";

    showToast(
      "My List",
      film + " ditambahkan ke My List."
    );

  }

  localStorage.setItem(
    "xxiFavorites",
    JSON.stringify(favorites)
  );

}


function showMyList() {

  document.getElementById("movies")
    .scrollIntoView({
      behavior: "smooth"
    });

  const cards =
    document.querySelectorAll(".movie-card");

  cards.forEach(card => {

    const title =
      card.dataset.title;

    if (favorites.includes(title)) {

      card.style.display = "block";

    } else {

      card.style.display = "none";

    }

  });

  showToast(
    "My List",
    "Menampilkan film favorit kamu."
  );

}


/* =========================================
   SEARCH FILM
========================================= */

function searchMovie() {

  const keyword =
    document.getElementById("searchInput")
      .value
      .toLowerCase();

  const cards =
    document.querySelectorAll(".movie-card");

  cards.forEach(card => {

    const title =
      card.dataset.title.toLowerCase();

    if (title.includes(keyword)) {

      card.style.display = "block";

    } else {

      card.style.display = "none";

    }

  });

}


/* =========================================
   GENRE FILTER
========================================= */

document
  .querySelectorAll(".genre-filter .pill")
  .forEach(pill => {

    pill.addEventListener("click", function () {

      // Kalau halaman ini TIDAK punya daftar film (misalnya di Home / Trends Now),
      // pindah ke movies.html dan bawa genre yang dipilih lewat URL.
      const hasMovieList =
        document.querySelectorAll(".movie-card").length > 0;

      if (!hasMovieList) {

        const genre = this.dataset.genre;

        window.location.href =
          "movies.html" +
          (genre && genre !== "all"
            ? "?genre=" + encodeURIComponent(genre)
            : "");

        return;
      }

      document
        .querySelectorAll(".genre-filter .pill")
        .forEach(p =>
          p.classList.remove("active")
        );

      this.classList.add("active");

      const genre =
        this.dataset.genre;

      document
        .querySelectorAll(".movie-card")
        .forEach(card => {

          if (
            genre === "all" ||
            card.dataset.genre === genre
          ) {

            card.style.display = "block";

          } else {

            card.style.display = "none";

          }

        });

    });

  });


/* =========================================
   BACA PARAMETER URL (?genre=... / ?list=favorit)
   dipakai saat pindah dari Home ke movies.html
========================================= */

(function applyUrlParams() {

  const params = new URLSearchParams(window.location.search);

  const genre = params.get("genre");
  const list = params.get("list");

  if (genre) {

    const targetPill =
      document.querySelector('.genre-filter .pill[data-genre="' + genre + '"]');

    if (targetPill) {
      targetPill.click();
    }

  }

  if (list === "favorit") {

    // beri jeda sedikit supaya elemen film sudah siap sebelum difilter
    setTimeout(showMyList, 50);

  }

})();


/* =========================================
   TABS
========================================= */

document.querySelectorAll(".tabs").forEach(group => {

  group.querySelectorAll("span").forEach(tab => {

    tab.addEventListener("click", function () {

      group
        .querySelectorAll("span")
        .forEach(x =>
          x.classList.remove("active")
        );

      this.classList.add("active");

    });

  });

});

/* =========================
   VIDEO PLAYER
========================= */

function playVideo(button) {

  // Mengambil card video yang diklik
  const card = button.closest(".video-card");

  // Mengambil video dari card
  const video = card.querySelector(".video-preview");

  // Mengambil judul film
  const title = card.querySelector("h3").textContent;

  // Mengambil alamat video
  const source = video.querySelector("source").src;

  // Mengambil modal
  const modal = document.getElementById("videoModal");

  // Mengambil video utama
  const mainVideo = document.getElementById("mainVideo");

  // Mengambil source video utama
  const mainVideoSource = document.getElementById("mainVideoSource");

  // Mengambil judul video
  const videoTitle = document.getElementById("videoTitle");


  // Memasukkan video yang dipilih
  mainVideoSource.src = source;

  // Memuat video
  mainVideo.load();


  // Mengubah judul
  videoTitle.textContent = title;


  // Membuka modal
  modal.classList.add("active");


  // Memutar video
  mainVideo.play();
}


/* =========================
   CLOSE VIDEO
========================= */

function closeVideo() {

  const modal = document.getElementById("videoModal");

  const mainVideo = document.getElementById("mainVideo");


  // Menghentikan video
  mainVideo.pause();

  // Mengembalikan video ke awal
  mainVideo.currentTime = 0;

  // Menutup modal
  modal.classList.remove("active");
}


/* =========================
   KLIK DI LUAR VIDEO
========================= */

const videoModal = document.getElementById("videoModal");

if (videoModal) {

  videoModal.addEventListener("click", function (event) {

    if (event.target === videoModal) {
      closeVideo();
    }

  });

}


/* =========================
   TOMBOL ESC
========================= */

document.addEventListener("keydown", function (event) {

  if (event.key === "Escape") {
    closeVideo();
  }

});


/* =========================================
   DARK / LIGHT MODE
========================================= */

function toggleTheme() {

  document.body.classList.toggle("light");

  const isLight =
    document.body.classList.contains("light");

  localStorage.setItem(
    "xxiTheme",
    isLight ? "light" : "dark"
  );

  showToast(
    "Tema",
    isLight
      ? "Light mode aktif."
      : "Dark mode aktif."
  );

}


if (
  localStorage.getItem("xxiTheme") === "light"
) {

  document.body.classList.add("light");

}


/* =========================================
   RESTORE FAVORITES
========================================= */

document.querySelectorAll(".favorite")
  .forEach(button => {

    const onclickText =
      button.getAttribute("onclick") || "";

    const match =
      onclickText.match(/'([^']+)'/g);

    if (!match) return;

    const film =
      match[match.length - 1]
        .replace(/'/g, "");

    if (favorites.includes(film)) {

      button.classList.add("active");

      button.textContent = "♥";

    }

  });


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(title, message) {

  const toast =
    document.getElementById("toast");

  document.getElementById("toastTitle")
    .textContent = title;

  document.getElementById("toastMsg")
    .textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 3500);

}


/* =========================================
   NEWSLETTER
========================================= */

function subscribeNewsletter() {

  const email =
    document.querySelector(".newsletter-input")
      .value;

  if (!email) {

    showToast(
      "Email Kosong",
      "Masukkan email terlebih dahulu."
    );

    return;
  }

  showToast(
    "Berhasil!",
    "Kamu berhasil berlangganan newsletter."
  );

}


/* =========================================
   BACK TO TOP
========================================= */

window.addEventListener("scroll", function () {

  const button =
    document.getElementById("backTop");

  if (window.scrollY > 400) {

    button.classList.add("show");

  } else {

    button.classList.remove("show");

  }

});