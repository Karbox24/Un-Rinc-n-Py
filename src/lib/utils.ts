import { Question, ShuffledQuestion } from '../types/trivia';

/**
 * Mezcla aleatoriamente los elementos de un array (Fisher-Yates shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prepara una pregunta barajando sus respuestas aleatoriamente
 * y recalculando el índice de la opción correcta
 */
export function prepareShuffledQuestion(q: Question): ShuffledQuestion {
  const originalOptions = q.options;
  const originalCorrectAnswerText = originalOptions[q.correctAnswer];
  
  // Mezclar las opciones
  const shuffledOptions = shuffleArray(originalOptions);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectAnswerText);

  return {
    id: q.id,
    category: q.category,
    categoryName: q.categoryName,
    question: q.question,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectIndex,
    explanation: q.explanation,
  };
}

/**
 * Retorna título de honor cultural guaraní y mensaje según el porcentaje de aciertos
 */
export function getGuaraniHonorificRank(accuracy: number): {
  title: string;
  subtitle: string;
  badge: string;
  color: string;
} {
  if (accuracy >= 90) {
    return {
      title: 'Mburuvicha Arandu',
      subtitle: '¡Gran Sabio de la Cultura y Mitos del Paraguay!',
      badge: '🏆 Máximo Honor Guaraní',
      color: 'from-amber-500 to-yellow-600',
    };
  } else if (accuracy >= 70) {
    return {
      title: 'Guapo / Guapaiterei',
      subtitle: '¡Excelente conocedor de nuestras raíces!',
      badge: '⭐ Orgullo Nacional',
      color: 'from-emerald-500 to-teal-600',
    };
  } else if (accuracy >= 50) {
    return {
      title: 'Arandu Pyahu',
      subtitle: '¡Buen camino, tu conocimiento guaraní está floreciendo!',
      badge: '🌿 Camino al Saber',
      color: 'from-blue-500 to-indigo-600',
    };
  } else {
    return {
      title: 'Mba’apohára',
      subtitle: '¡Gran esfuerzo! Tomate un tereré y volvé a desafiarte.',
      badge: '🧉 Entusiasta Cultural',
      color: 'from-orange-500 to-amber-600',
    };
  }
}

export const AVATAR_OPTIONS = [
  { id: 'terere', label: 'Tereré', icon: '🧉' },
  { id: 'sol', label: 'Sol de Mayo', icon: '☀️' },
  { id: 'nanduti', label: 'Ñandutí', icon: '🕸️' },
  { id: 'mburucuya', label: 'Mburucuyá', icon: '🌸' },
  { id: 'piri', label: 'Sombrero Piri', icon: '👒' },
  { id: 'poha', label: 'Pohã Ñana', icon: '🌿' },
  { id: 'arpa', label: 'Arpa Guaraní', icon: '🪕' },
  { id: 'chipa', label: 'Chipa', icon: '🥯' },
];

export function formatSeconds(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
