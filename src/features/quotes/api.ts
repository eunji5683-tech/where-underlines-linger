import { supabase } from '@/lib/supabase';
import type { Quote } from '@/types/database';

export interface ListQuotesFilters {
  search: string;
  sourceId: string | null;
}

export async function listQuotes(userId: string, filters: ListQuotesFilters): Promise<Quote[]> {
  let query = supabase
    .from('quotes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters.sourceId) {
    query = query.eq('source_id', filters.sourceId);
  }
  if (filters.search.trim()) {
    query = query.ilike('text', `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getQuote(id: string): Promise<Quote> {
  const { data, error } = await supabase.from('quotes').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export interface CreateQuoteInput {
  userId: string;
  text: string;
  sourceId: string | null;
}

export async function createQuote({ userId, text, sourceId }: CreateQuoteInput): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .insert({ user_id: userId, text, source_id: sourceId })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export interface UpdateQuoteInput {
  id: string;
  text: string;
  sourceId: string | null;
}

export async function updateQuote({ id, text, sourceId }: UpdateQuoteInput): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .update({ text, source_id: sourceId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
