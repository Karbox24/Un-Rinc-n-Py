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
  textColor: string;
  borderColor: string;
  bgColor: string;
  icon: string;
} {
  if (accuracy >= 90) {
    return {
      title: 'Mburuvicha Arandu',
      subtitle: '¡Gran Sabio de la Cultura y Mitos del Paraguay!',
      badge: '🏆 Máximo Honor Guaraní',
      color: 'from-amber-400 to-yellow-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      bgColor: 'bg-amber-950/40',
      icon: '👑',
    };
  } else if (accuracy >= 70) {
    return {
      title: 'Guapo / Guapaiterei',
      subtitle: '¡Excelente conocedor de nuestras raíces!',
      badge: '⭐ Orgullo Nacional',
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      bgColor: 'bg-emerald-950/40',
      icon: '⭐',
    };
  } else if (accuracy >= 50) {
    return {
      title: 'Arandu Pyahu',
      subtitle: '¡Buen camino, tu conocimiento guaraní está floreciendo!',
      badge: '🌿 Camino al Saber',
      color: 'from-blue-400 to-indigo-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/50',
      bgColor: 'bg-blue-950/40',
      icon: '🌿',
    };
  } else {
    return {
      title: 'Mba’apohára',
      subtitle: '¡Gran esfuerzo! Tomate un tereré y volvé a desafiarte.',
      badge: '🧉 Entusiasta Cultural',
      color: 'from-orange-400 to-amber-500',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/50',
      bgColor: 'bg-orange-950/40',
      icon: '🧉',
    };
  }
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Reciente';
    return date.toLocaleDateString('es-PY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Reciente';
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
