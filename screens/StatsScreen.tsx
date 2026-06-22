import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { UNITS, BADGES, LEVEL_XP_THRESHOLD } from '../constants/data';

export default function StatsScreen() {
  const { state } = useAppStore();

  const totalAnswered = Object.values(state.unitProgress).reduce((sum, p) => sum + p.total, 0);
  const totalCorrect = Object.values(state.unitProgress).reduce((sum, p) => sum + p.correct, 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const xpToNext = LEVEL_XP_THRESHOLD - (state.xp % LEVEL_XP_THRESHOLD);
  const levelProgress = ((state.xp % LEVEL_XP_THRESHOLD) / LEVEL_XP_THRESHOLD) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>내 통계 🏆</Text>

        {/* Level progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>레벨 진행도</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelNum}>Lv.{state.level}</Text>
            <View style={styles.lvBarBg}>
              <View style={[styles.lvBarFill, { width: `${levelProgress}%` }]} />
            </View>
            <Text style={styles.levelNum}>Lv.{state.level + 1}</Text>
          </View>
          <Text style={styles.xpToNext}>다음 레벨까지 {xpToNext} XP</Text>
        </View>

        {/* Overall stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>전체 학습 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.xp}</Text>
              <Text style={styles.statLabel}>총 XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalAnswered}</Text>
              <Text style={styles.statLabel}>총 문제 수</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCorrect}</Text>
              <Text style={styles.statLabel}>정답 수</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{overallAccuracy}%</Text>
              <Text style={styles.statLabel}>전체 정답률</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.streak}🔥</Text>
              <Text style={styles.statLabel}>연속 학습일</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.wrongAnswers.length}</Text>
              <Text style={styles.statLabel}>오답 누적</Text>
            </View>
          </View>
        </View>

        {/* Unit details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>단원별 상세</Text>
          {UNITS.map((u) => {
            const p = state.unitProgress[u.id];
            const unlocked = p?.unlocked ?? false;
            const accuracy = p && p.completed > 0 ? Math.round((p.correct / p.completed) * 100) : 0;
            return (
              <View key={u.id} style={styles.unitRow}>
                <Text style={styles.unitIcon}>{unlocked ? u.icon : '🔒'}</Text>
                <View style={styles.unitInfo}>
                  <Text style={[styles.unitName, !unlocked && styles.locked]}>{u.title}</Text>
                  {unlocked && p ? (
                    <Text style={styles.unitStat}>
                      {p.correct}/{p.completed} 정답 · 정답률 {accuracy}%
                    </Text>
                  ) : (
                    <Text style={styles.unitStat}>잠금</Text>
                  )}
                </View>
                {unlocked && (
                  <View style={[styles.accuracyBadge, { backgroundColor: accuracy >= 70 ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Text style={[styles.accuracyText, { color: accuracy >= 70 ? '#4CAF50' : '#F44336' }]}>
                      {accuracy}%
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Badges */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>배지 컬렉션</Text>
          <View style={styles.badgesGrid}>
            {BADGES.map((badge) => {
              const earned = state.badges.includes(badge.id);
              return (
                <View key={badge.id} style={[styles.badgeItem, !earned && styles.badgeLocked]}>
                  <Text style={[styles.badgeIcon, !earned && styles.badgeIconLocked]}>{badge.icon}</Text>
                  <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>{badge.name}</Text>
                  <Text style={styles.badgeCondition}>{badge.condition}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16, gap: 14 },
  header: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelNum: { fontSize: 14, fontWeight: '700', color: '#6C63FF', width: 40, textAlign: 'center' },
  lvBarBg: { flex: 1, height: 12, backgroundColor: '#E8ECF0', borderRadius: 6, overflow: 'hidden' },
  lvBarFill: { height: 12, backgroundColor: '#6C63FF', borderRadius: 6 },
  xpToNext: { fontSize: 13, color: '#9E9E9E', textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statItem: { width: '30%', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#6C63FF' },
  statLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '600', textAlign: 'center' },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  unitIcon: { fontSize: 24 },
  unitInfo: { flex: 1 },
  unitName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  locked: { color: '#9E9E9E' },
  unitStat: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  accuracyBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  accuracyText: { fontSize: 13, fontWeight: '700' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem: {
    width: '46%',
    backgroundColor: '#F0EEFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  badgeLocked: { backgroundColor: '#F5F5F5' },
  badgeIcon: { fontSize: 28 },
  badgeIconLocked: { opacity: 0.3 },
  badgeName: { fontSize: 13, fontWeight: '700', color: '#6C63FF', textAlign: 'center' },
  badgeNameLocked: { color: '#9E9E9E' },
  badgeCondition: { fontSize: 11, color: '#9E9E9E', textAlign: 'center' },
});
