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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 mb-1">
            <Sparkles className="w-3 h-3" /> Preparado para Fase 2
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-500" /> Ranking Global
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Los mejores puntajes sincronizados en Firestore
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
          <span>Posición y Jugador</span>
          <button
            onClick={loadRanking}
            disabled={loading}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto flex flex-col gap-1.5 pr-1">
          {rankings.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
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
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 shadow-sm'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900 shadow-sm'
                          : idx === 2
                          ? 'bg-amber-700 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                        {item.nickname}
                        {isCurrent && (
                          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                            TÚ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.gamesPlayed} partidas • {item.accuracy}% acierto
                      </div>
                    </div>
                  </div>

                  <div className="font-black text-amber-500 text-xs">
                    {item.highestScore} pts
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
