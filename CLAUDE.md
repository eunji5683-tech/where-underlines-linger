# 밑줄이 머문 자리

## 앱 소개
책·드라마·영화·TV·유튜브·SNS에서 만난 문장을 수집하는 앱.
- 사진 촬영(OCR) 또는 붙여넣기로 문장 수집
- 형광펜으로 원하는 줄을 선택해서 하이라이트(한 줄 또는 여러 줄 가능)
- 문장마다 '내 생각' 기록
- 문장이 떠오른 순간의 생각도 별도로 기록
- 독서 관리: 책 등록, 진행률, 독서 타이머
- 간격 반복(spaced repetition) 복습 알림

## 기술 스택
- Expo (React Native) + TypeScript + Expo Router
- Supabase (Auth / Postgres / Storage)
- expo-notifications
- TanStack Query

## 작업 규칙
- 한국어로 설명한다.
- 한 번에 한 단계만 진행한다.
- 큰 변경 전에는 계획을 먼저 보여주고 승인을 받는다.
- 작은 단위로 커밋한다. 커밋 메시지는 한국어 한 줄로 쓴다.
- .env와 비밀 키는 절대 커밋하지 않는다.
- 모르는 것은 추측하지 말고 묻는다.
- 새 라이브러리를 추가할 때는 이유를 설명한다.

## 코딩 규칙
- TypeScript strict 모드를 사용한다.
- 컴포넌트는 작게 쪼갠다.
- 화면에 보이는 문구는 한 곳에서 관리한다.
- 에러, 로딩, 빈 화면 상태를 항상 처리한다.

## 폴더 구조
```
src/
  components/      # 공통 UI 컴포넌트
  features/
    quotes/         # 문장 수집/하이라이트/내 생각
    sources/        # 출처(책/드라마/영화 등) 관리
    books/          # 독서 관리(등록/진행률/타이머)
    review/         # 간격 반복 복습
  lib/              # Supabase 클라이언트, 유틸 등
  types/            # 공통 타입 정의
  theme/            # 색상, 타이포그래피 등 디자인 토큰
```

## 디자인 방향 (적용 완료)
수채화(watercolor) 스타일. `src/theme/theme.ts`(파스텔 팔레트)와 `src/components/screen-container.tsx`(배경 물감 얼룩)에서 전역으로 관리 — 새 화면을 만들 때 이 두 곳의 값만 따르면 자동으로 톤이 맞는다.
- 배경은 크림색 종이 톤 + 반투명 파스텔 얼룩(복숭아·민트·하늘색)으로 수채화 질감 연출
- 버튼·카드는 파스텔 톤 색상 토큰(`backgroundElement`, `backgroundSelected`) 사용

## 범위

### MVP
- (docs/SPEC.md 기준으로 확정)

### 2차 범위
- 위젯
- Chrome 확장
- 콘텐츠별 카드 디자인
- 친구 공유
- AI 분석

## 배포 전 TODO
- Supabase Authentication → Providers → Email의 "Confirm email"을 다시 켜기 (지금은 개발 편의를 위해 꺼둔 상태)

## 보류된 것 (나중에 다시 다룰 것)
- 사진 OCR: 아이폰 + Windows PC라 기기 내 OCR을 넣으려면 Apple Developer Program(유료) 가입이 필요하고, 클라우드 OCR은 신용카드 등록이 필요해서 지금 단계에서는 보류. 당분간 텍스트 직접 입력(F2)만으로 진행하고, 나중에 비용·가입 부담 없는 방법이 생기면 다시 다룬다.

## 완료 기준
- 앱이 실행된다.
- 타입 오류가 없다.
- 방금 만든 기능을 사용자가 폰에서 직접 확인할 수 있다.
