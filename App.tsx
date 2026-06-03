import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { loadStore } from './store/useAppStore';
import UnitsScreen from './screens/UnitsScreen';
import QuizScreen from './screens/QuizScreen';
import ReviewScreen from './screens/ReviewScreen';
import DashScreen from './screens/DashScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function UnitsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Units" component={UnitsScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, active }: { emoji: string; active: boolean }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: active ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadStore().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
            name="Home"
            component={UnitsStack}
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
            name="Stats"
            component={StatsScreen}
            options={{
              tabBarLabel: '통계',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" active={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
});
