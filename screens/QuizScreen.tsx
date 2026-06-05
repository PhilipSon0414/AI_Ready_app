import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UNITS } from '../data/questions';
import { recordAnswer } from '../store/useAppStore';

export default function QuizScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { unitId } = route.params;

  const unit = UNITS.find((u) => u.id === unitId)!;
  const questions = unit.questions;

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const q = questions[idx];

  function choose(i: number) {
    if (selected !== null) return;
    const isCorrect = recordAnswer(q, i);
    setSelected(i);
    setCorrect(isCorrect);
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function next() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (idx + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIdx(idx + 1);
        setSelected(null);
        setCorrect(null);
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  if (finished) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📖'}</Text>
          <Text style={styles.resultTitle}>학습 완료!</Text>
          <Text style={styles.resultScore}>
            {score.correct}/{score.total} 정답 ({pct}%)
          </Text>
          <Text style={styles.resultMsg}>
            {pct >= 80 ? '훌륭해요! 다음 단원으로 도전해 보세요.' : '오답노트를 통해 복습해 보세요.'}
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => nav.goBack()}>
            <Text style={styles.btnText}>단원 목록으로</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => {
              setIdx(0);
              setSelected(null);
              setCorrect(null);
              setScore({ correct: 0, total: 0 });
              setFinished(false);
            }}
          >
            <Text style={[styles.btnText, { color: '#6C63FF' }]}>다시 풀기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>{unit.title}</Text>
        <Text style={styles.counter}>
          {idx + 1}/{questions.length}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.qCard}>
            <Text style={styles.topic}>{q.topic}</Text>
            <Text style={styles.question}>{q.question}</Text>
          </View>

          <View style={styles.options}>
            {q.options.map((opt, i) => {
              let bg = '#fff';
              let borderColor = '#E8ECF0';
              let textColor = '#1A1A2E';

              if (selected !== null) {
                if (i === q.answer) {
                  bg = '#E8F5E9';
                  borderColor = '#4CAF50';
                  textColor = '#2E7D32';
                } else if (i === selected && !correct) {
                  bg = '#FFEBEE';
                  borderColor = '#EF5350';
                  textColor = '#C62828';
                }
              }

              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.option, { backgroundColor: bg, borderColor }]}
                  onPress={() => choose(i)}
                  disabled={selected !== null}
                >
                  <Text style={[styles.optionLabel, { color: textColor }]}>
                    {String.fromCharCode(65 + i)}.
                  </Text>
                  <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selected !== null && (
            <View style={[styles.explanation, { borderColor: correct ? '#4CAF50' : '#EF5350' }]}>
              <Text style={styles.expTitle}>{correct ? '✅ 정답!' : '❌ 오답'}</Text>
              <Text style={styles.expText}>{q.explanation}</Text>
            </View>
          )}

          {selected !== null && (
            <TouchableOpacity style={styles.nextBtn} onPress={next}>
              <Text style={styles.nextText}>
                {idx + 1 >= questions.length ? '결과 보기' : '다음 문제 →'}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#6C63FF',
  },
  back: { color: '#fff', fontSize: 14 },
  topTitle: { flex: 1, color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 15 },
  counter: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  progressBar: { height: 4, backgroundColor: '#E8ECF0' },
  progressFill: { height: '100%', backgroundColor: '#6C63FF' },
  scroll: { padding: 16, gap: 12 },
  qCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topic: { fontSize: 11, color: '#6C63FF', fontWeight: '600', marginBottom: 8 },
  question: { fontSize: 16, color: '#1A1A2E', fontWeight: '600', lineHeight: 24 },
  options: { gap: 10, marginBottom: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 10,
  },
  optionLabel: { fontWeight: '700', fontSize: 14, width: 20 },
  optionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  explanation: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
  },
  expTitle: { fontWeight: '700', fontSize: 14, marginBottom: 6 },
  expText: { fontSize: 13, color: '#444', lineHeight: 20 },
  nextBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
  resultEmoji: { fontSize: 60 },
  resultTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  resultScore: { fontSize: 18, color: '#6C63FF', fontWeight: '700' },
  resultMsg: { fontSize: 14, color: '#666', textAlign: 'center' },
  btn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#6C63FF' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
