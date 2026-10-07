import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function useNotificationResponseListener() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'review') {
        router.push('/');
      }
    });
    return () => subscription.remove();
  }, []);
}
