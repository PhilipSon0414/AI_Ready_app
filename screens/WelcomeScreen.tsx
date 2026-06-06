import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  onLogin: () => void;
  onSignup: () => void;
};

export default function WelcomeScreen({ onLogin, onSignup }: Props) {
  const nav = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={styles.robot}>🤖</Text>
        <Text style={styles.title}>AI Ready</Text>
        <Text style={styles.tagline}>당신의 AI 역량을 키워보세요</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>── 이런 분께 추천합니다 ──</Text>
          <Text style={styles.bullet}>• 🌿 AI가 뭔지 전혀 모르는 분</Text>
          <Text style={styles.bullet}>• 👂 AI 단어는 들어봤지만 내용은 모르는 분</Text>
          <Text style={styles.bullet}>• 💻 Python을 처음 배워보고 싶은 분</Text>
          <Text style={styles.bullet}>• 📊 데이터 분석·머신러닝에 도전하고 싶은 분</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>── 8단계 학습 커리큘럼 ──</Text>
          <Text style={styles.feature}>🌿 Lv.0 AI 완전 입문</Text>
          <Text style={styles.feature}>👂 Lv.1 AI 용어 이해  →  📖 Lv.2 AI 개념</Text>
          <Text style={styles.feature}>💻 Lv.3 Python 첫걸음  →  🐍 Lv.4 파이썬 기초</Text>
          <Text style={styles.feature}>📊 Lv.5 데이터 분석  →  ⚙️ Lv.6 알고리즘</Text>
          <Text style={styles.feature}>🔥 Lv.7 코드 마스터</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>── 학습 방법 ──</Text>
          <Text style={styles.feature}>🎯 12문항 수준 진단 → 맞춤 레벨 시작</Text>
          <Text style={styles.feature}>📝 객관식  🃏 플래시카드  🔤 빈칸 채우기</Text>
          <Text style={styles.feature}>🏆 XP · 배지 · 레벨 해제 시스템</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSignup}>
          <Text style={styles.primaryBtnText}>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onLogin}>
          <Text style={styles.secondaryBtnText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.textBtn} onPress={() => nav.navigate('DiagnosticIntro')}>
          <Text style={styles.textBtnText}>비회원으로 시작하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  inner: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  robot: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  tagline: { fontSize: 16, color: '#6C63FF', fontWeight: '600', marginBottom: 32 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 12,
  },
  bullet: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 4 },
  feature: { fontSize: 14, color: '#333', lineHeight: 24, marginBottom: 2 },
  primaryBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  secondaryBtnText: { color: '#6C63FF', fontSize: 16, fontWeight: '700' },
  textBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
  textBtnText: { color: '#9E9E9E', fontSize: 14, textDecorationLine: 'underline' },
});
