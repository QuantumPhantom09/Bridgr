import React from 'react';
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../config/theme';

export default function ScreenWrapper({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 16 }
});
