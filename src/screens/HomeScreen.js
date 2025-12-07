// src/screens/HomeScreen.js (Aesthetic Update)

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import { colors, typography, spacing } from '../config/theme';
import { api } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [pools, setPools] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const data = await api.getPools();
      setPools(data);
    } catch (e) {
      console.error("API Fetch Error:", e);
      // Show an alert if the network is still failing
      if (!pools) {
         Alert.alert("Connection Error", "Could not fetch data from the simulator. Check API_URL and server status.");
      }
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fiatPoolValue = pools?.current?.fiat_pool || 0;
  const cryptoPoolValue = pools?.current?.crypto_pool || 0;
  const stablePoolValue = pools?.current?.stablecoin_pool || 0;
  const totalPoolValue = (fiatPoolValue / (pools?.rates?.USD_TO_INR || 83)) + stablePoolValue + (cryptoPoolValue * (pools?.rates?.BTC_TO_USD || 60000));
  
  return (
    <ScreenWrapper>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor={colors.primary}/>}>
        <View style={styles.header}>
          <Text style={typography.header}>Bridgr Analytics</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>LIVENET SIM</Text></View>
        </View>

        {/* Total Liquidity Card */}
        <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Bridgr Liquidity (USD Equiv.)</Text>
            <Text style={styles.totalValue}>${totalPoolValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
        </View>

        {/* AI Assistant Simulated */}
        <View style={styles.aiCard}>
          <MaterialCommunityIcons name="robot" size={24} color={colors.secondary} />
          <Text style={styles.aiText}>
            Bridgr AI: "Pool liquidity is healthy. Fiat demand is predicted to rise due to velocity flags."
          </Text>
        </View>

        {/* POOLS using StatCard */}
        <Text style={[typography.subheader, { marginTop: spacing.l }]}>Pool Health</Text>
        <View style={styles.poolContainer}>
          <StatCard 
            title="Fiat Liquidity"
            value={fiatPoolValue.toLocaleString()}
            unit="INR"
            iconName="cash-multiple"
            color={colors.secondary}
          />
          <StatCard 
            title="Crypto Reserve"
            value={cryptoPoolValue.toFixed(2)}
            unit="BTC"
            iconName="bitcoin"
            color={colors.primary}
          />
        </View>
        <View style={styles.poolContainer}>
          <StatCard 
            title="Stablecoin Reserve"
            value={stablePoolValue.toLocaleString()}
            unit="USD"
            iconName="currency-usd"
            color={colors.warning}
          />
          <StatCard 
            title="Exchange Rate"
            value={`1 BTC`}
            unit={`~${(pools?.rates?.BTC_TO_INR || 5000000).toLocaleString()} INR`}
            iconName="swap-horizontal"
            color={colors.textSecondary}
          />
        </View>

        {/* ACTIONS using Button component */}
        <Text style={[typography.subheader, { marginTop: spacing.xl }]}>Actions</Text>
        <View style={styles.actionRow}>
          <Button 
            title="SCAN TO PAY" 
            onPress={() => navigation.navigate('Scan')}
            style={{height: 100, flex: 1}}
            accessibilityLabel="Scan QR code to initiate payment"
          />
          <Button 
            title="FRAUD MONITOR" 
            variant="danger"
            onPress={() => navigation.navigate('Fraud')}
            style={{height: 100, flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.danger}}
            accessibilityLabel="Open fraud and liquidity monitor dashboard"
          />
        </View>

        {/* DEMO MODE SHORTCUT */}
        <TouchableOpacity style={styles.demoBtn} onPress={() => navigation.navigate('Demo')}>
          <Text style={styles.demoText}>Open Demo/Presenter Controls</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  badge: { backgroundColor: colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: colors.background, fontSize: 10, fontWeight: 'bold' },
  totalCard: { 
    backgroundColor: colors.primary, 
    padding: spacing.l, 
    borderRadius: 12, 
    marginBottom: spacing.l,
    alignItems: 'center'
  },
  totalLabel: { color: 'white', opacity: 0.8, fontSize: 16 },
  totalValue: { color: 'white', fontSize: 36, fontWeight: '900', marginTop: 4 },
  aiCard: { flexDirection: 'row', backgroundColor: '#1e3a8a', padding: spacing.m, borderRadius: 12, alignItems: 'center', marginVertical: spacing.s },
  aiText: { color: '#bfdbfe', marginLeft: spacing.s, flex: 1 },
  poolContainer: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.s },
  actionRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.l },
  demoBtn: { marginTop: spacing.xl, padding: spacing.m, alignItems: 'center' },
  demoText: { color: colors.textSecondary, textDecorationLine: 'underline' }
});