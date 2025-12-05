import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors, typography, spacing } from '../config/theme';
import { api } from '../services/api';

export default function PaymentScreen({ route, navigation }) {
  const { receiver } = route.params;
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!amount) return;
    setLoading(true);
    
    // Hardcoded Sender (Alice) for Demo
    const payload = {
      from_id: 'alice',
      to_id: receiver.to_id,
      amount: parseFloat(amount),
      currency: 'BTC', // Sending BTC
      geo_risk: false // Toggle in demo if needed
    };

    try {
      const res = await api.pay(payload);
      if (res.success) {
        Alert.alert("Success", `Paid! New Trust Score: ${res.new_trust_score}`, [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Error", "Payment Failed");
      }
    } catch (e) {
      Alert.alert("Error", "Network Error");
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper>
      <Text style={typography.header}>Payment</Text>
      
      <View style={styles.card}>
        <Text style={typography.subheader}>To: {receiver.name || receiver.to_id}</Text>
        <Text style={typography.body}>Receives in: {receiver.currency}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>You Send (BTC)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="0.00" 
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.conversion}>
          ~ {(parseFloat(amount || 0) * 5000000).toLocaleString()} INR
        </Text>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
        {loading ? <ActivityIndicator color="white"/> : <Text style={styles.btnText}>CONFIRM PAYMENT</Text>}
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, padding: spacing.m, borderRadius: 8, marginVertical: spacing.l },
  form: { gap: spacing.s },
  label: { color: colors.textSecondary },
  input: { backgroundColor: colors.surface, color: 'white', fontSize: 32, padding: spacing.m, borderRadius: 8 },
  conversion: { color: colors.secondary, textAlign: 'right' },
  payBtn: { backgroundColor: colors.secondary, padding: spacing.l, borderRadius: 12, alignItems: 'center', marginTop: spacing.xl },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});
