import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GratitudeInput from '../components/GratitudeInput';

const CreatePostScreen = ({ navigation }) => {
  const [bullets, setBullets] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  const addBullet = () => {
    if (currentInput.trim() !== '') {
      setBullets([...bullets, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const handlePost = () => {
    // Here, you would normally post the new entry via ApiService
    alert('Post submitted!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>What went well today?</Text>
      <GratitudeInput
        bullets={bullets}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        addBullet={addBullet}
      />
      {bullets.length > 0 && (
        <Button title="Post" onPress={handlePost} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  prompt: {
    fontSize: 20,
    marginBottom: 10
  }
});

export default CreatePostScreen; 