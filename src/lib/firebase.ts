import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GameSession, PlayerFeedback, RankingItem, PlayerStats } from '../types/trivia';

// Inicializar Firebase de forma segura evitando reinicializaciones
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Configurar Firestore considerando la base de datos especificada
export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const LOCAL_STORAGE_SESSIONS_KEY = 'unrinconpy_local_sessions';
const LOCAL_STORAGE_FEEDBACK_KEY = 'unrinconpy_local_feedback';
const LOCAL_STORAGE_RECORD_PREFIX = 'unrinconpy_record_';

/**
 * Guarda una sesión de juego completada en Firestore
 * Cuenta con respaldo en localStorage para modo offline (APK)
 */
export async function recordGameSession(sessionData: Omit<GameSession, 'id'>): Promise<string> {
  const localBackup = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const backupItem = { ...sessionData, id: 'local_' + Date.now() };
      list.unshift(backupItem);
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(list.slice(0, 100)));
      
      // Actualizar récord local
      const safeId = sessionData.nickname.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      const prevRecord = parseInt(localStorage.getItem(LOCAL_STORAGE_RECORD_PREFIX + safeId) || '0', 10);
      if (sessionData.score > prevRecord) {
        localStorage.setItem(LOCAL_STORAGE_RECORD_PREFIX + safeId, sessionData.score.toString());
      }
      return backupItem.id;
    } catch {
      return 'offline_' + Date.now();
    }
  };

  try {
    const docRef = await addDoc(collection(db, 'game_sessions'), {
      ...sessionData,
      createdAtServer: serverTimestamp(),
    });

    // Guardar también en localStorage para consulta inmediata
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({ ...sessionData, id: docRef.id });
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(list.slice(0, 100)));

      const safeId = sessionData.nickname.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      const prevRecord = parseInt(localStorage.getItem(LOCAL_STORAGE_RECORD_PREFIX + safeId) || '0', 10);
      if (sessionData.score > prevRecord) {
        localStorage.setItem(LOCAL_STORAGE_RECORD_PREFIX + safeId, sessionData.score.toString());
      }
    } catch {}

    // Actualizar o preparar ranking global para Fase 2
    try {
      await updateGlobalRankingSummary(sessionData);
    } catch (e) {
      console.warn('Ranking auto-update non-blocking warning:', e);
    }

    return docRef.id;
  } catch (error) {
    console.warn('Firestore offline o no disponible, respaldando localmente:', error);
    return localBackup();
  }
}

/**
 * Guarda la retroalimentación de comentarios del jugador para el administrador
 */
export async function submitFeedback(feedbackData: Omit<PlayerFeedback, 'id'>): Promise<string> {
  const localBackup = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FEEDBACK_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const backupItem = { ...feedbackData, id: 'local_fb_' + Date.now() };
      list.unshift(backupItem);
      localStorage.setItem(LOCAL_STORAGE_FEEDBACK_KEY, JSON.stringify(list.slice(0, 50)));
      return backupItem.id;
    } catch {
      return 'offline_fb_' + Date.now();
    }
  };

  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAtServer: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Error guardando feedback en Firestore, respaldando localmente:', error);
    return localBackup();
  }
}

/**
 * Fase 2: Actualiza la tabla global_ranking en Firestore
 */
