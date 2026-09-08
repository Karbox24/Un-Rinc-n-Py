import React from 'react';
import { ShuffledQuestion } from '../types/trivia';
import { Check, X, ArrowRight, Flame, Trophy, Info, Sparkles } from 'lucide-react';
import { formatSeconds } from '../lib/utils';

interface QuizScreenProps {
  question: ShuffledQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  durationSeconds: number;
  selectedOption: number | null;
  isAnswerRevealed: boolean;
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
  onSelectOption,
  onNextQuestion,
}) => {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  // Letras para las opciones
  const optionLetters = ['A', 'B', 'C', 'D'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mitologia':
        return 'text-purple-700 bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'gastronomia':
        return 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'tradiciones':
        return 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'idioma_guarani':
        return 'text-blue-700 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'historia':
        return 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'text-teal-700 bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Barra Superior de Estado y Progreso */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
              Pregunta {currentIndex + 1}
            </span>
            <span className="text-slate-400 font-medium">de {totalQuestions}</span>
          </div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {streak} seguidas
              </span>
            )}
            <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full text-xs">
              <Trophy className="w-3.5 h-3.5" />
              {score} pts
            </div>
          </div>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 via-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getCategoryColor(question.category)}`}>
            {question.categoryName}
          </span>
          <span>Tiempo: {formatSeconds(durationSeconds)}</span>
        </div>
      </div>

      {/* Tarjeta Principal de la Pregunta */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Conocimiento Paraguayo
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Opciones de Respuesta Aleatorias */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((optionText, index) => {
          const letter = optionLetters[index] || '';
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctAnswerIndex;

          let buttonClasses =
            'relative w-full p-3.5 rounded-xl border text-left transition-all font-medium text-sm flex items-center justify-between ';

          if (!isAnswerRevealed) {
            buttonClasses +=
              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 active:scale-[0.99] cursor-pointer shadow-sm';
          } else {
            if (isCorrect) {
              buttonClasses +=
                'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500 font-bold';
            } else if (isSelected && !isCorrect) {
              buttonClasses +=
                'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500';
            } else {
              buttonClasses +=
                'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelectOption(index)}
              disabled={isAnswerRevealed}
              className={buttonClasses}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isAnswerRevealed && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswerRevealed && isSelected && !isCorrect
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="leading-snug">{optionText}</span>
              </div>

              {isAnswerRevealed && isCorrect && (
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
              )}
              {isAnswerRevealed && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dato Cultural / Explicación Revelada */}
      {isAnswerRevealed && (
        <div className="rounded-2xl p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-slate-800 dark:text-amber-100 text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            Dato Cultural Guaraní:
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Botón Siguiente Pregunta */}
      {isAnswerRevealed && (
        <button
          onClick={onNextQuestion}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-1"
        >
          {isLastQuestion ? 'Ver Resultados Finales 🏁' : 'Siguiente Pregunta'}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
