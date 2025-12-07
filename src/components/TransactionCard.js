import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../config/theme';

export default function TransactionCard({ tx }) {
  const isFraud = tx.fraud_flags && tx.fraud_flags.length > 0;
  
  return (
    <View style={[styles.card, isFraud && styles.fraudCard]}>
      <View style={styles.row}>
        <Text style={styles.id}>{tx.id}</Text>
        <Text style={styles.date}>{new Date(tx.timestamp).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.amount}>
          {tx.sender_amount} {tx.sender_currency} → {tx.receiver_currency}
        </Text>
        {isFraud && <Text style={styles.fraudBadge}>⚠ SUSPICIOUS</Text>}
      </View>
      {isFraud && (
        <Text style={styles.reason}>{tx.fraud_flags.join(', ')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.s,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary
  },
  fraudCard: {
    borderLeftColor: colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.1)'
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  id: { color: colors.textSecondary, fontFamily: 'monospace' },
  date: { color: colors.textSecondary, fontSize: 12 },
  amount: { color: colors.text, fontWeight: 'bold' },
  fraudBadge: { color: colors.danger, fontWeight: 'bold', fontSize: 12 },
  reason: { color: colors.danger, fontSize: 12, marginTop: 4 }
});