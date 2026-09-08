export type QuestionCategory = 
  | 'mitologia'
  | 'historia'
  | 'gastronomia'
  | 'idioma_guarani'
  | 'tradiciones'
  | 'geografia';

export interface Question {
  id: string;
  category: QuestionCategory;
  categoryName: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index in original options array (0-3)
  explanation: string;
  difficulty?: 'facil' | 'medio' | 'dificil';
}

export interface ShuffledQuestion {
  id: string;
  category: QuestionCategory;
  categoryName: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface GameAnswer {
  questionId: string;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  category: QuestionCategory;
}

export interface GameSession {
  id?: string;
  nickname: string;
  avatar: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  durationSeconds: number;
  completedAt: string; // ISO String
  categoryBreakdown?: Record<string, { correct: number; total: number }>;
}

export interface PlayerFeedback {
  id?: string;
  nickname: string;
  rating: number; // 1 to 5
  comment: string;
  score: number;
  createdAt: string; // ISO String
  gameSessionId?: string;
}

export interface RankingItem {
  id?: string;
  nickname: string;
  avatar: string;
  highestScore: number;
  gamesPlayed: number;
  accuracy: number;
  lastPlayed: string;
}
