import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { UNITS } from '../constants/data';
import { getExplanation } from '../api/claude';
import { WrongAnswer } from '../types';

export default function ReviewScreen() {
  const { state, removeWrongAnswer } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleAiExplain = async (item: WrongAnswer) => {
    if (aiExplanations[item.id]) {
      setExpandedId(item.id);
      return;
    }
    setLoading(item.id);
    try {
      const exp = await getExplanation(item.question, item.userAnswer);
      setAiExplanations((prev) => ({ ...prev, [item.id]: exp }));
      setExpandedId(item.id);
    } catch {
      Alert.alert('오류', 'AI 해설을 불러올 수 없습니다.');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('삭제', '이 오답을 오답 노트에서 제거할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => removeWrongAnswer(id) },
    ]);
  };

  const renderItem = ({ item }: { item: WrongAnswer }) => {
    const unit = UNITS.find((u) => u.id === item.question.unitId);
    const isExpanded = expandedId === item.id;
    const isLoading = loading === item.id;
    const date = new Date(item.timestamp).toLocaleDateString('ko-KR');

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.unitTag}>{unit?.icon} {unit?.title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.question}>{item.question.prompt}</Text>
        {item.question.code && (
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{item.question.code}</Text>
          </View>
        )}
        <View style={styles.answerRow}>
          <View style={styles.answerChip}>
            <Text style={styles.answerLabel}>내 답: </Text>
            <Text style={styles.wrongAnswer}>{item.userAnswer}</Text>
          </View>
          <View style={styles.answerChip}>
            <Text style={styles.answerLabel}>정답: </Text>
            <Text style={styles.correctAnswer}>{item.question.answer}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>
              {aiExplanations[item.id] || item.question.explanation}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.aiBtn}
            onPress={() => isExpanded ? setExpandedId(null) : handleAiExplain(item)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#6C63FF" />
            ) : (
              <Text style={styles.aiBtnText}>{isExpanded ? '닫기' : '🤖 AI 해설'}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteBtnText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>오답 노트 📝</Text>
        <Text style={styles.count}>{state.wrongAnswers.length}개</Text>
      </View>
      {state.wrongAnswers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>오답이 없어요!</Text>
          <Text style={styles.emptySubtitle}>퀴즈를 풀면 틀린 문제가 여기에 쌓여요.</Text>
        </View>
      ) : (
        <FlatList
          data={[...state.wrongAnswers].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
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
  count: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
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
    gap: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unitTag: { fontSize: 12, fontWeight: '600', color: '#6C63FF' },
  date: { fontSize: 12, color: '#9E9E9E' },
  question: { fontSize: 15, color: '#1A1A2E', lineHeight: 22 },
  codeBox: { backgroundColor: '#1A1A2E', borderRadius: 8, padding: 10 },
  codeText: { fontFamily: 'monospace', color: '#A8FF78', fontSize: 12 },
  answerRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  answerChip: { flexDirection: 'row', alignItems: 'center' },
  answerLabel: { fontSize: 13, color: '#9E9E9E' },
  wrongAnswer: { fontSize: 13, fontWeight: '700', color: '#F44336' },
  correctAnswer: { fontSize: 13, fontWeight: '700', color: '#4CAF50' },
  explanationBox: {
    backgroundColor: '#F0EEFF',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6C63FF',
  },
  explanationText: { fontSize: 14, color: '#333', lineHeight: 21 },
  actions: { flexDirection: 'row', gap: 10 },
  aiBtn: {
    flex: 1,
    backgroundColor: '#F0EEFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minHeight: 38,
    justifyContent: 'center',
  },
  aiBtnText: { color: '#6C63FF', fontWeight: '700', fontSize: 14 },
  deleteBtn: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    paddingHorizontal: 16,
    padding: 10,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#F44336', fontWeight: '700', fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  emptySubtitle: { fontSize: 14, color: '#9E9E9E' },
});
