import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { loadStore, getStore, initAuth, loadFromCloud } from './store/useAppStore';
import DiagnosticScreen from './screens/DiagnosticScreen';
import DiagnosticReportScreen from './screens/DiagnosticReportScreen';
import DiagnosticIntroScreen from './screens/DiagnosticIntroScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupCompleteScreen from './screens/SignupCompleteScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import StudyModeScreen from './screens/StudyModeScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import ClozeScreen from './screens/ClozeScreen';
import ReviewScreen from './screens/ReviewScreen';
import DashScreen from './screens/DashScreen';
import BadgesScreen from './screens/BadgesScreen';
import AccountScreen from './screens/AccountScreen';
import AdminScreen from './screens/AdminScreen';
import BaboRobotScreen from './screens/BaboRobotScreen';

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
      <Stack.Screen name="BaboRobot" component={BaboRobotScreen} />
    </Stack.Navigator>
  );
}

type MainTabsProps = {
  user: { id: string; email: string } | null;
  onAuthSuccess: () => void;
  onSignOut: () => void;
};

function MainTabs({ user, onAuthSuccess, onSignOut }: MainTabsProps) {
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
          paddingBottom: Platform.OS === 'ios' ? 20 : 4,
          height: Platform.OS === 'ios' ? 80 : 60,
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
      <Tab.Screen
        name="Account"
        options={{
          tabBarLabel: '내 계정',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" active={focused} />,
        }}
      >
        {() => (
          <AccountScreen
            user={user}
            onAuthSuccess={onAuthSuccess}
            onSignOut={onSignOut}
          />
        )}
      </Tab.Screen>
      {user?.email === 'jidong.son@gmail.com' && (
        <Tab.Screen
          name="Admin"
          options={{
            tabBarLabel: '관리자',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" active={focused} />,
          }}
        >
          {() => <AdminScreen user={user} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Welcome' | 'MainTabs'>('Welcome');
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  // pending signup email to pass to SignupComplete screen
  const [pendingSignupEmail, setPendingSignupEmail] = useState<string>('');

  useEffect(() => {
    loadStore().finally(() => {
      initAuth(async (authUser) => {
        setUser(authUser);

        if (authUser) {
          // Show loading state then determine route after cloud load
          try {
            await loadFromCloud();
          } catch (_) {}
          const store = getStore();
          if (store.diagnosticDone && store.answers.length > 0) {
            setInitialRoute('MainTabs');
          } else {
            setInitialRoute('Welcome');
          }
        } else {
          setInitialRoute('Welcome');
        }

        setReady(true);
      });
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

  const handleSignOut = () => {
    setUser(null);
  };

  const handleAuthSuccess = () => {
    // user state will be updated via initAuth listener
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          {/* Welcome screen wraps auth forms via modal-like inline navigation */}
          <RootStack.Screen name="Welcome">
            {({ navigation }) => (
              <WelcomeScreen
                onLogin={() => navigation.navigate('Login')}
                onSignup={() => navigation.navigate('Signup')}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen name="Login">
            {({ navigation }) => (
              <AuthScreen
                mode="login"
                onLoginSuccess={async () => {
                  // After login, check cloud data
                  try {
                    await loadFromCloud();
                  } catch (_) {}
                  const store = getStore();
                  if (store.diagnosticDone && store.answers.length > 0) {
                    navigation.replace('MainTabs');
                  } else {
                    navigation.replace('DiagnosticIntro');
                  }
                }}
                onSignupComplete={() => {}}
                onBack={() => navigation.goBack()}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen name="Signup">
            {({ navigation }) => (
              <AuthScreen
                mode="signup"
                onLoginSuccess={() => {}}
                onSignupComplete={(email) => {
                  setPendingSignupEmail(email);
                  navigation.replace('SignupComplete');
                }}
                onBack={() => navigation.goBack()}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen name="SignupComplete">
            {() => <SignupCompleteScreen email={pendingSignupEmail} />}
          </RootStack.Screen>

          <RootStack.Screen name="DiagnosticIntro" component={DiagnosticIntroScreen} />

          <RootStack.Screen name="Diagnostic" component={DiagnosticScreen} />

          <RootStack.Screen name="DiagnosticReport" component={DiagnosticReportScreen} />

          <RootStack.Screen name="MainTabs">
            {() => (
              <MainTabs
                user={user}
                onAuthSuccess={handleAuthSuccess}
                onSignOut={handleSignOut}
              />
            )}
          </RootStack.Screen>
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
