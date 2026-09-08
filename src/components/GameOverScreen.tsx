import React from 'react';
import { Trophy, RotateCcw, MessageSquare, Award, Clock, CheckCircle2, XCircle, Share2, Check } from 'lucide-react';
import { getGuaraniHonorificRank, formatSeconds } from '../lib/utils';
import { GameAnswer } from '../types/trivia';

interface GameOverScreenProps {
  nickname: string;
  avatar: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  durationSeconds: number;
  isSaving: boolean;
  hasSubmittedFeedback: boolean;
  answersHistory: GameAnswer[];
  onPlayAgain: () => void;
  onOpenFeedback: () => void;
  onOpenRanking: () => void;
  onGoHome: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  nickname,
  avatar,
  score,
  totalQuestions,
  correctCount,
  incorrectCount,
  durationSeconds,
  isSaving,
  hasSubmittedFeedback,
  answersHistory,
  onPlayAgain,
  onOpenFeedback,
  onOpenRanking,
  onGoHome,
}) => {
  const [copiedShare, setCopiedShare] = React.useState(false);
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const rank = getGuaraniHonorificRank(accuracy);

  const handleShare = () => {
    const text = `¡Obtuve ${score} puntos con ${correctCount}/${totalQuestions} aciertos en "Un Rincón Py" - Trivia de Mitos y Cultura Paraguaya! Rango: ${rank.title} 🧉🇵🇾`;
    if (navigator.share) {
      navigator.share({ title: 'Un Rincón Py', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Tarjeta de Honor Cultural Guaraní */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 text-white text-center shadow-xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
          {rank.badge}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          {rank.title}
        </h1>
        <p className="text-xs text-slate-300 max-w-xs mx-auto mb-5 leading-relaxed">
          {rank.subtitle}
        </p>

        {/* Puntuación destacada */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/60 max-w-[260px] mx-auto shadow-inner">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Puntuación Final
          </span>
          <div className="text-4xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
            <Trophy className="w-7 h-7 text-amber-400" />
            {score}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
            {nickname}
          </span>
        </div>

        {/* Estado de sincronización Firestore */}
        <div className="mt-4 text-[11px] flex items-center justify-center gap-1.5 font-medium text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {isSaving ? 'Guardando en Firebase...' : 'Estadísticas registradas en Firebase Firestore'}
        </div>
      </div>

      {/* Grid de Estadísticas de la Partida */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {correctCount}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Aciertos
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="text-rose-600 dark:text-rose-400 font-black text-xl flex items-center justify-center gap-1">
            <XCircle className="w-4 h-4" />
            {incorrectCount}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Errores
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="text-blue-600 dark:text-blue-400 font-black text-xl flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            {formatSeconds(durationSeconds)}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tiempo
          </span>
        </div>
      </div>

      {/* Botones de Acción Primarios */}
      <div className="flex flex-col gap-2.5 mt-1">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Jugar de Nuevo
        </button>

        <button
          onClick={onOpenFeedback}
          className={`w-full py-3 px-5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            hasSubmittedFeedback
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              : 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 hover:bg-amber-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {hasSubmittedFeedback
            ? '¡Comentario enviado al Administrador! ✓'
            : 'Dejar Comentario o Sugerencia'}
        </button>
      </div>

      {/* Acciones Secundarias */}
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <button
          onClick={handleShare}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-slate-500" />
              Compartir Puntaje
            </>
          )}
        </button>

        <button
          onClick={onOpenRanking}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5"
        >
          <Award className="w-4 h-4 text-amber-500" />
          Ranking Global (Fase 2)
        </button>
      </div>

      {/* Resumen desplegable de respuestas para aprender */}
      {answersHistory.length > 0 && (
        <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 transition-all">
          <summary className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 cursor-pointer flex items-center justify-between">
            <span>Revisar Respuestas de la Partida ({answersHistory.length})</span>
            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {answersHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs leading-snug ${
                  item.isCorrect
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200'
                    : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-950 dark:text-rose-200'
                }`}
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {idx + 1}. {item.questionText}
                </p>
                <div className="mt-1 flex flex-col gap-0.5 text-[11px]">
                  <span>
                    Tu respuesta:{' '}
                    <strong className={item.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                      {item.selectedOption}
                    </strong>
                  </span>
                  {!item.isCorrect && (
                    <span className="text-slate-500 dark:text-slate-400">
                      Respuesta correcta: <strong>{item.correctOption}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      <button
        onClick={onGoHome}
        className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-center py-2 transition-colors"
      >
        ← Volver a la Pantalla de Inicio
      </button>
    </div>
  );
};
