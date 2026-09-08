/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTriviaGame } from './hooks/useTriviaGame';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { AdminPanel } from './components/AdminPanel';
import { RankingModal } from './components/RankingModal';

export default function App() {
  const {
    screen,
    setScreen,
    nickname,
    avatar,
    questionMode,
    currentQuestion,
    currentIndex,
    totalQuestions,
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
  } = useTriviaGame();

  const [isRankingModalOpen, setIsRankingModalOpen] = useState<boolean>(false);

  return (
    <Layout
      header={
        <Header
          currentScreen={screen}
          onNavigateHome={() => setScreen('home')}
          onOpenAdmin={() => setScreen('admin')}
          onOpenRankingModal={() => setIsRankingModalOpen(true)}
        />
      }
    >
      {screen === 'home' && (
        <HomeScreen
          nickname={nickname}
          avatar={avatar}
          questionMode={questionMode}
          onStartGame={(nick, avt, mode) => startNewGame(nick, avt, mode)}
          onOpenAdmin={() => setScreen('admin')}
          onOpenRanking={() => setIsRankingModalOpen(true)}
        />
      )}

      {screen === 'quiz' && currentQuestion && (
        <QuizScreen
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          score={score}
          streak={streak}
          durationSeconds={durationSeconds}
          selectedOption={selectedOption}
          isAnswerRevealed={isAnswerRevealed}
          onSelectOption={handleSelectOption}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          nickname={nickname}
          avatar={avatar}
          score={score}
          totalQuestions={totalQuestions}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          durationSeconds={durationSeconds}
          isSaving={isSaving}
          hasSubmittedFeedback={hasSubmittedFeedback}
          answersHistory={answersHistory}
          onPlayAgain={() => startNewGame(nickname, avatar, questionMode)}
          onOpenFeedback={() => setIsFeedbackModalOpen(true)}
          onOpenRanking={() => setIsRankingModalOpen(true)}
          onGoHome={() => setScreen('home')}
        />
      )}

      {screen === 'admin' && (
        <AdminPanel onBack={() => setScreen('home')} />
      )}

      {/* Modal de Feedback Post-Partida guardado para el Administrador */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        nickname={nickname}
        score={score}
        gameSessionId={lastSavedSessionId}
        onFeedbackSaved={() => {
          setHasSubmittedFeedback(true);
        }}
      />

      {/* Modal de Ranking Global preparado para Fase 2 */}
      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        currentPlayerNick={nickname}
      />
    </Layout>
  );
}

