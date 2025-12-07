// src/components/StatCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function StatCard({ title, value, unit, iconName, color = colors.primary }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '33' }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    marginVertical: spacing.s,
    marginHorizontal: spacing.xs,
    alignItems: 'flex-start',
  },
  iconContainer: {
    padding: spacing.s,
    borderRadius: 8,
    marginBottom: spacing.s,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  unit: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
});