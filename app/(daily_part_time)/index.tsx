import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Daily Part Time Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});