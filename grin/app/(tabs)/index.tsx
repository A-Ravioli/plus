import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl, Image, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AuthService from '@/services/AuthService';
import ApiService, { GratitudePost } from '@/services/ApiService';
import NotificationService from '@/services/NotificationService';
import * as Notifications from 'expo-notifications';

export default function HomeScreen() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [posts, setPosts] = useState<GratitudePost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize notifications when the app starts
    NotificationService.initialize().catch(console.error);

    // Set up notification handlers
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const username = response.notification.request.content.data?.username;
      if (username) {
        // TODO: Navigate to user's profile or post
        console.log('Navigate to user:', username);
      }
    });

    // Schedule daily reminder at 8 PM
    NotificationService.scheduleReminder(20, 0).catch(console.error);

    return () => {
      subscription.remove();
    };
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error('Error loading user:', e);
    }
  };

  const loadPosts = async () => {
    try {
      setError('');
      if (!user) return;
      
      const feedPosts = await ApiService.getFeed(user.username);
      setPosts(feedPosts);
    } catch (e) {
      setError('Failed to load posts');
      console.error('Error loading posts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadUser(), loadPosts()]);
    setRefreshing(false);
  }, []);

  const renderPost = ({ item }: { item: GratitudePost }) => (
    <ThemedView style={styles.postContainer}>
      <ThemedText type="defaultSemiBold" style={styles.username}>
        @{item.username}
      </ThemedText>
      
      {item.bullets.map((bullet, index) => (
        <ThemedText key={index} style={styles.bullet}>
          • {bullet}
        </ThemedText>
      ))}

      {item.mediaUrls.length > 0 && (
        <View style={styles.mediaContainer}>
          {item.mediaUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}
      
      <ThemedText style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </ThemedText>
    </ThemedView>
  );

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Welcome to Gratitude</ThemedText>
        <ThemedText>Please log in to see gratitude posts from your friends.</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Loading posts...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No gratitude posts yet. Be the first to share!</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  postContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  username: {
    marginBottom: 8,
  },
  bullet: {
    marginVertical: 4,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  mediaImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    color: '#ff4444',
  },
});
