export type SourceType = 'book' | 'drama' | 'movie' | 'tv' | 'youtube' | 'sns' | 'etc';
export type SourceStatus = 'wish' | 'ongoing' | 'done';
export type ReviewResult = 'remembered' | 'again';

export interface Profile {
  id: string;
  nickname: string | null;
  review_time: string;
  created_at: string;
}

export interface Source {
  id: string;
  user_id: string;
  type: SourceType;
  title: string;
  creator: string | null;
  url: string | null;
  cover_url: string | null;
  external_id: string | null;
  status: SourceStatus;
  created_at: string;
}

export interface BookDetails {
  source_id: string;
  total_pages: number | null;
  current_page: number;
  started_at: string | null;
  finished_at: string | null;
}

export interface HighlightBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Quote {
  id: string;
  user_id: string;
  source_id: string | null;
  text: string;
  image_path: string | null;
  highlight_boxes: HighlightBox[] | null;
  page_number: number | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Thought {
  id: string;
  user_id: string;
  quote_id: string | null;
  source_id: string | null;
  body: string;
  tags: string[];
  created_at: string;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  source_id: string;
  started_at: string;
  ended_at: string | null;
  minutes: number | null;
  pages_read: number | null;
}

export interface ReviewSchedule {
  quote_id: string;
  user_id: string;
  interval_days: number;
  next_review_at: string | null;
  last_result: ReviewResult | null;
  review_count: number;
}
