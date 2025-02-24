import React from 'react';
import {
  ScrollView,
  VStack,
  Heading,
  Avatar,
  AvatarImage,
  Text,
  HStack,
  Progress,
  ProgressFilledTrack,
  Card,
  Badge,
  BadgeText,
  BadgeIcon,
  Icon,
  Divider,
} from '@gluestack-ui/themed';
import { Award, Star, Trophy } from 'lucide-react-native';

// Temporary mock data
const MOCK_USER = {
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?img=1',
  points: 750,
  nextLevel: 1000,
  level: 3,
  streak: 7,
  achievements: [
    {
      id: '1',
      title: 'Week Streak',
      description: 'Journaled for 7 days in a row',
      icon: Star,
    },
    {
      id: '2',
      title: 'Gratitude Master',
      description: 'Reached 500 points',
      icon: Trophy,
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Connected with 5 friends',
      icon: Award,
    },
  ],
};

export default function ProfileScreen() {
  const progressPercentage = (MOCK_USER.points / MOCK_USER.nextLevel) * 100;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <VStack space="xl" alignItems="center">
        <Avatar size="2xl">
          <AvatarImage source={{ uri: MOCK_USER.avatar }} />
        </Avatar>
        
        <VStack space="xs" alignItems="center">
          <Heading size="xl">{MOCK_USER.name}</Heading>
          <Text size="md" color="$gray500">Level {MOCK_USER.level}</Text>
        </VStack>

        <Card width="$full" p="$4">
          <VStack space="sm">
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontWeight="$bold">Points: {MOCK_USER.points}</Text>
              <Text color="$gray500">Next Level: {MOCK_USER.nextLevel}</Text>
            </HStack>
            <Progress value={progressPercentage} size="lg">
              <ProgressFilledTrack />
            </Progress>
          </VStack>
        </Card>

        <HStack space="md" flexWrap="wrap" justifyContent="center">
          <Badge size="lg" variant="solid" action="success">
            <BadgeText>{MOCK_USER.streak} Day Streak! 🔥</BadgeText>
          </Badge>
        </HStack>

        <Divider my="$2" />

        <VStack space="md" width="$full">
          <Heading size="lg">Achievements</Heading>
          {MOCK_USER.achievements.map((achievement) => (
            <Card key={achievement.id} p="$4">
              <HStack space="md" alignItems="center">
                <Badge size="lg" variant="solid" action="success">
                  <BadgeIcon as={achievement.icon} />
                </Badge>
                <VStack>
                  <Text fontWeight="$bold">{achievement.title}</Text>
                  <Text size="sm" color="$gray500">
                    {achievement.description}
                  </Text>
                </VStack>
              </HStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
} 