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
import { GameSession, PlayerFeedback, RankingItem } from '../types/trivia';

// Inicializar Firebase de forma segura evitando reinicializaciones
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Configurar Firestore considerando la base de datos especificada
export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const LOCAL_STORAGE_SESSIONS_KEY = 'unrinconpy_local_sessions';
const LOCAL_STORAGE_FEEDBACK_KEY = 'unrinconpy_local_feedback';

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
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(list.slice(0, 50)));
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
 * Fase 2 Preparación: Actualiza la tabla global_ranking en Firestore
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
      avatar: session.avatar || prev.avatar || 'tereré',
      highestScore: newHighest,
      gamesPlayed: newPlayed,
      accuracy: newAccuracy,
      lastPlayed: new Date().toISOString()
    }, { merge: true });
  } else {
    await setDoc(rankRef, {
      nickname: session.nickname,
      avatar: session.avatar || 'tereré',
      highestScore: session.score,
      gamesPlayed: 1,
      accuracy: session.accuracy,
      lastPlayed: new Date().toISOString()
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
 * Fase 2: Obtiene el Ranking Global actual
 */
export async function fetchGlobalRanking(topCount: number = 20): Promise<RankingItem[]> {
  try {
    const rankQuery = query(collection(db, 'global_ranking'), orderBy('highestScore', 'desc'), limit(topCount));
    const snap = await getDocs(rankQuery);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as RankingItem));
  } catch (error) {
    console.warn('Error al obtener ranking global de Firestore:', error);
    return [];
  }
}