async function updateGlobalRankingSummary(session: Omit<GameSession, 'id'>): Promise<void> {
  if (!session.nickname || session.nickname.trim().length === 0) return;
  const safeId = session.nickname.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const rankRef = doc(db, 'global_ranking', safeId);
  
  const existing = await getDoc(rankRef);
  if (existing.exists()) {
    const prev = existing.data() as RankingItem;
    const newHighest = Math.max(prev.highestScore || 0, session.score);
    const newPlayed = (prev.gamesPlayed || 0) + 1;
    const newAccuracy = Math.round(((prev.accuracy || 0) + session.accuracy) / 2);
    await setDoc(rankRef, {
      nickname: session.nickname,
      avatar: session.avatar || prev.avatar || 'terere',
      highestScore: newHighest,
      gamesPlayed: newPlayed,
      accuracy: newAccuracy,
      lastPlayed: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } else {
    await setDoc(rankRef, {
      nickname: session.nickname,
      avatar: session.avatar || 'terere',
      highestScore: session.score,
      gamesPlayed: 1,
      accuracy: session.accuracy,
      lastPlayed: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

/**
 * Obtiene métricas generales y sesiones para el panel del administrador
 */
export async function fetchAdminMetrics(): Promise<{
  totalSessions: number;
  averageScore: number;
  averageAccuracy: number;
  sessions: GameSession[];
  feedbacks: PlayerFeedback[];
}> {
  let sessions: GameSession[] = [];
  let feedbacks: PlayerFeedback[] = [];

  try {
    const sessionQuery = query(collection(db, 'game_sessions'), orderBy('completedAt', 'desc'), limit(50));
    const sessionSnap = await getDocs(sessionQuery);
    sessions = sessionSnap.docs.map(d => ({ id: d.id, ...d.data() } as GameSession));
  } catch (err) {
    console.warn('Fallo al obtener sesiones de Firestore, cargando fallback local:', err);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      if (stored) sessions = JSON.parse(stored);
    } catch {}
  }

  try {
    const feedbackQuery = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(50));
    const feedbackSnap = await getDocs(feedbackQuery);
    feedbacks = feedbackSnap.docs.map(d => ({ id: d.id, ...d.data() } as PlayerFeedback));
  } catch (err) {
    console.warn('Fallo al obtener feedback de Firestore, cargando fallback local:', err);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FEEDBACK_KEY);
      if (stored) feedbacks = JSON.parse(stored);
    } catch {}
  }

  const totalSessions = sessions.length;
  const averageScore = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / totalSessions) 
    : 0;
  const averageAccuracy = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / totalSessions)
    : 0;

  return {
    totalSessions,
    averageScore,
    averageAccuracy,
    sessions,
    feedbacks,
  };
}

/**
 * Fase 2: Obtiene el Ranking Global actual con orden consistente
 */
export async function fetchGlobalRanking(topCount: number = 25): Promise<RankingItem[]> {
  try {
    const rankQuery = query(collection(db, 'global_ranking'), orderBy('highestScore', 'desc'), limit(topCount));
    const snap = await getDocs(rankQuery);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as RankingItem));

    // Regla consistente para desempate:
    // 1) highestScore descendente
    // 2) accuracy descendente
    // 3) lastPlayed más reciente
    return items.sort((a, b) => {
      if (b.highestScore !== a.highestScore) {
        return b.highestScore - a.highestScore;
      }
      if ((b.accuracy || 0) !== (a.accuracy || 0)) {
        return (b.accuracy || 0) - (a.accuracy || 0);
      }
      return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime();
    });
  } catch (error) {
    console.warn('Error al obtener ranking global de Firestore, calculando desde historial local:', error);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      if (!stored) return [];
      const sessions: GameSession[] = JSON.parse(stored);
      const map = new Map<string, RankingItem>();
      sessions.forEach(s => {
        const key = s.nickname.trim().toLowerCase();
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            nickname: s.nickname,
            avatar: s.avatar || 'terere',
            highestScore: s.score,
            gamesPlayed: 1,
            accuracy: s.accuracy,
            lastPlayed: s.completedAt
          });
        } else {
          existing.highestScore = Math.max(existing.highestScore, s.score);
          existing.gamesPlayed += 1;
          existing.accuracy = Math.round((existing.accuracy + s.accuracy) / 2);
          if (new Date(s.completedAt) > new Date(existing.lastPlayed)) {
            existing.lastPlayed = s.completedAt;
          }
        }
      });
      return Array.from(map.values())
        .sort((a, b) => b.highestScore - a.highestScore)
        .slice(0, topCount);
    } catch {
      return [];
    }
  }
}

