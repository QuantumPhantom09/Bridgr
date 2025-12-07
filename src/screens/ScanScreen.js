import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as Camera from 'expo-camera';
import { colors } from '../config/theme';

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      // Parse QR JSON payload
      // Expecting: {"to_id": "bob", "currency": "INR", "name": "Bob's Shop"}
      const payload = JSON.parse(data);
      navigation.navigate('Payment', { receiver: payload });
    } catch (e) {
      alert("Invalid QR Code for Bridgr");
      setScanned(false);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <Camera.Camera
    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
    style={StyleSheet.absoluteFillObject}/>
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.text}>Scan Merchant QR</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={{color: 'white'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: colors.primary, backgroundColor: 'transparent' },
  text: { color: 'white', marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  cancelBtn: { marginTop: 40, padding: 10 }
});
