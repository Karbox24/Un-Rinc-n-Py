import React, { useState, useEffect } from 'react';
import { Trophy, Award, RefreshCw, Sparkles, Flame, User, ArrowLeft, Search } from 'lucide-react';
import { fetchGlobalRanking } from '../lib/firebase';
import { RankingItem } from '../types/trivia';
import { AVATAR_OPTIONS, formatDate } from '../lib/utils';

interface RankingSectionProps {
  currentPlayerNick?: string;
  onGoHome?: () => void;
  onStartNewGame?: () => void;
}

export const RankingSection: React.FC<RankingSectionProps> = ({
  currentPlayerNick = '',
  onGoHome,
  onStartNewGame,
}) => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGlobalRanking(50);
      setRankings(data);
    } catch (err) {
      console.error('Error al cargar ranking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRankings = rankings.filter((item) =>
    item.nickname.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const topThree = rankings.slice(0, 3);
  const currentPlayerInRanking = rankings.find(
    (r) => r.nickname.toLowerCase() === currentPlayerNick.toLowerCase().trim()
  );
  const currentPlayerPosition = currentPlayerInRanking
    ? rankings.indexOf(currentPlayerInRanking) + 1
    : null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 py-2">
      {/* Encabezado Principal de la Sección */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Cuadro de Honor
              </span>
              <span className="text-xs text-slate-400">Datos en Tiempo Real</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              Ranking Global
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Las mejores puntuaciones registradas en la trivia de Un Rincón Py.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Inicio
              </button>
            )}
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Notificación de posición del jugador actual */}
        {currentPlayerNick && (
          <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-blue-400" />
              Tu apodo: <strong className="text-white">{currentPlayerNick}</strong>
            </span>
            {currentPlayerPosition ? (
              <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full font-bold">
                Posición #{currentPlayerPosition} ({currentPlayerInRanking?.highestScore} pts)
              </span>
            ) : (
              <span className="text-slate-400 italic">
                Completá una partida para ingresar al ranking
              </span>
            )}
          </div>
        )}
      </div>

      {/* Podio Visual Top 3 (si hay al menos 1 jugador registrado) */}
      {!isLoading && rankings.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
          {/* Segundo Lugar (Plata) */}
          <div className="flex flex-col items-center">
            {topThree[1] ? (
              <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-4 text-center shadow-lg relative flex flex-col items-center">
                <span className="text-2xl sm:text-3xl mb-1">
                  {AVATAR_OPTIONS.find((a) => a.id === topThree[1].avatar)?.icon || '🧉'}
                </span>
                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center -mt-2 mb-1 shadow">
                  2
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">
                  {topThree[1].nickname}
                </span>
                <span className="text-xs font-black text-slate-300 mt-1">
                  {topThree[1].highestScore} pts
                </span>
              </div>
            ) : (
              <div className="w-full h-24 border border-dashed border-slate-800 rounded-3xl flex items-center justify-center text-slate-600 text-xs">
                Vacante
              </div>
            )}
          </div>

          {/* Primer Lugar (Oro) */}
          <div className="flex flex-col items-center -mt-4">
            {topThree[0] ? (
              <div className="w-full bg-gradient-to-b from-amber-950/60 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-4 sm:p-5 text-center shadow-xl relative flex flex-col items-center">
                <div className="absolute -top-3">
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                    👑 Campeón
                  </span>
                </div>
                <span className="text-3xl sm:text-4xl my-1">
                  {AVATAR_OPTIONS.find((a) => a.id === topThree[0].avatar)?.icon || '🧉'}
                </span>
                <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center -mt-2 mb-1 shadow-md">
                  1
                </span>
                <span className="text-xs sm:text-base font-black text-amber-300 truncate max-w-full">
                  {topThree[0].nickname}
                </span>
                <span className="text-sm sm:text-base font-black text-amber-400 mt-1">
                  {topThree[0].highestScore} pts
                </span>
              </div>
            ) : null}
          </div>

          {/* Tercer Lugar (Bronce) */}
          <div className="flex flex-col items-center">
            {topThree[2] ? (
              <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-4 text-center shadow-lg relative flex flex-col items-center">
                <span className="text-2xl sm:text-3xl mb-1">
                  {AVATAR_OPTIONS.find((a) => a.id === topThree[2].avatar)?.icon || '🧉'}
                </span>
                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center -mt-2 mb-1 shadow">
                  3
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">
                  {topThree[2].nickname}
                </span>
                <span className="text-xs font-black text-amber-200 mt-1">
                  {topThree[2].highestScore} pts
                </span>
              </div>
            ) : (
              <div className="w-full h-24 border border-dashed border-slate-800 rounded-3xl flex items-center justify-center text-slate-600 text-xs">
                Vacante
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra de Búsqueda y Filtro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar jugador por apodo..."
          className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white px-2"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla y Lista de Clasificación */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Pos</span>
            <span>Jugador</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-10">
            <span className="hidden sm:inline">Partidas</span>
            <span className="hidden sm:inline">Efectividad</span>
            <span className="text-right">Puntuación</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            Cargando ranking global desde Firebase...
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-14 text-center px-4">
            <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">
              {searchQuery ? 'No se encontraron jugadores' : 'Aún no hay puntuaciones registradas'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              {searchQuery
                ? `No hay ningún jugador registrado con el apodo "${searchQuery}".`
                : '¡Sé el primero en jugar una partida para consagrar tu apodo en el cuadro de honor guaraní!'}
            </p>
            {onStartNewGame && (
              <button
                onClick={onStartNewGame}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                Comenzar Partida Ahora
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 max-h-[480px] overflow-y-auto">
            {filteredRankings.map((item, index) => {
              const isCurrent =
                currentPlayerNick &&
                item.nickname.toLowerCase() === currentPlayerNick.toLowerCase().trim();
              const avatarObj = AVATAR_OPTIONS.find((a) => a.id === item.avatar);

              let posBadgeColor = 'bg-slate-800 text-slate-400';
              if (index === 0) posBadgeColor = 'bg-amber-400 text-amber-950 font-black shadow';
              else if (index === 1) posBadgeColor = 'bg-slate-300 text-slate-900 font-black shadow';
              else if (index === 2) posBadgeColor = 'bg-amber-700 text-white font-black shadow';

              return (
                <div
                  key={item.id || item.nickname + index}
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-blue-950/40 border-l-4 border-blue-500 font-bold'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Posición, Avatar y Apodo */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${posBadgeColor}`}
                    >
                      {index + 1}
                    </span>

                    <span className="text-xl shrink-0" title={avatarObj?.label}>
                      {avatarObj?.icon || '🧉'}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[200px]">
                          {item.nickname}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-black tracking-wider shrink-0">
                            TÚ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block sm:hidden">
                        {item.gamesPlayed} partidas • {item.accuracy}% acierto
                      </span>
                    </div>
                  </div>

                  {/* Estadísticas y Puntos */}
                  <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                    <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                      {item.gamesPlayed}
                    </span>
                    <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                      {item.accuracy}%
                    </span>
                    <div className="text-right">
                      <span className="block text-sm sm:text-base font-black text-amber-400">
                        {item.highestScore} pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
