import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  isNewHighScore,
  onPlayAgain,
  onMainMenu,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GAME OVER</Text>

        {isNewHighScore && (
          <View style={styles.newHighScoreBadge}>
            <Text style={styles.newHighScoreText}>🎉 NEW HIGH SCORE! 🎉</Text>
          </View>
        )}

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
          <Text style={styles.highScoreValue}>{highScore}</Text>
        </View>

        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={onPlayAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.playAgainButtonText}>PLAY AGAIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMainMenu}
          activeOpacity={0.8}
        >
          <Text style={styles.menuButtonText}>MAIN MENU</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ff00ff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 3,
  },
  newHighScoreBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  newHighScoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00ff88',
    textAlign: 'center',
  },
  scoreContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    color: '#00ff88',
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  highScoreContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  highScoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  highScoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  playAgainButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  playAgainButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0a0a14',
    textAlign: 'center',
    letterSpacing: 2,
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 16,
    width: '100%',
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
