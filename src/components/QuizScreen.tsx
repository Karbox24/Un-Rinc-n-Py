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
  const isPlayerCorrect = selectedOption !== null && selectedOption === question.correctAnswerIndex;

  return (
    <div className="w-full max-w-[540px] mx-auto flex flex-col gap-4 py-1">
      {/* Barra Superior Minimalista de Progreso y Datos */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-[#757575] font-medium px-1">
          <span className="text-[#1A1A1A] font-semibold">
            Pregunta {currentIndex + 1} de {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            {streak > 1 && (
              <span className="text-emerald-700 font-bold">
                {streak} seguidas
              </span>
            )}
            <span className="font-semibold text-[#1A1A1A]">
              {score} pts
            </span>
            <span className="text-[#757575]">
              {formatSeconds(durationSeconds)}
            </span>
          </div>
        </div>

        {/* Barra de Progreso limpia estilo Duolingo */}
        <div className="w-full bg-[#EADCCF] h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#1A3A5F] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Tarjeta de Pregunta: blanca, con borde superior de 4px con colores de bandera Paraguay: rojo #D52B1E y azul #0038A8 */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm flex flex-col justify-center min-h-[140px]">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6">
          {question.categoryName && (
            <span className="text-[12px] font-semibold text-[#8B1A1A] uppercase tracking-wider text-center mb-2 block">
              {question.categoryName}
            </span>
          )}
          {/* Texto pregunta: font-size 22px, negro #1A1A1A, centrado */}
          <h2 className="text-[22px] text-[#1A1A1A] font-semibold text-center leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Botones respuesta: 4 botones, blancos, borde #E0E0E0, altura 56px, texto 18px, uno debajo del otro con gap 12px. Hover: fondo #F0F0F0 */}
      <div className="flex flex-col gap-[12px]">
        {question.options.map((optionText, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctAnswerIndex;

          let btnStyle = 'w-full min-h-[56px] px-4 rounded-[16px] border border-[#EADCCF] bg-white text-[18px] text-[#1A1A1A] font-normal transition-colors flex items-center justify-between text-left select-none ';

          if (!isAnswerRevealed) {
            btnStyle += 'hover:bg-[#FFFBF5] active:bg-[#FFF0DB]/50 cursor-pointer shadow-2xs';
          } else {
            if (isCorrect) {
              btnStyle += 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
            } else if (isSelected && !isCorrect) {
              btnStyle += 'bg-rose-50 border-rose-500 text-rose-900 font-medium';
            } else {
              btnStyle += 'bg-white opacity-40 cursor-not-allowed';
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelectOption(index)}
              disabled={isAnswerRevealed}
              className={btnStyle}
            >
              <span className="leading-snug break-words pr-2">
                {optionText}
              </span>

              {isAnswerRevealed && isCorrect && (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isAnswerRevealed && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explicación cultural / Dato: limpio, blanco con borde suave */}
      {isAnswerRevealed && (
        <div className="bg-white border border-[#EADCCF] rounded-[16px] p-4 text-sm text-[#424242] shadow-sm">
          <div className="font-semibold text-[#8B1A1A] mb-1">
            {isPlayerCorrect ? '✓ ¡Iporã! (Correcto)' : '✕ Respuesta incorrecta'}
          </div>
          <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Botón Siguiente Pregunta: #1A3A5F con hover #122A45 */}
      {isAnswerRevealed && (
        <button
          onClick={onNextQuestion}
          className="w-full h-[56px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white text-[18px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <span>{isLastQuestion ? 'Ver Resultados' : 'Continuar'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
