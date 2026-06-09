import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { getStore, signOut, setNickname, generateNickname } from '../store/useAppStore';
import AuthScreen from './AuthScreen';
import { generateReport, downloadReportAsPDF } from '../lib/reportGenerator';

type Props = {
  user: { id: string; email: string } | null;
  onAuthSuccess: () => void;
  onSignOut: () => void;
};

export default function AccountScreen({ user, onAuthSuccess, onSignOut }: Props) {
  const store = getStore();
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(store.nickname || '');

  function handleSaveNickname() {
    const trimmed = nicknameInput.trim();
    if (trimmed) {
      setNickname(trimmed);
    }
    setEditingNickname(false);
  }

  function handleRandomNickname() {
    const newNick = generateNickname();
    setNicknameInput(newNick);
    setNickname(newNick);
  }

  const currentNickname = store.nickname || generateNickname();

  if (!user) {
    // Guest: show nickname section + auth prompt
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
        <Text style={styles.title}>👤 내 계정</Text>

        <View style={styles.nicknameCard}>
          <Text style={styles.nicknameLabel}>내 별명</Text>
          <Text style={styles.nicknameDisplay}>{currentNickname}</Text>
          {editingNickname ? (
            <View style={styles.nicknameEditRow}>
              <TextInput
                style={styles.nicknameInput}
                value={nicknameInput}
                onChangeText={setNicknameInput}
                placeholder="새 별명 입력"
                maxLength={20}
                autoFocus
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNickname}>
                <Text style={styles.saveBtnText}>저장</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nicknameButtonRow}>
              <TouchableOpacity style={styles.nicknameBtnOutline} onPress={() => { setNicknameInput(currentNickname); setEditingNickname(true); }}>
                <Text style={styles.nicknameBtnOutlineText}>✏️ 별명 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nicknameBtnOutline} onPress={handleRandomNickname}>
                <Text style={styles.nicknameBtnOutlineText}>🎲 랜덤 생성</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.notLoggedInDesc}>
          로그인하면 기기가 바뀌어도{'\n'}학습 데이터가 유지됩니다
        </Text>
        <View style={styles.authWrapper}>
          <AuthScreen onSuccess={onAuthSuccess} onSkip={() => {}} />
        </View>
      </ScrollView>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>👤 내 계정</Text>

      {/* Nickname Section */}
      <View style={styles.nicknameCard}>
        <Text style={styles.nicknameLabel}>내 별명</Text>
        <Text style={styles.nicknameDisplay}>{store.nickname || currentNickname}</Text>
        {editingNickname ? (
          <View style={styles.nicknameEditRow}>
            <TextInput
              style={styles.nicknameInput}
              value={nicknameInput}
              onChangeText={setNicknameInput}
              placeholder="새 별명 입력"
              maxLength={20}
              autoFocus
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNickname}>
              <Text style={styles.saveBtnText}>저장</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nicknameButtonRow}>
            <TouchableOpacity style={styles.nicknameBtnOutline} onPress={() => { setNicknameInput(store.nickname || currentNickname); setEditingNickname(true); }}>
              <Text style={styles.nicknameBtnOutlineText}>✏️ 별명 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nicknameBtnOutline} onPress={handleRandomNickname}>
              <Text style={styles.nicknameBtnOutlineText}>🎲 랜덤 생성</Text>
            </TouchableOpacity>
          </View>
        )}
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

      {/* Diagnostic Report Section */}
      {store.diagnosticLevel !== null && store.diagnosticLevel !== undefined && (
        <>
          <View style={styles.divider}>
            <Text style={styles.dividerLabel}>내 진단 레포트</Text>
          </View>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => {
              const nick = store.nickname || '익명 학습자';
              const level = store.diagnosticLevel as number;
              const totalQ = 12;
              const correctAns = Math.round(level <= 1 ? level * 2 : level <= 5 ? level * 2 : level * 2);
              const report = generateReport({ nickname: nick, level, score: correctAns, totalQuestions: totalQ });
              downloadReportAsPDF(report);
            }}
          >
            <Text style={styles.reportBtnText}>레포트 보기 & PDF 다운로드 📄</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  inner: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 20 },

  nicknameCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  nicknameLabel: { fontSize: 12, color: '#9E9E9E', fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  nicknameDisplay: { fontSize: 26, fontWeight: '800', color: '#6C63FF', marginBottom: 14 },
  nicknameButtonRow: { flexDirection: 'row', gap: 10 },
  nicknameBtnOutline: {
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  nicknameBtnOutlineText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  nicknameEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  nicknameInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#1A1A2E',
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

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
  reportBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  signOutBtn: {
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  signOutText: { color: '#E74C3C', fontSize: 15, fontWeight: '700' },
  notLoggedInDesc: {
    fontSize: 15,
    color: '#6C63FF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  authWrapper: { flex: 1, width: '100%' },
});
