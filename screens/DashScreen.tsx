import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStats, getUnitProgress } from '../store/useAppStore';
import { UNITS } from '../data/questions';

export default function DashScreen() {
  const [stats, setStats] = React.useState(getStats());

  useFocusEffect(
    useCallback(() => {
      setStats(getStats());
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>대시보드</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.row}>
          <StatCard emoji="🎯" label="전체 정답률" value={`${stats.accuracy}%`} color="#6C63FF" />
          <StatCard emoji="🔥" label="학습 스트릭" value={`${stats.streak}일`} color="#FF6B6B" />
        </View>
        <View style={styles.row}>
          <StatCard emoji="📝" label="총 문제 수" value={`${stats.total}`} color="#4ECDC4" />
          <StatCard emoji="✅" label="맞힌 문제" value={`${stats.correct}`} color="#45B7D1" />
        </View>

        <Text style={styles.sectionTitle}>단원별 현황</Text>
        {UNITS.map((unit) => {
          const s = stats.byUnit[unit.id] ?? { correct: 0, total: 0 };
          const prog = getUnitProgress(unit.id);
          const acc = s.total === 0 ? 0 : Math.round((s.correct / s.total) * 100);
          const studyPct = prog.total === 0 ? 0 : (prog.completed / prog.total) * 100;
          return (
            <View key={unit.id} style={styles.unitCard}>
              <View style={styles.unitHeader}>
                <Text style={styles.unitIcon}>{unit.icon}</Text>
                <View style={styles.unitInfo}>
                  <Text style={styles.unitName}>{unit.title}</Text>
                  <Text style={styles.unitMeta}>
                    풀이 {s.total}회 · 정답률 {acc}%
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: acc >= 80 ? '#E8F5E9' : '#F3E5F5' }]}>
                  <Text style={[styles.badgeText, { color: acc >= 80 ? '#2E7D32' : '#7B1FA2' }]}>
                    {acc}%
                  </Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${studyPct}%` as any }]} />
                </View>
                <Text style={styles.progressLabel}>
                  {prog.completed}/{prog.total} 완료
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  row: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: { fontSize: 28, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginTop: 8 },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  unitIcon: { fontSize: 28 },
  unitInfo: { flex: 1 },
  unitName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  unitMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 13, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E8ECF0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#6C63FF', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#9E9E9E', minWidth: 60, textAlign: 'right' },
});
