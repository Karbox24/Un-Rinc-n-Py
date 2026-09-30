import React, { useState, useEffect } from 'react';
import { Trophy, X, Sparkles, RefreshCw, Award, Flame } from 'lucide-react';
import { fetchGlobalRanking } from '../lib/firebase';
import { RankingItem } from '../types/trivia';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayerNick?: string;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  isOpen,
  onClose,
  currentPlayerNick,
}) => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadRanking = async () => {
    setLoading(true);
    try {
      const data = await fetchGlobalRanking(15);
      setRankings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRanking();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-[16px] border border-[#EADCCF] shadow-lg overflow-hidden">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#757575] hover:text-[#1A1A1A] rounded-xl hover:bg-[#FFFBF5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-[#8B1A1A] flex items-center justify-center gap-1.5">
              <Trophy className="w-5 h-5 text-[#8B1A1A]" /> Ranking Global
            </h2>
            <p className="text-xs text-[#757575] mt-0.5">
              Los mejores puntajes oficiales sincronizados
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-[#757575] mb-2 px-1">
            <span>Posición y Jugador</span>
            <button
              onClick={loadRanking}
              disabled={loading}
              className="text-[#1A3A5F] font-semibold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {rankings.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#757575] bg-[#FFFBF5] rounded-[12px] border border-[#EADCCF]">
                Aún no hay puntuaciones en el ranking. ¡Completá tu primera partida para aparecer aquí!
              </div>
            ) : (
              rankings.map((item, idx) => {
                const isCurrent =
                  currentPlayerNick &&
                  item.nickname.toLowerCase() === currentPlayerNick.toLowerCase();
                return (
                  <div
                    key={item.id || idx}
                    className={`flex items-center justify-between p-2.5 rounded-[12px] border text-xs transition-colors ${
                      isCurrent
                        ? 'border-[#FFB347] bg-[#FFF0DB] font-semibold'
                        : 'border-[#EADCCF] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#FFFBF5] border border-[#EADCCF] text-[#1A1A1A] flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-[#1A1A1A] flex items-center gap-1">
                          {item.nickname}
                          {isCurrent && (
                            <span className="text-[9px] bg-[#1A3A5F] text-white px-1.5 py-0.2 rounded font-bold">
                              TÚ
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#757575]">
                          {item.gamesPlayed} partidas · {item.accuracy}% acierto
                        </div>
                      </div>
                    </div>

                    <div className="font-bold text-[#8B1A1A] text-xs">
                      {item.highestScore} pts
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full h-[48px] rounded-[12px] bg-[#FFFBF5] hover:bg-[#FFF0DB]/60 text-[#1A1A1A] font-semibold text-xs transition-colors border border-[#EADCCF] cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
