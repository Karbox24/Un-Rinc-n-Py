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
    <div className="w-full max-w-[540px] mx-auto flex flex-col gap-4 py-2">
      {/* Encabezado Principal de la Sección con Borde de Bandera Paraguaya */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-[#8B1A1A] tracking-tight">
                Ranking Global
              </h1>
              <p className="text-xs text-[#757575] mt-0.5">
                Puntuaciones oficiales sincronizadas en tiempo real.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="h-9 px-3 rounded-[10px] bg-[#FFFBF5] hover:bg-[#FFF0DB]/60 text-[#1A1A1A] border border-[#EADCCF] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Inicio
                </button>
              )}
              <button
                onClick={loadData}
                disabled={isLoading}
                className="h-9 px-3 rounded-[10px] bg-white hover:bg-[#FFFBF5] text-[#1A1A1A] border border-[#EADCCF] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>

          {/* Notificación de posición del jugador actual */}
          {currentPlayerNick && (
            <div className="mt-3 pt-3 border-t border-[#EADCCF] flex items-center justify-between text-xs">
              <span className="text-[#757575]">
                Jugador: <strong className="text-[#1A1A1A]">{currentPlayerNick}</strong>
              </span>
              {currentPlayerPosition ? (
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Puesto #{currentPlayerPosition} ({currentPlayerInRanking?.highestScore} pts)
                </span>
              ) : (
                <span className="text-[#9E9E9E]">
                  Sin partidas aún
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white border border-[#EADCCF] rounded-[12px] p-2.5 flex items-center gap-2 shadow-2xs">
        <Search className="w-4 h-4 text-[#9E9E9E] ml-1.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por apodo..."
          className="bg-transparent w-full text-xs sm:text-sm text-[#1A1A1A] placeholder-[#9E9E9E] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#757575] hover:text-[#1A1A1A] px-2 cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla y Lista de Clasificación */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-[#FFFBF5] border-b border-[#EADCCF] flex items-center justify-between text-xs font-semibold text-[#757575]">
          <div className="flex items-center gap-3">
            <span className="w-6 text-center">#</span>
            <span>Jugador</span>
          </div>
          <span>Puntos</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-[#757575] text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#1A3A5F]" />
            Cargando ranking...
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-10 text-center px-4">
            <p className="text-xs text-[#757575] mb-3">
              {searchQuery
                ? `No se encontró ningún jugador llamado "${searchQuery}".`
                : 'Aún no hay puntuaciones registradas.'}
            </p>
            {onStartNewGame && (
              <button
                onClick={onStartNewGame}
                className="h-10 px-5 rounded-[12px] bg-[#1A3A5F] hover:bg-[#122A45] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Jugar Ahora
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#EADCCF] max-h-[460px] overflow-y-auto">
            {filteredRankings.map((item, index) => {
              const isCurrent =
                currentPlayerNick &&
                item.nickname.toLowerCase() === currentPlayerNick.toLowerCase().trim();
              const avatarObj = AVATAR_OPTIONS.find((a) => a.id === item.avatar);

              return (
                <div
                  key={item.id || item.nickname + index}
                  className={`px-4 py-3 flex items-center justify-between transition-colors ${
                    isCurrent ? 'bg-[#FFF0DB]/50 font-semibold' : 'hover:bg-[#FFFBF5]'
                  }`}
                >
                  {/* Posición, Avatar y Apodo */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-center text-xs font-bold text-[#757575]">
                      {index + 1}
                    </span>

                    <span className="text-xl shrink-0">
                      {avatarObj?.icon || '🧉'}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[160px]">
                          {item.nickname}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-[#1A3A5F] text-white px-1.5 py-0.2 rounded font-bold shrink-0">
                            TÚ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#757575] block">
                        {item.gamesPlayed} partidas · {item.accuracy}%
                      </span>
                    </div>
                  </div>

                  {/* Puntuación */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#8B1A1A]">
                      {item.highestScore} pts
                    </span>
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
