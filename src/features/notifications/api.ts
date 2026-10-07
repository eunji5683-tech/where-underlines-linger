import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 앱이 켜져 있는 동안(포그라운드)에도 알림 배너가 보이도록 설정.
// 기본값은 포그라운드에서 알림을 조용히 숨기기 때문에 명시적으로 켜줘야 한다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return status === 'granted';
}

export interface ScheduleDailyReviewInput {
  hour: number;
  minute: number;
}

export async function scheduleDailyReviewReminder({ hour, minute }: ScheduleDailyReviewInput): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '오늘의 복습',
      body: '오늘 복습할 문장이 기다리고 있어요.',
      data: { type: 'review' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export function parseReviewTime(reviewTime: string): { hour: number; minute: number } {
  const [h, m] = reviewTime.split(':');
  return { hour: Number(h), minute: Number(m) };
}
