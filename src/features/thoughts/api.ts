import { supabase } from '@/lib/supabase';
import type { Thought } from '@/types/database';

export async function listThoughtsForQuote(quoteId: string): Promise<Thought[]> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .eq('quote_id', quoteId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function listUnlinkedThoughts(userId: string): Promise<Thought[]> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .eq('user_id', userId)
    .is('quote_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export interface CreateThoughtInput {
  userId: string;
  quoteId: string | null;
  body: string;
}

export async function createThought({ userId, quoteId, body }: CreateThoughtInput): Promise<Thought> {
  const { data, error } = await supabase
    .from('thoughts')
    .insert({ user_id: userId, quote_id: quoteId, body })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export interface LinkThoughtInput {
  thoughtId: string;
  quoteId: string;
}

export async function linkThoughtToQuote({ thoughtId, quoteId }: LinkThoughtInput): Promise<Thought> {
  const { data, error } = await supabase
    .from('thoughts')
    .update({ quote_id: quoteId })
    .eq('id', thoughtId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
