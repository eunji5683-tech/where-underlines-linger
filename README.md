# 밑줄이 머문 자리

책·드라마·영화·TV·유튜브·SNS에서 만난 문장을 모으고, 그 옆에 내 생각을 적어 다시 꺼내 보는 습관을 만들어주는 앱.

**웹에서 바로 보기**: https://eunji5683-tech.github.io/where-underlines-linger/
(카카오 도서 검색은 브라우저 보안 정책상 웹에서는 동작하지 않을 수 있습니다.)

## 주요 기능

- 텍스트 입력으로 문장 수집 + 출처(책/드라마/영화/TV/유튜브/SNS/기타) 관리
- 문장마다 '내 생각' 기록, 문장 없이 떠오른 순간의 생각도 별도 기록
- 독서 관리: 카카오 도서 검색으로 책 등록, 읽은 쪽수·진행률, 독서 타이머
- 영상(드라마·영화·TV) 위시리스트
- 간격 반복(1→3→7→14→30일) 복습 알림과 복습 카드
- 이메일 로그인/회원가입, 계정별 데이터 분리(Row Level Security)

사진 촬영 OCR 기능은 보류 중입니다 — 자세한 이유는 [CLAUDE.md](CLAUDE.md)의 "보류된 것" 참고.

## 기술 스택

- Expo(React Native) + TypeScript + Expo Router
- Supabase (Auth / Postgres / Storage)
- TanStack Query
- expo-notifications (로컬 알림)
- 카카오 도서 검색 API

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수

`.env.example`을 복사해 `.env` 파일을 만들고 값을 채워주세요.

```bash
cp .env.example .env
```

- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase 프로젝트 설정 > API에서 확인
- `EXPO_PUBLIC_KAKAO_REST_API_KEY`: [Kakao Developers](https://developers.kakao.com)에서 애플리케이션 생성 후 REST API 키 발급

`.env`는 절대 커밋하지 마세요(이미 `.gitignore`에 포함되어 있습니다).

### 3. Supabase 데이터베이스 준비

Supabase 대시보드 > SQL Editor에서 [`docs/schema.sql`](docs/schema.sql) 전체를 붙여넣고 실행하세요. 테이블 7개, RLS 정책, 트리거 2개(회원가입 시 프로필 자동 생성, 문장 저장 시 복습 일정 자동 생성)가 한 번에 만들어집니다.

개발 중에는 Authentication > Providers > Email에서 "Confirm email"을 꺼두면 가입 즉시 로그인할 수 있어 편합니다. 배포 전에는 다시 켜주세요.

### 4. 앱 실행

```bash
npx expo start
```

터미널에 뜨는 QR 코드를 [Expo Go](https://expo.dev/go) 앱으로 스캔하면 실제 기기에서 바로 확인할 수 있습니다.

## 문서

- [`CLAUDE.md`](CLAUDE.md): 프로젝트 소개, 작업·코딩 규칙, 폴더 구조, 디자인 방향
- [`docs/SPEC.md`](docs/SPEC.md): MVP 범위, 화면 구성, 기능 명세, 데이터 구조
- [`docs/schema.sql`](docs/schema.sql): Supabase 데이터베이스 스키마 전체
