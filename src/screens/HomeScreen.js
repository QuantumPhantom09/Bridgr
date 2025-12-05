import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
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
      console.error(e);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <ScreenWrapper>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor={colors.primary}/>}>
        <View style={styles.header}>
          <Text style={typography.header}>Bridgr Dashboard</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>LIVENET SIM</Text></View>
        </View>

        {/* AI Assistant Simulated */}
        <View style={styles.aiCard}>
          <MaterialCommunityIcons name="robot" size={24} color={colors.primary} />
          <Text style={styles.aiText}>
            Bridgr AI: "Pool liquidity is optimal. Predicted INR demand +5% next hour."
          </Text>
        </View>

        {/* POOLS */}
        <Text style={[typography.subheader, { marginTop: spacing.l }]}>Liquidity Pools</Text>
        <View style={styles.poolContainer}>
          <View style={styles.poolCard}>
            <Text style={styles.poolLabel}>Fiat (INR)</Text>
            <Text style={styles.poolValue}>₹ {pools?.current?.fiat_pool.toLocaleString()}</Text>
          </View>
          <View style={styles.poolCard}>
            <Text style={styles.poolLabel}>Crypto (BTC)</Text>
            <Text style={styles.poolValue}>₿ {pools?.current?.crypto_pool.toFixed(4)}</Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Scan')}>
            <MaterialCommunityIcons name="qrcode-scan" size={32} color="white" />
            <Text style={styles.btnText}>Scan & Pay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor: colors.surface}]} onPress={() => navigation.navigate('Fraud')}>
            <MaterialCommunityIcons name="shield-alert" size={32} color={colors.danger} />
            <Text style={styles.btnText}>Fraud Monitor</Text>
          </TouchableOpacity>
        </View>

        {/* DEMO MODE SHORTCUT */}
        <TouchableOpacity style={styles.demoBtn} onPress={() => navigation.navigate('Demo')}>
          <Text style={styles.demoText}>Open Demo Controls</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  aiCard: { flexDirection: 'row', backgroundColor: '#1e3a8a', padding: spacing.m, borderRadius: 12, alignItems: 'center' },
  aiText: { color: '#bfdbfe', marginLeft: spacing.s, flex: 1 },
  poolContainer: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.s },
  poolCard: { flex: 1, backgroundColor: colors.surface, padding: spacing.m, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.secondary },
  poolLabel: { color: colors.textSecondary, marginBottom: 4 },
  poolValue: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xl },
  actionBtn: { flex: 1, backgroundColor: colors.primary, height: 100, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', marginTop: 8 },
  demoBtn: { marginTop: spacing.xl, padding: spacing.m, alignItems: 'center' },
  demoText: { color: colors.textSecondary, textDecorationLine: 'underline' }
});
