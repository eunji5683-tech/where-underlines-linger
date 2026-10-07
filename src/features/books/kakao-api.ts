export interface BookSearchResult {
  title: string;
  author: string | null;
  coverUrl: string | null;
  isbn: string | null;
}

interface KakaoBookDocument {
  title: string;
  authors: string[];
  thumbnail: string;
  isbn: string;
}

interface KakaoBookSearchResponse {
  documents: KakaoBookDocument[];
}

const apiKey = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  if (!apiKey) {
    throw new Error(
      '[Kakao] .env 파일에 EXPO_PUBLIC_KAKAO_REST_API_KEY를 설정해주세요. ' +
        '값을 바꾼 뒤에는 `npx expo start -c`로 다시 시작해야 합니다.'
    );
  }

  const response = await fetch(
    `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(query)}&size=15`,
    {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    }
  );

  if (!response.ok) {
    throw new Error(`카카오 도서 검색 실패: ${response.status}`);
  }

  const data: KakaoBookSearchResponse = await response.json();

  return data.documents.map((doc) => ({
    title: doc.title,
    author: doc.authors.length > 0 ? doc.authors.join(', ') : null,
    coverUrl: doc.thumbnail || null,
    isbn: doc.isbn ? doc.isbn.split(' ')[0] : null,
  }));
}
