import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GratitudeInput } from '@/components/GratitudeInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ApiService from '@/services/ApiService';
import AuthService from '@/services/AuthService';

export default function CreatePostScreen() {
  const [bullets, setBullets] = useState<string[]>([]);
  const [mediaAssets, setMediaAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');

  const handleBulletsChange = (newBullets: string[]) => {
    setBullets(newBullets);
    setError('');
  };

  const handlePickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMediaAssets([...mediaAssets, ...result.assets]);
    }
  };

  const handlePost = async () => {
    if (bullets.length === 0) {
      setError('Please add at least one gratitude bullet point');
      return;
    }

    try {
      setIsPosting(true);
      setError('');

      const user = await AuthService.getCurrentUser();
      if (!user) {
        setError('Please log in to post');
        return;
      }

      await ApiService.createPost(user.username, bullets, mediaAssets);
      
      // Navigate back to home screen after posting
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.prompt}>
          What went well today?
        </ThemedText>

        <GratitudeInput onBulletsChange={handleBulletsChange} />

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}

        {bullets.length > 0 && (
          <ThemedView style={styles.actionsContainer}>
            <TouchableOpacity onPress={handlePickMedia} style={styles.mediaButton}>
              <IconSymbol name="paperplane.fill" size={24} color="#0a7ea4" />
              <ThemedText type="link">Add Photo/Video</ThemedText>
            </TouchableOpacity>

            {mediaAssets.length > 0 && (
              <ThemedText>
                {mediaAssets.length} media item{mediaAssets.length !== 1 ? 's' : ''} attached
              </ThemedText>
            )}

            <TouchableOpacity
              onPress={handlePost}
              disabled={isPosting}
              style={[styles.postButton, isPosting && styles.postButtonDisabled]}>
              {isPosting ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.postButtonText}>Post Gratitude</ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  prompt: {
    textAlign: 'center',
    marginVertical: 24,
  },
  actionsContainer: {
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  postButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
    minWidth: 150,
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 8,
  },
}); 