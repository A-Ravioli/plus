import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ScrollView,
  VStack,
  Heading,
  Button,
  ButtonText,
  Text,
  Card,
  Avatar,
  AvatarImage,
  HStack,
  Spinner,
  Center,
} from '@gluestack-ui/themed';
import { useAuth } from '../../contexts/auth';

interface Friend {
  email: string;
  username: string;
  userId: string;
}

export default function ContactImportScreen() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const { findFriendsFromContacts, sendFriendRequest } = useAuth();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const foundFriends = await findFriendsFromContacts();
      setFriends(foundFriends);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFriend = (userId: string) => {
    const newSelected = new Set(selectedFriends);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedFriends(newSelected);
  };

  const handleContinue = async () => {
    try {
      setSending(true);
      // Send friend requests to all selected users
      await Promise.all(
        Array.from(selectedFriends).map(userId => sendFriendRequest(userId))
      );
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error sending friend requests:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <VStack space="xl">
        <VStack space="xs">
          <Heading size="2xl">Find Friends</Heading>
          <Text color="$gray500">
            We found these Plus users in your contacts. Select the ones you'd like to connect with!
          </Text>
        </VStack>

        {friends.length === 0 ? (
          <Card p="$4">
            <Text textAlign="center" color="$gray500">
              No Plus users found in your contacts yet. You can add friends later!
            </Text>
          </Card>
        ) : (
          <VStack space="md">
            {friends.map((friend) => (
              <Card
                key={friend.userId}
                p="$4"
                borderColor={selectedFriends.has(friend.userId) ? '$primary500' : '$gray200'}
                borderWidth={2}
                onPress={() => toggleFriend(friend.userId)}
              >
                <HStack space="md" alignItems="center">
                  <Avatar size="md">
                    <AvatarImage source={{ uri: `https://www.gravatar.com/avatar/${friend.email}?d=identicon` }} />
                  </Avatar>
                  <VStack flex={1}>
                    <Text fontWeight="$bold">{friend.username}</Text>
                    <Text size="sm" color="$gray500">{friend.email}</Text>
                  </VStack>
                </HStack>
              </Card>
            ))}
          </VStack>
        )}

        <Button
          size="lg"
          onPress={handleContinue}
          isDisabled={sending}
        >
          <ButtonText>
            {sending
              ? 'Sending Requests...'
              : friends.length === 0
              ? 'Continue to App'
              : `Add ${selectedFriends.size} Friends & Continue`}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
} 