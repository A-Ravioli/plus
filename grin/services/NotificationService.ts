import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import FriendshipService from './FriendshipService';

// Configure notifications for the app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private static pushToken: string | null = null;

  async initialize(): Promise<void> {
    // Request permission for notifications
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get the token for this device
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    NotificationService.pushToken = token;

    // Set up notification channels for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  async notifyFriendsOfNewPost(username: string, firstBullet: string): Promise<void> {
    // In a real implementation, we would send this to a server
    // which would then use the Expo push notification service
    // to send notifications to all mutual friends

    // For now, we'll just simulate local notifications
    const mutualFriends = await FriendshipService.getMutualFriends(username);
    
    if (mutualFriends.length > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `New gratitude from @${username}`,
          body: firstBullet,
          data: { username },
        },
        trigger: null, // Send immediately
      });
    }
  }

  async scheduleReminder(hour: number, minute: number): Promise<string> {
    // Schedule a daily reminder notification
    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for Gratitude!",
        body: "What went well today? Take a moment to reflect and share.",
      },
      trigger,
    });

    return identifier;
  }

  async cancelReminder(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async getPushToken(): Promise<string | null> {
    return NotificationService.pushToken;
  }
}

export default new NotificationService(); 