import React from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const GratitudeInput = ({ bullets, currentInput, setCurrentInput, addBullet }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a good thing"
        value={currentInput}
        onChangeText={setCurrentInput}
      />
      <Button title="Add" onPress={addBullet} />
      {bullets.map((bullet, index) => (
        <Text key={index} style={styles.bullet}>- {bullet}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 5,
  },
  bullet: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default GratitudeInput; 