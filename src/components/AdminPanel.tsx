import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  RefreshCw, 
  MessageSquare, 
  History, 
  Trophy, 
  Star, 
  ArrowLeft,
  Users,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { fetchAdminMetrics, fetchGlobalRanking } from '../lib/firebase';
import { GameSession, PlayerFeedback, RankingItem } from '../types/trivia';
import { formatSeconds, AVATAR_OPTIONS } from '../lib/utils';

interface AdminPanelProps {
  onBack: () => void;
}

const ADMIN_DEFAULT_PASS = 'adminpy';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'feedback' | 'sessions' | 'ranking'>('feedback');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Datos del panel
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [averageAccuracy, setAverageAccuracy] = useState<number>(0);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [feedbacks, setFeedbacks] = useState<PlayerFeedback[]>([]);
  const [rankings, setRankings] = useState<RankingItem[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === ADMIN_DEFAULT_PASS || passwordInput.trim() === 'rinconpy2025') {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError(`Contraseña incorrecta. (Clave por defecto: ${ADMIN_DEFAULT_PASS})`);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const metrics = await fetchAdminMetrics();
      setTotalSessions(metrics.totalSessions);
      setAverageScore(metrics.averageScore);
      setAverageAccuracy(metrics.averageAccuracy);
      setSessions(metrics.sessions);
      setFeedbacks(metrics.feedbacks);

      const topRankings = await fetchGlobalRanking(20);
      setRankings(topRankings);
    } catch (err) {
      console.error('Error al cargar datos de administración:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Pantalla de Ingreso / Login de Administrador
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-red-950/50 border border-red-800/60 flex items-center justify-center text-red-400 mb-4 shadow-xl">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white text-center">
          Panel de Administración
        </h1>
        <p className="text-xs text-slate-400 text-center mt-1 mb-6 px-4">
          Acceso privado para consultar estadísticas de Firebase y comentarios de los jugadores.
        </p>

        <form onSubmit={handleLogin} className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Contraseña de Acceso
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Ingresá la contraseña de admin"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
            />
            {authError && (
              <p className="text-red-400 text-xs font-semibold mt-2">
                ⚠️ {authError}
              </p>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              💡 Clave de prueba para desarrollo: <code className="text-red-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">adminpy</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Unlock className="w-4 h-4" />
            Ingresar al Panel
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Trivia
        </button>
      </div>
    );
  }

  // Dashboard de Administración Desbloqueado
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 py-2">
      {/* Barra de Título del Panel */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            <h1 className="text-lg sm:text-xl font-black">Panel Administrador</h1>
            <span className="text-[10px] bg-red-600/30 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Privado
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Métricas de uso, comentarios y base de datos en Firebase Firestore
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Refrescar datos"
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>

      {/* Grid de Métricas Generales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total de Partidas
          </span>
          <div className="text-3xl font-black text-white mt-1">
            {totalSessions}
          </div>
          <span className="text-xs text-emerald-400 flex items-center justify-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Registradas
          </span>
        </div>

        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Puntaje Promedio
          </span>
          <div className="text-3xl font-black text-amber-400 mt-1">
            {averageScore}
          </div>
          <span className="text-xs text-slate-400 font-medium mt-1 block">
            puntos por partida
          </span>
        </div>

        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Precisión Promedio
          </span>
          <div className="text-3xl font-black text-blue-400 mt-1">
            {averageAccuracy}%
          </div>
          <span className="text-xs text-slate-400 font-medium mt-1 block">
            aciertos globales
          </span>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex rounded-2xl bg-slate-900 p-1.5 text-xs sm:text-sm font-bold border border-slate-800">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'feedback'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Comentarios ({feedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sessions'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          Partidas ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ranking'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          Fase 2: Ranking
        </button>
      </div>

      {/* Contenido de Pestaña: Comentarios (Grid 2 columnas en PC) */}
      {activeTab === 'feedback' && (
        <div>
          {feedbacks.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-800 text-slate-400 text-xs sm:text-sm">
              No hay comentarios registrados todavía. Cuando los jugadores completen una partida y dejen su opinión, aparecerán aquí en tiempo real.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbacks.map((fb, idx) => (
                <div
                  key={fb.id || idx}
                  className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">
                        {fb.nickname}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        • {fb.score} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= fb.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                    "{fb.comment}"
                  </p>
                  <span className="text-[11px] text-slate-500 self-end font-mono">
                    {new Date(fb.createdAt).toLocaleString('es-PY', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido de Pestaña: Sesiones de Juego */}
      {activeTab === 'sessions' && (
        <div>
          {sessions.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-800 text-slate-400 text-xs sm:text-sm">
              No hay partidas registradas aún.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sessions.map((s, idx) => {
                const avatarObj = AVATAR_OPTIONS.find((a) => a.id === s.avatar);
                return (
                  <div
                    key={s.id || idx}
                    className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                        {avatarObj?.icon || '🧉'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {s.nickname}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {s.correctCount}/{s.totalQuestions} aciertos • {formatSeconds(s.durationSeconds)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-amber-400 text-base">
                        {s.score} pts
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {s.accuracy}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contenido de Pestaña: Fase 2 - Ranking Global */}
      {activeTab === 'ranking' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl p-5 bg-amber-950/40 border border-amber-800/60 text-xs sm:text-sm text-amber-200">
            <div className="flex items-center gap-2 font-bold mb-1.5 text-base">
              <Trophy className="w-5 h-5 text-amber-400" />
              Estructura Preparada para Fase 2
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              La base de datos Firestore ya consolida en tiempo real la colección <code className="font-bold bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">global_ranking</code> con los máximos puntajes y cantidad de partidas por jugador.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between text-xs font-bold uppercase text-slate-400">
              <span>Posición / Jugador</span>
              <span>Puntaje Máximo / Partidas</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {rankings.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No hay datos en el ranking todavía. Completá una partida para inaugurar la tabla.
                </div>
              ) : (
                rankings.map((r) => {
                  const avatarObj = AVATAR_OPTIONS.find((a) => a.id === r.avatar);
                  return (
                    <div
                      key={r.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                            r.rank === 1
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : r.rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : r.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {r.rank}
                        </span>
                        <span className="text-xl">{avatarObj?.icon || '🧉'}</span>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {r.nickname}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {r.gamesPlayed} {r.gamesPlayed === 1 ? 'partida jugada' : 'partidas jugadas'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-amber-400">
                          {r.highScore} pts
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
