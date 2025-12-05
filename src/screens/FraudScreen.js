import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors, spacing } from '../config/theme';
import { api } from '../services/api';

export default function FraudScreen() {
  const [data, setData] = useState({ transactions: [], fraudAlerts: [] });
  const [prediction, setPrediction] = useState([]);

  useEffect(() => {
    const load = async () => {
      const txData = await api.getTransactions();
      const poolData = await api.getPools();
      setData(txData);
      setPrediction(poolData.prediction || [0]);
    };
    load();
    const interval = setInterval(load, 2000); // Poll for demo
    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Fraud & Liquidity Monitor</Text>

      {/* CHART */}
      <Text style={styles.sectionTitle}>Pool Demand Prediction (Next 10 Steps)</Text>
      <LineChart
        data={{
          labels: ["1", "3", "5", "7", "9"],
          datasets: [{ data: prediction.length ? prediction : [0] }]
        }}
        width={Dimensions.get("window").width - 32}
        height={180}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 2,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      {/* FRAUD LOG */}
      <Text style={[styles.sectionTitle, { color: colors.danger, marginTop: 20 }]}>Suspicious Activity</Text>
      <FlatList
        data={data.fraudAlerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <Text style={styles.alertHeader}>FLAGGED: {item.id}</Text>
            <Text style={styles.alertReason}>{item.fraud_flags.join(', ')}</Text>
            <Text style={{color: '#999'}}>Amount: {item.sender_amount} {item.sender_currency}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{color:'#555', marginTop:10}}>No fraud detected.</Text>}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  sectionTitle: { fontSize: 16, color: '#ccc', marginBottom: 5 },
  alertCard: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeftWidth: 4, borderLeftColor: colors.danger, padding: 10, marginBottom: 8, borderRadius: 4 },
  alertHeader: { color: colors.danger, fontWeight: 'bold' },
  alertReason: { color: 'white', fontWeight: '600' }
});
