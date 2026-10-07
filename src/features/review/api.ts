import { getQuote } from '@/features/quotes/api';
import { supabase } from '@/lib/supabase';
import type { Quote, ReviewResult } from '@/types/database';

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export interface DueReview {
  quoteId: string;
  intervalDays: number;
  reviewCount: number;
  quote: Quote;
}

export async function getDueQuote(userId: string): Promise<DueReview | null> {
  const { data, error } = await supabase
    .from('review_schedule')
    .select('quote_id, interval_days, review_count')
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const row = data[0];
  const quote = await getQuote(row.quote_id);
  return {
    quoteId: row.quote_id,
    intervalDays: row.interval_days,
    reviewCount: row.review_count,
    quote,
  };
}

function nextIntervalDays(current: number, result: ReviewResult): number {
  if (result === 'again') return 1;
  const idx = REVIEW_INTERVALS.indexOf(current as (typeof REVIEW_INTERVALS)[number]);
  const nextIdx = idx === -1 ? 0 : Math.min(idx + 1, REVIEW_INTERVALS.length - 1);
  return REVIEW_INTERVALS[nextIdx];
}

export interface SubmitReviewInput {
  quoteId: string;
  currentIntervalDays: number;
  currentReviewCount: number;
  result: ReviewResult;
}

export async function submitReview({
  quoteId,
  currentIntervalDays,
  currentReviewCount,
  result,
}: SubmitReviewInput): Promise<void> {
  const intervalDays = nextIntervalDays(currentIntervalDays, result);
  const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('review_schedule')
    .update({
      interval_days: intervalDays,
      next_review_at: nextReviewAt,
      last_result: result,
      review_count: currentReviewCount + 1,
    })
    .eq('quote_id', quoteId);

  if (error) throw error;
}
