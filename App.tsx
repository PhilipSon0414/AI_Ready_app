import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { loadStore, getStore } from './store/useAppStore';
import DiagnosticScreen from './screens/DiagnosticScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import StudyModeScreen from './screens/StudyModeScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import ClozeScreen from './screens/ClozeScreen';
import ReviewScreen from './screens/ReviewScreen';
import DashScreen from './screens/DashScreen';
import BadgesScreen from './screens/BadgesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

function TabIcon({ emoji, active }: { emoji: string; active: boolean }) {
  return <Text style={{ fontSize: 20, opacity: active ? 1 : 0.5 }}>{emoji}</Text>;
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StudyMode" component={StudyModeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Flashcard" component={FlashcardScreen} />
      <Stack.Screen name="Cloze" component={ClozeScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E8ECF0',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTabs"
        component={HomeStack}
        options={{
          tabBarLabel: '학습',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" active={focused} />,
        }}
      />
      <Tab.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          tabBarLabel: '오답노트',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📝" active={focused} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashScreen}
        options={{
          tabBarLabel: '대시보드',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" active={focused} />,
        }}
      />
      <Tab.Screen
        name="Badges"
        component={BadgesScreen}
        options={{
          tabBarLabel: '뱃지',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" active={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Diagnostic' | 'MainTabs'>('MainTabs');

  useEffect(() => {
    loadStore().finally(() => {
      const store = getStore();
      setInitialRoute(store.diagnosticDone ? 'MainTabs' : 'Diagnostic');
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>AI Ready 로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="Diagnostic" component={DiagnosticScreen} />
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    gap: 12,
  },
  loadingText: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
});
