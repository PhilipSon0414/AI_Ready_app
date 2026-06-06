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

export default function DiagnosticIntroScreen() {
  const nav = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>🎯</Text>
        <Text style={styles.title}>AI · Python 수준 진단</Text>
        <Text style={styles.desc}>
          12문항으로 나의 현재 수준을 파악하고{'\n'}딱 맞는 레벨부터 학습을 시작해요!
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>── 진단 안내 ──</Text>
          <Text style={styles.bullet}>• 총 12문항 (약 5~8분 소요)</Text>
          <Text style={styles.bullet}>• AI 기초부터 Python 코딩까지{'\n'}  난이도가 점점 올라갑니다</Text>
          <Text style={styles.bullet}>• 결과에 따라 Lv.0~Lv.7 중{'\n'}  나의 레벨이 자동 설정됩니다</Text>
          <Text style={styles.bullet}>• 모르는 문제는 과감히 넘어가도 됩니다</Text>
        </View>

        <Text style={styles.levelRange}>
          🌿 Lv.0 완전 입문  →  🔥 Lv.7 코드 마스터{'\n'}8단계 중 나의 출발점을 찾아보세요!
        </Text>

        <TouchableOpacity style={styles.startBtn} onPress={() => nav.navigate('Diagnostic')}>
          <Text style={styles.startBtnText}>진단 시작하기 →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  backBtn: { alignSelf: 'flex-start' },
  backText: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },
  inner: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  desc: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 16,
  },
  bullet: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 8 },
  levelRange: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
