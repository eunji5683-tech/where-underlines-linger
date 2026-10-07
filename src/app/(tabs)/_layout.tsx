import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: '문장함',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '추가',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: '독서',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '나',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
