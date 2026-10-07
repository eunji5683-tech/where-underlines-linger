import { useEffect } from 'react';

import {
  ensureNotificationPermission,
  parseReviewTime,
  scheduleDailyReviewReminder,
} from '@/features/notifications/api';
import type { Profile } from '@/types/database';

export function useSyncDailyReminder(profile: Profile | undefined) {
  useEffect(() => {
    if (!profile) return;

    (async () => {
      const granted = await ensureNotificationPermission();
      if (!granted) return;
      const { hour, minute } = parseReviewTime(profile.review_time);
      await scheduleDailyReviewReminder({ hour, minute });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the saved time actually changes, not on every profile refetch
  }, [profile?.review_time]);
}
