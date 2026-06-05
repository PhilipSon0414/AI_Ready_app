import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWrongAnswers } from '../store/useAppStore';
import { UNITS } from '../data/questions';

export default function ReviewScreen() {
  const [wrongs, setWrongs] = React.useState(getWrongAnswers());

  useFocusEffect(
    useCallback(() => {
      setWrongs(getWrongAnswers());
    }, [])
  );

  const wrongQuestions = wrongs
    .map((w) => {
      const unit = UNITS.find((u) => u.id === w.unit);
      const q = unit?.questions.find((q) => q.id === w.questionId);
      return q ? { ...q, unitTitle: unit!.title, icon: unit!.icon } : null;
    })
    .filter(Boolean) as any[];

  if (wrongQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>오답노트</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyText}>오답이 없습니다!</Text>
          <Text style={styles.emptyDesc}>학습을 완료하면 틀린 문제가 여기에 표시됩니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오답노트</Text>
        <Text style={styles.count}>{wrongQuestions.length}개</Text>
      </View>
      <FlatList
        data={wrongQuestions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.unitTag}>
                {item.icon} {item.unitTitle}
              </Text>
              <Text style={styles.topicTag}>{item.topic}</Text>
            </View>
            <Text style={styles.question}>{item.question}</Text>
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>✅ 정답</Text>
              <Text style={styles.answerText}>{item.options[item.answer]}</Text>
            </View>
            <Text style={styles.explanation}>{item.explanation}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#6C63FF',
    gap: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', flex: 1 },
  count: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '700',
  },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  unitTag: { fontSize: 11, color: '#6C63FF', fontWeight: '600' },
  topicTag: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  question: { fontSize: 14, color: '#1A1A2E', fontWeight: '600', lineHeight: 20, marginBottom: 10 },
  answerBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  answerLabel: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  answerText: { flex: 1, fontSize: 13, color: '#2E7D32' },
  explanation: { fontSize: 12, color: '#666', lineHeight: 18 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 8 },
  emptyEmoji: { fontSize: 60 },
  emptyText: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  emptyDesc: { fontSize: 14, color: '#888', textAlign: 'center' },
});
