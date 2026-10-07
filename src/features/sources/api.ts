import { supabase } from '@/lib/supabase';
import type { Source, SourceType } from '@/types/database';

export async function listSources(userId: string): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export interface CreateSourceInput {
  userId: string;
  title: string;
  type: SourceType;
}

export async function createSource({ userId, title, type }: CreateSourceInput): Promise<Source> {
  const { data, error } = await supabase
    .from('sources')
    .insert({ user_id: userId, title, type })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
