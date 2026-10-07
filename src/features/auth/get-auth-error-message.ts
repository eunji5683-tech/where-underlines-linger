import { authStrings } from '@/features/auth/strings';

const MESSAGE_MAP: Record<string, string> = {
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않아요.',
  'User already registered': '이미 가입된 이메일이에요. 로그인해주세요.',
  'Password should be at least 6 characters': '비밀번호는 최소 6자 이상이어야 해요.',
  'Unable to validate email address: invalid format': '이메일 형식이 올바르지 않아요.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && MESSAGE_MAP[error.message]) {
    return MESSAGE_MAP[error.message];
  }
  return authStrings.genericError;
}
