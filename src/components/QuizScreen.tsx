import React from 'react';
import { ShuffledQuestion } from '../types/trivia';
import { Check, X, ArrowRight, Flame, Trophy, Info, Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatSeconds, AVATAR_OPTIONS } from '../lib/utils';

interface QuizScreenProps {
  question: ShuffledQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  durationSeconds: number;
  selectedOption: number | null;
  isAnswerRevealed: boolean;
  nickname?: string;
  avatar?: string;
  onSelectOption: (index: number) => void;
  onNextQuestion: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  score,
  streak,
  durationSeconds,
  selectedOption,
  isAnswerRevealed,
  nickname = 'Jugador Guaraní',
  avatar = 'terere',
  onSelectOption,
  onNextQuestion,
}) => {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentIndex + 1 >= totalQuestions;
  const avatarObj = AVATAR_OPTIONS.find((a) => a.id === avatar);

  // Letras para las opciones
  const optionLetters = ['A', 'B', 'C', 'D'];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'mitologia':
        return { label: question.categoryName || 'Mitos Guaraníes', color: 'text-purple-300 bg-purple-950/70 border-purple-700/60', icon: '👹' };
      case 'gastronomia':
        return { label: question.categoryName || 'Gastronomía Típica', color: 'text-amber-300 bg-amber-950/70 border-amber-700/60', icon: '🍲' };
      case 'tradiciones':
        return { label: question.categoryName || 'Tradiciones & Costumbres', color: 'text-emerald-300 bg-emerald-950/70 border-emerald-700/60', icon: '🧉' };
      case 'idioma_guarani':
        return { label: question.categoryName || 'Idioma Guaraní', color: 'text-blue-300 bg-blue-950/70 border-blue-700/60', icon: '📜' };
      case 'historia':
        return { label: question.categoryName || 'Historia & Héroes', color: 'text-rose-300 bg-rose-950/70 border-rose-700/60', icon: '🏛️' };
      default:
        return { label: question.categoryName || 'Geografía Paraguaya', color: 'text-teal-300 bg-teal-950/70 border-teal-700/60', icon: '🗺️' };
    }
  };

  const catMeta = getCategoryBadge(question.category);
  const isPlayerCorrect = selectedOption !== null && selectedOption === question.correctAnswerIndex;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-5 py-1 sm:py-2">
      {/* Barra Superior de Estado y Progreso */}
      <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl">
        {/* Fila 1: Jugador + Puntuación + Racha */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Datos del Jugador */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
              {avatarObj?.icon || '🧉'}
            </span>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-white block truncate">
                {nickname}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Pregunta {currentIndex + 1} de {totalQuestions}
              </span>
            </div>
          </div>

          {/* Temporizador y Puntos */}
          <div className="flex items-center gap-2 shrink-0">
            {streak > 1 && (
              <span className="flex items-center gap-1 font-extrabold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-xl text-xs border border-amber-500/40 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {streak}x
              </span>
            )}

            <div className="flex items-center gap-1.5 font-extrabold text-amber-300 bg-slate-800 px-3 py-1 rounded-xl text-xs sm:text-sm border border-slate-700">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {score} pts
            </div>

            <div className="flex items-center gap-1 text-slate-300 bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono border border-slate-700">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatSeconds(durationSeconds)}
            </div>
          </div>
        </div>

        {/* Barra de progreso tricolor */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-red-600 via-white to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Categoría Cultural */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 font-medium">
          <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${catMeta.color}`}>
            <span>{catMeta.icon}</span> {catMeta.label}
          </span>
          <span className="text-[11px] text-slate-400">
            Progreso: {progressPercent}%
          </span>
        </div>
      </div>

      {/* Tarjeta Principal de la Pregunta */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Conocimiento Paraguayo
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Opciones de Respuesta Aleatorias: Grandes, táctiles y claras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((optionText, index) => {
          const letter = optionLetters[index] || '';
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctAnswerIndex;

          let buttonClasses =
            'relative w-full min-h-[58px] sm:min-h-[66px] p-4 sm:p-5 rounded-2xl border text-left transition-all font-medium text-sm sm:text-base flex items-center justify-between select-none ';

          if (!isAnswerRevealed) {
            buttonClasses +=
              'bg-slate-900 border-slate-800 text-slate-100 hover:border-blue-500 hover:bg-slate-800/80 active:scale-[0.99] cursor-pointer shadow-md';
          } else {
            if (isCorrect) {
              buttonClasses +=
                'bg-emerald-950/90 border-emerald-500 text-white ring-2 ring-emerald-500 shadow-lg font-bold';
            } else if (isSelected && !isCorrect) {
              buttonClasses +=
                'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500 shadow-lg';
            } else {
              buttonClasses +=
                'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-40 cursor-not-allowed';
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelectOption(index)}
              disabled={isAnswerRevealed}
              className={buttonClasses}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <span
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-colors shadow-xs ${
                    isAnswerRevealed && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isAnswerRevealed && isSelected && !isCorrect
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="leading-snug break-words">{optionText}</span>
              </div>

              {isAnswerRevealed && isCorrect && (
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              {isAnswerRevealed && isSelected && !isCorrect && (
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje de Resultado Inmediato y Explicación Revelada */}
      {isAnswerRevealed && (
        <div
          className={`rounded-2xl p-5 border text-xs sm:text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            isPlayerCorrect
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100'
              : 'bg-rose-950/30 border-rose-800/60 text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2 font-black mb-1.5 text-sm sm:text-base">
            {isPlayerCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">¡Correcto! (+100 {streak > 1 ? `+${(streak - 1) * 20} racha` : ''} pts)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-rose-300">¡Respuesta Incorrecta!</span>
              </>
            )}
          </div>
          <div className="text-slate-300 mt-2 pt-2 border-t border-slate-800/60">
            <strong className="text-amber-300 block mb-1">Dato Cultural Guaraní:</strong>
            {question.explanation}
          </div>
        </div>
      )}

      {/* Botón Siguiente Pregunta: Grande y cómodo para el pulgar */}
      {isAnswerRevealed && (
        <button
          onClick={onNextQuestion}
          className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-black text-base sm:text-lg tracking-wide shadow-xl shadow-red-600/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{isLastQuestion ? 'Ver Resultados Finales 🏁' : 'Siguiente Pregunta'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
