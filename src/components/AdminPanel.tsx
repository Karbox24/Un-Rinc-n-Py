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
import { formatSeconds } from '../lib/utils';

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

      const rankList = await fetchGlobalRanking(20);
      setRankings(rankList);
    } catch (err) {
      console.error('Error cargando datos de administración:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Pantalla de Bloqueo / Autenticación de Administrador
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 max-w-sm mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center mb-3 border border-red-500/20">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Panel Privado de Administración
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Acceso reservado para el administrador de "Un Rincón Py" para visualizar estadísticas de partidas y comentarios.
        </p>

        <form onSubmit={handleLogin} className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <div className="text-left">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Contraseña de Administrador
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Ingresá la clave de acceso..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              💡 Clave por defecto para pruebas: <strong>adminpy</strong>
            </span>
          </div>

          {authError && (
            <p className="text-xs text-rose-500 font-semibold">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Unlock className="w-4 h-4" />
            Ingresar al Panel
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la Trivia
        </button>
      </div>
    );
  }

  // Dashboard de Administración Desbloqueado
  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Barra de Título del Panel */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h1 className="text-base font-extrabold">Panel Administrador</h1>
            <span className="text-[10px] bg-red-600/30 text-red-400 border border-red-500/30 px-2 py-0.2 rounded-full font-bold">
              Privado
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Métricas de uso y comentarios en Firebase Firestore
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={loadData}
            title="Refrescar datos"
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </div>

      {/* Grid de Métricas Generales */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Partidas
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {totalSessions}
          </div>
          <span className="text-[10px] text-emerald-500 flex items-center justify-center gap-0.5 mt-0.5 font-semibold">
            <TrendingUp className="w-3 h-3" /> Jugadas
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Puntaje Prom.
          </span>
          <div className="text-xl font-black text-amber-500 mt-0.5">
            {averageScore}
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
            puntos
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Aciertos Prom.
          </span>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
            {averageAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
            precisión
          </span>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
          Comentarios ({feedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'sessions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-500" />
          Partidas ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ranking'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          Fase 2: Ranking
        </button>
      </div>

      {/* Contenido de Pestaña: Comentarios */}
      {activeTab === 'feedback' && (
        <div className="flex flex-col gap-2.5">
          {feedbacks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No hay comentarios registrados todavía. Cuando los jugadores completen una partida y dejen su opinión, aparecerán aquí.
            </div>
          ) : (
            feedbacks.map((fb, idx) => (
              <div
                key={fb.id || idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {fb.nickname}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      • Puntaje: {fb.score} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= fb.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  "{fb.comment}"
                </p>
                <span className="text-[10px] text-slate-400 self-end">
                  {new Date(fb.createdAt).toLocaleString('es-PY', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contenido de Pestaña: Sesiones de Juego */}
      {activeTab === 'sessions' && (
        <div className="flex flex-col gap-2">
          {sessions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No hay partidas registradas aún.
            </div>
          ) : (
            sessions.map((s, idx) => (
              <div
                key={s.id || idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-sm">
                    {s.avatar === 'terere' ? '🧉' : '👤'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {s.nickname}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {s.correctCount}/{s.totalQuestions} aciertos • {formatSeconds(s.durationSeconds)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-amber-500 text-sm">
                    {s.score} pts
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {s.accuracy}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contenido de Pestaña: Fase 2 - Ranking Global */}
      {activeTab === 'ranking' && (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Estructura Preparada para Fase 2
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              La base de datos Firestore ya consolida en tiempo real la colección <code className="font-bold bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">global_ranking</code> con los máximos puntajes y cantidad de partidas por jugador. En la Fase 2, esta tabla será accesible públicamente para todos los usuarios con ligas y medallas.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {rankings.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                El ranking se irá poblando a medida que se jueguen partidas.
              </div>
            ) : (
              rankings.map((rank, idx) => (
                <div
                  key={rank.id || idx}
                  className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {rank.nickname}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rank.gamesPlayed} partidas • {rank.accuracy}% acierto
                      </div>
                    </div>
                  </div>

                  <div className="font-black text-amber-500 text-sm">
                    {rank.highestScore} pts
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
