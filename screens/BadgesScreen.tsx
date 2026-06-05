import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStore, BADGE_INFO, BadgeId } from '../store/useAppStore';

const ALL_BADGES: BadgeId[] = ['first_quiz', 'streak_3', 'perfect_unit', 'level_up', 'master'];

export default function BadgesScreen() {
  const [store, setStore] = React.useState(getStore());

  useFocusEffect(
    useCallback(() => {
      setStore(getStore());
    }, [])
  );

  const earned = store.badges;
  const earnedCount = earned.length;
  const totalCount = ALL_BADGES.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>뱃지 & 업적</Text>
        <View style={styles.headerRight}>
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>⭐ {store.xp} XP</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{earnedCount}/{totalCount}</Text>
              <Text style={styles.summaryLabel}>뱃지 획득</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{store.xp}</Text>
              <Text style={styles.summaryLabel}>총 XP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{store.streak}일</Text>
              <Text style={styles.summaryLabel}>학습 연속</Text>
            </View>
          </View>
          <View style={styles.badgeProgressBg}>
            <View
              style={[
                styles.badgeProgressFill,
                { width: `${(earnedCount / totalCount) * 100}%` as any },
              ]}
            />
          </View>
          <Text style={styles.badgeProgressLabel}>
            {earnedCount === totalCount ? '모든 뱃지 획득 완료! 🏆' : `${totalCount - earnedCount}개 뱃지 남음`}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>모든 뱃지</Text>

        <View style={styles.grid}>
          {ALL_BADGES.map((badgeId) => {
            const info = BADGE_INFO[badgeId];
            const isEarned = earned.includes(badgeId);
            return (
              <View
                key={badgeId}
                style={[styles.badgeCard, isEarned ? styles.badgeCardEarned : styles.badgeCardLocked]}
              >
                <View style={[styles.badgeEmojiContainer, !isEarned && styles.badgeEmojiGray]}>
                  <Text style={[styles.badgeEmoji, !isEarned && styles.emojiGray]}>{info.emoji}</Text>
                </View>
                <Text style={[styles.badgeName, !isEarned && styles.lockedText]}>{info.name}</Text>
                <Text style={[styles.badgeDesc, !isEarned && styles.lockedText]} numberOfLines={2}>
                  {info.desc}
                </Text>
                {isEarned ? (
                  <View style={styles.earnedTag}>
                    <Text style={styles.earnedTagText}>획득 완료</Text>
                  </View>
                ) : (
                  <View style={styles.lockedTag}>
                    <Text style={styles.lockedTagText}>🔒 미획득</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.hintTitle}>XP 획득 방법</Text>
        <View style={styles.hintCard}>
          {[
            { icon: '✅', text: '정답 1개', xp: '+10 XP' },
            { icon: '📚', text: '단원 완료 보너스', xp: '+50 XP' },
            { icon: '🚀', text: '레벨 잠금 해제', xp: '+100 XP' },
          ].map((h, i) => (
            <View key={i} style={styles.hintRow}>
              <Text style={styles.hintIcon}>{h.icon}</Text>
              <Text style={styles.hintText}>{h.text}</Text>
              <Text style={styles.hintXP}>{h.xp}</Text>
            </View>
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerRight: {},
  xpPill: {
    backgroundColor: 'rgba(255,179,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  xpPillText: { color: '#FFE082', fontWeight: '700', fontSize: 13 },
  scroll: { padding: 16, gap: 14 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '800', color: '#6C63FF' },
  summaryLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  divider: { width: 1, height: 36, backgroundColor: '#E8ECF0' },
  badgeProgressBg: {
    height: 8,
    backgroundColor: '#E8ECF0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  badgeProgressFill: { height: '100%', backgroundColor: '#FFB300', borderRadius: 4 },
  badgeProgressLabel: { fontSize: 12, color: '#888', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '47%',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeCardEarned: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FFB300' },
  badgeCardLocked: { backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: '#E0E0E0' },
  badgeEmojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmojiGray: { backgroundColor: '#F0F0F0' },
  badgeEmoji: { fontSize: 30 },
  emojiGray: { opacity: 0.4 },
  badgeName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', textAlign: 'center' },
  badgeDesc: { fontSize: 11, color: '#666', textAlign: 'center', lineHeight: 16 },
  lockedText: { color: '#BDBDBD' },
  earnedTag: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 2,
  },
  earnedTagText: { fontSize: 11, color: '#FFB300', fontWeight: '700' },
  lockedTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 2,
  },
  lockedTagText: { fontSize: 11, color: '#9E9E9E', fontWeight: '600' },
  hintTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  hintCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hintIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  hintText: { flex: 1, fontSize: 13, color: '#444' },
  hintXP: { fontSize: 14, fontWeight: '700', color: '#FFB300' },
});
