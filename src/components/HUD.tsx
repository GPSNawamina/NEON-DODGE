import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HUDProps {
  time: number;
  score: number;
  multiplier: number;
  highScore: number;
}

export const HUD: React.FC<HUDProps> = ({ time, score, multiplier, highScore }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.label}>TIME</Text>
          <Text style={styles.value}>{time}s</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.valueHighlight}>{score}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.label}>MULTIPLIER</Text>
          <Text style={styles.valueMultiplier}>x{multiplier.toFixed(1)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>HIGH SCORE</Text>
          <Text style={styles.value}>{highScore}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  valueHighlight: {
    fontSize: 28,
    color: '#00ff88',
    fontWeight: '800',
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  valueMultiplier: {
    fontSize: 20,
    color: '#ff00ff',
    fontWeight: '700',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
