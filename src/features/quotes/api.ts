import { supabase } from '@/lib/supabase';
import type { Quote } from '@/types/database';

export interface ListQuotesFilters {
  search: string;
  sourceId: string | null;
}

function baseQuotesQuery(userId: string, sourceId: string | null) {
  let query = supabase.from('quotes').select('*').eq('user_id', userId);
  if (sourceId) {
    query = query.eq('source_id', sourceId);
  }
  return query;
}

export async function listQuotes(userId: string, filters: ListQuotesFilters): Promise<Quote[]> {
  const term = filters.search.trim();

  if (!term) {
    const { data, error } = await baseQuotesQuery(userId, filters.sourceId).order('created_at', {
      ascending: false,
    });
    if (error) throw error;
    return data;
  }

  // 문장 텍스트뿐 아니라, 그 문장에 달린 '내 생각' 내용에서도 찾는다.
  const { data: thoughtRows, error: thoughtError } = await supabase
    .from('thoughts')
    .select('quote_id')
    .eq('user_id', userId)
    .not('quote_id', 'is', null)
    .ilike('body', `%${term}%`);
  if (thoughtError) throw thoughtError;
  const thoughtQuoteIds = [...new Set(thoughtRows.map((row) => row.quote_id).filter((id): id is string => !!id))];

  const { data: textMatches, error: textError } = await baseQuotesQuery(userId, filters.sourceId)
    .ilike('text', `%${term}%`)
    .order('created_at', { ascending: false });
  if (textError) throw textError;

  const matchedIds = new Set(textMatches.map((quote) => quote.id));
  const missingIds = thoughtQuoteIds.filter((id) => !matchedIds.has(id));

  let combined = textMatches;
  if (missingIds.length > 0) {
    const { data: extraMatches, error: extraError } = await baseQuotesQuery(userId, filters.sourceId).in(
      'id',
      missingIds
    );
    if (extraError) throw extraError;
    combined = [...combined, ...extraMatches];
  }

  return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
