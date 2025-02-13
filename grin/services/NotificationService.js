import * as Notifications from 'expo-notifications';

const NotificationService = {
  scheduleNotification: async (content, trigger) => {
    try {
      const schedulingOptions = trigger ? { content, trigger } : { content };
      const notificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }
};

export default NotificationService; 