import { useState, useEffect, useRef, useCallback } from 'react';
import { ShuffledQuestion, GameAnswer, GameSession } from '../types/trivia';
import { MASTER_PARAGUAY_QUESTIONS, getRandomQuestions } from '../data/questions';
import { shuffleArray, prepareShuffledQuestion } from '../lib/utils';
import { recordGameSession } from '../lib/firebase';

export type ScreenState = 'home' | 'quiz' | 'gameover' | 'admin';

const NICKNAME_STORAGE_KEY = 'unrinconpy_nickname';
const AVATAR_STORAGE_KEY = 'unrinconpy_avatar';

export function useTriviaGame() {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem(NICKNAME_STORAGE_KEY) || '';
  });
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem(AVATAR_STORAGE_KEY) || 'terere';
  });

  // Modo de juego: 'test10' (10 preguntas de prueba) o 'all' (banco extendido)
  const [questionMode, setQuestionMode] = useState<'test10' | 'all'>('test10');

  // Estado de la partida actual
  const [gameQuestions, setGameQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

  // Estado de respuesta por pregunta
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<GameAnswer[]>([]);

  // Tiempo y guardado
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedSessionId, setLastSavedSessionId] = useState<string | null>(null);

  // Modal de feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState<boolean>(false);

  // Temporizador durante el juego
  useEffect(() => {
    if (screen === 'quiz') {
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // Guardar apodo y avatar en localStorage
  const updatePlayerProfile = (newNick: string, newAvatar: string) => {
    setNickname(newNick);
    setAvatar(newAvatar);
    localStorage.setItem(NICKNAME_STORAGE_KEY, newNick);
    localStorage.setItem(AVATAR_STORAGE_KEY, newAvatar);
  };

  /**
   * Inicia una nueva partida con preguntas aleatorias
   * y respuestas barajadas
   */
  const startNewGame = useCallback(
    (playerNick?: string, playerAvatar?: string, mode: 'test10' | 'all' = 'test10') => {
      const activeNick = (playerNick || nickname).trim() || 'Jugador Guaraní';
      const activeAvatar = playerAvatar || avatar || 'terere';
      updatePlayerProfile(activeNick, activeAvatar);
      setQuestionMode(mode);

      // Elegir conjunto de preguntas de forma 100% aleatoria del banco exhaustivo de 60+ preguntas
      const selectedPool = mode === 'test10'
        ? getRandomQuestions(10)
        : shuffleArray(MASTER_PARAGUAY_QUESTIONS);

      // Barajar las respuestas de cada pregunta de forma independiente para que las opciones A, B, C, D nunca sean predecibles
      const prepared = selectedPool.map(prepareShuffledQuestion);

      setGameQuestions(prepared);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setCorrectCount(0);
      setIncorrectCount(0);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setAnswersHistory([]);
      setDurationSeconds(0);
      setLastSavedSessionId(null);
      setHasSubmittedFeedback(false);
      setScreen('quiz');
    },
    [nickname, avatar]
  );

  /**
   * Maneja la selección de una opción en la pregunta activa
   */
  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (isAnswerRevealed || selectedOption !== null) return;

      const currentQ = gameQuestions[currentIndex];
      if (!currentQ) return;

      const isCorrect = optionIndex === currentQ.correctAnswerIndex;
      setSelectedOption(optionIndex);
      setIsAnswerRevealed(true);

      // Calcular puntos: Base 100 + bonus de racha
      const points = isCorrect ? 100 + streak * 20 : 0;

      if (isCorrect) {
        setScore((prev) => prev + points);
        setStreak((prev) => prev + 1);
        setCorrectCount((prev) => prev + 1);
      } else {
        setStreak(0);
        setIncorrectCount((prev) => prev + 1);
      }

      setAnswersHistory((prev) => [
        ...prev,
        {
          questionId: currentQ.id,
          questionText: currentQ.question,
          selectedOption: currentQ.options[optionIndex],
          correctOption: currentQ.options[currentQ.correctAnswerIndex],
          isCorrect,
          category: currentQ.category,
        },
      ]);
    },
    [currentIndex, gameQuestions, isAnswerRevealed, selectedOption, streak]
  );

  /**
   * Finaliza la partida y envía estadísticas a Firebase
   */
  const finishGame = useCallback(
    async (finalCorrect: number, finalScore: number, finalHistory: GameAnswer[]) => {
      setScreen('gameover');
      setIsSaving(true);

      const totalQ = gameQuestions.length || 10;
      const accuracy = Math.round((finalCorrect / totalQ) * 100);

      // Calcular desglose por categoría
      const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
      finalHistory.forEach((ans) => {
        if (!categoryBreakdown[ans.category]) {
          categoryBreakdown[ans.category] = { correct: 0, total: 0 };
        }
        categoryBreakdown[ans.category].total += 1;
        if (ans.isCorrect) {
          categoryBreakdown[ans.category].correct += 1;
        }
      });

      const sessionPayload: Omit<GameSession, 'id'> = {
        nickname: nickname.trim() || 'Jugador Guaraní',
        avatar,
        score: finalScore,
        totalQuestions: totalQ,
        correctCount: finalCorrect,
        incorrectCount: totalQ - finalCorrect,
        accuracy,
        durationSeconds,
        completedAt: new Date().toISOString(),
        categoryBreakdown,
      };

      try {
        const id = await recordGameSession(sessionPayload);
        setLastSavedSessionId(id);
      } catch (err) {
        console.error('Error al registrar partida:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [avatar, durationSeconds, gameQuestions.length, nickname]
  );

  /**
   * Avanza a la siguiente pregunta o finaliza el juego
   */
  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 < gameQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      finishGame(correctCount, score, answersHistory);
    }
  }, [answersHistory, correctCount, currentIndex, finishGame, gameQuestions.length, score]);

  return {
    screen,
    setScreen,
    nickname,
    avatar,
    questionMode,
    setQuestionMode,
    updatePlayerProfile,
    gameQuestions,
    currentQuestion: gameQuestions[currentIndex],
    currentIndex,
    totalQuestions: gameQuestions.length,
    score,
    streak,
    correctCount,
    incorrectCount,
    selectedOption,
    isAnswerRevealed,
    answersHistory,
    durationSeconds,
    isSaving,
    lastSavedSessionId,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    hasSubmittedFeedback,
    setHasSubmittedFeedback,
    startNewGame,
    handleSelectOption,
    handleNextQuestion,
  };
}
