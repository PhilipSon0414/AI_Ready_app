import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UNITS, QUESTIONS_PER_UNIT } from '../constants/data';
import { useAppStore } from '../store/useAppStore';

const LEVEL_COLOR: Record<string, string> = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
};

export default function UnitsScreen() {
  const navigation = useNavigation<any>();
  const { state } = useAppStore();

  const renderUnit = ({ item }: { item: (typeof UNITS)[0] }) => {
    const progress = state.unitProgress[item.id];
    const isUnlocked = progress?.unlocked ?? false;
    const completed = progress?.completed ?? 0;
    const correct = progress?.correct ?? 0;
    const pct = Math.min(Math.round((completed / QUESTIONS_PER_UNIT) * 100), 100);
    const accuracy = completed > 0 ? Math.round((correct / completed) * 100) : 0;

    return (
      <TouchableOpacity
        style={[styles.card, !isUnlocked && styles.locked]}
        onPress={() => isUnlocked && navigation.navigate('Quiz', { unitId: item.id })}
        activeOpacity={isUnlocked ? 0.7 : 1}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>{isUnlocked ? item.icon : '🔒'}</Text>
          <View style={styles.cardInfo}>
            <Text style={[styles.title, !isUnlocked && styles.lockedText]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: LEVEL_COLOR[item.level] }]}>
                <Text style={styles.tagText}>{item.level}</Text>
              </View>
              {completed > 0 && (
                <Text style={styles.accuracy}>정답률 {accuracy}%</Text>
              )}
            </View>
          </View>
          {isUnlocked && (
            <View style={styles.pctBox}>
              <Text style={styles.pctText}>{pct}%</Text>
            </View>
          )}
        </View>
        {isUnlocked && (
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${pct}%` }]} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Ready 🐍</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>Lv.{state.level} · {state.xp} XP</Text>
        </View>
      </View>
      <FlatList
        data={UNITS}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUnit}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  xpBadge: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  xpText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  locked: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { fontSize: 36, marginRight: 14 },
  cardInfo: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  lockedText: { color: '#9E9E9E' },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 6 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  accuracy: { fontSize: 12, color: '#6C63FF', fontWeight: '600' },
  pctBox: { marginLeft: 8 },
  pctText: { fontSize: 16, fontWeight: '800', color: '#6C63FF' },
  barBg: { height: 6, backgroundColor: '#E8ECF0', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: '#6C63FF', borderRadius: 3 },
});
