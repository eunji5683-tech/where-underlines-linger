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
