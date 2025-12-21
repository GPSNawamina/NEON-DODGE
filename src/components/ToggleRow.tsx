import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onToggle: () => void;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({ label, value, onToggle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleActive]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.thumb, value && styles.thumbActive]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  toggle: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 3,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#00ff88',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbActive: {
    transform: [{ translateX: 28 }],
  },
});
