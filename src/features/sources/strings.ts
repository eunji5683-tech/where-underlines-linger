import type { SourceType } from '@/types/database';

export const sourcesStrings = {
  pickerTitle: '출처',
  pickerEmpty: '등록된 출처가 없어요.',
  addNew: '+ 새 출처 추가',
  titleLabel: '제목',
  typeLabel: '종류',
  saveButton: '추가',
  cancelButton: '취소',
  titleRequired: '제목을 입력해주세요.',
  saveError: '출처를 저장하지 못했어요. 다시 시도해주세요.',
  loadError: '출처를 불러오지 못했어요.',
  none: '출처 없음',
};

export const sourceTypeLabels: Record<SourceType, string> = {
  book: '책',
  drama: '드라마',
  movie: '영화',
  tv: 'TV',
  youtube: '유튜브',
  sns: 'SNS',
  etc: '기타',
};

export const watchStrings = {
  toggleBook: '책',
  toggleWatch: '영상',
  addNew: '+ 영상 추가',
  titleLabel: '제목',
  typeLabel: '종류',
  statusLabel: '상태',
  statusWish: '위시리스트',
  statusOngoing: '보는 중',
  statusDone: '완료',
  saveButton: '추가',
  cancelButton: '취소',
  titleRequired: '제목을 입력해주세요.',
  saveError: '저장하지 못했어요. 다시 시도해주세요.',
  loadError: '불러오지 못했어요.',
  emptyList: '아직 등록한 영상이 없어요.',
};
