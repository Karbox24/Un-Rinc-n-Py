/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTriviaGame } from './hooks/useTriviaGame';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { RankingSection } from './components/RankingSection';
import { PlayerStatsScreen } from './components/PlayerStatsScreen';
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
    personalRecord,
    isNewRecord,
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
      isQuizActive={screen === 'quiz'}
      header={
        <Header
          currentScreen={screen}
          onNavigateHome={() => setScreen('home')}
          onOpenAdmin={() => setScreen('admin')}
          onOpenRankingModal={() => setScreen('ranking')}
          onNavigateTo={(target) => setScreen(target)}
        />
      }
      bottomNav={
        <BottomNav
          currentScreen={screen}
          onNavigate={(target) => setScreen(target)}
        />
      }
    >
      {screen === 'home' && (
        <HomeScreen
          nickname={nickname}
          avatar={avatar}
          questionMode={questionMode}
          personalRecord={personalRecord}
          onStartGame={(nick, avt, mode) => startNewGame(nick, avt, mode)}
          onOpenAdmin={() => setScreen('admin')}
          onOpenRanking={() => setScreen('ranking')}
          onOpenStats={() => setScreen('stats')}
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
          nickname={nickname}
          avatar={avatar}
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
          personalRecord={personalRecord}
          isNewRecord={isNewRecord}
          onPlayAgain={() => startNewGame(nickname, avatar, questionMode)}
          onOpenFeedback={() => setIsFeedbackModalOpen(true)}
          onOpenRanking={() => setScreen('ranking')}
          onOpenStats={() => setScreen('stats')}
          onGoHome={() => setScreen('home')}
        />
      )}

      {screen === 'ranking' && (
        <RankingSection
          currentPlayerNick={nickname}
          onGoHome={() => setScreen('home')}
          onStartNewGame={() => startNewGame(nickname, avatar, questionMode)}
        />
      )}

      {screen === 'stats' && (
        <PlayerStatsScreen
          nickname={nickname}
          avatar={avatar}
          onGoHome={() => setScreen('home')}
          onStartGame={() => startNewGame(nickname, avatar, questionMode)}
          onOpenRanking={() => setScreen('ranking')}
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

      {/* Modal de Ranking Global */}
      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        currentPlayerNick={nickname}
      />
    </Layout>
  );
}

