import { supabase } from '@/lib/supabase';
import type { Source, SourceStatus, SourceType } from '@/types/database';

export type WatchSourceType = 'drama' | 'movie' | 'tv';

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

export async function listWatchSources(userId: string, status: SourceStatus): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('user_id', userId)
    .in('type', ['drama', 'movie', 'tv'])
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export interface CreateWatchSourceInput {
  userId: string;
  title: string;
  type: WatchSourceType;
  status: SourceStatus;
}

export async function createWatchSource({
  userId,
  title,
  type,
  status,
}: CreateWatchSourceInput): Promise<Source> {
  const { data, error } = await supabase
    .from('sources')
    .insert({ user_id: userId, title, type, status })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
