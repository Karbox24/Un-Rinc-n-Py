import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Play, 
  RefreshCw, 
  Calendar,
  Sparkles,
  Flame,
  ArrowLeft,
  User,
  PieChart
} from 'lucide-react';
import { fetchPlayerStats } from '../lib/firebase';
import { PlayerStats } from '../types/trivia';
import { getGuaraniHonorificRank, formatSeconds, formatDate, AVATAR_OPTIONS } from '../lib/utils';

interface PlayerStatsScreenProps {
  nickname: string;
  avatar: string;
  onGoHome: () => void;
  onStartGame: () => void;
  onOpenRanking: () => void;
}

export const PlayerStatsScreen: React.FC<PlayerStatsScreenProps> = ({
  nickname,
  avatar,
  onGoHome,
  onStartGame,
  onOpenRanking,
}) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeNick = nickname.trim() || 'Jugador Guaraní';

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPlayerStats(activeNick);
      setStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas del jugador:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [activeNick]);

  const avatarObj = AVATAR_OPTIONS.find((a) => a.id === (stats?.avatar || avatar));
  const rank = getGuaraniHonorificRank(stats?.overallAccuracy || 0);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 py-2">
      {/* Tarjeta de Perfil & Rango Cultural */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-800/90 border-2 border-blue-500/40 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
              {avatarObj?.icon || '🧉'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-800">
                  Perfil de Jugador
                </span>
                <span className="text-xs text-slate-400">Fase 2</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
                {activeNick}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs sm:text-sm font-bold ${rank.textColor}`}>
                  {rank.icon} {rank.title}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 hidden sm:inline">{rank.badge}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onGoHome}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Inicio
            </button>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Recargar</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          Calculando tus estadísticas históricas en Firebase...
        </div>
      ) : !stats || stats.totalGames === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-3xl mb-3">
            🧉
          </div>
          <h2 className="text-lg font-extrabold text-white mb-1">
            Sin Partidas Registradas Aún
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Aún no has jugado partidas con el apodo "{activeNick}". ¡Completá tu primera partida para acumular aciertos, porcentaje y tu récord personal!
          </p>
          <button
            onClick={onStartGame}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Jugar Mi Primera Partida
          </button>
        </div>
      ) : (
        <>
          {/* Métricas Principales en Grid (4 Tarjetas) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Récord Personal */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Récord Personal
                </span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.highestScore}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Mejor Puntuación</span>
            </div>

            {/* Partidas Jugadas */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Partidas
                </span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalGames}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Partidas Completas</span>
            </div>

            {/* Porcentaje de Aciertos */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Efectividad
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.overallAccuracy}%
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Promedio de Aciertos</span>
            </div>

            {/* Total Aciertos vs Errores */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Respuestas
                </span>
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {stats.totalCorrect}
                </span>
                <span className="text-xs text-slate-500 font-bold">/</span>
                <span className="text-sm font-bold text-rose-400">
                  {stats.totalIncorrect} err.
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                {stats.totalQuestionsAnswered} respondidas
              </span>
            </div>
          </div>

          {/* Desglose por Categoría Cultural Guaraní (si existen partidas) */}
          {stats.categoryPerformance && Object.keys(stats.categoryPerformance).length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <PieChart className="w-4 h-4 text-amber-400" />
                Rendimiento por Categoría Cultural
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(stats.categoryPerformance).map(([cat, rawData]) => {
                  const data = rawData as { correct: number; total: number };
                  const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                  const catLabels: Record<string, { name: string; icon: string }> = {
                    mitologia: { name: 'Mitos Guaraníes', icon: '👹' },
                    gastronomia: { name: 'Gastronomía Típica', icon: '🍲' },
                    tradiciones: { name: 'Costumbres & Tereré', icon: '🧉' },
                    idioma_guarani: { name: 'Idioma Guaraní', icon: '📜' },
                    historia: { name: 'Historia & Héroes', icon: '🏛️' },
                    geografia: { name: 'Geografía & Cerros', icon: '🗺️' },
                  };
                  const meta = catLabels[cat] || { name: cat, icon: '🇵🇾' };

                  return (
                    <div
                      key={cat}
                      className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 truncate">
                          <span>{meta.icon}</span> {meta.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-600 via-amber-400 to-blue-600 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {data.correct} correctas de {data.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historial de Partidas Recientes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" /> Historial de Partidas Recientes
              </span>
              <span>{stats.recentGames.length} registros</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {stats.recentGames.map((game, idx) => {
                const gameAccuracy = Math.round((game.correctCount / game.totalQuestions) * 100);
                return (
                  <div
                    key={idx}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/30 text-xs transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        Partida #{stats.recentGames.length - idx}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDate(game.date)} • {formatSeconds(game.durationSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-300 font-semibold hidden sm:inline">
                        {game.correctCount}/{game.totalQuestions} ({gameAccuracy}%)
                      </span>
                      <span className="font-black text-amber-400 text-sm">
                        {game.score} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones de Navegación Rápida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onStartGame}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-extrabold text-sm tracking-wide shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Jugar Nueva Partida
            </button>

            <button
              onClick={onOpenRanking}
              className="py-3.5 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Ver Mi Puesto en el Ranking
            </button>
          </div>
        </>
      )}
    </div>
  );
};
