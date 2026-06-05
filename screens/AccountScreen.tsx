import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { getStore, signOut, getCurrentUser } from '../store/useAppStore';
import AuthScreen from './AuthScreen';

type Props = {
  user: { id: string; email: string } | null;
  onAuthSuccess: () => void;
  onSignOut: () => void;
};

export default function AccountScreen({ user, onAuthSuccess, onSignOut }: Props) {
  const store = getStore();

  if (!user) {
    return (
      <View style={styles.notLoggedIn}>
        <Text style={styles.notLoggedInTitle}>내 계정</Text>
        <Text style={styles.notLoggedInDesc}>
          로그인하면 기기가 바뀌어도{'\n'}학습 데이터가 유지됩니다
        </Text>
        <View style={styles.authWrapper}>
          <AuthScreen onSuccess={onAuthSuccess} onSkip={() => {}} />
        </View>
      </View>
    );
  }

  const joinDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  async function handleSignOut() {
    await signOut();
    onSignOut();
  }

  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>👤 내 계정</Text>

      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.joinDate}>가입일: {joinDate}</Text>

      <View style={styles.divider}>
        <Text style={styles.dividerLabel}>내 학습 현황</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>XP</Text>
          <Text style={styles.statValue}>{store.xp.toLocaleString()} ⭐</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>획득 배지</Text>
          <Text style={styles.statValue}>{store.badges.length}개</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>연속 학습</Text>
          <Text style={styles.statValue}>{store.streak}일</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  inner: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 28 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  email: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  joinDate: { fontSize: 13, color: '#9E9E9E', marginBottom: 28 },
  divider: {
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
    marginBottom: 16,
  },
  dividerLabel: { fontSize: 13, fontWeight: '700', color: '#9E9E9E', letterSpacing: 1 },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statLabel: { fontSize: 15, color: '#555' },
  statValue: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  signOutBtn: {
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  signOutText: { color: '#E74C3C', fontSize: 15, fontWeight: '700' },
  notLoggedIn: { flex: 1, backgroundColor: '#F5F7FA' },
  notLoggedInTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
    paddingTop: 60,
    marginBottom: 8,
  },
  notLoggedInDesc: {
    fontSize: 15,
    color: '#6C63FF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  authWrapper: { flex: 1 },
});
