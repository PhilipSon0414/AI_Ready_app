import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStats, getStore, resetUnit } from '../store/useAppStore';
import { UNITS } from '../data/questions';

export default function StatsScreen() {
  const [stats, setStats] = React.useState(getStats());
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useFocusEffect(
    useCallback(() => {
      setStats(getStats());
    }, [])
  );

  const allQuestions = UNITS.reduce((acc, u) => acc + u.questions.length, 0);
  const totalPossible = allQuestions;

  function handleReset(unitId: string, unitTitle: string) {
    Alert.alert(
      '초기화 확인',
      `"${unitTitle}" 단원의 학습 기록을 초기화할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => {
            resetUnit(unitId);
            setStats(getStats());
            forceUpdate();
          },
        },
      ]
    );
  }

  const store = getStore();
  const recentAnswers = [...store.answers]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>통계</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>전체 성적</Text>
          <View style={styles.bigCircle}>
            <Text style={styles.bigPct}>{stats.accuracy}%</Text>
            <Text style={styles.bigLabel}>정답률</Text>
          </View>
          <View style={styles.summaryRow}>
            <SummaryItem label="총 풀이" value={stats.total} />
            <SummaryItem label="정답" value={stats.correct} color="#4CAF50" />
            <SummaryItem label="오답" value={stats.total - stats.correct} color="#EF5350" />
          </View>
        </View>

        <Text style={styles.sectionTitle2}>단원별 통계</Text>
        {UNITS.map((unit) => {
          const s = stats.byUnit[unit.id] ?? { correct: 0, total: 0 };
          const acc = s.total === 0 ? 0 : Math.round((s.correct / s.total) * 100);
          return (
            <View key={unit.id} style={styles.unitCard}>
              <View style={styles.unitRow}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unitName}>{unit.title}</Text>
                  <Text style={styles.unitMeta}>
                    {s.total}회 풀이 · 정답 {s.correct}개
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => handleReset(unit.id, unit.title)}
                >
                  <Text style={styles.resetText}>초기화</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${acc}%` as any, backgroundColor: acc >= 80 ? '#4CAF50' : acc >= 50 ? '#FF9800' : '#EF5350' }]} />
              </View>
              <Text style={styles.accText}>{acc}%</Text>
            </View>
          );
        })}

        {recentAnswers.length > 0 && (
          <>
            <Text style={styles.sectionTitle2}>최근 풀이</Text>
            <View style={styles.historyCard}>
              {recentAnswers.map((a, i) => {
                const unit = UNITS.find((u) => u.id === a.unit);
                const q = unit?.questions.find((q) => q.id === a.questionId);
                return (
                  <View key={i} style={styles.historyRow}>
                    <Text style={styles.historyResult}>{a.correct ? '✅' : '❌'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyQ} numberOfLines={1}>
                        {q?.question ?? '(삭제된 문제)'}
                      </Text>
                      <Text style={styles.historyMeta}>
                        {unit?.title} · {new Date(a.timestamp).toLocaleDateString('ko-KR')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryItem({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#6C63FF',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  scroll: { padding: 16, gap: 12 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  sectionTitle2: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginTop: 4 },
  bigCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0EDFF',
    borderWidth: 3,
    borderColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigPct: { fontSize: 30, fontWeight: '800', color: '#6C63FF' },
  bigLabel: { fontSize: 11, color: '#888' },
  summaryRow: { flexDirection: 'row', gap: 24 },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  summaryLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  unitIcon: { fontSize: 26 },
  unitName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  unitMeta: { fontSize: 12, color: '#888' },
  resetBtn: {
    borderWidth: 1,
    borderColor: '#EF5350',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetText: { fontSize: 11, color: '#EF5350' },
  barBg: { height: 8, backgroundColor: '#E8ECF0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  accText: { fontSize: 12, color: '#666', textAlign: 'right' },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  historyResult: { fontSize: 18 },
  historyQ: { fontSize: 13, color: '#1A1A2E', fontWeight: '500' },
  historyMeta: { fontSize: 11, color: '#888', marginTop: 2 },
});
