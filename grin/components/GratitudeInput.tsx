import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface GratitudeInputProps {
  onBulletsChange: (bullets: string[]) => void;
}

export function GratitudeInput({ onBulletsChange }: GratitudeInputProps) {
  const [currentBullet, setCurrentBullet] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);

  const handleAddBullet = () => {
    if (currentBullet.trim()) {
      const newBullets = [...bullets, currentBullet.trim()];
      setBullets(newBullets);
      onBulletsChange(newBullets);
      setCurrentBullet('');
    }
  };

  const handleRemoveBullet = (index: number) => {
    const newBullets = bullets.filter((_, i) => i !== index);
    setBullets(newBullets);
    onBulletsChange(newBullets);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentBullet}
          onChangeText={setCurrentBullet}
          placeholder="Add a gratitude bullet point..."
          onSubmitEditing={handleAddBullet}
          returnKeyType="done"
          multiline={false}
        />
        <TouchableOpacity onPress={handleAddBullet} style={styles.addButton}>
          <ThemedText>Add</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.bulletList}>
        {bullets.map((bullet, index) => (
          <View key={index} style={styles.bulletItem}>
            <ThemedText>• {bullet}</ThemedText>
            <TouchableOpacity onPress={() => handleRemoveBullet(index)}>
              <ThemedText style={styles.removeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    color: '#ff4444',
    fontSize: 16,
    paddingHorizontal: 8,
  },
}); 