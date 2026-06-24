import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
        {/* 바보로봇 코딩 안내 배너 — 최상단 */}
        <TouchableOpacity style={styles.baboBanner} onPress={() => nav.navigate('BaboRobot', { stageIndex: 0 })}>
          <Text style={styles.baboBannerEmoji}>🤖</Text>
          <View style={styles.baboBannerBody}>
            <Text style={styles.baboBannerTitle}>바보로봇 코딩 — NEW!</Text>
            <Text style={styles.baboBannerDesc}>명령을 그대로만 따르는 바보로봇과 함께{'\n'}알고리즘 사고를 재미있게 배워요!</Text>
          </View>
          <Text style={styles.baboBannerArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.robot}>🤖</Text>
        <Text style={styles.title}>AI Ready</Text>
        <Text style={styles.tagline1}>AI 완전 초보부터</Text>
        <Text style={styles.tagline2}>코드 마스터까지</Text>

        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>🎯</Text>
            <Text style={styles.cardValue}>12문항</Text>
            <Text style={styles.cardLabel}>진단</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardValue}>3가지</Text>
            <Text style={styles.cardLabel}>학습법</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>🏆</Text>
            <Text style={styles.cardValue}>8단계</Text>
            <Text style={styles.cardLabel}>레벨</Text>
          </View>
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
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  baboBanner: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF88',
    gap: 12,
    marginBottom: 32,
  },
  baboBannerEmoji: { fontSize: 32 },
  baboBannerBody: { flex: 1 },
  baboBannerTitle: { color: '#00FF88', fontWeight: '800', fontSize: 13, marginBottom: 4 },
  baboBannerDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 17 },
  baboBannerArrow: { color: '#00FF88', fontSize: 22, fontWeight: '700' },
  robot: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  tagline1: { fontSize: 18, color: '#6C63FF', fontWeight: '600' },
  tagline2: { fontSize: 18, color: '#6C63FF', fontWeight: '600', marginBottom: 40 },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardIcon: { fontSize: 28, marginBottom: 6 },
  cardValue: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  cardLabel: { fontSize: 12, color: '#9E9E9E', fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    marginBottom: 12,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  secondaryBtnText: { color: '#6C63FF', fontSize: 16, fontWeight: '700' },
  textBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
  textBtnText: { color: '#9E9E9E', fontSize: 14, textDecorationLine: 'underline' },
});
