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
      <div className="w-full max-w-[420px] mx-auto py-8 sm:py-12 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFFBF5] border border-[#FFB347]/40 flex items-center justify-center text-[#8B1A1A] mb-4 shadow-2xs">
          <Lock className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-extrabold text-[#8B1A1A] text-center">
          Panel de Administración
        </h1>
        <p className="text-xs text-[#757575] text-center mt-1 mb-6 px-4">
          Acceso privado para consultar estadísticas de Firebase y comentarios de los jugadores.
        </p>

        <form onSubmit={handleLogin} className="w-full bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm flex flex-col">
          {/* Borde superior de 4px con colores de la bandera de Paraguay */}
          <div className="h-[4px] w-full flex">
            <div className="w-1/2 bg-[#D52B1E]" />
            <div className="w-1/2 bg-[#0038A8]" />
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#757575] mb-2">
                Contraseña de Acceso
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresá la contraseña de admin"
                autoFocus
                className="w-full h-12 px-4 rounded-[12px] border border-[#EADCCF] bg-[#FFFBF5] text-[#1A1A1A] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1A3A5F] focus:bg-white text-sm transition-colors"
              />
              {authError && (
                <p className="text-rose-600 text-xs font-medium mt-2">
                  ⚠️ {authError}
                </p>
              )}
              <p className="text-[11px] text-[#9E9E9E] mt-2">
                💡 Clave por defecto: <code className="text-[#8B1A1A] font-bold bg-[#FFF0DB] px-1.5 py-0.5 rounded">adminpy</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-[52px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Unlock className="w-4 h-4" />
              Ingresar al Panel
            </button>
          </div>
        </form>

        <button
          onClick={onBack}
          className="mt-6 text-xs text-[#757575] hover:text-[#1A3A5F] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Trivia
        </button>
      </div>
    );
  }

  // Dashboard de Administración Desbloqueado
  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col gap-4 py-2">
      {/* Barra de Título del Panel con Borde de Bandera */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8B1A1A]" />
              <h1 className="text-lg font-bold text-[#8B1A1A]">Panel Administrador</h1>
              <span className="text-[10px] bg-[#FFF0DB] text-[#8B1A1A] border border-[#FFB347]/40 px-2 py-0.5 rounded-full font-semibold">
                Privado
              </span>
            </div>
            <p className="text-xs text-[#757575] mt-0.5">
              Métricas de partidas, comentarios y base de datos en Firebase Firestore
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refrescar datos"
              disabled={isLoading}
              className="h-9 px-3 rounded-[10px] bg-white hover:bg-[#FFFBF5] text-[#1A1A1A] border border-[#EADCCF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button
              onClick={onBack}
              className="h-9 px-3 rounded-[10px] bg-[#FFFBF5] hover:bg-[#FFF0DB]/60 text-[#1A1A1A] border border-[#EADCCF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Generales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="bg-white rounded-[16px] p-4 border border-[#EADCCF] shadow-sm text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757575]">
            Total de Partidas
          </span>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {totalSessions}
          </div>
          <span className="text-xs text-emerald-700 flex items-center justify-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Sincronizadas
          </span>
        </div>

        <div className="bg-white rounded-[16px] p-4 border border-[#EADCCF] shadow-sm text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757575]">
            Puntaje Promedio
          </span>
          <div className="text-2xl font-bold text-[#8B1A1A] mt-1">
            {averageScore}
          </div>
          <span className="text-xs text-[#757575] font-normal mt-1 block">
            puntos por partida
          </span>
        </div>

        <div className="bg-white rounded-[16px] p-4 border border-[#EADCCF] shadow-sm text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#757575]">
            Precisión Promedio
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {averageAccuracy}%
          </div>
          <span className="text-xs text-[#757575] font-normal mt-1 block">
            aciertos globales
          </span>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex rounded-[12px] bg-white p-1 border border-[#EADCCF] shadow-2xs">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-2.5 rounded-[10px] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-[#1A3A5F] text-white shadow-xs'
              : 'text-[#757575] hover:text-[#1A3A5F]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Comentarios ({feedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-2.5 rounded-[10px] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-[#1A3A5F] text-white shadow-xs'
              : 'text-[#757575] hover:text-[#1A3A5F]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Partidas ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-2.5 rounded-[10px] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ranking'
              ? 'bg-[#1A3A5F] text-white shadow-xs'
              : 'text-[#757575] hover:text-[#1A3A5F]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Ranking Global ({rankings.length})
        </button>
      </div>

      {/* Contenido de Pestaña: Comentarios */}
      {activeTab === 'feedback' && (
        <div>
          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#E0E0E0] text-[#757575] text-xs">
              No hay comentarios registrados todavía. Cuando los jugadores completen una partida y dejen su opinión, aparecerán aquí en tiempo real.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedbacks.map((fb, idx) => (
                <div
                  key={fb.id || idx}
                  className="bg-white rounded-[16px] p-4 border border-[#E0E0E0] shadow-sm flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-[#1A1A1A]">
                        {fb.nickname}
                      </span>
                      <span className="text-[11px] text-[#757575]">
                        · {fb.score} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= fb.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#E0E0E0]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#424242] leading-relaxed bg-[#F8F9FA] p-3 rounded-[10px] border border-[#E0E0E0]">
                    "{fb.comment}"
                  </p>
                  <span className="text-[10px] text-[#9E9E9E] self-end">
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
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#E0E0E0] text-[#757575] text-xs">
              No hay partidas registradas aún.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sessions.map((s, idx) => {
                const avatarObj = AVATAR_OPTIONS.find((a) => a.id === s.avatar);
                return (
                  <div
                    key={s.id || idx}
                    className="bg-white rounded-[12px] p-3.5 border border-[#E0E0E0] shadow-xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0">
                        {avatarObj?.icon || '🧉'}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1A1A1A] truncate">
                          {s.nickname}
                        </div>
                        <div className="text-[11px] text-[#757575]">
                          {s.correctCount}/{s.totalQuestions} aciertos · {formatSeconds(s.durationSeconds)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-[#1A1A1A]">
                        {s.score} pts
                      </div>
                      <div className="text-[11px] text-[#757575]">
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

      {/* Contenido de Pestaña: Ranking Global */}
      {activeTab === 'ranking' && (
        <div className="bg-white rounded-[16px] border border-[#E0E0E0] overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[#F8F9FA] border-b border-[#E0E0E0] flex items-center justify-between text-xs font-semibold text-[#757575]">
            <span>Posición / Jugador</span>
            <span>Puntaje Máximo / Partidas</span>
          </div>

          <div className="divide-y divide-[#E0E0E0]">
            {rankings.length === 0 ? (
              <div className="p-8 text-center text-[#757575] text-xs">
                No hay datos en el ranking todavía.
              </div>
            ) : (
              rankings.map((r, idx) => {
                const avatarObj = AVATAR_OPTIONS.find((a) => a.id === r.avatar);
                return (
                  <div
                    key={r.id || idx}
                    className="px-4 py-3 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-[#757575]">
                        {idx + 1}
                      </span>
                      <span className="text-xl">{avatarObj?.icon || '🧉'}</span>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">
                          {r.nickname}
                        </div>
                        <div className="text-[11px] text-[#757575]">
                          {r.gamesPlayed} {r.gamesPlayed === 1 ? 'partida' : 'partidas'} · {r.accuracy}% acierto
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-[#1A1A1A]">
                        {r.highestScore} pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
