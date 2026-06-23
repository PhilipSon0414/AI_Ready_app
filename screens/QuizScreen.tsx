import React, { useState, useRef, useEffect } from 'react';
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
import {
  recordAnswer,
  completeUnit,
  checkLevelUnlock,
  getStore,
  BADGE_INFO,
  BadgeId,
} from '../store/useAppStore';

export default function QuizScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { unitId } = route.params;

  const unit = UNITS.find((u) => u.id === unitId)!;

  const [questions] = useState(() =>
    unit.questions.map((q) => {
      const indexed = q.options.map((opt, i) => ({ opt, isAnswer: i === q.answer }));
      for (let i = indexed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
      }
      return { ...q, options: indexed.map((o) => o.opt), answer: indexed.findIndex((o) => o.isAnswer) };
    })
  );

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const scoreRef = React.useRef({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState<BadgeId[]>([]);
  const [levelUnlocked, setLevelUnlocked] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const celebAnim = useRef(new Animated.Value(0.8)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;

  const q = questions[idx];

  function choose(i: number) {
    if (selected !== null) return;
    const isCorrect = recordAnswer(q, i);
    setSelected(i);
    setCorrect(isCorrect);
    const newScore = {
      correct: scoreRef.current.correct + (isCorrect ? 1 : 0),
      total: scoreRef.current.total + 1,
    };
    scoreRef.current = newScore;
    setScore(newScore);
    if (isCorrect) {
      setXpEarned((prev) => prev + 10);
    }
  }

  function next() {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      if (idx + 1 >= questions.length) {
        finishQuiz();
      } else {
        setIdx(idx + 1);
        setSelected(null);
        setCorrect(null);
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  }

  function finishQuiz() {
    const finalCorrect = scoreRef.current.correct;
    const finalTotal = scoreRef.current.total;

    // Award unit completion badges & XP
    const badges = completeUnit(unitId, finalCorrect, finalTotal);
    setNewBadges(badges);
    setXpEarned((prev) => prev + 50); // unit bonus

    // Check level unlock
    const unlocked = checkLevelUnlock(unit.level);
    if (unlocked) {
      setLevelUnlocked(true);
      setUnlockedLevel(unit.level + 1);
      setXpEarned((prev) => prev + 100);
    }

    setFinished(true);

    // Celebration animation
    Animated.spring(celebAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    Animated.timing(xpAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }

  if (finished) {
    const finalCorrect = score.correct;
    const finalTotal = score.total;
    const pct = Math.round((finalCorrect / finalTotal) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <Animated.View style={[styles.resultBox, { transform: [{ scale: celebAnim }] }]}>
            <Text style={styles.resultEmoji}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📖'}</Text>
            <Text style={styles.resultTitle}>학습 완료!</Text>
            <Text style={styles.resultScore}>
              {finalCorrect}/{finalTotal} 정답 ({pct}%)
            </Text>

            {/* XP earned */}
            <Animated.View style={[styles.xpBanner, { opacity: xpAnim }]}>
              <Text style={styles.xpBannerText}>+{xpEarned} XP 획득!</Text>
              <Text style={styles.xpBreakdown}>
                정답: +{(finalCorrect) * 10} XP · 완료 보너스: +50 XP
                {levelUnlocked ? ' · 레벨업: +100 XP' : ''}
              </Text>
            </Animated.View>

            {/* Level unlocked */}
            {levelUnlocked && unlockedLevel && (
              <View style={styles.levelUpBanner}>
                <Text style={styles.levelUpText}>🚀 레벨 {unlockedLevel} 잠금 해제!</Text>
              </View>
            )}

            {/* New badges */}
            {newBadges.length > 0 && (
              <View style={styles.badgesSection}>
                <Text style={styles.badgesSectionTitle}>새 뱃지 획득!</Text>
                <View style={styles.badgesRow}>
                  {newBadges.map((b) => (
                    <View key={b} style={styles.badgeChip}>
                      <Text style={styles.badgeChipEmoji}>{BADGE_INFO[b].emoji}</Text>
                      <Text style={styles.badgeChipName}>{BADGE_INFO[b].name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <Text style={styles.resultMsg}>
              {pct >= 80
                ? '훌륭해요! 다음 단원으로 도전해 보세요.'
                : pct >= 70
                ? '잘했습니다! 조금만 더 연습해 보세요.'
                : '오답노트를 통해 복습해 보세요.'}
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
                setXpEarned(0);
                setNewBadges([]);
                setLevelUnlocked(false);
                celebAnim.setValue(0.8);
                xpAnim.setValue(0);
              }}
            >
              <Text style={[styles.btnText, { color: '#6C63FF' }]}>다시 풀기</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
                  bg = '#E8F5E9'; borderColor = '#4CAF50'; textColor = '#2E7D32';
                } else if (i === selected && !correct) {
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
            <View style={[styles.explanation, { borderColor: correct ? '#4CAF50' : '#EF5350' }]}>
              <Text style={styles.expTitle}>{correct ? '✅ 정답! +10 XP' : '❌ 오답'}</Text>
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
  // Result
  resultScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  resultEmoji: { fontSize: 60 },
  resultTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  resultScore: { fontSize: 18, color: '#6C63FF', fontWeight: '700' },
  xpBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  xpBannerText: { fontSize: 20, fontWeight: '800', color: '#FFB300' },
  xpBreakdown: { fontSize: 11, color: '#888', textAlign: 'center' },
  levelUpBanner: {
    backgroundColor: '#EDE7F6',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  levelUpText: { fontSize: 16, fontWeight: '800', color: '#6A1B9A' },
  badgesSection: { width: '100%', gap: 8 },
  badgesSectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  badgesRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#FFB300',
  },
  badgeChipEmoji: { fontSize: 18 },
  badgeChipName: { fontSize: 13, fontWeight: '700', color: '#FFB300' },
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
