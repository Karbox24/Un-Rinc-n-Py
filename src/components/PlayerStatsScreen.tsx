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
    <div className="w-full max-w-[540px] mx-auto flex flex-col gap-4 py-2">
      {/* Tarjeta de Perfil & Rango Cultural con Borde Bandera Paraguaya */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#FFFBF5] border border-[#FFB347]/40 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
              {avatarObj?.icon || '🧉'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575]">
                  Estadísticas del Jugador
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-[#8B1A1A] mt-0.5">
                {activeNick}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  {rank.title}
                </span>
                <span className="text-xs text-[#9E9E9E]">•</span>
                <span className="text-xs text-[#757575]">{rank.subtitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onGoHome}
              className="h-9 px-3 rounded-[10px] bg-[#FFFBF5] hover:bg-[#FFF0DB]/60 text-[#1A1A1A] border border-[#EADCCF] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Inicio
            </button>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="h-9 px-3 rounded-[10px] bg-white hover:bg-[#FFFBF5] text-[#1A1A1A] border border-[#EADCCF] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-[#757575] text-xs flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#1A3A5F]" />
          Cargando estadísticas históricas...
        </div>
      ) : !stats || stats.totalGames === 0 ? (
        <div className="bg-white border border-[#EADCCF] rounded-[16px] p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFFBF5] border border-[#FFB347]/40 flex items-center justify-center text-3xl mb-3 shadow-2xs">
            🧉
          </div>
          <h2 className="text-base font-bold text-[#8B1A1A] mb-1">
            Sin Partidas Registradas Aún
          </h2>
          <p className="text-xs text-[#757575] max-w-sm mx-auto mb-6">
            Aún no has jugado partidas con el apodo "{activeNick}". ¡Completá tu primera partida para acumular aciertos, efectividad y tu récord personal!
          </p>
          <button
            onClick={onStartGame}
            className="w-full h-[56px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white text-[18px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-white" /> Jugar Mi Primera Partida
          </button>
        </div>
      ) : (
        <>
          {/* Métricas Principales en Grid (4 Tarjetas) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Récord Personal */}
            <div className="bg-white border border-[#EADCCF] rounded-[16px] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575] block mb-1">
                Récord Personal
              </span>
              <span className="text-2xl font-bold text-[#8B1A1A] block">
                {stats.highestScore} <span className="text-xs font-normal text-[#757575]">pts</span>
              </span>
              <span className="text-[11px] text-[#9E9E9E] block mt-0.5">Mejor Puntuación</span>
            </div>

            {/* Partidas Jugadas */}
            <div className="bg-white border border-[#EADCCF] rounded-[16px] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575] block mb-1">
                Partidas
              </span>
              <span className="text-2xl font-bold text-[#1A3A5F] block">
                {stats.totalGames}
              </span>
              <span className="text-[11px] text-[#9E9E9E] block mt-0.5">Completadas</span>
            </div>

            {/* Porcentaje de Aciertos */}
            <div className="bg-white border border-[#EADCCF] rounded-[16px] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575] block mb-1">
                Efectividad
              </span>
              <span className="text-2xl font-bold text-emerald-700 block">
                {stats.overallAccuracy}%
              </span>
              <span className="text-[11px] text-[#9E9E9E] block mt-0.5">Promedio de Aciertos</span>
            </div>

            {/* Total Aciertos vs Errores */}
            <div className="bg-white border border-[#EADCCF] rounded-[16px] p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575] block mb-1">
                Respuestas
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-emerald-700">
                  {stats.totalCorrect}
                </span>
                <span className="text-xs text-[#9E9E9E]">/</span>
                <span className="text-sm font-semibold text-rose-700">
                  {stats.totalIncorrect} err.
                </span>
              </div>
              <span className="text-[11px] text-[#9E9E9E] block mt-0.5">
                {stats.totalQuestionsAnswered} respondidas
              </span>
            </div>
          </div>

          {/* Desglose por Categoría Cultural Guaraní (si existen partidas) */}
          {stats.categoryPerformance && Object.keys(stats.categoryPerformance).length > 0 && (
            <div className="bg-white border border-[#EADCCF] rounded-[16px] p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#757575] mb-3">
                Rendimiento por Categoría
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      className="p-3 rounded-[12px] bg-[#FFFBF5] border border-[#EADCCF] flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5 truncate">
                          <span>{meta.icon}</span> {meta.name}
                        </span>
                        <span className="text-xs font-bold text-[#8B1A1A]">
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full bg-[#EADCCF] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1A3A5F] h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <span className="text-[10px] text-[#757575]">
                        {data.correct} correctas de {data.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historial de Partidas Recientes */}
          <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#FFFBF5] border-b border-[#EADCCF] flex items-center justify-between text-xs font-semibold text-[#757575]">
              <span>Historial Reciente</span>
              <span>{stats.recentGames.length} registros</span>
            </div>

            <div className="divide-y divide-[#EADCCF] max-h-60 overflow-y-auto">
              {stats.recentGames.map((game, idx) => {
                const gameAccuracy = Math.round((game.correctCount / game.totalQuestions) * 100);
                return (
                  <div
                    key={idx}
                    className="px-4 py-3 flex items-center justify-between text-xs hover:bg-[#FFFBF5] transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-[#1A1A1A] block">
                        Partida #{stats.recentGames.length - idx}
                      </span>
                      <span className="text-[11px] text-[#757575]">
                        {formatDate(game.date)} · {formatSeconds(game.durationSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#757575] hidden sm:inline">
                        {game.correctCount}/{game.totalQuestions} ({gameAccuracy}%)
                      </span>
                      <span className="font-bold text-[#8B1A1A]">
                        {game.score} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones de Navegación Rápida */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={onStartGame}
              className="w-full h-[56px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white text-[18px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Play className="w-5 h-5 fill-white" />
              Jugar Nueva Partida
            </button>

            <button
              onClick={onOpenRanking}
              className="w-full h-[48px] rounded-[12px] bg-white border border-[#EADCCF] hover:bg-[#FFFBF5] text-[#1A1A1A] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#8B1A1A]" />
              Ver Mi Puesto en el Ranking
            </button>
          </div>
        </>
      )}
    </div>
  );
};
