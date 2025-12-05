import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ScreenWrapper from '../components/ScreenWrapper';
import { api } from '../services/api';
import { colors, spacing } from '../config/theme';

export default function DemoControlScreen() {
  
  const runReset = async () => {
    await api.reset();
    Alert.alert("Reset Complete", "Pools and Users reset.");
  };

  const runVelocityBot = async () => {
    const payload = { from_id: 'alice', to_id: 'bob', amount: 0.0001, currency: 'BTC' };
    // Fire 4 times
    for(let i=0; i<4; i++) await api.pay(payload);
    Alert.alert("Bot Run", "4 rapid transactions fired.");
  };

  const runHighValue = async () => {
    // > 5% of fiat pool (pool is 500k, so > 25k INR value)
    // Sending 0.01 BTC (~50,000 INR)
    const payload = { from_id: 'alice', to_id: 'bob', amount: 0.1, currency: 'BTC' };
    await api.pay(payload);
    Alert.alert("Whale Tx", "High value transaction sent.");
  };

  const qrData = JSON.stringify({ to_id: 'bob', currency: 'INR', name: 'Bob Store' });

  return (
    <ScreenWrapper>
      <ScrollView>
        <Text style={styles.header}>Presenter Controls</Text>
        
        <View style={styles.section}>
          <Text style={styles.sub}>1. Merchant QR Code</Text>
          <View style={{alignItems: 'center', margin: 20, backgroundColor: 'white', padding: 10}}>
            <QRCode value={qrData} size={150} />
            <Text style={{color: 'black'}}>Bob (INR)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sub}>2. Scenarios</Text>
          <View style={{gap: 10}}>
            <Button title="RESET DEMO STATE" onPress={runReset} color={colors.warning} />
            <Button title="Trigger Velocity Fraud (4x Tx)" onPress={runVelocityBot} color={colors.danger} />
            <Button title="Trigger High Value Fraud" onPress={runHighValue} color={colors.danger} />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  sub: { fontSize: 18, color: colors.primary, marginBottom: 10 },
  section: { marginBottom: 30, padding: 10, backgroundColor: colors.surface, borderRadius: 10 }
});
