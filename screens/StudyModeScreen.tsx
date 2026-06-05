import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UNITS } from '../data/questions';

export default function StudyModeScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { unitId } = route.params as { unitId: string };

  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return null;

  const modes = [
    {
      id: 'quiz',
      emoji: '📝',
      title: '객관식 퀴즈',
      desc: '4지선다 문제를 풀며\n지식을 점검하세요',
      detail: `${unit.questions.length}문제`,
      color: '#6C63FF',
      bgColor: '#EEF0FF',
      screen: 'Quiz',
    },
    {
      id: 'flashcard',
      emoji: '🃏',
      title: '플래시카드',
      desc: '카드를 넘기며\n핵심 개념을 익히세요',
      detail: `${unit.questions.length}장`,
      color: '#FF6B6B',
      bgColor: '#FFF0F0',
      screen: 'Flashcard',
    },
    {
      id: 'cloze',
      emoji: '🔤',
      title: '빈칸 채우기',
      desc: '빈칸을 채우며\n점진적으로 암기하세요',
      detail: '점진적 암기',
      color: '#26C6A6',
      bgColor: '#E8FAF6',
      screen: 'Cloze',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backBtnText}>‹ 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>학습 모드 선택</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Unit info card */}
        <View style={styles.unitCard}>
          <Text style={styles.unitEmoji}>{unit.icon}</Text>
          <View style={styles.unitInfo}>
            <Text style={styles.unitTitle}>{unit.title}</Text>
            <Text style={styles.unitDesc}>{unit.description}</Text>
            <View style={styles.unitMeta}>
              <Text style={styles.unitMetaText}>레벨 {unit.level}</Text>
              <Text style={styles.unitMetaDot}>•</Text>
              <Text style={styles.unitMetaText}>{unit.questions.length}개 문제</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>원하는 학습 방식을 선택하세요</Text>

        {/* Mode cards */}
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeCard, { borderLeftColor: mode.color }]}
            onPress={() => nav.navigate(mode.screen, { unitId })}
            activeOpacity={0.85}
          >
            <View style={[styles.modeIconBg, { backgroundColor: mode.bgColor }]}>
              <Text style={styles.modeEmoji}>{mode.emoji}</Text>
            </View>
            <View style={styles.modeContent}>
              <View style={styles.modeTitleRow}>
                <Text style={[styles.modeTitle, { color: mode.color }]}>{mode.title}</Text>
                <View style={[styles.modeDetailBadge, { backgroundColor: mode.bgColor }]}>
                  <Text style={[styles.modeDetailText, { color: mode.color }]}>{mode.detail}</Text>
                </View>
              </View>
              <Text style={styles.modeDesc}>{mode.desc}</Text>
            </View>
            <Text style={[styles.arrow, { color: mode.color }]}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#6C63FF',
  },
  backBtn: { paddingVertical: 4, paddingHorizontal: 4, minWidth: 60 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  scroll: { padding: 16, gap: 14 },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unitEmoji: { fontSize: 44 },
  unitInfo: { flex: 1 },
  unitTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  unitDesc: { fontSize: 13, color: '#888', marginBottom: 8 },
  unitMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unitMetaText: { fontSize: 12, color: '#6C63FF', fontWeight: '600' },
  unitMetaDot: { fontSize: 12, color: '#ccc' },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  modeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  modeIconBg: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeEmoji: { fontSize: 30 },
  modeContent: { flex: 1 },
  modeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  modeTitle: { fontSize: 16, fontWeight: '800' },
  modeDetailBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  modeDetailText: { fontSize: 11, fontWeight: '700' },
  modeDesc: { fontSize: 13, color: '#888', lineHeight: 18 },
  arrow: { fontSize: 28, fontWeight: '300' },
});
