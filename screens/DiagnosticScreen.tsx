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
import { useNavigation } from '@react-navigation/native';
import { DIAGNOSTIC_QUESTIONS } from '../data/questions';
import { completeDiagnostic } from '../store/useAppStore';

const LEVEL_INFO: Record<number, { name: string; icon: string; color: string; desc: string }> = {
  0: { icon: '🌿', color: '#78909C', name: 'AI 완전 입문', desc: 'AI에 대해 이제 막 관심을 갖기 시작하셨군요! 걱정 마세요. 가장 쉬운 개념부터 차근차근 배워나갈 수 있습니다.' },
  1: { icon: '👂', color: '#66BB6A', name: 'AI 이름만 들어봤어요', desc: 'AI라는 단어는 익숙하시죠? 이제 그 안에 무엇이 있는지 하나씩 알아갈 시간입니다.' },
  2: { icon: '📖', color: '#42A5F5', name: 'AI 개념 이해 중', desc: 'AI의 기본 개념들을 이해하고 계시네요! 이제 실제로 코드로 구현하는 방법을 배워볼게요.' },
  3: { icon: '💻', color: '#AB47BC', name: '코딩 첫걸음', desc: 'Python 코드를 실행해보셨군요! 기초 문법을 다지고 데이터 분석으로 나아가 봅시다.' },
  4: { icon: '🐍', color: '#FF7043', name: '파이썬 기초', desc: 'Python 기초 문법을 잘 활용하시네요! 이제 데이터를 다루는 강력한 라이브러리를 배울 차례입니다.' },
  5: { icon: '📊', color: '#FFA726', name: '데이터 분석 입문', desc: '데이터 분석 능력을 갖추셨네요! 이제 머신러닝 알고리즘을 이해하고 적용해 봅시다.' },
  6: { icon: '⚙️', color: '#EC407A', name: '알고리즘 적용', desc: '다양한 알고리즘을 알고 계시는군요! 코드를 직접 읽고 수정하는 전문가 수준에 도전해 보세요.' },
  7: { icon: '🔥', color: '#8D6E63', name: '코드 마스터', desc: '코드를 자유롭게 읽고 수정할 수 있는 최고 수준이시네요! AI 전문가의 역량을 갖추셨습니다.' },
};

function scoreToLevel(score: number): number {
  // 12 questions: 0-1→0, 2-3→1, 4-5→2, 6-7→3, 8-9→4, 10→5, 11→6, 12→7
  if (score <= 1) return 0;
  if (score <= 3) return 1;
  if (score <= 5) return 2;
  if (score <= 7) return 3;
  if (score <= 9) return 4;
  if (score <= 10) return 5;
  if (score <= 11) return 6;
  return 7;
}

function shuffleOptions(q: typeof DIAGNOSTIC_QUESTIONS[0]) {
  const indexed = q.options.map((opt, i) => ({ opt, isAnswer: i === q.answer }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    ...q,
    options: indexed.map((o) => o.opt),
    answer: indexed.findIndex((o) => o.isAnswer),
  };
}

export default function DiagnosticScreen() {
  const nav = useNavigation<any>();
  const [questions] = useState(() => DIAGNOSTIC_QUESTIONS.map(shuffleOptions));

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const correctCountRef = React.useRef(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const q = questions[idx];

  function choose(i: number) {
    if (selected !== null) return;
    const correct = i === q.answer;
    setSelected(i);
    setIsCorrect(correct);
    if (correct) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
    }
  }

  function next() {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      if (idx + 1 >= questions.length) {
        const finalCount = correctCountRef.current;
        const level = scoreToLevel(finalCount);
        completeDiagnostic(level);
        nav.replace('DiagnosticReport', { level, score: finalCount, totalQuestions: questions.length });
      } else {
        setIdx(idx + 1);
        setSelected(null);
        setIsCorrect(null);
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  }

  const progress = (idx + 1) / questions.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 수준 진단</Text>
        <Text style={styles.headerSub}>내 실력을 파악하고 맞춤 학습을 시작하세요</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>
      <Text style={styles.progressLabel}>{idx + 1} / {questions.length}</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Level indicator */}
          <View style={[styles.levelTag, { backgroundColor: LEVEL_INFO[q.level].color + '20' }]}>
            <Text style={[styles.levelTagText, { color: LEVEL_INFO[q.level].color }]}>
              {LEVEL_INFO[q.level].icon} {LEVEL_INFO[q.level].name} 수준
            </Text>
          </View>

          {/* Question */}
          <View style={styles.qCard}>
            <Text style={styles.topic}>{q.topic}</Text>
            <Text style={styles.question}>{q.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.options}>
            {q.options.map((opt, i) => {
              let bg = '#fff';
              let borderColor = '#E8ECF0';
              let textColor = '#1A1A2E';

              if (selected !== null) {
                if (i === q.answer) {
                  bg = '#E8F5E9'; borderColor = '#4CAF50'; textColor = '#2E7D32';
                } else if (i === selected && !isCorrect) {
                  bg = '#FFEBEE'; borderColor = '#EF5350'; textColor = '#C62828';
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
            <View style={[styles.explanation, { borderColor: isCorrect ? '#4CAF50' : '#EF5350' }]}>
              <Text style={styles.expTitle}>{isCorrect ? '✅ 정답!' : '❌ 오답'}</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#6C63FF',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  progressBar: { height: 4, backgroundColor: '#E8ECF0' },
  progressFill: { height: '100%', backgroundColor: '#FFB300' },
  progressLabel: { textAlign: 'right', paddingRight: 16, paddingTop: 4, fontSize: 12, color: '#9E9E9E', fontWeight: '600' },
  scroll: { padding: 16, gap: 12 },
  levelTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  levelTagText: { fontSize: 12, fontWeight: '700' },
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
});
