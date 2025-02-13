import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AuthService from '@/services/AuthService';
import FriendshipService from '@/services/FriendshipService';
import ApiService from '@/services/ApiService';

type Section = 'posts' | 'friends' | 'requests';

export default function ProfileScreen() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeSection]);

  const loadUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error('Error loading user:', e);
    }
  };

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      switch (activeSection) {
        case 'posts':
          const posts = await ApiService.getUserPosts(user.username);
          setUserPosts(posts);
          break;
        case 'friends':
          const friendsList = await FriendshipService.getMutualFriends(user.username);
          setFriends(friendsList);
          break;
        case 'requests':
          const requests = await FriendshipService.getPendingRequests(user.username);
          setPendingRequests(requests);
          break;
      }
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace('/');
    } catch (e) {
      console.error('Error logging out:', e);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!user || !newFriendUsername.trim()) return;

    try {
      await FriendshipService.sendFriendRequest(user.username, newFriendUsername.trim());
      setNewFriendUsername('');
      Alert.alert('Success', 'Friend request sent!');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (friendUsername: string) => {
    if (!user) return;

    try {
      await FriendshipService.acceptFriendRequest(user.username, friendUsername);
      loadData();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (friendUsername: string) => {
    if (!user) return;

    try {
      await FriendshipService.rejectFriendRequest(user.username, friendUsername);
      loadData();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to reject request');
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Please log in</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">@{user.username}</ThemedText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <ThemedText type="link">Logout</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'posts' && styles.activeTab]}
          onPress={() => setActiveSection('posts')}>
          <ThemedText>My Posts</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'friends' && styles.activeTab]}
          onPress={() => setActiveSection('friends')}>
          <ThemedText>Friends</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'requests' && styles.activeTab]}
          onPress={() => setActiveSection('requests')}>
          <ThemedText>Requests</ThemedText>
        </TouchableOpacity>
      </View>

      {activeSection === 'friends' && (
        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.input}
            value={newFriendUsername}
            onChangeText={setNewFriendUsername}
            placeholder="Enter username to add friend"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleSendFriendRequest} style={styles.addButton}>
            <ThemedText>Send Request</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={
            activeSection === 'posts'
              ? userPosts
              : activeSection === 'friends'
              ? friends
              : pendingRequests
          }
          keyExtractor={(item, index) => 
            activeSection === 'posts' ? item.id : item + index
          }
          renderItem={({ item }) => (
            <ThemedView style={styles.itemContainer}>
              {activeSection === 'posts' ? (
                <>
                  {item.bullets.map((bullet: string, index: number) => (
                    <ThemedText key={index} style={styles.bullet}>
                      • {bullet}
                    </ThemedText>
                  ))}
                  <ThemedText style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </ThemedText>
                </>
              ) : activeSection === 'friends' ? (
                <ThemedText>@{item}</ThemedText>
              ) : (
                <View style={styles.requestContainer}>
                  <ThemedText>@{item}</ThemedText>
                  <View style={styles.requestButtons}>
                    <TouchableOpacity
                      onPress={() => handleAcceptRequest(item)}
                      style={[styles.requestButton, styles.acceptButton]}>
                      <ThemedText style={styles.buttonText}>Accept</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRejectRequest(item)}
                      style={[styles.requestButton, styles.rejectButton]}>
                      <ThemedText style={styles.buttonText}>Reject</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <ThemedText>
                {activeSection === 'posts'
                  ? 'No posts yet'
                  : activeSection === 'friends'
                  ? 'No friends yet'
                  : 'No pending requests'}
              </ThemedText>
            </ThemedView>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0a7ea4',
  },
  addFriendContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    padding: 8,
    borderRadius: 8,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  bullet: {
    marginVertical: 4,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  requestButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
}); 