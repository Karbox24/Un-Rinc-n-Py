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
    <div className="w-full max-w-[540px] mx-auto flex flex-col gap-4 py-2">
      {/* Banner Especial de Récord Superado */}
      {isNewRecord && (
        <div className="p-4 rounded-[16px] bg-emerald-50 border border-emerald-300 shadow-sm flex items-center justify-between gap-3 text-emerald-900">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700 block">
              ¡Hazaña!
            </span>
            <h2 className="text-[18px] font-bold text-emerald-950">
              ¡Nuevo Récord Personal!
            </h2>
            <p className="text-xs text-emerald-800 mt-0.5">
              Superaste tu mejor marca histórica con <strong>{score} puntos</strong>.
            </p>
          </div>
          <span className="text-2xl">🏆</span>
        </div>
      )}

      {/* Tarjeta de Resumen Principal con Borde de Bandera Paraguaya */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm text-center">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFFBF5] border border-[#FFB347]/40 flex items-center justify-center text-3xl mb-3 shadow-2xs">
            {avatarObj?.icon || '🧉'}
          </div>

          <h2 className="text-[20px] font-bold text-[#8B1A1A] mb-0.5">
            {nickname}
          </h2>

          <div className="my-1.5">
            <span className="inline-block text-[15px] font-semibold text-[#1A1A1A]">
              {rank.title}
            </span>
            <p className="text-xs text-[#757575] mt-0.5">
              {rank.subtitle}
            </p>
          </div>

          {/* Puntuación */}
          <div className="my-4 py-3 border-y border-[#EADCCF] flex items-center justify-center gap-2">
            <span className="text-4xl font-extrabold text-[#1A3A5F] tracking-tight">
              {score}
            </span>
            <span className="text-xs uppercase font-bold text-[#757575]">pts</span>
          </div>

          <div className="text-xs text-[#757575] flex items-center justify-center gap-1.5">
            <span>Tu récord histórico:</span>
            <strong className="text-[#8B1A1A] font-bold">{displayRecord} pts</strong>
          </div>

          {/* Métricas en mini grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#EADCCF]">
            <div className="p-2 rounded-[12px] bg-[#FFFBF5] border border-[#EADCCF]">
              <span className="block text-lg font-bold text-emerald-700">{correctCount}</span>
              <span className="text-[11px] text-[#757575]">Aciertos ({accuracy}%)</span>
            </div>

            <div className="p-2 rounded-[12px] bg-[#FFFBF5] border border-[#EADCCF]">
              <span className="block text-lg font-bold text-rose-700">{incorrectCount}</span>
              <span className="text-[11px] text-[#757575]">Errores</span>
            </div>

            <div className="p-2 rounded-[12px] bg-[#FFFBF5] border border-[#EADCCF]">
              <span className="block text-lg font-bold text-[#1A3A5F]">{formatSeconds(durationSeconds)}</span>
              <span className="text-[11px] text-[#757575]">Tiempo</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#9E9E9E]">
            {isSaving ? 'Guardando en Firebase...' : '✓ Partida sincronizada'}
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col gap-2.5">
        {/* 1. JUGAR DE NUEVO: #1A3A5F con hover #122A45 */}
        <button
          onClick={onPlayAgain}
          className="w-full h-[56px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white text-[18px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <RotateCcw className="w-5 h-5" />
          Jugar de Nuevo
        </button>

        {/* 2. VER RANKING y 3. MIS ESTADÍSTICAS */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenRanking}
            className="h-[48px] rounded-[12px] bg-white border border-[#EADCCF] hover:bg-[#FFFBF5] text-[#1A1A1A] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#8B1A1A]" />
            Ranking Global
          </button>

          <button
            onClick={onOpenStats || onOpenRanking}
            className="h-[48px] rounded-[12px] bg-white border border-[#EADCCF] hover:bg-[#FFFBF5] text-[#1A1A1A] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#1A3A5F]" />
            Mis Estadísticas
          </button>
        </div>

        {/* Dejar Comentario & Compartir */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenFeedback}
            className="h-[44px] rounded-[12px] bg-white border border-[#EADCCF] hover:bg-[#FFFBF5] text-[#424242] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#757575]" />
            {hasSubmittedFeedback ? 'Comentario Enviado' : 'Dejar Comentario'}
          </button>

          <button
            onClick={handleShare}
            className="h-[44px] rounded-[12px] bg-white border border-[#EADCCF] hover:bg-[#FFFBF5] text-[#424242] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Copiado
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#757575]" /> Compartir
              </>
            )}
          </button>
        </div>

        {/* Volver al Inicio */}
        <button
          onClick={onGoHome}
          className="h-[44px] rounded-[12px] bg-[#FFFBF5] border border-[#EADCCF] hover:bg-[#FFF0DB]/50 text-[#757575] hover:text-[#1A1A1A] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Volver al Inicio
        </button>
      </div>

      {/* Desglose de Preguntas Respondidas */}
      {answersHistory.length > 0 && (
        <div className="bg-white border border-[#E0E0E0] rounded-[16px] p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#757575] hover:text-[#1A1A1A] transition-colors"
          >
            <span>Repasar Preguntas ({answersHistory.length})</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showReview ? 'rotate-180' : ''}`} />
          </button>

          {showReview && (
            <div className="flex flex-col gap-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
              {answersHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-[12px] border text-xs ${
                    item.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-[#1A1A1A] leading-snug">
                      {idx + 1}. {item.questionText}
                    </span>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${item.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                      {item.isCorrect ? 'Correcto' : 'Incorrecto'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#616161]">
                    <span>Tu respuesta:</span> {item.selectedOption}
                  </div>
                  {!item.isCorrect && (
                    <div className="text-[11px] text-emerald-800 font-medium">
                      <span>Correcta:</span> {item.correctOption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
