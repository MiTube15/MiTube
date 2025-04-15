document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.adultdatalink.com/eporner/search";
    const params = {
      query: "porn", // Palabra clave inicial de búsqueda
      per_page: 12,  // Videos por página
      page: 1,       // Página inicial
      thumbsize: "medium",
      order: "viewed",
      gay: 0,
      lq: 0,
      search_format: "json"
    };
  
    const videoList = document.getElementById("video-list");
    const videoTitle = document.getElementById("video-title");
    const videoIframe = document.getElementById("video-iframe");
    const videoDuration = document.getElementById("video-duration");
    const videoViews = document.getElementById("video-views");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const pageNumber = document.getElementById("page-number");
    const detailView = document.getElementById("video-detail");
    const videoTags = document.getElementById("video-tags");
    const thumbGallery = document.getElementById("thumb-gallery");
    const backBtn = document.getElementById("backBtn");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
  
    let currentPage = 1;
  
    // Función para cargar videos desde la API
    function loadVideos(page = 1, query = params.query) {
      params.page = page;
      params.query = query;
  
      const queryString = new URLSearchParams(params).toString();
      fetch(`${API_URL}?${queryString}`)
        .then(res => res.json())
        .then(data => {
          videoList.innerHTML = "";
          data.videos.forEach(video => {
            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded-lg shadow-xl hover:shadow-2xl cursor-pointer transition duration-300 transform hover:scale-105";
            div.innerHTML = `
              <img src="${video.default_thumb.src}" alt="${video.title}" class="w-full h-48 object-cover rounded-md mb-4">
              <h3 class="font-semibold text-xl text-gray-900">${video.title}</h3>
              <p class="text-sm text-gray-600">${video.length_min}</p>
              <p class="text-sm text-gray-500 mt-2">Vistas: ${video.views}</p>
            `;
            div.addEventListener("click", () => showDetail(video));
            videoList.appendChild(div);
          });
  
          // Actualizar la paginación
          pageNumber.textContent = `Página ${page}`;
          prevPageBtn.disabled = page <= 1;
          nextPageBtn.disabled = page >= data.total_pages;
        })
        .catch(err => {
          console.error("Error al cargar los videos:", err);
        });
    }
  
    // Mostrar detalles del video
    function showDetail(video) {
      videoList.classList.add("hidden");
      detailView.classList.remove("hidden");
  
      videoTitle.textContent = video.title;
      videoIframe.src = video.embed;
      videoDuration.textContent = `Duración: ${video.length_min}`;
      videoViews.textContent = `Vistas: ${video.views}`;
  
      // Etiquetas
      videoTags.innerHTML = "";
      video.keywords.split(",").forEach(tag => {
        const span = document.createElement("span");
        span.textContent = tag.trim();
        span.className = "bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm mr-2 mb-2 inline-block";
        videoTags.appendChild(span);
      });
  
      // Miniaturas
      thumbGallery.innerHTML = "";
      video.thumbs.slice(0, 8).forEach(thumb => {
        const img = document.createElement("img");
        img.src = thumb.src;
        img.alt = "Frame";
        img.className = "rounded-md border-2 border-gray-300 m-1 hover:border-blue-400 transition duration-300";
        thumbGallery.appendChild(img);
      });
    }
  
    // Volver a la vista de lista
    backBtn.addEventListener("click", () => {
      detailView.classList.add("hidden");
      videoList.classList.remove("hidden");
    });
  
    // Paginación
    nextPageBtn.addEventListener("click", () => {
      currentPage++;
      loadVideos(currentPage, searchInput.value.trim() || params.query);
    });
  
    prevPageBtn.addEventListener("click", () => {
      currentPage--;
      loadVideos(currentPage, searchInput.value.trim() || params.query);
    });
  
    // Botón de búsqueda
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        currentPage = 1;
        loadVideos(currentPage, query);
      }
    });
  
    // Cargar videos iniciales
    loadVideos(currentPage, params.query);
  });


  //cargar videos de categorias
  function cargarVideosDesdeAPI() {
    fetch("https://api.adultdatalink.com/auntmia/feed/")
      .then(res => res.json())
      .then(data => {
        const contenedor = document.getElementById("api-content");
  
        // Asegura que sea un array
        const items = Array.isArray(data) ? data : [data];
  
        contenedor.innerHTML = items.map(item => `
          <a href="${item.link_url}" target="_blank" class="bg-white rounded shadow hover:shadow-lg transition p-2 block">
            <img src="${item.thumbnail_url}" alt="${item.title}" class="w-full h-48 object-cover rounded mb-2">
            <h3 class="font-semibold text-lg">${item.title}</h3>
            <p class="text-sm text-gray-600">${item.category}</p>
          </a>
        `).join("");
      })
      .catch(err => {
        console.error("Error al cargar datos desde API:", err);
        document.getElementById("api-content").innerHTML = `
          <p class='text-red-600'>No se pudo cargar el contenido dinámico.</p>
        `;
      });
  }
  
  // Ejecutar al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    cargarVideosDesdeAPI();
  });
  
  
  