/**
 * Fase 2: Obtiene el récord personal de un jugador
 */
export async function getPlayerRecord(nickname: string): Promise<number> {
  const cleanNick = nickname.trim();
  if (!cleanNick) return 0;
  const safeId = cleanNick.toLowerCase().replace(/[^a-z0-9]/g, '_');

  // Chequeo rápido local
  const localRecord = parseInt(localStorage.getItem(LOCAL_STORAGE_RECORD_PREFIX + safeId) || '0', 10);

  try {
    const rankRef = doc(db, 'global_ranking', safeId);
    const snap = await getDoc(rankRef);
    if (snap.exists()) {
      const data = snap.data() as RankingItem;
      const remoteRecord = data.highestScore || 0;
      return Math.max(localRecord, remoteRecord);
    }
  } catch (e) {
    console.warn('Error consultando record remoto:', e);
  }

  return localRecord;
}

/**
 * Fase 2: Obtiene las estadísticas completas de un jugador
 */
export async function fetchPlayerStats(nickname: string): Promise<PlayerStats> {
  const cleanNick = nickname.trim();
  const safeId = cleanNick.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const storedAvatar = localStorage.getItem('unrinconpy_avatar') || 'terere';

  // Obtener sesiones locales y remotas
  let matchingSessions: GameSession[] = [];

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
    if (stored) {
      const allLocal: GameSession[] = JSON.parse(stored);
      matchingSessions = allLocal.filter(s => s.nickname.toLowerCase() === cleanNick.toLowerCase());
    }
  } catch {}

  // Consultar también en global_ranking
  let rankingInfo: RankingItem | null = null;
  try {
    const rankRef = doc(db, 'global_ranking', safeId);
    const snap = await getDoc(rankRef);
    if (snap.exists()) {
      rankingInfo = snap.data() as RankingItem;
    }
  } catch (err) {
    console.warn('No se pudo obtener ranking doc para estadísticas:', err);
  }

  // Calcular agregados
  const totalGames = Math.max(matchingSessions.length, rankingInfo?.gamesPlayed || 0);
  const highestScore = Math.max(
    rankingInfo?.highestScore || 0,
    parseInt(localStorage.getItem(LOCAL_STORAGE_RECORD_PREFIX + safeId) || '0', 10),
    ...matchingSessions.map(s => s.score)
  );

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalTime = 0;
  const categoryPerformance: Record<string, { correct: number; total: number }> = {};

  matchingSessions.forEach(s => {
    totalCorrect += (s.correctCount || 0);
    totalIncorrect += (s.incorrectCount || 0);
    totalTime += (s.durationSeconds || 0);

    if (s.categoryBreakdown) {
      Object.entries(s.categoryBreakdown).forEach(([cat, data]) => {
        if (!categoryPerformance[cat]) {
          categoryPerformance[cat] = { correct: 0, total: 0 };
        }
        categoryPerformance[cat].correct += data.correct;
        categoryPerformance[cat].total += data.total;
      });
    }
  });

  const totalQuestionsAnswered = totalCorrect + totalIncorrect;
  const overallAccuracy = totalQuestionsAnswered > 0
    ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
    : (rankingInfo?.accuracy || 0);

  const averageTimeSeconds = matchingSessions.length > 0
    ? Math.round(totalTime / matchingSessions.length)
    : 0;

  const recentGames = matchingSessions.slice(0, 10).map(s => ({
    date: s.completedAt,
    score: s.score,
    correctCount: s.correctCount,
    totalQuestions: s.totalQuestions,
    durationSeconds: s.durationSeconds
  }));

  return {
    nickname: cleanNick || 'Jugador Guaraní',
    avatar: rankingInfo?.avatar || storedAvatar,
    highestScore: Math.max(0, highestScore),
    totalGames,
    totalCorrect,
    totalIncorrect,
    totalQuestionsAnswered,
    overallAccuracy,
    averageTimeSeconds,
    categoryPerformance,
    recentGames
  };
}
