import React, { useState } from 'react';
import {
  ScrollView,
  VStack,
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Card,
  Text,
  Avatar,
  AvatarImage,
  HStack,
  Button,
  ButtonText,
  Tabs,
  TabList,
  Tab,
  TabTitle,
  TabPanels,
  TabPanel,
  Icon,
} from '@gluestack-ui/themed';
import { Search, UserPlus, Check, X } from 'lucide-react-native';

// Temporary mock data
const MOCK_FRIENDS = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'friends',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'friends',
  },
];

const MOCK_REQUESTS = [
  {
    id: '3',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'pending',
  },
];

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAcceptRequest = (id: string) => {
    // TODO: Implement Firebase friend request acceptance
    console.log('Accepting request:', id);
  };

  const handleRejectRequest = (id: string) => {
    // TODO: Implement Firebase friend request rejection
    console.log('Rejecting request:', id);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <VStack space="lg">
        <Heading size="xl">Friends</Heading>

        <Input>
          <InputSlot pl="$3">
            <InputIcon as={Search} />
          </InputSlot>
          <InputField
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>

        <Tabs>
          <TabList>
            <Tab>
              <TabTitle>Friends</TabTitle>
            </Tab>
            <Tab>
              <TabTitle>Requests</TabTitle>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack space="md">
                {MOCK_FRIENDS.map((friend) => (
                  <Card key={friend.id} p="$4">
                    <HStack space="md" alignItems="center">
                      <Avatar size="md">
                        <AvatarImage source={{ uri: friend.avatar }} />
                      </Avatar>
                      <Text flex={1} fontWeight="$bold">
                        {friend.name}
                      </Text>
                    </HStack>
                  </Card>
                ))}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack space="md">
                {MOCK_REQUESTS.map((request) => (
                  <Card key={request.id} p="$4">
                    <HStack space="md" alignItems="center">
                      <Avatar size="md">
                        <AvatarImage source={{ uri: request.avatar }} />
                      </Avatar>
                      <Text flex={1} fontWeight="$bold">
                        {request.name}
                      </Text>
                      <HStack space="sm">
                        <Button
                          size="sm"
                          variant="solid"
                          onPress={() => handleAcceptRequest(request.id)}
                          leftIcon={<Icon as={Check} />}
                        >
                          <ButtonText>Accept</ButtonText>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => handleRejectRequest(request.id)}
                          leftIcon={<Icon as={X} />}
                        >
                          <ButtonText>Reject</ButtonText>
                        </Button>
                      </HStack>
                    </HStack>
                  </Card>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </ScrollView>
  );
} 