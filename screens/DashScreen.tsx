import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useAppStore } from '../store/useAppStore';
import { UNITS, QUESTIONS_PER_UNIT } from '../constants/data';

const CHART_W = 320;
const CHART_H = 140;
const PAD = 30;

function getLast7Days() {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export default function DashScreen() {
  const { state } = useAppStore();
  const days = getLast7Days();

  // XP line chart data
  const xpByDay = days.map((d) => {
    const rec = state.dailyRecords.find((r) => r.date === d);
    return rec?.xp ?? 0;
  });
  const maxXp = Math.max(...xpByDay, 1);

  const linePoints = xpByDay
    .map((xp, i) => {
      const x = PAD + (i / 6) * (CHART_W - PAD * 2);
      const y = CHART_H - PAD - (xp / maxXp) * (CHART_H - PAD * 2);
      return `${x},${y}`;
    })
    .join(' ');

  // Unit bar chart
  const unitStats = UNITS.map((u) => {
    const p = state.unitProgress[u.id];
    const accuracy = p && p.completed > 0 ? Math.round((p.correct / p.completed) * 100) : 0;
    const progress = p ? Math.min(Math.round((p.completed / QUESTIONS_PER_UNIT) * 100), 100) : 0;
    return { unit: u, accuracy, progress, unlocked: p?.unlocked ?? false };
  });

  // Weak units (unlocked, accuracy < 60)
  const weakUnits = unitStats.filter((s) => s.unlocked && s.unit.id > 0 && s.accuracy < 60 && s.accuracy > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>대시보드 📊</Text>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#6C63FF' }]}>
            <Text style={styles.summaryValue}>{state.xp}</Text>
            <Text style={styles.summaryLabel}>총 XP</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FF9800' }]}>
            <Text style={styles.summaryValue}>Lv.{state.level}</Text>
            <Text style={styles.summaryLabel}>레벨</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F44336' }]}>
            <Text style={styles.summaryValue}>{state.streak}🔥</Text>
            <Text style={styles.summaryLabel}>연속 학습</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.summaryValue}>{state.badges.length}</Text>
            <Text style={styles.summaryLabel}>배지</Text>
          </View>
        </View>

        {/* 7-day XP line chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 7일 XP 추이</Text>
          <View style={styles.chartBox}>
            <Svg width={CHART_W} height={CHART_H}>
              {/* Grid lines */}
              {[0, 0.5, 1].map((ratio, i) => {
                const y = CHART_H - PAD - ratio * (CHART_H - PAD * 2);
                return (
                  <Line key={i} x1={PAD} y1={y} x2={CHART_W - PAD} y2={y} stroke="#E8ECF0" strokeWidth={1} />
                );
              })}
              {/* Line */}
              {xpByDay.some((v) => v > 0) && (
                <Polyline points={linePoints} fill="none" stroke="#6C63FF" strokeWidth={2.5} strokeLinejoin="round" />
              )}
              {/* Dots */}
              {xpByDay.map((xp, i) => {
                const x = PAD + (i / 6) * (CHART_W - PAD * 2);
                const y = CHART_H - PAD - (xp / maxXp) * (CHART_H - PAD * 2);
                return <Circle key={i} cx={x} cy={y} r={4} fill="#6C63FF" />;
              })}
              {/* X labels */}
              {days.map((d, i) => {
                const x = PAD + (i / 6) * (CHART_W - PAD * 2);
                const label = d.slice(5);
                return (
                  <SvgText key={i} x={x} y={CHART_H - 4} fontSize={9} fill="#9E9E9E" textAnchor="middle">
                    {label}
                  </SvgText>
                );
              })}
            </Svg>
          </View>
        </View>

        {/* Unit accuracy bar chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 단원별 정답률</Text>
          {unitStats.map(({ unit, accuracy, progress, unlocked }) => (
            <View key={unit.id} style={styles.barRow}>
              <Text style={styles.barLabel}>{unit.icon} {unit.title}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${accuracy}%`, backgroundColor: unlocked ? '#6C63FF' : '#E8ECF0' }]} />
              </View>
              <Text style={styles.barPct}>{unlocked ? `${accuracy}%` : '🔒'}</Text>
            </View>
          ))}
        </View>

        {/* Weak units */}
        {weakUnits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ 취약 단원</Text>
            {weakUnits.map(({ unit, accuracy }) => (
              <View key={unit.id} style={styles.weakCard}>
                <Text style={styles.weakIcon}>{unit.icon}</Text>
                <View style={styles.weakInfo}>
                  <Text style={styles.weakTitle}>{unit.title}</Text>
                  <Text style={styles.weakAccuracy}>정답률 {accuracy}% — 더 연습이 필요해요!</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 획득한 배지</Text>
          {state.badges.length === 0 ? (
            <Text style={styles.noBadge}>아직 배지가 없어요. 퀴즈를 풀어보세요!</Text>
          ) : (
            <View style={styles.badgeGrid}>
              {state.badges.map((b) => (
                <View key={b} style={styles.badge}>
                  <Text style={styles.badgeText}>{b}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16, gap: 16 },
  header: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  section: {
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
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  chartBox: { alignItems: 'center' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 80, fontSize: 11, color: '#444', fontWeight: '500' },
  barTrack: { flex: 1, height: 10, backgroundColor: '#E8ECF0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 5 },
  barPct: { width: 36, fontSize: 12, color: '#6C63FF', fontWeight: '700', textAlign: 'right' },
  weakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  weakIcon: { fontSize: 28 },
  weakInfo: { flex: 1 },
  weakTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  weakAccuracy: { fontSize: 13, color: '#FF9800', marginTop: 2 },
  noBadge: { fontSize: 14, color: '#9E9E9E' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    backgroundColor: '#E8E4FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { color: '#6C63FF', fontWeight: '700', fontSize: 13 },
});
