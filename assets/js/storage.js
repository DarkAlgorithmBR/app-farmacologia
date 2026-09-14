/**
 * Farmacologia Conectada - Storage & State Manager
 * Gerencia persistência local no localStorage sob a chave @farmacologia_progress
 */

const STORAGE_KEY = '@farmacologia_progress';

class StorageManager {
  constructor() {
    this.data = this.load();
  }

  // Carrega os dados ou inicializa com valores padrão
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar localStorage, inicializando padrão:', e);
    }
    return {
      completedMaps: [],      // IDs dos mapas marcados como estudados
      favoriteMaps: [],       // IDs dos mapas favoritados
      favoriteDrugs: [],      // IDs dos fármacos favoritados no dicionário
      quizStats: {
        totalAnswered: 0,
        correctAnswers: 0,
        streak: 0,
        bestStreak: 0,
        categoryScores: {},   // { [categoria]: { total: X, correct: Y } }
        history: []           // Últimas 20 tentativas
      },
      flashcardsMastered: [], // IDs dos flashcards dominados
      customNotes: {},        // { [mapId ou drugId]: 'texto da nota' }
      lastVisited: null,
      installedAt: new Date().toISOString()
    };
  }

  // Salva os dados no localStorage
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      // Dispara evento customizado para reatividade entre componentes
      window.dispatchEvent(new CustomEvent('farmaco-storage-updated', { detail: this.data }));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }

  // --- MAPAS MENTAIS ---
  isMapCompleted(mapId) {
    return this.data.completedMaps.includes(mapId);
  }

  toggleMapCompleted(mapId) {
    const idx = this.data.completedMaps.indexOf(mapId);
    if (idx > -1) {
      this.data.completedMaps.splice(idx, 1);
    } else {
      this.data.completedMaps.push(mapId);
    }
    this.save();
    return this.isMapCompleted(mapId);
  }

  isMapFavorite(mapId) {
    return this.data.favoriteMaps.includes(mapId);
  }

  toggleMapFavorite(mapId) {
    const idx = this.data.favoriteMaps.indexOf(mapId);
    if (idx > -1) {
      this.data.favoriteMaps.splice(idx, 1);
    } else {
      this.data.favoriteMaps.push(mapId);
    }
    this.save();
    return this.isMapFavorite(mapId);
  }

  // --- DICIONÁRIO DE FÁRMACOS ---
  isDrugFavorite(drugId) {
    return this.data.favoriteDrugs.includes(drugId);
  }

  toggleDrugFavorite(drugId) {
    const idx = this.data.favoriteDrugs.indexOf(drugId);
    if (idx > -1) {
      this.data.favoriteDrugs.splice(idx, 1);
    } else {
      this.data.favoriteDrugs.push(drugId);
    }
    this.save();
    return this.isDrugFavorite(drugId);
  }

  // --- QUIZ & FLASHCARDS ---
  recordQuizAnswer(category, isCorrect, questionId) {
    this.data.quizStats.totalAnswered += 1;
    if (isCorrect) {
      this.data.quizStats.correctAnswers += 1;
      this.data.quizStats.streak += 1;
      if (this.data.quizStats.streak > this.data.quizStats.bestStreak) {
        this.data.quizStats.bestStreak = this.data.quizStats.streak;
      }
    } else {
      this.data.quizStats.streak = 0;
    }

    if (!this.data.quizStats.categoryScores[category]) {
      this.data.quizStats.categoryScores[category] = { total: 0, correct: 0 };
    }
    this.data.quizStats.categoryScores[category].total += 1;
    if (isCorrect) {
      this.data.quizStats.categoryScores[category].correct += 1;
    }

    this.data.quizStats.history.unshift({
      questionId,
      category,
      isCorrect,
      timestamp: new Date().toISOString()
    });

    if (this.data.quizStats.history.length > 50) {
      this.data.quizStats.history.pop();
    }

    this.save();
  }

  isFlashcardMastered(cardId) {
    return this.data.flashcardsMastered.includes(cardId);
  }

  toggleFlashcardMastered(cardId) {
    const idx = this.data.flashcardsMastered.indexOf(cardId);
    if (idx > -1) {
      this.data.flashcardsMastered.splice(idx, 1);
    } else {
      this.data.flashcardsMastered.push(cardId);
    }
    this.save();
    return this.isFlashcardMastered(cardId);
  }

  // --- ANOTAÇÕES ---
  getNote(itemId) {
    return this.data.customNotes[itemId] || '';
  }

  setNote(itemId, noteText) {
    if (!noteText || noteText.trim() === '') {
      delete this.data.customNotes[itemId];
    } else {
      this.data.customNotes[itemId] = noteText.trim();
    }
    this.save();
  }

  // --- ESTATÍSTICAS GERAIS ---
  getOverallProgress(totalMapsCount) {
    const completedCount = this.data.completedMaps.length;
    const percentage = totalMapsCount > 0 ? Math.round((completedCount / totalMapsCount) * 100) : 0;
    const accuracy = this.data.quizStats.totalAnswered > 0 
      ? Math.round((this.data.quizStats.correctAnswers / this.data.quizStats.totalAnswered) * 100) 
      : 0;

    return {
      completedMapsCount: completedCount,
      totalMapsCount,
      percentage,
      favoriteMapsCount: this.data.favoriteMaps.length,
      favoriteDrugsCount: this.data.favoriteDrugs.length,
      quizTotalAnswered: this.data.quizStats.totalAnswered,
      quizAccuracy: accuracy,
      quizStreak: this.data.quizStats.streak,
      quizBestStreak: this.data.quizStats.bestStreak,
      flashcardsMasteredCount: this.data.flashcardsMastered.length
    };
  }

  // Reset de progresso se o usuário desejar
  resetProgress() {
    this.data = {
      completedMaps: [],
      favoriteMaps: [],
      favoriteDrugs: [],
      quizStats: {
        totalAnswered: 0,
        correctAnswers: 0,
        streak: 0,
        bestStreak: 0,
        categoryScores: {},
        history: []
      },
      flashcardsMastered: [],
      customNotes: {},
      lastVisited: null,
      installedAt: new Date().toISOString()
    };
    this.save();
  }
}

// Instância global para uso em toda a aplicação
window.FarmacoStorage = new StorageManager();
