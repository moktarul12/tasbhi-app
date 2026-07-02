import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AllahBadge: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.text}>الله</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  text: {
    fontSize: 30,
    color: '#4A8FA3',
    fontWeight: '700',
  },
});

export default AllahBadge;
