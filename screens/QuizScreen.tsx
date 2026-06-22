import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UNITS, XP_PER_CORRECT, XP_PER_HINT } from '../constants/data';
import { generateQuestion, getHint, getExplanation } from '../api/claude';
import { useAppStore } from '../store/useAppStore';
import { Question } from '../types';

type Phase = 'loading' | 'answering' | 'result';

export default function QuizScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { recordAnswer } = useAppStore();
  const unitId: number = route.params?.unitId ?? 1;
  const unit = UNITS.find((u) => u.id === unitId)!;

  const [question, setQuestion] = useState<Question | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [loadingHint, setLoadingHint] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const loadQuestion = useCallback(async () => {
    setPhase('loading');
    setUserAnswer('');
    setHint('');
    setExplanation('');
    setHintUsed(false);
    try {
      const q = await generateQuestion(unit);
      setQuestion(q);
      setPhase('answering');
    } catch (e) {
      Alert.alert(
        '⚠️ API 오류',
        '웹 브라우저는 CORS 정책으로 Anthropic API를 직접 호출할 수 없습니다.\n\n✅ 해결방법: Expo Go 앱(모바일)으로 실행하세요.\n\n① 앱스토어에서 "Expo Go" 설치\n② 터미널에서 npx expo start 실행\n③ QR 코드 스캔',
        [{ text: '확인', onPress: () => navigation.goBack() }]
      );
    }
  }, [unit, navigation]);

  useEffect(() => {
    loadQuestion();
  }, []);

  const handleHint = async () => {
    if (!question || hintUsed) return;
    setLoadingHint(true);
    try {
      const h = await getHint(question);
      setHint(h);
      setHintUsed(true);
    } catch {
      setHint('힌트를 불러올 수 없습니다.');
    } finally {
      setLoadingHint(false);
    }
  };

  const handleSubmit = async () => {
    if (!question || !userAnswer.trim()) return;
    const correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    setIsCorrect(correct);
    recordAnswer(unitId, question, userAnswer.trim(), correct);
    setPhase('result');
    setLoadingExplanation(true);
    try {
      const exp = await getExplanation(question, userAnswer.trim());
      setExplanation(exp);
    } catch {
      setExplanation(question.explanation);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleNext = () => {
    const next = questionCount + 1;
    setQuestionCount(next);
    loadQuestion();
  };

  if (phase === 'loading') {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Claude가 문제를 생성하고 있어요...</Text>
      </SafeAreaView>
    );
  }

  if (!question) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.unitLabel}>{unit.icon} {unit.title}</Text>
          <Text style={styles.countLabel}>#{questionCount + 1}</Text>
        </View>

        {/* Question type badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{question.type.replace('_', ' ')}</Text>
        </View>

        {/* Question */}
        <View style={styles.card}>
          <Text style={styles.prompt}>{question.prompt}</Text>
          {question.code && (
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{question.code}</Text>
            </View>
          )}
        </View>

        {/* Choices or TextInput */}
        {phase === 'answering' && (
          <>
            {question.choices ? (
              <View style={styles.choices}>
                {question.choices.map((choice, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.choiceBtn, userAnswer === choice && styles.choiceSelected]}
                    onPress={() => setUserAnswer(choice)}
                  >
                    <Text style={[styles.choiceText, userAnswer === choice && styles.choiceTextSelected]}>
                      {String.fromCharCode(65 + i)}. {choice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="답을 입력하세요..."
                placeholderTextColor="#9E9E9E"
                value={userAnswer}
                onChangeText={setUserAnswer}
                multiline
              />
            )}

            {/* Hint */}
            {hint ? (
              <View style={styles.hintBox}>
                <Text style={styles.hintLabel}>💡 힌트</Text>
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.hintBtn} onPress={handleHint} disabled={loadingHint}>
                {loadingHint ? (
                  <ActivityIndicator size="small" color="#FF9800" />
                ) : (
                  <Text style={styles.hintBtnText}>💡 힌트 보기 ({XP_PER_HINT} XP)</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, !userAnswer && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!userAnswer}
            >
              <Text style={styles.submitText}>정답 제출</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Result */}
        {phase === 'result' && (
          <View>
            <View style={[styles.resultCard, isCorrect ? styles.correctCard : styles.wrongCard]}>
              <Text style={styles.resultEmoji}>{isCorrect ? '🎉' : '😅'}</Text>
              <Text style={styles.resultTitle}>{isCorrect ? '정답!' : '오답'}</Text>
              <Text style={styles.resultXp}>{isCorrect ? `+${XP_PER_CORRECT} XP` : '다음엔 파이팅!'}</Text>
              <Text style={styles.answerLabel}>정답: <Text style={styles.answerText}>{question.answer}</Text></Text>
            </View>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>📖 해설</Text>
              {loadingExplanation ? (
                <ActivityIndicator size="small" color="#6C63FF" />
              ) : (
                <Text style={styles.explanationText}>{explanation}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>다음 문제 →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA', gap: 16 },
  loadingText: { fontSize: 16, color: '#6C63FF', fontWeight: '600' },
  scroll: { padding: 16, gap: 14 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  backBtn: { padding: 4 },
  backText: { color: '#6C63FF', fontWeight: '600', fontSize: 15 },
  unitLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  countLabel: { fontSize: 14, color: '#9E9E9E', fontWeight: '600' },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E4FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: { color: '#6C63FF', fontSize: 12, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  prompt: { fontSize: 17, color: '#1A1A2E', lineHeight: 26, fontWeight: '500' },
  codeBox: {
    marginTop: 12,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 14,
  },
  codeText: { fontFamily: 'monospace', color: '#A8FF78', fontSize: 13, lineHeight: 20 },
  choices: { gap: 10 },
  choiceBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E8ECF0',
  },
  choiceSelected: { borderColor: '#6C63FF', backgroundColor: '#F0EEFF' },
  choiceText: { fontSize: 15, color: '#444' },
  choiceTextSelected: { color: '#6C63FF', fontWeight: '700' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#E8ECF0',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hintBtn: {
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: '#FF9800',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hintBtnText: { color: '#FF9800', fontWeight: '600', fontSize: 14 },
  hintBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  hintLabel: { fontWeight: '700', color: '#FF9800', marginBottom: 4 },
  hintText: { color: '#5D4037', lineHeight: 22 },
  submitBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#C5C0F5' },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  correctCard: { backgroundColor: '#E8F5E9' },
  wrongCard: { backgroundColor: '#FFEBEE' },
  resultEmoji: { fontSize: 40 },
  resultTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  resultXp: { fontSize: 16, fontWeight: '600', color: '#6C63FF' },
  answerLabel: { fontSize: 14, color: '#555' },
  answerText: { fontWeight: '700', color: '#1A1A2E' },
  explanationBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    minHeight: 60,
    gap: 8,
  },
  explanationLabel: { fontWeight: '700', fontSize: 15, color: '#1A1A2E' },
  explanationText: { color: '#444', lineHeight: 22 },
  nextBtn: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  nextText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
