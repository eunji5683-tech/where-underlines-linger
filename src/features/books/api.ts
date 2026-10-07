import { supabase } from '@/lib/supabase';
import type { BookDetails, Source, SourceStatus } from '@/types/database';

export type BookWithDetails = Source & { book_details: BookDetails | null };

export async function listBooks(userId: string, status: SourceStatus): Promise<BookWithDetails[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*, book_details(*)')
    .eq('user_id', userId)
    .eq('type', 'book')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as BookWithDetails[];
}

export async function getBook(sourceId: string): Promise<BookWithDetails> {
  const { data, error } = await supabase
    .from('sources')
    .select('*, book_details(*)')
    .eq('id', sourceId)
    .single();

  if (error) throw error;
  return data as unknown as BookWithDetails;
}

export interface CreateBookInput {
  userId: string;
  title: string;
  creator: string | null;
  coverUrl: string | null;
  externalId: string | null;
  status: 'wish' | 'ongoing';
  totalPages: number;
}

export async function createBook({
  userId,
  title,
  creator,
  coverUrl,
  externalId,
  status,
  totalPages,
}: CreateBookInput): Promise<BookWithDetails> {
  const { data: source, error: sourceError } = await supabase
    .from('sources')
    .insert({
      user_id: userId,
      type: 'book',
      title,
      creator,
      cover_url: coverUrl,
      external_id: externalId,
      status,
    })
    .select('*')
    .single();

  if (sourceError) throw sourceError;

  const { data: bookDetails, error: detailsError } = await supabase
    .from('book_details')
    .insert({ source_id: source.id, total_pages: totalPages, current_page: 0 })
    .select('*')
    .single();

  if (detailsError) throw detailsError;

  return { ...source, book_details: bookDetails };
}

export interface UpdateBookInput {
  sourceId: string;
  title: string;
  creator: string | null;
  totalPages: number;
}

export async function updateBook({ sourceId, title, creator, totalPages }: UpdateBookInput): Promise<void> {
  const { error: sourceError } = await supabase
    .from('sources')
    .update({ title, creator })
    .eq('id', sourceId);
  if (sourceError) throw sourceError;

  const { error: detailsError } = await supabase
    .from('book_details')
    .update({ total_pages: totalPages })
    .eq('source_id', sourceId);
  if (detailsError) throw detailsError;
}

export async function deleteBook(sourceId: string): Promise<void> {
  const { error } = await supabase.from('sources').delete().eq('id', sourceId);
  if (error) throw error;
}

export async function markBookDone(sourceId: string): Promise<void> {
  const { error: sourceError } = await supabase
    .from('sources')
    .update({ status: 'done' })
    .eq('id', sourceId);
  if (sourceError) throw sourceError;

  const { error: detailsError } = await supabase
    .from('book_details')
    .update({ finished_at: new Date().toISOString() })
    .eq('source_id', sourceId);
  if (detailsError) throw detailsError;
}

export interface LogReadingSessionInput {
  userId: string;
  sourceId: string;
  oldCurrentPage: number;
  newCurrentPage: number;
  startedAt: string;
  endedAt: string;
  hadStarted: boolean;
}

export async function logReadingSession({
  userId,
  sourceId,
  oldCurrentPage,
  newCurrentPage,
  startedAt,
  endedAt,
  hadStarted,
}: LogReadingSessionInput): Promise<void> {
  const pagesRead = Math.max(0, newCurrentPage - oldCurrentPage);
  const minutes = Math.max(1, Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000));

  const { error: detailsError } = await supabase
    .from('book_details')
    .update({
      current_page: newCurrentPage,
      ...(hadStarted ? {} : { started_at: startedAt }),
    })
    .eq('source_id', sourceId);
  if (detailsError) throw detailsError;

  const { error: sessionError } = await supabase.from('reading_sessions').insert({
    user_id: userId,
    source_id: sourceId,
    started_at: startedAt,
    ended_at: endedAt,
    minutes,
    pages_read: pagesRead,
  });
  if (sessionError) throw sessionError;
}
