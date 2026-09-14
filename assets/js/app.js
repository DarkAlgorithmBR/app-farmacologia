/**
 * Farmacologia Conectada - Main Application Controller
 * Gerencia navegação SPA, renderização dinâmica, busca global (Ctrl+K), Quiz, Dicionário e PWA
 */

class FarmacoApp {
  constructor() {
    this.currentTab = 'maps';
    this.selectedMapCategory = 'all';
    this.mapFilterStatus = 'all'; // 'all', 'favorites', 'completed', 'pending'
    this.mapSearchQuery = '';

    this.dictionarySearchQuery = '';
    this.dictionaryCategoryFilter = 'all';

    // Estado do Quiz
    this.quizFilterCategory = 'all';
    this.quizQuestionsList = [];
    this.quizCurrentIndex = 0;
    this.quizSelectedAnswer = null;
    this.quizIsAnswered = false;

    // Estado dos Flashcards
    this.flashcardsList = [];
    this.flashcardCurrentIndex = 0;
    this.isFlashcardFlipped = false;

    // PWA Prompt
    this.deferredPrompt = null;

    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.setupPWA();
    this.setupSearchModal();
    this.setupCalculator();
    this.setupHorizontalScrollers();

    // Rota inicial pela URL hash se existir
    const hash = window.location.hash.replace('#', '');
    if (['maps', 'bonus', 'dictionary', 'quiz', 'calculator', 'dashboard'].includes(hash)) {
      this.switchTab(hash);
    } else {
      this.switchTab('maps');
    }

    this.updateStatsDisplay();

    // Listener para atualizações de storage
    window.addEventListener('farmaco-storage-updated', () => {
      this.updateStatsDisplay();
      if (this.currentTab === 'maps') this.renderMapsList();
      if (this.currentTab === 'dictionary') this.renderDictionaryList();
    });

    window.addEventListener('farmaco-map-status-changed', () => {
      this.updateStatsDisplay();
      this.renderMapsList();
    });
  }

  // ==========================================
  // ROLAGEM HORIZONTAL INTELIGENTE (WHEEL + DRAG + CHEVRONS)
  // ==========================================
  setupHorizontalScrollers() {
    this.enableDragAndWheelScroll('mapCategoriesPills', 'mapCatScrollLeft', 'mapCatScrollRight');
    this.enableDragAndWheelScroll('dictionaryCategoryFilters', 'dictCatScrollLeft', 'dictCatScrollRight');
    this.enableDragAndWheelScroll('quizCategoryPills', 'quizCatScrollLeft', 'quizCatScrollRight');
  }

