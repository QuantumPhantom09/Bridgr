import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../config/theme';

export default function Button({ title, onPress, variant = 'primary', loading = false, style }) {
  const bg = variant === 'primary' ? colors.primary : 
             variant === 'danger' ? colors.danger : 
             colors.surface;
  
  return (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: bg }, style]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.s
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});