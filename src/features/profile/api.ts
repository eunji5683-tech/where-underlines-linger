import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export interface UpdateReviewTimeInput {
  userId: string;
  reviewTime: string;
}

export async function updateReviewTime({ userId, reviewTime }: UpdateReviewTimeInput): Promise<void> {
  const { error } = await supabase.from('profiles').update({ review_time: reviewTime }).eq('id', userId);
  if (error) throw error;
}
