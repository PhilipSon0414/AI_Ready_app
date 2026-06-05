import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UNITS } from '../data/questions';
import { getStore, getUnitProgress, getLevelProgress } from '../store/useAppStore';

const LEVEL_CONFIG: Record<number, { name: string; icon: string; color: string; bgColor: string }> = {
  1: { name: 'AI 입문',   icon: '🌱', color: '#4CAF50', bgColor: '#E8F5E9' },
  2: { name: 'AI 기초',   icon: '📘', color: '#2196F3', bgColor: '#E3F2FD' },
  3: { name: 'AI 응용',   icon: '⚡', color: '#FF9800', bgColor: '#FFF3E0' },
  4: { name: 'AI 전문가', icon: '🔥', color: '#9C27B0', bgColor: '#F3E5F5' },
};

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useFocusEffect(
    useCallback(() => {
      forceUpdate();
    }, [])
  );

  const store = getStore();
  const { xp, streak, unlockedLevels } = store;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Ready</Text>
          <Text style={styles.subtitle}>AI 자격증 대비 학습</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statChip}>
            <Text style={styles.statChipText}>🔥 {streak}일</Text>
          </View>
          <View style={[styles.statChip, styles.xpChip]}>
            <Text style={[styles.statChipText, styles.xpText]}>⭐ {xp} XP</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {[1, 2, 3, 4].map((level) => {
          const cfg = LEVEL_CONFIG[level];
          const locked = !unlockedLevels.includes(level);
          const levelUnits = UNITS.filter((u) => u.level === level);
          const lvlProg = getLevelProgress(level);
          const prevLevelProg = level > 1 ? getLevelProgress(level - 1) : null;

          return (
            <View
              key={level}
              style={[
                styles.levelCard,
                locked && styles.levelCardLocked,
                { borderLeftColor: locked ? '#E0E0E0' : cfg.color },
              ]}
            >
              {/* Level header */}
              <View style={styles.levelHeader}>
                <View style={[styles.levelIconBg, { backgroundColor: locked ? '#F5F5F5' : cfg.bgColor }]}>
                  <Text style={styles.levelIcon}>{locked ? '🔒' : cfg.icon}</Text>
                </View>
                <View style={styles.levelTitleGroup}>
                  <Text style={[styles.levelNum, { color: locked ? '#9E9E9E' : cfg.color }]}>
                    레벨 {level}
                  </Text>
                  <Text style={[styles.levelName, locked && styles.lockedText]}>{cfg.name}</Text>
                  {locked && prevLevelProg && (
                    <Text style={styles.lockHint}>이전 레벨 완료 필요 (70% 이상)</Text>
                  )}
                </View>
                <View style={styles.levelRight}>
                  <Text style={[styles.levelProgress, { color: locked ? '#9E9E9E' : cfg.color }]}>
                    {lvlProg.completed}/{lvlProg.total}
                  </Text>
                  {!locked && lvlProg.total > 0 && (
                    <Text style={styles.levelAccuracy}>{lvlProg.accuracy}% 정답</Text>
                  )}
                </View>
              </View>

              {/* Level progress bar */}
              {!locked && (
                <View style={styles.levelProgressBarBg}>
                  <View
                    style={[
                      styles.levelProgressBarFill,
                      {
                        backgroundColor: cfg.color,
                        width: lvlProg.total === 0
                          ? '0%'
                          : (`${(lvlProg.completed / lvlProg.total) * 100}%` as any),
                      },
                    ]}
                  />
                </View>
              )}

              {/* Units list */}
              {levelUnits.map((unit) => {
                const prog = getUnitProgress(unit.id);
                const pct = prog.total === 0 ? 0 : (prog.completed / prog.total) * 100;
                const unitDone = prog.completed >= prog.total && prog.total > 0;

                return (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.unitRow,
                      locked && styles.unitRowLocked,
                      unitDone && styles.unitRowDone,
                    ]}
                    onPress={() => {
                      if (!locked) nav.navigate('StudyMode', { unitId: unit.id });
                    }}
                    disabled={locked}
                  >
                    <Text style={[styles.unitIcon, locked && styles.lockedText]}>{unit.icon}</Text>
                    <View style={styles.unitInfo}>
                      <View style={styles.unitTitleRow}>
                        <Text style={[styles.unitTitle, locked && styles.lockedText]}>
                          {unit.title}
                        </Text>
                        {unitDone && <Text style={styles.doneTag}>완료 ✓</Text>}
                      </View>
                      <Text style={[styles.unitDesc, locked && styles.lockedText]}>
                        {unit.description}
                      </Text>
                      <View style={styles.unitProgressRow}>
                        <View style={[styles.unitProgressBg, locked && styles.unitProgressBgLocked]}>
                          <View
                            style={[
                              styles.unitProgressFill,
                              { backgroundColor: locked ? '#9E9E9E' : cfg.color, width: `${pct}%` as any },
                            ]}
                          />
                        </View>
                        <Text style={[styles.unitProgressLabel, locked && styles.lockedText]}>
                          {prog.completed}/{prog.total}
                        </Text>
                      </View>
                    </View>
                    {!locked && (
                      <Text style={[styles.arrowIcon, { color: cfg.color }]}>›</Text>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Locked overlay note */}
              {locked && (
                <View style={styles.lockedNote}>
                  <Text style={styles.lockedNoteText}>
                    🔒 레벨 {level - 1} 단원을 70% 이상 정답률로 완료하면 잠금 해제됩니다
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  headerStats: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  statChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  xpChip: { backgroundColor: 'rgba(255,179,0,0.25)' },
  statChipText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  xpText: { color: '#FFE082' },
  scroll: { padding: 16, gap: 16 },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  levelCardLocked: { opacity: 0.75 },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  levelIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelIcon: { fontSize: 26 },
  levelTitleGroup: { flex: 1 },
  levelNum: { fontSize: 12, fontWeight: '700', marginBottom: 1 },
  levelName: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },
  lockHint: { fontSize: 11, color: '#9E9E9E', marginTop: 2 },
  lockedText: { color: '#9E9E9E' },
  levelRight: { alignItems: 'flex-end' },
  levelProgress: { fontSize: 16, fontWeight: '800' },
  levelAccuracy: { fontSize: 11, color: '#9E9E9E', marginTop: 2 },
  levelProgressBarBg: {
    height: 6,
    backgroundColor: '#E8ECF0',
    marginHorizontal: 14,
    marginBottom: 8,
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelProgressBarFill: { height: '100%', borderRadius: 3 },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  unitRowLocked: { backgroundColor: '#FAFAFA' },
  unitRowDone: { backgroundColor: '#FAFFFE' },
  unitIcon: { fontSize: 28 },
  unitInfo: { flex: 1 },
  unitTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unitTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  doneTag: {
    fontSize: 10,
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '700',
  },
  unitDesc: { fontSize: 12, color: '#888', marginTop: 2, marginBottom: 6 },
  unitProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unitProgressBg: {
    flex: 1,
    height: 5,
    backgroundColor: '#E8ECF0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  unitProgressBgLocked: { backgroundColor: '#F0F0F0' },
  unitProgressFill: { height: '100%', borderRadius: 3 },
  unitProgressLabel: { fontSize: 11, color: '#9E9E9E', minWidth: 32, textAlign: 'right' },
  arrowIcon: { fontSize: 24, fontWeight: '300' },
  lockedNote: {
    margin: 12,
    marginTop: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
  },
  lockedNoteText: { fontSize: 12, color: '#9E9E9E', textAlign: 'center' },
});
