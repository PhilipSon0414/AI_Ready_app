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
  1: { name: 'AI 입문',  icon: '🌱', color: '#4CAF50', desc: 'AI의 기본 개념에 대한 이해가 시작 단계입니다. 인공지능이 무엇인지, 어떻게 활용되는지 기초부터 차근차근 배워보세요.' },
  2: { name: 'AI 기초',  icon: '📘', color: '#2196F3', desc: 'AI의 기본 개념은 이해하고 있지만 심화 내용이 필요합니다. 머신러닝, 딥러닝 등 핵심 기술을 학습해 보세요.' },
  3: { name: 'AI 응용',  icon: '⚡', color: '#FF9800', desc: 'AI에 대한 상당한 지식을 갖추고 있습니다. 실무 응용과 최신 트렌드를 중심으로 실력을 더욱 높여보세요.' },
  4: { name: 'AI 전문가', icon: '🔥', color: '#9C27B0', desc: 'AI 분야의 높은 전문성을 보유하고 있습니다. 고급 개념과 최신 연구 동향으로 전문가 수준을 완성하세요.' },
};

function scoreToLevel(score: number): number {
  // 0-2 → Level 1, 3-4 → Level 1-2, 5-6 → Level 2-3, 7-8 → Level 3-4
  if (score <= 2) return 1;
  if (score <= 4) return 2;
  if (score <= 6) return 3;
  return 4;
}

export default function DiagnosticScreen() {
  const nav = useNavigation<any>();
  const questions = DIAGNOSTIC_QUESTIONS;

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const correctCountRef = React.useRef(0);
  const [finished, setFinished] = useState(false);
  const [assignedLevel, setAssignedLevel] = useState(1);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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
        setAssignedLevel(level);
        setCorrectCount(finalCount);
        completeDiagnostic(level);
        setFinished(true);
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
      } else {
        setIdx(idx + 1);
        setSelected(null);
        setIsCorrect(null);
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  }

  function goHome() {
    nav.replace('MainTabs');
  }

  if (finished) {
    const levelInfo = LEVEL_INFO[assignedLevel];
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <Animated.View style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.resultBig}>🎉</Text>
            <Text style={styles.resultHeading}>진단 완료!</Text>
            <Text style={styles.resultScore}>
              {correctCount}/{questions.length} 정답 ({pct}%)
            </Text>

            <View style={[styles.levelBadge, { backgroundColor: levelInfo.color + '20', borderColor: levelInfo.color }]}>
              <Text style={styles.levelBadgeIcon}>{levelInfo.icon}</Text>
              <View>
                <Text style={[styles.levelBadgeName, { color: levelInfo.color }]}>레벨 {assignedLevel}</Text>
                <Text style={[styles.levelBadgeTitle, { color: levelInfo.color }]}>{levelInfo.name}</Text>
              </View>
            </View>

            <Text style={styles.levelDesc}>{levelInfo.desc}</Text>

            <View style={styles.scoreBreakdown}>
              {[1, 2, 3, 4].map((l) => {
                const lqIds = questions.filter((dq) => dq.level === l).map((dq) => dq.id);
                return (
                  <View key={l} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      {LEVEL_INFO[l].icon} {LEVEL_INFO[l].name}
                    </Text>
                    <View style={[styles.breakdownDot, { backgroundColor: l <= assignedLevel ? LEVEL_INFO[l].color : '#E0E0E0' }]} />
                  </View>
                );
              })}
            </View>

            <Text style={styles.unlockNote}>
              레벨 1{assignedLevel > 1 ? `~${assignedLevel}` : ''} 잠금 해제됨!
            </Text>

            <TouchableOpacity style={[styles.startBtn, { backgroundColor: levelInfo.color }]} onPress={goHome}>
              <Text style={styles.startBtnText}>학습 시작하기 →</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
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
  // Result styles
  resultScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  resultBig: { fontSize: 64 },
  resultHeading: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  resultScore: { fontSize: 16, color: '#666' },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
    justifyContent: 'center',
  },
  levelBadgeIcon: { fontSize: 40 },
  levelBadgeName: { fontSize: 13, fontWeight: '600' },
  levelBadgeTitle: { fontSize: 20, fontWeight: '800' },
  levelDesc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  scoreBreakdown: { width: '100%', gap: 8 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel: { fontSize: 13, color: '#555' },
  breakdownDot: { width: 12, height: 12, borderRadius: 6 },
  unlockNote: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFB300',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startBtn: {
    width: '100%',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
