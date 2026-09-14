/**
 * Farmacologia Conectada - HD Mind Map Viewer Engine
 * Leitor nativo de imagens PNG em alta resolução com Pan, Zoom, Pinch-to-zoom touch, Fullscreen e Download do arquivo
 */

class MapViewerEngine {
  constructor() {
    this.currentMap = null;
    this.scale = 1;
    this.minScale = 0.4;
    this.maxScale = 5;
    this.pointX = 0;
    this.pointY = 0;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
    this.pinchStartDistance = 0;
    this.initialScale = 1;

    this.modalEl = null;
    this.containerEl = null;
    this.contentEl = null;
    this.zoomLevelEl = null;

    this.initDOM();
  }

  initDOM() {
    let modal = document.getElementById('mapViewerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mapViewerModal';
      modal.className = 'fixed inset-0 z-50 hidden bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-0 md:p-3 transition-opacity duration-200';
      modal.innerHTML = `
        <div class="relative w-full h-full max-w-7xl bg-slate-900 md:rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
          
          <!-- Top Navigation & Action Bar -->
          <div class="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800 z-10 shrink-0">
            <div class="flex items-center space-x-3 overflow-hidden pr-2">
              <span id="viewerCategoryBadge" class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">SNA</span>
              <div class="truncate">
                <h2 id="viewerMapTitle" class="text-sm md:text-base font-bold truncate text-white leading-tight">Título do Mapa</h2>
                <p id="viewerSubtitle" class="text-[11px] text-slate-400 truncate hidden sm:block">Subtítulo</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-1 md:space-x-2 shrink-0">
              <!-- Marcar Estudado -->
              <button id="viewerToggleCompletedBtn" class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition bg-slate-800 hover:bg-slate-700 text-slate-300">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                <span class="hidden md:inline" id="viewerCompletedText">Marcar Estudado</span>
              </button>

              <!-- Favoritar -->
              <button id="viewerToggleFavoriteBtn" class="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition" title="Favoritar">
                <i data-lucide="star" class="w-5 h-5"></i>
              </button>

              <!-- Baixar Arquivo PNG / PDF -->
              <button id="viewerDownloadBtn" class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white transition shadow-sm" title="Baixar Arquivo">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span class="hidden sm:inline">Baixar</span>
              </button>

              <!-- Tela Cheia -->
              <button id="viewerFullscreenBtn" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition" title="Tela Cheia (F)">
                <i data-lucide="maximize" class="w-5 h-5"></i>
              </button>

              <!-- Fechar -->
              <button id="viewerCloseBtn" class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition ml-1" title="Fechar (ESC)">
                <i data-lucide="x" class="w-6 h-6"></i>
              </button>
            </div>
          </div>

          <!-- Viewport Area (Pan & Zoom Canvas) -->
          <div id="viewerContainer" class="relative flex-1 w-full h-full overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing select-none flex items-center justify-center touch-none">
            
            <!-- Target for translate & scale transforms -->
            <div id="viewerContent" class="absolute transform-gpu origin-center transition-transform duration-75 will-change-transform flex items-center justify-center">
              <!-- Imagem PNG renderizada aqui -->
            </div>

            <!-- Dica Flutuante de Gestos -->
            <div id="viewerHint" class="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur border border-slate-700/80 text-slate-300 text-xs px-4 py-2 rounded-full shadow-xl pointer-events-none flex items-center space-x-2 transition-opacity duration-500">
              <i data-lucide="hand" class="w-4 h-4 text-teal-400"></i>
              <span>Arraste para mover • Scroll ou pinça para zoom</span>
            </div>
          </div>

          <!-- Bottom Toolbar Controls -->
          <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 z-10 text-xs text-slate-400 shrink-0">
            <div class="flex items-center space-x-2">
              <span id="viewerFilePath" class="font-mono text-[11px] text-slate-500 hidden sm:inline truncate max-w-xs">assets/images/maps/</span>
            </div>

            <!-- Controles de Zoom -->
            <div class="flex items-center space-x-2 mx-auto sm:mx-0">
              <button id="viewerZoomOutBtn" class="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition" title="Diminuir Zoom (-)">
                <i data-lucide="minus" class="w-4 h-4"></i>
              </button>
              
              <span id="viewerZoomLevel" class="font-mono font-bold px-2 py-1 bg-slate-950/80 rounded text-slate-200 min-w-[55px] text-center">100%</span>
              
              <button id="viewerZoomInBtn" class="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition" title="Aumentar Zoom (+)">
                <i data-lucide="plus" class="w-4 h-4"></i>
              </button>

              <button id="viewerZoomResetBtn" class="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition ml-1" title="Ajustar à Tela (0)">
                Ajustar
              </button>
            </div>
          </div>

        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modalEl = modal;
    this.containerEl = modal.querySelector('#viewerContainer');
    this.contentEl = modal.querySelector('#viewerContent');
    this.zoomLevelEl = modal.querySelector('#viewerZoomLevel');

    this.bindEvents();
  }

  bindEvents() {
    const modal = this.modalEl;
    const container = this.containerEl;

    // Fechar
    modal.querySelector('#viewerCloseBtn').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // Teclado
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;
      if (e.key === 'Escape') this.close();
      if (e.key === '+' || e.key === '=') this.zoomIn();
      if (e.key === '-') this.zoomOut();
      if (e.key === '0') this.resetZoom();
      if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
    });

    // Zoom Buttons
    modal.querySelector('#viewerZoomInBtn').addEventListener('click', () => this.zoomIn());
    modal.querySelector('#viewerZoomOutBtn').addEventListener('click', () => this.zoomOut());
    modal.querySelector('#viewerZoomResetBtn').addEventListener('click', () => this.resetZoom());

    // Fullscreen Button
    modal.querySelector('#viewerFullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

    // Toggle Completed & Favorite
    modal.querySelector('#viewerToggleCompletedBtn').addEventListener('click', () => this.toggleCompleted());
    modal.querySelector('#viewerToggleFavoriteBtn').addEventListener('click', () => this.toggleFavorite());

    // Download Button
    modal.querySelector('#viewerDownloadBtn').addEventListener('click', () => this.downloadFile());

    // Mouse Pan
    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      this.isPanning = true;
      this.startX = e.clientX - this.pointX;
      this.startY = e.clientY - this.pointY;
      container.classList.add('cursor-grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      e.preventDefault();
      this.pointX = e.clientX - this.startX;
      this.pointY = e.clientY - this.startY;
      this.updateTransform();
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      container.classList.remove('cursor-grabbing');
    });

    // Double Click / Double Tap to toggle 100% / 200%
    container.addEventListener('dblclick', () => {
      if (this.scale > 1.2) {
        this.resetZoom();
      } else {
        this.scale = 2;
        this.updateTransform();
      }
    });

    // Mobile Double Tap detection
    let lastTap = 0;
    container.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0 && e.changedTouches.length === 1) {
        // Double tap detected
        if (this.scale > 1.2) {
          this.resetZoom();
        } else {
          this.scale = 2;
          this.updateTransform();
        }
        e.preventDefault();
      }
      lastTap = currentTime;

      if (e.touches.length === 0) {
        this.isPanning = false;
        this.pinchStartDistance = 0;
      }
    });

    // Mouse Wheel Zoom
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.18;
      const newScale = Math.min(Math.max(this.scale + delta, this.minScale), this.maxScale);
      this.scale = newScale;
      this.updateTransform();
    }, { passive: false });

    // Touch Pinch-to-Zoom & Pan with touch-action isolation
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isPanning = true;
        this.startX = e.touches[0].clientX - this.pointX;
        this.startY = e.touches[0].clientY - this.pointY;
      } else if (e.touches.length === 2) {
        this.isPanning = false;
        this.pinchStartDistance = this.getTouchDistance(e.touches);
        this.initialScale = this.scale;
      }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isPanning) {
        if (e.cancelable) e.preventDefault();
        this.pointX = e.touches[0].clientX - this.startX;
        this.pointY = e.touches[0].clientY - this.startY;
        this.updateTransform();
      } else if (e.touches.length === 2) {
        if (e.cancelable) e.preventDefault();
        const currentDistance = this.getTouchDistance(e.touches);
        if (this.pinchStartDistance > 0) {
          const factor = currentDistance / this.pinchStartDistance;
          this.scale = Math.min(Math.max(this.initialScale * factor, this.minScale), this.maxScale);
          this.updateTransform();
        }
      }
    }, { passive: false });
  }

  getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  updateTransform() {
    this.contentEl.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
    if (this.zoomLevelEl) {
      this.zoomLevelEl.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.3, this.maxScale);
    this.updateTransform();
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.3, this.minScale);
    this.updateTransform();
  }

  resetZoom() {
    this.scale = 1;
    this.pointX = 0;
    this.pointY = 0;
    this.updateTransform();
  }

  isOpen() {
    return !this.modalEl.classList.contains('hidden');
  }

  open(mapId) {
    const map = window.MAPS_DATABASE.find(m => m.id === mapId);
    if (!map) return;

    this.currentMap = map;
    this.resetZoom();

    // Atualiza cabeçalho
    this.modalEl.querySelector('#viewerMapTitle').textContent = map.title;
    this.modalEl.querySelector('#viewerSubtitle').textContent = map.subtitle || '';
    this.modalEl.querySelector('#viewerFilePath').textContent = map.image || map.pdf || '';

    const cat = window.MAPS_CATEGORIES.find(c => c.id === map.category);
    this.modalEl.querySelector('#viewerCategoryBadge').textContent = cat ? cat.name : map.category.toUpperCase();

    // Renderiza a imagem PNG no visualizador
    this.renderMapImage(map);

    // Atualiza status de botões
    this.updateModalButtonsState();

    // Abre o modal
    this.modalEl.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Auto-esconde a dica após 3.5s
    const hint = this.modalEl.querySelector('#viewerHint');
    if (hint) {
      hint.style.opacity = '1';
      setTimeout(() => { hint.style.opacity = '0'; }, 3500);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.modalEl.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  toggleCompleted() {
    if (!this.currentMap) return;
    const isCompleted = window.FarmacoStorage.toggleMapCompleted(this.currentMap.id);
    this.updateModalButtonsState();
    window.dispatchEvent(new CustomEvent('farmaco-map-status-changed', { detail: { mapId: this.currentMap.id, isCompleted } }));
  }

  toggleFavorite() {
    if (!this.currentMap) return;
    const isFav = window.FarmacoStorage.toggleMapFavorite(this.currentMap.id);
    this.updateModalButtonsState();
    window.dispatchEvent(new CustomEvent('farmaco-map-status-changed', { detail: { mapId: this.currentMap.id, isFav } }));
  }

  updateModalButtonsState() {
    if (!this.currentMap) return;
    const isCompleted = window.FarmacoStorage.isMapCompleted(this.currentMap.id);
    const isFav = window.FarmacoStorage.isMapFavorite(this.currentMap.id);

    const completedBtn = this.modalEl.querySelector('#viewerToggleCompletedBtn');
    const completedText = this.modalEl.querySelector('#viewerCompletedText');
    const favBtn = this.modalEl.querySelector('#viewerToggleFavoriteBtn');

    if (isCompleted) {
      completedBtn.className = 'flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition bg-emerald-600 hover:bg-emerald-500 text-white shadow-md';
      completedText.textContent = 'Estudado ✓';
    } else {
      completedBtn.className = 'flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition bg-slate-800 hover:bg-slate-700 text-slate-300';
      completedText.textContent = 'Marcar Estudado';
    }

    if (isFav) {
      favBtn.className = 'p-2 rounded-lg text-amber-400 bg-amber-500/20 border border-amber-500/30 transition';
    } else {
      favBtn.className = 'p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderMapImage(map) {
    const imgPath = map.image || `./assets/images/maps/${map.id}.png`;

    // Renderiza a tag de imagem com tratamento inteligente de fallback caso o arquivo ainda não tenha sido colado na pasta
    this.contentEl.innerHTML = `
      <div class="relative max-w-full max-h-full flex items-center justify-center p-2">
        <img id="viewerActiveImage" src="${imgPath}" alt="${map.title}" class="max-w-[90vw] max-h-[82vh] md:max-w-[1200px] object-contain rounded-xl shadow-2xl transition-opacity duration-300" 
          onload="this.classList.remove('opacity-0'); document.getElementById('viewerImgFallback')?.classList.add('hidden');"
          onerror="this.classList.add('hidden'); document.getElementById('viewerImgFallback')?.classList.remove('hidden');"
        />

        <!-- Card de Fallback Elegante se o arquivo PNG ainda não estiver presente na pasta -->
        <div id="viewerImgFallback" class="hidden p-8 md:p-12 max-w-xl text-center bg-slate-900 border-2 border-dashed border-teal-500/40 rounded-2xl shadow-2xl text-slate-200">
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <i data-lucide="image" class="w-7 h-7"></i>
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 block">${map.category.toUpperCase()}</span>
          <h3 class="text-xl font-extrabold text-white mb-2">${map.title}</h3>
          <p class="text-xs text-slate-400 mb-6 leading-relaxed">${map.subtitle || 'Bloco de leitura do mapa mental preparado.'}</p>
          
          <div class="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 text-left mb-6 break-all">
            <span class="text-slate-500 block text-[10px] uppercase font-sans font-bold mb-1">Caminho do arquivo esperado:</span>
            📁 ${imgPath}
          </div>

          <!-- Botão para testar com qualquer PNG local se o usuário quiser -->
          <label class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer transition shadow-md">
            <i data-lucide="upload" class="w-4 h-4"></i>
            <span>Carregar PNG local deste mapa</span>
            <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" onchange="
              const file = this.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const img = document.getElementById('viewerActiveImage');
                  img.src = e.target.result;
                  img.classList.remove('hidden');
                  document.getElementById('viewerImgFallback').classList.add('hidden');
                };
                reader.readAsDataURL(file);
              }
            ">
          </label>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  downloadFile() {
    if (!this.currentMap) return;
    const map = this.currentMap;
    const filePath = map.pdf || map.image;

    // Dispara o download direto do arquivo
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop() || `${map.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Instância global
window.FarmacoViewer = new MapViewerEngine();