  enableDragAndWheelScroll(containerId, leftBtnId, rightBtnId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!container.dataset.scrollInitialized) {
      container.dataset.scrollInitialized = 'true';

      // 1. Rolar horizontalmente ao usar a roda do mouse (Wheel)
      container.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      }, { passive: false });

      // 2. Clicar e arrastar com o mouse (Drag to scroll)
      let isDown = false;
      let startX = 0;
      let scrollStart = 0;

      container.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollStart = container.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        isDown = false;
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollStart - walk;
      });
    }

    // 3. Botões Laterais (< e >)
    const leftBtn = document.getElementById(leftBtnId);
    const rightBtn = document.getElementById(rightBtnId);

    if (leftBtn && !leftBtn.dataset.btnBound) {
      leftBtn.dataset.btnBound = 'true';
      leftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.scrollBy({ left: -260, behavior: 'smooth' });
      });
    }

    if (rightBtn && !rightBtn.dataset.btnBound) {
      rightBtn.dataset.btnBound = 'true';
      rightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // NAVEGAÇÃO SPA & ABAS
  // ==========================================
  switchTab(tabId) {
    this.currentTab = tabId;
    window.location.hash = tabId;

    // Atualiza classes dos botões na sidebar (Desktop)
    document.querySelectorAll('aside [data-nav-tab]').forEach(btn => {
      const target = btn.getAttribute('data-nav-tab');
      if (target === tabId) {
        btn.classList.add('bg-teal-600', 'text-white', 'shadow-md', 'shadow-teal-900/20');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100', 'hover:text-slate-900');
      } else {
        btn.classList.remove('bg-teal-600', 'text-white', 'shadow-md', 'shadow-teal-900/20');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100', 'hover:text-slate-900');
      }
    });

    // Atualiza classes dos botões no rodapé fixo (Mobile)
    document.querySelectorAll('#bottomNav [data-nav-tab]').forEach(btn => {
      const target = btn.getAttribute('data-nav-tab');
      if (target === tabId) {
        btn.className = 'flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-teal-600 font-bold bg-teal-50 transition text-[10px]';
      } else {
        btn.className = 'flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-600 font-semibold transition text-[10px]';
      }
    });

    // Esconde todas as seções e exibe a selecionada
    document.querySelectorAll('.app-tab-section').forEach(section => {
      section.classList.add('hidden');
    });

    const activeSection = document.getElementById(`tab-${tabId}`);
    if (activeSection) {
      activeSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Inicialização específica da aba
    if (tabId === 'maps') {
      this.renderMapCategoriesPills();
      this.renderMapsList();
    } else if (tabId === 'bonus') {
      this.renderBonusCards();
    } else if (tabId === 'dictionary') {
      this.renderDictionaryCategories();
      this.renderDictionaryList();
    } else if (tabId === 'quiz') {
      this.initQuiz();
      this.initFlashcards();
    } else if (tabId === 'dashboard') {
      this.renderDashboard();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  bindGlobalEvents() {
    // Bloqueio rigoroso de zoom nativo da página inteira no celular (Safari/Chrome Mobile)
    document.addEventListener('gesturestart', (e) => {
      if (!e.target.closest('#viewerContainer')) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('gesturechange', (e) => {
      if (!e.target.closest('#viewerContainer')) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('gestureend', (e) => {
      if (!e.target.closest('#viewerContainer')) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 1 && !e.target.closest('#viewerContainer')) {
        e.preventDefault();
      }
    }, { passive: false });

    let lastTouchTime = 0;
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('#viewerContainer') || e.target.closest('input, textarea, select, button, a')) {
        return;
      }
      const now = Date.now();
      if (now - lastTouchTime <= 300) {
        e.preventDefault();
      }
      lastTouchTime = now;
    }, { passive: false });

    // Cliques nos links de navegação
    document.querySelectorAll('[data-nav-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-nav-tab');
        this.switchTab(tab);
      });
    });

    // Busca de Mapas
    const mapSearchInput = document.getElementById('mapSearchInput');
    if (mapSearchInput) {
      mapSearchInput.addEventListener('input', (e) => {
        this.mapSearchQuery = e.target.value.toLowerCase().trim();
        this.renderMapsList();
      });
    }

    // Filtro de Status dos Mapas
    document.querySelectorAll('[data-map-status-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-map-status-filter]').forEach(b => {
          b.classList.remove('bg-teal-600', 'text-white');
          b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-50');
        });
        btn.classList.add('bg-teal-600', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-50');
        this.mapFilterStatus = btn.getAttribute('data-map-status-filter');
        this.renderMapsList();
      });
    });

    // Busca no Dicionário
    const dictSearchInput = document.getElementById('dictionarySearchInput');
    if (dictSearchInput) {
      dictSearchInput.addEventListener('input', (e) => {
        this.dictionarySearchQuery = e.target.value.toLowerCase().trim();
        this.renderDictionaryList();
      });
    }
  }

  // ==========================================
  // 1. BIBLIOTECA DE MAPAS MENTAIS
  // ==========================================
  renderMapCategoriesPills() {
    const container = document.getElementById('mapCategoriesPills');
    if (!container) return;

    let html = `
      <button data-map-cat="all" class="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${this.selectedMapCategory === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
        Todos os Módulos (${window.MAPS_DATABASE.length})
      </button>
    `;

    window.MAPS_CATEGORIES.forEach(cat => {
      const count = window.MAPS_DATABASE.filter(m => m.category === cat.id).length;
      const isSelected = this.selectedMapCategory === cat.id;
      html += `
        <button data-map-cat="${cat.id}" class="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${isSelected ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
          ${cat.name} (${count})
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-map-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedMapCategory = btn.getAttribute('data-map-cat');
        this.renderMapCategoriesPills();
        this.renderMapsList();
        const activeBtn = container.querySelector(`[data-map-cat="${this.selectedMapCategory}"]`);
        if (activeBtn) {
          activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    this.setupHorizontalScrollers();
  }

  renderMapsList() {
    const container = document.getElementById('mapsGridContainer');
    const emptyState = document.getElementById('mapsEmptyState');
    if (!container) return;

    let filtered = window.MAPS_DATABASE;

    // Filtro por Categoria
    if (this.selectedMapCategory !== 'all') {
      filtered = filtered.filter(m => m.category === this.selectedMapCategory);
    }

    // Filtro por Status
    if (this.mapFilterStatus === 'favorites') {
      filtered = filtered.filter(m => window.FarmacoStorage.isMapFavorite(m.id));
    } else if (this.mapFilterStatus === 'completed') {
      filtered = filtered.filter(m => window.FarmacoStorage.isMapCompleted(m.id));
    } else if (this.mapFilterStatus === 'pending') {
      filtered = filtered.filter(m => !window.FarmacoStorage.isMapCompleted(m.id));
    }

    // Filtro por Busca de Texto
    if (this.mapSearchQuery) {
      filtered = filtered.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(this.mapSearchQuery);
        const subMatch = m.subtitle.toLowerCase().includes(this.mapSearchQuery);
        const tagMatch = (m.tags || []).some(t => t.toLowerCase().includes(this.mapSearchQuery));
        const highYieldMatch = (m.highYield || '').toLowerCase().includes(this.mapSearchQuery);
        return titleMatch || subMatch || tagMatch || highYieldMatch;
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    let html = '';
    filtered.forEach(map => {
      const cat = window.MAPS_CATEGORIES.find(c => c.id === map.category) || {};
      const isFav = window.FarmacoStorage.isMapFavorite(map.id);
      const isCompleted = window.FarmacoStorage.isMapCompleted(map.id);

      const tagsHTML = (map.tags || []).slice(0, 3).map(t => `
        <span class="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">#${t}</span>
      `).join('');

      html += `
        <div class="bg-white rounded-2xl border ${isCompleted ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'} p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <!-- Top row: Badge da categoria & Botão Favoritar -->
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat.badgeColor || 'bg-slate-100 text-slate-800'}">
                ${cat.name || map.category}
              </span>
              <div class="flex items-center space-x-1">
                ${isCompleted ? `
                  <span class="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Estudado</span>
                  </span>
                ` : ''}
                <button data-fav-map-id="${map.id}" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition" title="Favoritar">
                  <i data-lucide="star" class="w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}"></i>
                </button>
              </div>
            </div>

            <!-- Thumbnail da Imagem PNG Original -->
            <div data-open-map-id="${map.id}" class="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 mb-3 cursor-pointer group-hover:ring-2 group-hover:ring-teal-500/80 transition flex items-center justify-center shadow-inner">
              <img src="${map.image}" alt="${map.title}" class="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <span class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/90 text-[11px] font-bold text-teal-300 border border-slate-700/80 flex items-center space-x-1 shadow-sm backdrop-blur-xs">
                <i data-lucide="zoom-in" class="w-3.5 h-3.5 text-teal-400"></i>
                <span>Ver HD</span>
              </span>
            </div>

            <!-- Título e Subtítulo -->
            <h3 class="text-sm md:text-base font-bold text-slate-900 leading-snug mb-1 group-hover:text-teal-600 transition">
              ${map.title}
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed line-clamp-1 mb-3">
              ${map.subtitle}
            </p>
          </div>

          <!-- Bottom Row: Tags & Ações -->
          <div>
            <div class="flex flex-wrap gap-1 mb-3">
              ${tagsHTML}
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button data-open-map-id="${map.id}" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-3 rounded-xl text-xs md:text-sm transition flex items-center justify-center space-x-1.5 shadow-sm shadow-teal-700/20">
                <i data-lucide="eye" class="w-4 h-4"></i>
                <span>Abrir Mapa</span>
              </button>
              
              <button data-toggle-complete-id="${map.id}" class="p-2 rounded-xl border ${isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'} transition" title="${isCompleted ? 'Desmarcar como Estudado' : 'Marcar como Estudado'}">
                <i data-lucide="${isCompleted ? 'check-circle-2' : 'circle'}" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Vincula eventos dos botões dos cards
    container.querySelectorAll('[data-open-map-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-map-id');
        window.FarmacoViewer.open(id);
      });
    });

    container.querySelectorAll('[data-fav-map-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-fav-map-id');
        window.FarmacoStorage.toggleMapFavorite(id);
        this.renderMapsList();
        this.updateStatsDisplay();
      });
    });

    container.querySelectorAll('[data-toggle-complete-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-toggle-complete-id');
        const completed = window.FarmacoStorage.toggleMapCompleted(id);
        this.showToast(completed ? 'Mapa marcado como concluído! 🎉' : 'Status do mapa atualizado.');
        this.renderMapsList();
        this.updateStatsDisplay();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 2. SUPER BÔNUS EXCLUSIVOS
  // ==========================================
  renderBonusCards() {
    const container = document.getElementById('bonusGridContainer');
    if (!container) return;

    let html = '';
    window.BONUS_DATA.forEach(bonus => {
      html += `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <i data-lucide="${bonus.icon || 'file-text'}" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs font-bold text-teal-700 uppercase tracking-wider">${bonus.badge}</span>
                <h3 class="text-lg font-extrabold text-slate-900 leading-snug">${bonus.title}</h3>
              </div>
            </div>
            
            <p class="text-sm font-semibold text-slate-700 mb-2">${bonus.subtitle}</p>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">${bonus.summary}</p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
            <button data-open-bonus-id="${bonus.id}" class="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs md:text-sm transition flex items-center justify-center space-x-2">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>Abrir Leitor de PDF</span>
            </button>
            <button data-download-bonus-id="${bonus.id}" class="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition flex items-center space-x-1 text-xs font-semibold" title="Baixar Arquivo PDF">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span class="hidden sm:inline">Baixar</span>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-open-bonus-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-bonus-id');
        this.openBonusModal(id);
      });
    });

    container.querySelectorAll('[data-download-bonus-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-bonus-id');
        const bonus = window.BONUS_DATA.find(b => b.id === id);
        if (bonus && bonus.pdf) {
          const link = document.createElement('a');
          link.href = bonus.pdf;
          link.download = bonus.pdf.split('/').pop();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  openBonusModal(bonusId) {
    const bonus = window.BONUS_DATA.find(b => b.id === bonusId);
    if (!bonus) return;

    const pdfPath = bonus.pdf || `./assets/pdfs/${bonus.id}.pdf`;

    let contentHTML = `
      <div class="flex flex-col h-full space-y-4">
        <!-- Barra de Informações do Arquivo -->
        <div class="flex flex-wrap items-center justify-between p-3.5 bg-slate-100 rounded-xl text-xs text-slate-700 gap-2">
          <div class="flex items-center space-x-2">
            <i data-lucide="file-text" class="w-4 h-4 text-teal-700"></i>
            <span class="font-mono text-slate-800 font-semibold">${pdfPath}</span>
          </div>
          <div class="flex items-center space-x-2">
            <a href="${pdfPath}" target="_blank" class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold flex items-center space-x-1 transition">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              <span>Abrir em Nova Aba</span>
            </a>
            <a href="${pdfPath}" download="${pdfPath.split('/').pop()}" class="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold flex items-center space-x-1 transition shadow-sm">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        <!-- Leitor de PDF Embutido (iframe / embed com suporte total a navegadores modernos) -->
        <div class="relative flex-1 w-full min-h-[550px] bg-slate-950 rounded-xl overflow-hidden border border-slate-200">
          <iframe id="bonusPdfIframe" src="${pdfPath}#toolbar=1&navpanes=1" class="w-full h-full min-h-[550px] rounded-xl" frameborder="0">
            <p class="p-6 text-center text-slate-400 text-xs">Seu navegador não suporta visualização de PDF embutida. <a href="${pdfPath}" class="text-teal-400 underline font-bold">Clique aqui para baixar o PDF</a>.</p>
          </iframe>
        </div>
      </div>
    `;

    // Modal de exibição do bônus
    let modal = document.getElementById('bonusViewerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bonusViewerModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4';
      modal.innerHTML = `
        <div class="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
            <div>
              <span id="bonusModalBadge" class="text-xs font-bold text-teal-700 uppercase tracking-wider">Super Bônus</span>
              <h3 id="bonusModalTitle" class="text-base md:text-lg font-bold text-slate-900">Título</h3>
            </div>
            <button id="closeBonusModalBtn" class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition">
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
          </div>
          <div id="bonusModalBody" class="p-4 md:p-6 overflow-y-auto flex-1 text-slate-800 flex flex-col">
            <!-- Conteúdo injetado -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#closeBonusModalBtn').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    }

    modal.querySelector('#bonusModalBadge').textContent = bonus.badge;
    modal.querySelector('#bonusModalTitle').textContent = bonus.title;
    modal.querySelector('#bonusModalBody').innerHTML = contentHTML;
    if (window.lucide) window.lucide.createIcons();
  }

  printBonus(bonusId) {
    this.openBonusModal(bonusId);
    setTimeout(() => {
      window.print();
    }, 400);
  }

  // ==========================================
  // 3. GUIA RÁPIDO & DICIONÁRIO DE FÁRMACOS
  // ==========================================
  renderDictionaryCategories() {
    const container = document.getElementById('dictionaryCategoryFilters');
    if (!container) return;

    const systems = ['all', 'Cardiovascular', 'Antimicrobianos', 'Anti-inflamatórios e Dor', 'SNC', 'Endócrino e Metabólico', 'Sangue, Pulmão e TGI'];

    let html = '';
    systems.forEach(sys => {
      const isSelected = this.dictionaryCategoryFilter === sys;
      const label = sys === 'all' ? 'Todos os Sistemas' : sys;
      html += `
        <button data-dict-filter="${sys}" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${isSelected ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
          ${label}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-dict-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.dictionaryCategoryFilter = btn.getAttribute('data-dict-filter');
        this.renderDictionaryCategories();
        this.renderDictionaryList();
        const activeBtn = container.querySelector(`[data-dict-filter="${this.dictionaryCategoryFilter}"]`);
        if (activeBtn) {
          activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    this.setupHorizontalScrollers();
  }

  renderDictionaryList() {
    const container = document.getElementById('dictionaryListContainer');
    const emptyState = document.getElementById('dictionaryEmptyState');
    if (!container) return;

    let filtered = window.DRUGS_DICTIONARY;

    if (this.dictionaryCategoryFilter !== 'all') {
      filtered = filtered.filter(d => d.system.includes(this.dictionaryCategoryFilter));
    }

    if (this.dictionarySearchQuery) {
      filtered = filtered.filter(d => {
        const nameMatch = d.name.toLowerCase().includes(this.dictionarySearchQuery);
        const tradeMatch = (d.tradeNames || '').toLowerCase().includes(this.dictionarySearchQuery);
        const classMatch = d.class.toLowerCase().includes(this.dictionarySearchQuery);
        const indMatch = d.indications.toLowerCase().includes(this.dictionarySearchQuery);
        const mechMatch = d.mechanism.toLowerCase().includes(this.dictionarySearchQuery);
        return nameMatch || tradeMatch || classMatch || indMatch || mechMatch;
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    let html = '';
    filtered.forEach(drug => {
      const isFav = window.FarmacoStorage.isDrugFavorite(drug.id);

      html += `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition">
          <!-- Header do Fármaco -->
          <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                  ${drug.class}
                </span>
                <span class="text-xs text-slate-400">• ${drug.system}</span>
              </div>
              <h3 class="text-lg md:text-xl font-bold text-slate-900">${drug.name}</h3>
              <p class="text-xs text-slate-500">Nomes comerciais: <span class="font-medium text-slate-700">${drug.tradeNames}</span></p>
            </div>

            <div class="flex items-center space-x-2 self-end md:self-auto">
              <button data-copy-drug-id="${drug.id}" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition" title="Copiar Resumo">
                <i data-lucide="copy" class="w-4 h-4"></i>
              </button>
              <button data-fav-drug-id="${drug.id}" class="p-2 rounded-xl border border-slate-200 bg-white hover:text-amber-500 hover:bg-amber-50 text-slate-400 transition" title="Favoritar Fármaco">
                <i data-lucide="star" class="w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}"></i>
              </button>
            </div>
          </div>

          <!-- Detalhes Farmacológicos em Grid -->
          <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <!-- Mecanismo de Ação -->
            <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span class="font-bold text-slate-900 flex items-center gap-1 mb-1 text-xs uppercase tracking-wide">
                <i data-lucide="cog" class="w-3.5 h-3.5 text-teal-600"></i>
                Mecanismo de Ação
              </span>
              <p class="text-slate-700 leading-relaxed">${drug.mechanism}</p>
            </div>

            <!-- Principais Indicações -->
            <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span class="font-bold text-slate-900 flex items-center gap-1 mb-1 text-xs uppercase tracking-wide">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
                Principais Indicações
              </span>
              <p class="text-slate-700 leading-relaxed">${drug.indications}</p>
            </div>

            <!-- Efeitos Adversos Críticos -->
            <div class="bg-rose-50/70 rounded-xl p-3.5 border border-rose-200/70">
              <span class="font-bold text-rose-900 flex items-center gap-1 mb-1 text-xs uppercase tracking-wide">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-600"></i>
                Efeitos Adversos Críticos & Cuidados
              </span>
              <p class="text-rose-800 leading-relaxed">${drug.adverseEffects}</p>
            </div>

            <!-- Dica de Prova (High Yield) -->
            <div class="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/70">
              <span class="font-bold text-amber-900 flex items-center gap-1 mb-1 text-xs uppercase tracking-wide">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-600"></i>
                Dica de Prova & Prática Clínica
              </span>
              <p class="text-amber-900 font-medium leading-relaxed">${drug.examTip}</p>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Ações dos botões
    container.querySelectorAll('[data-fav-drug-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-fav-drug-id');
        window.FarmacoStorage.toggleDrugFavorite(id);
        this.renderDictionaryList();
        this.updateStatsDisplay();
      });
    });

    container.querySelectorAll('[data-copy-drug-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-copy-drug-id');
        const drug = window.DRUGS_DICTIONARY.find(d => d.id === id);
        if (drug) {
          const text = `💊 ${drug.name} (${drug.tradeNames})\nClasse: ${drug.class}\nMecanismo: ${drug.mechanism}\nIndicações: ${drug.indications}\nEfeitos Adversos: ${drug.adverseEffects}\nDica: ${drug.examTip}`;
          navigator.clipboard.writeText(text).then(() => {
            this.showToast(`Resumo de ${drug.name} copiado com sucesso! 📋`);
          });
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 4. QUIZ DE FIXAÇÃO & FLASHCARDS
  // ==========================================
  initQuiz() {
    this.quizQuestionsList = [...window.QUIZ_QUESTIONS];
    this.quizCurrentIndex = 0;
    this.quizSelectedAnswer = null;
    this.quizIsAnswered = false;

    // Filtros de Categoria do Quiz
    const catContainer = document.getElementById('quizCategoryPills');
    if (catContainer) {
      let catHTML = `
        <button data-quiz-cat="all" class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${this.quizFilterCategory === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'}">
          Todas as Questões (${window.QUIZ_QUESTIONS.length})
        </button>
      `;
      window.MAPS_CATEGORIES.forEach(c => {
        const count = window.QUIZ_QUESTIONS.filter(q => q.category === c.id).length;
        if (count > 0) {
          catHTML += `
            <button data-quiz-cat="${c.id}" class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${this.quizFilterCategory === c.id ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'}">
              ${c.name} (${count})
            </button>
          `;
        }
      });
      catContainer.innerHTML = catHTML;

      catContainer.querySelectorAll('[data-quiz-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.quizFilterCategory = btn.getAttribute('data-quiz-cat');
          this.initQuiz();
          const activeBtn = catContainer.querySelector(`[data-quiz-cat="${this.quizFilterCategory}"]`);
          if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
      });

      this.setupHorizontalScrollers();
    }

    if (this.quizFilterCategory !== 'all') {
      this.quizQuestionsList = window.QUIZ_QUESTIONS.filter(q => q.category === this.quizFilterCategory);
    }

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const card = document.getElementById('quizCardContainer');
    const resultBox = document.getElementById('quizResultBox');
    if (!card) return;

    if (resultBox) resultBox.classList.add('hidden');

    if (this.quizQuestionsList.length === 0) {
      card.innerHTML = `<p class="text-center text-slate-500 py-8">Nenhuma questão encontrada para esta categoria.</p>`;
      return;
    }

    const q = this.quizQuestionsList[this.quizCurrentIndex];
    const total = this.quizQuestionsList.length;

    let optionsHTML = '';
    q.options.forEach(opt => {
      let btnClass = 'bg-white border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-slate-800';

      if (this.quizIsAnswered) {
        if (opt.id === q.correctAnswer) {
          btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-400';
        } else if (opt.id === this.quizSelectedAnswer && opt.id !== q.correctAnswer) {
          btnClass = 'bg-rose-50 border-rose-500 text-rose-900 font-semibold ring-2 ring-rose-400';
        } else {
          btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
        }
      }

      optionsHTML += `
        <button data-quiz-opt="${opt.id}" class="w-full text-left p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${btnClass}" ${this.quizIsAnswered ? 'disabled' : ''}>
          <span class="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 font-bold flex items-center justify-center text-xs text-slate-700 shrink-0">
            ${opt.id}
          </span>
          <span class="text-xs md:text-sm font-medium leading-relaxed">${opt.text}</span>
        </button>
      `;
    });

    card.innerHTML = `
      <div class="mb-4 flex items-center justify-between">
        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wider">${q.categoryName}</span>
        <span class="text-xs font-semibold text-slate-500">Questão ${this.quizCurrentIndex + 1} de ${total}</span>
      </div>

      <!-- Barra de Progresso da Sessão -->
      <div class="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
        <div class="bg-teal-600 h-1.5 rounded-full transition-all duration-300" style="width: ${((this.quizCurrentIndex + 1) / total) * 100}%"></div>
      </div>

      <h3 class="text-base md:text-lg font-bold text-slate-900 mb-6 leading-relaxed">
        ${q.question}
      </h3>

      <div class="space-y-3 mb-6">
        ${optionsHTML}
      </div>
    `;

    // Vincula clique nas opções
    card.querySelectorAll('[data-quiz-opt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const optId = btn.getAttribute('data-quiz-opt');
        this.handleQuizAnswer(optId, q);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  handleQuizAnswer(selectedId, question) {
    this.quizSelectedAnswer = selectedId;
    this.quizIsAnswered = true;

    const isCorrect = selectedId === question.correctAnswer;
    window.FarmacoStorage.recordQuizAnswer(question.category, isCorrect, question.id);

    this.renderQuizQuestion();

    // Renderiza caixa de feedback explicativo
    const resultBox = document.getElementById('quizResultBox');
    if (resultBox) {
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="p-5 rounded-2xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'} shadow-sm animate-slide-down">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="p-1.5 rounded-full ${isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}">
                <i data-lucide="${isCorrect ? 'check' : 'x'}" class="w-5 h-5"></i>
              </span>
              <h4 class="text-base font-extrabold">${isCorrect ? 'Excelente! Resposta Correta 🎉' : 'Resposta Incorreta! Vamos revisar 💡'}</h4>
            </div>
          </div>

          <p class="text-xs md:text-sm leading-relaxed mb-4 font-normal">${question.explanation}</p>

          ${question.highYieldNote ? `
            <div class="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <i data-lucide="zap" class="w-4 h-4 text-amber-500 shrink-0"></i>
              <span>High-Yield: ${question.highYieldNote}</span>
            </div>
          ` : ''}

          <div class="flex items-center justify-end">
            <button id="nextQuizQuestionBtn" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs md:text-sm transition flex items-center space-x-2 shadow-sm">
              <span>${this.quizCurrentIndex + 1 >= this.quizQuestionsList.length ? 'Concluir Simulado' : 'Próxima Questão'}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;

      resultBox.querySelector('#nextQuizQuestionBtn').addEventListener('click', () => {
        if (this.quizCurrentIndex + 1 < this.quizQuestionsList.length) {
          this.quizCurrentIndex++;
          this.quizSelectedAnswer = null;
          this.quizIsAnswered = false;
          this.renderQuizQuestion();
        } else {
          this.showToast('Simulado concluído com sucesso! 🏆');
          this.quizCurrentIndex = 0;
          this.quizSelectedAnswer = null;
          this.quizIsAnswered = false;
          this.renderQuizQuestion();
        }
      });

      if (window.lucide) window.lucide.createIcons();
    }
  }

  // FLASHCARDS 3D
  initFlashcards() {
    this.flashcardsList = [...window.FLASHCARDS_DATABASE];
    this.flashcardCurrentIndex = 0;
    this.isFlashcardFlipped = false;

    this.renderFlashcard();

    const cardEl = document.getElementById('flashcardElement');
    if (cardEl) {
      cardEl.addEventListener('click', () => {
        this.isFlashcardFlipped = !this.isFlashcardFlipped;
        cardEl.classList.toggle('flashcard-flipped', this.isFlashcardFlipped);
      });
    }

    const prevBtn = document.getElementById('flashcardPrevBtn');
    const nextBtn = document.getElementById('flashcardNextBtn');
    const masterBtn = document.getElementById('flashcardMasterBtn');

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.flashcardCurrentIndex > 0) {
          this.flashcardCurrentIndex--;
          this.isFlashcardFlipped = false;
          this.renderFlashcard();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.flashcardCurrentIndex < this.flashcardsList.length - 1) {
          this.flashcardCurrentIndex++;
          this.isFlashcardFlipped = false;
          this.renderFlashcard();
        }
      };
    }

    if (masterBtn) {
      masterBtn.onclick = () => {
        const card = this.flashcardsList[this.flashcardCurrentIndex];
        const mastered = window.FarmacoStorage.toggleFlashcardMastered(card.id);
        this.showToast(mastered ? 'Flashcard marcado como dominado! 🧠' : 'Flashcard para revisão.');
        this.renderFlashcard();
        this.updateStatsDisplay();
      };
    }
  }

  renderFlashcard() {
    const cardEl = document.getElementById('flashcardElement');
    const counterEl = document.getElementById('flashcardCounter');
    const masterBtn = document.getElementById('flashcardMasterBtn');
    if (!cardEl) return;

    const fc = this.flashcardsList[this.flashcardCurrentIndex];
    const total = this.flashcardsList.length;
    const isMastered = window.FarmacoStorage.isFlashcardMastered(fc.id);

    if (counterEl) counterEl.textContent = `Card ${this.flashcardCurrentIndex + 1} de ${total}`;

    cardEl.classList.toggle('flashcard-flipped', this.isFlashcardFlipped);

    cardEl.innerHTML = `
      <div class="flashcard-inner relative w-full h-full cursor-pointer">
        <!-- Frente -->
        <div class="flashcard-front bg-white p-6 md:p-8 border-2 border-slate-200 shadow-lg rounded-2xl flex flex-col justify-between select-none">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">${fc.categoryName}</span>
            <span class="text-xs text-slate-400 flex items-center gap-1">
              <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
              Clique para virar
            </span>
          </div>
          <div class="my-auto py-6">
            <h4 class="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">${fc.front}</h4>
          </div>
          <div class="text-xs text-slate-400 font-medium">
            💡 Desafie sua memória antes de virar a resposta
          </div>
        </div>

        <!-- Verso -->
        <div class="flashcard-back bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8 text-white border-2 border-slate-800 shadow-xl rounded-2xl flex flex-col justify-between select-none">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">Resposta Farmacológica</span>
            <span class="text-xs text-slate-400 flex items-center gap-1">
              <i data-lucide="check" class="w-3.5 h-3.5 text-teal-400"></i>
              Resposta
            </span>
          </div>
          <div class="my-auto py-4">
            <p class="text-sm md:text-base font-semibold leading-relaxed text-slate-100">${fc.back}</p>
            ${fc.tip ? `
              <div class="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium text-left">
                ⚡ <strong>Dica Mnemônica:</strong> ${fc.tip}
              </div>
            ` : ''}
          </div>
          <div class="text-xs text-slate-400">
            Clique no card para voltar à pergunta
          </div>
        </div>
      </div>
    `;

    if (masterBtn) {
      if (isMastered) {
        masterBtn.className = 'px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-600 text-white transition flex items-center space-x-1.5 shadow-sm';
        masterBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i><span>Dominado ✓</span>`;
      } else {
        masterBtn.className = 'px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center space-x-1.5';
        masterBtn.innerHTML = `<i data-lucide="brain" class="w-4 h-4"></i><span>Marcar como Dominado</span>`;
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // 5. CALCULADORA FARMACOMÉTRICA
  // ==========================================
  setupCalculator() {
    // 1. Gotejamento
    const btnGotejamento = document.getElementById('calcGotejamentoBtn');
    if (btnGotejamento) {
      btnGotejamento.addEventListener('click', () => {
        try {
          const vol = document.getElementById('gotVolInput').value;
          const time = document.getElementById('gotTimeInput').value;
          const unit = document.getElementById('gotUnitSelect').value;
          const res = window.FarmacoCalculator.calcGotejamento({ volumeMl: vol, timeValue: time, timeUnit: unit });

          const outBox = document.getElementById('gotResultBox');
          outBox.classList.remove('hidden');
          outBox.innerHTML = `
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs md:text-sm">
              <h5 class="font-bold text-teal-950 mb-2">Resultado da Infusão:</h5>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 bg-white rounded-lg border border-teal-100">
                  <span class="text-xs text-slate-500 block">Gotas / min</span>
                  <span class="text-lg font-bold text-teal-700">${res.gotasPorMinInt}</span>
                </div>
                <div class="p-2 bg-white rounded-lg border border-teal-100">
                  <span class="text-xs text-slate-500 block">Microgotas / min</span>
                  <span class="text-lg font-bold text-teal-700">${res.microgotasPorMinInt}</span>
                </div>
                <div class="p-2 bg-white rounded-lg border border-teal-100">
                  <span class="text-xs text-slate-500 block">Vazão (mL/h)</span>
                  <span class="text-lg font-bold text-teal-700">${res.mlPorHora}</span>
                </div>
              </div>
            </div>
          `;
        } catch (err) {
          alert(err.message);
        }
      });
    }

    // 2. Regra de Três / Diluição
    const btnDiluicao = document.getElementById('calcDiluicaoBtn');
    if (btnDiluicao) {
      btnDiluicao.addEventListener('click', () => {
        try {
          const ampMg = document.getElementById('dilAmpMg').value;
          const ampMl = document.getElementById('dilAmpMl').value;
          const prescrito = document.getElementById('dilPrescritoMg').value;
          const res = window.FarmacoCalculator.calcDiluicao({ ampolaMg: ampMg, ampolaMl: ampMl, prescritoMg: prescrito });

          const outBox = document.getElementById('dilResultBox');
          outBox.classList.remove('hidden');
          outBox.innerHTML = `
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs md:text-sm">
              <h5 class="font-bold text-teal-950 mb-1">Volume a Aspirar:</h5>
              <p class="text-2xl font-black text-teal-700 mb-2">${res.volumeAspirarMl} mL</p>
              <p class="text-xs text-slate-700">${res.explicacao}</p>
            </div>
          `;
        } catch (err) {
          alert(err.message);
        }
      });
    }

    // 3. Pediátrico / Peso
    const btnPed = document.getElementById('calcPedBtn');
    if (btnPed) {
      btnPed.addEventListener('click', () => {
        try {
          const peso = document.getElementById('pedPeso').value;
          const doseKg = document.getElementById('pedDoseKg').value;
          const freq = document.getElementById('pedFreqSelect').value;
          const sMg = document.getElementById('pedSuspMg').value;
          const sMl = document.getElementById('pedSuspMl').value;

          const res = window.FarmacoCalculator.calcPediatrico({
            pesoKg: peso,
            dosePorKg: doseKg,
            frequenciaVezesDia: freq,
            suspensaoMg: sMg,
            suspensaoMl: sMl
          });

          const outBox = document.getElementById('pedResultBox');
          outBox.classList.remove('hidden');
          outBox.innerHTML = `
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs md:text-sm">
              <h5 class="font-bold text-teal-950 mb-2">Posologia Calculada:</h5>
              <div class="space-y-1.5 text-xs text-slate-800">
                <p>• <strong>Dose Total / Dia:</strong> <span class="font-bold text-teal-700">${res.doseTotalDiaMg} mg</span></p>
                <p>• <strong>Dose por Tomada:</strong> <span class="font-bold text-teal-700">${res.dosePorTomadaMg} mg</span> (${res.intervaloTexto})</p>
                ${res.mlPorTomada ? `
                  <p class="mt-2 text-sm font-bold text-teal-900 bg-white p-2 rounded-lg border border-teal-200">
                    💉 Administrar: ${res.mlPorTomada} mL por tomada (${res.intervaloTexto})
                  </p>
                ` : ''}
              </div>
            </div>
          `;
        } catch (err) {
          alert(err.message);
        }
      });
    }

    // 4. Vasoativas Presets
    document.querySelectorAll('[data-vaso-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const drug = btn.getAttribute('data-vaso-preset');
        if (drug === 'nora') {
          document.getElementById('vasoDrogaMg').value = 4;
          document.getElementById('vasoVolMl').value = 100;
        } else if (drug === 'dobuta') {
          document.getElementById('vasoDrogaMg').value = 250;
          document.getElementById('vasoVolMl').value = 250;
        } else if (drug === 'dopa') {
          document.getElementById('vasoDrogaMg').value = 250;
          document.getElementById('vasoVolMl').value = 250;
        } else if (drug === 'tridil') {
          document.getElementById('vasoDrogaMg').value = 50;
          document.getElementById('vasoVolMl').value = 250;
        }
      });
    });

    const btnVaso = document.getElementById('calcVasoBtn');
    if (btnVaso) {
      btnVaso.addEventListener('click', () => {
        try {
          const peso = document.getElementById('vasoPeso').value;
          const mg = document.getElementById('vasoDrogaMg').value;
          const vol = document.getElementById('vasoVolMl').value;
          const mode = document.getElementById('vasoModeSelect').value;
          const mlH = document.getElementById('vasoMlHInput').value;
          const doseMcg = document.getElementById('vasoDoseMcgInput').value;

          const res = window.FarmacoCalculator.calcVasoativa({
            pesoKg: peso,
            totalDrogaMg: mg,
            volumeSolucaoMl: vol,
            taxaMlHora: mlH,
            doseMcgKgMin: doseMcg,
            modoCalculo: mode
          });

          const outBox = document.getElementById('vasoResultBox');
          outBox.classList.remove('hidden');
          outBox.innerHTML = `
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs md:text-sm">
              <h5 class="font-bold text-teal-950 mb-2">Resultado da Infusão Contínua:</h5>
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="p-2 bg-white rounded-lg border border-teal-100">
                  <span class="text-xs text-slate-500 block">Dose (mcg/kg/min)</span>
                  <span class="text-lg font-bold text-teal-700">${res.doseMcgKgMin}</span>
                </div>
                <div class="p-2 bg-white rounded-lg border border-teal-100">
                  <span class="text-xs text-slate-500 block">Vazão da Bomba</span>
                  <span class="text-lg font-bold text-teal-700">${res.taxaMlHora} mL/h</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500 mt-2 text-center">Concentração da solução: ${res.concentracaoMcgMl} mcg/mL</p>
            </div>
          `;
        } catch (err) {
          alert(err.message);
        }
      });
    }

    // 5. Clearance de Creatinina (Cockcroft-Gault)
    const btnClCr = document.getElementById('calcClcrBtn');
    if (btnClCr) {
      btnClCr.addEventListener('click', () => {
        try {
          const idade = document.getElementById('clcrIdade').value;
          const peso = document.getElementById('clcrPeso').value;
          const cr = document.getElementById('clcrCreatinina').value;
          const sexo = document.getElementById('clcrSexo').value;

          const res = window.FarmacoCalculator.calcClearanceCreatinina({
            idadeAnos: idade,
            pesoKg: peso,
            creatininaSerica: cr,
            sexo
          });

          const outBox = document.getElementById('clcrResultBox');
          outBox.classList.remove('hidden');
          outBox.innerHTML = `
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs md:text-sm">
              <div class="flex items-center justify-between mb-2">
                <h5 class="font-bold text-teal-950">Clearance Estimado (Cockcroft-Gault):</h5>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${res.badgeColor}">${res.clcr} mL/min</span>
              </div>
              <p class="font-semibold text-slate-800 mb-1">${res.estagioDrc}</p>
              <p class="text-xs text-slate-700">${res.recomendacao}</p>
            </div>
          `;
        } catch (err) {
          alert(err.message);
        }
      });
    }
  }

  // ==========================================
  // 6. BUSCA GLOBAL (CTRL + K)
  // ==========================================
  setupSearchModal() {
    const modal = document.getElementById('globalSearchModal');
    const input = document.getElementById('globalSearchInput');
    const resultsContainer = document.getElementById('globalSearchResults');
    const openBtns = document.querySelectorAll('[data-open-global-search]');
    const closeBtn = document.getElementById('closeGlobalSearchBtn');

    if (!modal || !input) return;

    const openSearch = () => {
      modal.classList.remove('hidden');
      input.value = '';
      input.focus();
      renderResults('');
    };

    const closeSearch = () => {
      modal.classList.add('hidden');
    };

    openBtns.forEach(b => b.addEventListener('click', openSearch));
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });

    // Tecla de atalho Ctrl+K / Cmd+K e ESC
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('hidden')) {
          openSearch();
        } else {
          closeSearch();
        }
      }
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeSearch();
      }
    });

    const renderResults = (query) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = `
          <div class="p-6 text-center text-xs text-slate-400">
            Digite o nome de um medicamento, classe, mecanismo ou tema de estudo...
          </div>
        `;
        return;
      }

      // Busca em Mapas
      const matchedMaps = window.MAPS_DATABASE.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.subtitle.toLowerCase().includes(q) || 
        (m.tags || []).some(t => t.toLowerCase().includes(q))
      ).slice(0, 4);

      // Busca em Dicionário
      const matchedDrugs = window.DRUGS_DICTIONARY.filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.tradeNames || '').toLowerCase().includes(q) ||
        d.class.toLowerCase().includes(q) ||
        d.indications.toLowerCase().includes(q)
      ).slice(0, 4);

      // Busca em Bônus
      const matchedBonus = window.BONUS_DATA.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q)
      );

      let html = '';

      if (matchedMaps.length > 0) {
        html += `<div class="px-4 py-2 bg-slate-100 text-[11px] font-bold text-slate-500 uppercase">Mapas Mentais</div>`;
        matchedMaps.forEach(m => {
          html += `
            <div data-search-map-id="${m.id}" class="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-slate-100 flex items-center justify-between transition">
              <div>
                <span class="text-xs font-bold text-teal-800">${m.title}</span>
                <p class="text-xs text-slate-500 line-clamp-1">${m.subtitle}</p>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
            </div>
          `;
        });
      }

      if (matchedDrugs.length > 0) {
        html += `<div class="px-4 py-2 bg-slate-100 text-[11px] font-bold text-slate-500 uppercase">Dicionário de Fármacos</div>`;
        matchedDrugs.forEach(d => {
          html += `
            <div data-search-drug-id="${d.id}" class="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-slate-100 flex items-center justify-between transition">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-bold text-slate-900">${d.name}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800">${d.class}</span>
                </div>
                <p class="text-xs text-slate-500 line-clamp-1">${d.indications}</p>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
            </div>
          `;
        });
      }

      if (matchedBonus.length > 0) {
        html += `<div class="px-4 py-2 bg-slate-100 text-[11px] font-bold text-slate-500 uppercase">Super Bônus</div>`;
        matchedBonus.forEach(b => {
          html += `
            <div data-search-bonus-id="${b.id}" class="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-slate-100 flex items-center justify-between transition">
              <span class="text-xs font-bold text-slate-900">${b.title}</span>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
            </div>
          `;
        });
      }

      if (!html) {
        html = `<div class="p-6 text-center text-xs text-slate-400">Nenhum resultado encontrado para "<strong>${query}</strong>"</div>`;
      }

      resultsContainer.innerHTML = html;

      // Eventos de clique nos resultados
      resultsContainer.querySelectorAll('[data-search-map-id]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-search-map-id');
          closeSearch();
          this.switchTab('maps');
          window.FarmacoViewer.open(id);
        });
      });

      resultsContainer.querySelectorAll('[data-search-drug-id]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-search-drug-id');
          const drug = window.DRUGS_DICTIONARY.find(d => d.id === id);
          closeSearch();
          this.switchTab('dictionary');
          this.dictionarySearchQuery = drug ? drug.name.toLowerCase() : '';
          const searchIn = document.getElementById('dictionarySearchInput');
          if (searchIn) searchIn.value = drug ? drug.name : '';
          this.renderDictionaryList();
        });
      });

      resultsContainer.querySelectorAll('[data-search-bonus-id]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-search-bonus-id');
          closeSearch();
          this.switchTab('bonus');
          this.openBonusModal(id);
        });
      });

      if (window.lucide) window.lucide.createIcons();
    };

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });
  }

  // ==========================================
  // 7. DASHBOARD & MÉTRICAS
  // ==========================================
  renderDashboard() {
    this.updateStatsDisplay();
  }

  updateStatsDisplay() {
    const totalMaps = window.MAPS_DATABASE.length;
    const stats = window.FarmacoStorage.getOverallProgress(totalMaps);

    // Atualiza barras de progresso globais
    const progressBar = document.getElementById('globalProgressFill');
    const progressText = document.getElementById('globalProgressPercent');
    const completedCountText = document.getElementById('globalCompletedCount');

    if (progressBar) progressBar.style.width = `${stats.percentage}%`;
    if (progressText) progressText.textContent = `${stats.percentage}%`;
    if (completedCountText) completedCountText.textContent = `${stats.completedMapsCount}/${stats.totalMapsCount} Mapas`;

    // Atualiza cards de métricas do dashboard
    const dashCompletedMaps = document.getElementById('dashCompletedMaps');
    const dashFavMaps = document.getElementById('dashFavMaps');
    const dashQuizAccuracy = document.getElementById('dashQuizAccuracy');
    const dashMasteredCards = document.getElementById('dashMasteredCards');

    if (dashCompletedMaps) dashCompletedMaps.textContent = `${stats.completedMapsCount}`;
    if (dashFavMaps) dashFavMaps.textContent = `${stats.favoriteMapsCount}`;
    if (dashQuizAccuracy) dashQuizAccuracy.textContent = `${stats.quizAccuracy}%`;
    if (dashMasteredCards) dashMasteredCards.textContent = `${stats.flashcardsMasteredCount}`;
  }

  // ==========================================
  // PWA CONFIG & INSTALL PROMPT
  // ==========================================
  setupPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(reg => {
          console.log('Service Worker registrado:', reg.scope);
        }).catch(err => {
          console.warn('Falha no Service Worker:', err);
        });
      });
    }

    const installBanner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    // Se já estiver rodando em modo aplicativo nativo
    if (isStandalone) {
      if (installBtn) installBtn.classList.add('hidden');
      if (installBanner) installBanner.classList.add('hidden');
      return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (installBanner) installBanner.classList.remove('hidden');
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          const { outcome } = await this.deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            if (installBanner) installBanner.classList.add('hidden');
            installBtn.classList.add('hidden');
            this.showToast('Aplicativo instalado com sucesso! 🎉');
          }
          this.deferredPrompt = null;
        } else if (isIOS) {
          this.openIOSInstallModal();
        } else {
          this.openGenericInstallModal();
        }
      });
    }
  }

  openIOSInstallModal() {
    let modal = document.getElementById('pwaIOSInstallModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pwaIOSInstallModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-slide-down';
      modal.innerHTML = `
        <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 pb-safe">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <i data-lucide="smartphone" class="w-4 h-4"></i>
              </div>
              <h3 class="text-base font-bold text-slate-900">Instalar no iPhone / iPad</h3>
            </div>
            <button id="closeIOSModalBtn" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            Instale o <strong>Farmacologia Conectada</strong> para ter acesso em tela cheia e carregamento instantâneo offline direto na sua tela de início:
          </p>

          <div class="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
              <p>No navegador Safari, toque no ícone de <strong>Compartilhar</strong> (quadrado com seta apontando para cima) na barra inferior.</p>
            </div>
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <p>Role o menu para baixo e selecione a opção <strong>"Adicionar à Tela de Início"</strong> (ícone +).</p>
            </div>
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
              <p>Toque em <strong>"Adicionar"</strong> no canto superior direito para finalizar.</p>
            </div>
          </div>

          <button id="closeIOSModalOkBtn" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition">
            Entendi!
          </button>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#closeIOSModalBtn').addEventListener('click', closeModal);
      modal.querySelector('#closeIOSModalOkBtn').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  openGenericInstallModal() {
    let modal = document.getElementById('pwaGenericInstallModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pwaGenericInstallModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-slide-down';
      modal.innerHTML = `
        <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 pb-safe">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <i data-lucide="download" class="w-4 h-4"></i>
              </div>
              <h3 class="text-base font-bold text-slate-900">Instalar FarmacoApp</h3>
            </div>
            <button id="closeGenericModalBtn" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            Você pode instalar o app diretamente pelo seu navegador:
          </p>

          <div class="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
              <p>Abra o menu de opções do seu navegador (ícone dos <strong>três pontinhos</strong> ou ícone de instalação na barra de endereço).</p>
            </div>
            <div class="flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <p>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
            </div>
          </div>

          <button id="closeGenericModalOkBtn" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition">
            Fechar
          </button>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#closeGenericModalBtn').addEventListener('click', closeModal);
      modal.querySelector('#closeGenericModalOkBtn').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs md:text-sm font-semibold flex items-center space-x-2 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-none border border-slate-700';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <i data-lucide="check-circle" class="w-4 h-4 text-teal-400"></i>
      <span>${message}</span>
    `;

    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-10', 'opacity-0');
    }, 2800);
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FarmacoApp();
});
