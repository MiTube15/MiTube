const API_URL = "http://api.adultdatalink.com/pornhub/search/";
let currentPage = 1;
let currentQuery = "all";
let currentCategory = "";
let currentTag = "";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const videoList = document.getElementById("videoList");
const pageIndicator = document.getElementById("pageIndicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const modal = document.getElementById("videoModal");
const modalTitle = document.getElementById("modalTitle");
const modalFrame = document.getElementById("videoFrame");
const modalDetails = document.getElementById("videoDetails");
const closeModalBtn = document.querySelector(".close");

const categoryFilter = document.getElementById("categoryFilter");
const tagFilter = document.getElementById("tagFilter");

window.addEventListener("DOMContentLoaded", () => {
  fetchVideos();
});

searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value.trim() || "all";
  currentPage = 1;
  fetchVideos();
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchVideos();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchVideos();
});

categoryFilter.addEventListener("change", () => {
  currentCategory = categoryFilter.value;
  currentPage = 1;
  fetchVideos();
});

tagFilter.addEventListener("change", () => {
  currentTag = tagFilter.value;
  currentPage = 1;
  fetchVideos();
});

async function fetchVideos() {
  try {
    let query = `${API_URL}?q=${encodeURIComponent(currentQuery)}&page=${currentPage}`;
    if (currentCategory) query += `&category=${encodeURIComponent(currentCategory)}`;
    if (currentTag) query += `&tag=${encodeURIComponent(currentTag)}`;

    const response = await fetch(query);
    const data = await response.json();

    if (data.videos) {
      renderVideos(data.videos);
      pageIndicator.textContent = `Página ${currentPage}`;
    } else {
      videoList.innerHTML = "<p>No se encontraron videos.</p>";
    }
  } catch (error) {
    videoList.innerHTML = `<p>Error al cargar los videos. Intenta de nuevo.</p>`;
    console.error(error);
  }
}

function renderVideos(videos) {
  videoList.innerHTML = "";

  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="${video.thumb}" alt="${video.title}" />
      <div class="video-info">
        <h3>${video.title}</h3>
        <p>Duración: ${video.duration}</p>
        <p>Vistas: ${video.views.toLocaleString()}</p>
        <div class="video-tags">${(video.tags || []).slice(0, 5).map(tag => `<span>${tag}</span>`).join('')}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(video));
    videoList.appendChild(card);
  });
}

function openModal(video) {
  modalTitle.textContent = video.title;
  modalFrame.src = video.url;
  modalDetails.textContent = `Tags: ${(video.tags || []).join(", ")}`;
  modal.style.display = "flex";
}

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modalFrame.src = "";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalFrame.src = "";
  }
});
