import React from 'react';
import { 
  Trophy, 
  RotateCcw, 
  MessageSquare, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  Check, 
  Home, 
  ChevronDown, 
  BarChart3, 
  Sparkles, 
  Flame, 
  Crown 
} from 'lucide-react';
import { getGuaraniHonorificRank, formatSeconds, AVATAR_OPTIONS } from '../lib/utils';
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
  personalRecord?: number;
  isNewRecord?: boolean;
  onPlayAgain: () => void;
  onOpenFeedback: () => void;
  onOpenRanking: () => void;
  onOpenStats?: () => void;
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
  personalRecord = 0,
  isNewRecord = false,
  onPlayAgain,
  onOpenFeedback,
  onOpenRanking,
  onOpenStats,
  onGoHome,
}) => {
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const rank = getGuaraniHonorificRank(accuracy);
  const avatarObj = AVATAR_OPTIONS.find((a) => a.id === avatar);

  const displayRecord = Math.max(personalRecord, score);

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
    <div className="max-w-5xl mx-auto py-2">
      {/* Banner Especial de Récord Superado */}
      {isNewRecord && (
        <div className="mb-4 p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400/80 shadow-2xl flex items-center justify-between gap-3 text-amber-200 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center text-2xl shadow-lg shrink-0">
              👑
            </div>
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-amber-400 block">
                ¡Hazaña Histórica!
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                ¡NUEVO RÉCORD PERSONAL!
              </h2>
              <p className="text-xs text-amber-300/90 mt-0.5">
                ¡Superaste tu mejor marca histórica con <strong>{score} puntos</strong>!
              </p>
            </div>
          </div>
          <span className="hidden sm:flex text-3xl">🎉</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Certificado de Honor Guaraní y Puntuación */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 text-white text-center shadow-xl">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
              Resultado de la Partida
            </span>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 border-2 border-amber-500/40 flex items-center justify-center text-4xl shadow-inner mb-3">
              {avatarObj?.icon || '🧉'}
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
              {nickname}
            </h2>

            <div className="my-2">
              <span className={`inline-block text-lg font-black ${rank.textColor}`}>
                {rank.icon} {rank.title}
              </span>
              <p className="text-xs text-slate-300 mt-1 px-4">
                {rank.subtitle}
              </p>
            </div>

            {/* Puntuación Principal */}
            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-center gap-2">
              <Trophy className="w-7 h-7 text-amber-400" />
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {score}
              </span>
              <span className="text-xs uppercase font-bold text-slate-400">pts</span>
            </div>

            {/* Comparativa con Récord */}
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <span>Tu récord histórico:</span>
              <strong className="text-amber-400 font-mono">{displayRecord} pts</strong>
            </div>

            {/* Estado de sincronización con Firebase */}
            <div className="mt-4 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-3 border-t border-slate-800">
              {isSaving ? (
                <span className="text-amber-400 animate-pulse">
                  Sincronizando puntuación en Firebase...
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Partida registrada en Firebase
                </span>
              )}
            </div>
          </div>

          {/* Botones de acción complementarios */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleShare}
              className="py-3 px-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> ¡Copiado!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-blue-400" /> Compartir
                </>
              )}
            </button>

            <button
              onClick={onOpenRanking}
              className="py-3 px-3 rounded-2xl bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Ver Ranking
            </button>
          </div>
        </div>

        {/* Columna Derecha: Estadísticas Detalladas, Botones de Acción y Repaso */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Métricas de Rendimiento */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="block text-2xl font-black text-white">{correctCount}</span>
              <span className="text-[11px] font-semibold text-slate-400">
                Aciertos ({accuracy}%)
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center shadow-md">
              <XCircle className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
              <span className="block text-2xl font-black text-white">{incorrectCount}</span>
              <span className="text-[11px] font-semibold text-slate-400">
                Errores ({totalQuestions - correctCount})
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center shadow-md">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <span className="block text-2xl font-black text-white">
                {formatSeconds(durationSeconds)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Tiempo Total</span>
            </div>
          </div>

          {/* Botones Principales de Acción Solicitados */}
          <div className="flex flex-col gap-3">
            {/* 1. JUGAR DE NUEVO */}
            <button
              onClick={onPlayAgain}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-black text-base tracking-wide shadow-xl shadow-red-600/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              JUGAR DE NUEVO (Nuevas Preguntas)
            </button>

            {/* 2. VER RANKING y 3. MIS ESTADÍSTICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onOpenRanking}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                VER RANKING GLOBAL
              </button>

              <button
                onClick={onOpenStats || onOpenRanking}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 border border-blue-500/40 text-blue-300 hover:bg-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                MIS ESTADÍSTICAS
              </button>
            </div>

            {/* Dejar Comentario al Administrador */}
            <button
              onClick={onOpenFeedback}
              className={`w-full py-3.5 px-6 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                hasSubmittedFeedback
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              {hasSubmittedFeedback
                ? 'Comentario Enviado al Administrador ✓'
                : 'Dejar Comentario o Sugerencia post-partida'}
            </button>

            {/* Volver al Inicio */}
            <button
              onClick={onGoHome}
              className="w-full py-3 px-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Volver a la Pantalla de Inicio
            </button>
          </div>

          {/* Desglose de Preguntas Respondidas */}
          {answersHistory.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                <span>Repasar Preguntas de esta Partida ({answersHistory.length})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showReview ? 'rotate-180' : ''}`} />
              </button>

              {showReview && (
                <div className="flex flex-col gap-3 mt-4 max-h-72 overflow-y-auto pr-1">
                  {answersHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs ${
                        item.isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-800/50 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-white leading-snug">
                          {idx + 1}. {item.questionText}
                        </span>
                        {item.isCorrect ? (
                          <span className="shrink-0 bg-emerald-600/30 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            Correcto (+100)
                          </span>
                        ) : (
                          <span className="shrink-0 bg-rose-600/30 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            Incorrecto
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        <span className="text-slate-300 font-semibold">Tu respuesta:</span> {item.selectedOption}
                      </div>
                      {!item.isCorrect && (
                        <div className="text-[11px] text-emerald-400 mt-0.5">
                          <span className="font-semibold">Respuesta correcta:</span> {item.correctOption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
