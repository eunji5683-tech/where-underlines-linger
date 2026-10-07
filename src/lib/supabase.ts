import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] .env 파일에 EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요. ' +
      '.env.example을 참고해서 .env 파일을 만드세요. 값을 바꾼 뒤에는 `npx expo start -c`로 다시 시작해야 합니다.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 웹에서는 Expo Router가 Node 환경에서 서버사이드 렌더링을 하는데,
    // AsyncStorage의 웹 구현은 그 안에서 바로 window.localStorage를 참조해 죽는다.
    // storage를 넘기지 않으면 Supabase가 window 유무를 직접 확인하는 기본 구현을 쓴다.
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
