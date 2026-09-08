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
        return 'text-purple-300 bg-purple-950/70 border-purple-800';
      case 'gastronomia':
        return 'text-amber-300 bg-amber-950/70 border-amber-800';
      case 'tradiciones':
        return 'text-emerald-300 bg-emerald-950/70 border-emerald-800';
      case 'idioma_guarani':
        return 'text-blue-300 bg-blue-950/70 border-blue-800';
      case 'historia':
        return 'text-rose-300 bg-rose-950/70 border-rose-800';
      default:
        return 'text-teal-300 bg-teal-950/70 border-teal-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5 py-2">
      {/* Barra Superior de Estado y Progreso */}
      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base">
              Pregunta {currentIndex + 1}
            </span>
            <span className="text-slate-400 font-medium">de {totalQuestions}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {streak > 1 && (
              <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full text-xs border border-amber-500/30 animate-pulse">
                <Flame className="w-4 h-4 fill-amber-400" />
                {streak} seguidas
              </span>
            )}
            <div className="flex items-center gap-1.5 font-extrabold text-blue-400 bg-blue-950/50 px-3.5 py-1 rounded-full text-xs sm:text-sm border border-blue-500/30">
              <Trophy className="w-4 h-4 text-blue-400" />
              {score} pts
            </div>
          </div>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-red-600 via-white to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 font-medium">
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${getCategoryColor(question.category)}`}>
            {question.categoryName}
          </span>
          <span className="bg-slate-800/80 px-2.5 py-0.5 rounded-md font-mono text-slate-300">
            ⏱️ {formatSeconds(durationSeconds)}
          </span>
        </div>
      </div>

      {/* Tarjeta Principal de la Pregunta */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Conocimiento Paraguayo
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Opciones de Respuesta Aleatorias: 1 columna en móvil, 2 columnas en PC y Tablets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((optionText, index) => {
          const letter = optionLetters[index] || '';
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctAnswerIndex;

          let buttonClasses =
            'relative w-full p-4 sm:p-5 rounded-2xl border text-left transition-all font-medium text-sm sm:text-base flex items-center justify-between ';

          if (!isAnswerRevealed) {
            buttonClasses +=
              'bg-slate-900 border-slate-800 text-slate-200 hover:border-blue-500 hover:bg-slate-800 active:scale-[0.99] cursor-pointer shadow-md';
          } else {
            if (isCorrect) {
              buttonClasses +=
                'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500 font-bold';
            } else if (isSelected && !isCorrect) {
              buttonClasses +=
                'bg-rose-950/80 border-rose-500 text-rose-100 ring-2 ring-rose-500';
            } else {
              buttonClasses +=
                'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-50';
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelectOption(index)}
              disabled={isAnswerRevealed}
              className={buttonClasses}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-colors ${
                    isAnswerRevealed && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswerRevealed && isSelected && !isCorrect
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="leading-snug">{optionText}</span>
              </div>

              {isAnswerRevealed && isCorrect && (
                <Check className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
              )}
              {isAnswerRevealed && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dato Cultural / Explicación Revelada */}
      {isAnswerRevealed && (
        <div className="rounded-2xl p-5 bg-amber-950/40 border border-amber-800/60 text-amber-100 text-xs sm:text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5 text-sm">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            Dato Cultural Guaraní:
          </div>
          <p className="text-slate-200">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Botón Siguiente Pregunta */}
      {isAnswerRevealed && (
        <button
          onClick={onNextQuestion}
          className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-600/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {isLastQuestion ? 'Ver Resultados Finales 🏁' : 'Siguiente Pregunta'}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
