import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UNITS, Question } from '../data/questions';
import {
  addXP,
  getClozeLevel,
  incrementClozeLevel,
  getClozeMastery,
} from '../store/useAppStore';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDistractors(allQuestions: Question[], currentQuestion: Question): string[] {
  const correctAnswers = currentQuestion.cloze?.answers ?? [];
  const distractorPool: string[] = [];
  allQuestions.forEach((q) => {
    if (q.id !== currentQuestion.id && q.cloze) {
      q.cloze.answers.forEach((a) => {
        if (!correctAnswers.includes(a) && !distractorPool.includes(a)) {
          distractorPool.push(a);
        }
      });
    }
  });
  return shuffle(distractorPool).slice(0, 3);
}

function renderSentence(sentence: string, blanksCount: number, selectedAnswer: string | null, isCorrect: boolean | null) {
  // Replace the first `blanksCount` blank placeholders with either ___ or result
  let occurrenceCount = 0;
  const parts: { text: string; isBlank: boolean; index: number }[] = [];
  const regex = /___/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let blankIdx = 0;

  while ((match = regex.exec(sentence)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: sentence.slice(lastIndex, match.index), isBlank: false, index: -1 });
    }
    parts.push({ text: '___', isBlank: true, index: blankIdx });
    blankIdx++;
    lastIndex = match.index + 3;
  }
  if (lastIndex < sentence.length) {
    parts.push({ text: sentence.slice(lastIndex), isBlank: false, index: -1 });
  }

  return parts;
}

export default function ClozeScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { unitId } = route.params as { unitId: string };

  const unit = UNITS.find((u) => u.id === unitId);
  const clozeQuestions = unit ? unit.questions.filter((q) => q.cloze) : [];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [done, setDone] = useState(false);

  const current = clozeQuestions[questionIndex];

  const buildChoices = useCallback((q: Question) => {
    if (!q.cloze) return [];
    const level = getClozeLevel(q.id);
    // The target blank is at position min(level, answers.length-1)
    const blankIdx = Math.min(level, q.cloze.answers.length - 1);
    const correct = q.cloze.answers[blankIdx];
    const distractors = buildDistractors(clozeQuestions, q);
    const choices = shuffle([correct, ...distractors.slice(0, 3)]);
    return choices;
  }, [clozeQuestions]);

  if (!unit || clozeQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Text style={styles.backBtnText}>‹ 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>빈칸 채우기</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>이 단원에는 빈칸 문제가 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (done) {
    const mastery = getClozeMastery(unitId);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>✏️</Text>
          <Text style={styles.completionTitle}>세션 완료!</Text>
          <Text style={styles.completionSub}>{unit.title} 빈칸 채우기를 마쳤어요</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{mastery.mastered}</Text>
              <Text style={styles.statLabel}>마스터 ({mastery.total}개 중)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FFB300' }]}>+{totalXP}</Text>
              <Text style={styles.statLabel}>획득 XP</Text>
            </View>
          </View>

          <View style={styles.masteryBar}>
            <Text style={styles.masteryBarLabel}>숙달도 {mastery.mastered}/{mastery.total}</Text>
            <View style={styles.masteryBarBg}>
              <View
                style={[
                  styles.masteryBarFill,
                  {
                    width: mastery.total === 0 ? '0%' : (`${(mastery.mastered / mastery.total) * 100}%` as any),
                  },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={() => nav.goBack()}>
            <Text style={styles.doneBtnText}>학습 모드로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const clozeLevel = getClozeLevel(current.id);
  const blanksCount = Math.min(clozeLevel + 1, current.cloze!.answers.length);
  const blankIdx = Math.min(clozeLevel, current.cloze!.answers.length - 1);
  const correctAnswer = current.cloze!.answers[blankIdx];
  const choices = buildChoices(current);

  const handleChoice = (choice: string) => {
    if (selectedAnswer !== null) return; // already answered
    const correct = choice === correctAnswer;
    setSelectedAnswer(choice);
    setIsCorrect(correct);

    if (correct) {
      addXP(5);
      setTotalXP((prev) => prev + 5);
      incrementClozeLevel(current.id);
    }
  };

  const handleNext = () => {
    if (questionIndex + 1 >= clozeQuestions.length) {
      setDone(true);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  // Build sentence display parts
  const sentence = current.cloze!.sentence;
  const sentenceParts = renderSentence(sentence, blanksCount, selectedAnswer, isCorrect);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backBtnText}>‹ 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>빈칸 채우기</Text>
        <Text style={styles.cardCount}>{questionIndex + 1}/{clozeQuestions.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((questionIndex + 1) / clozeQuestions.length) * 100}%` as any },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Level indicator */}
        <View style={styles.levelRow}>
          <Text style={styles.levelLabel}>
            숙달 단계 {clozeLevel >= 2 ? '🌟 마스터' : `레벨 ${clozeLevel + 1}`}
          </Text>
          <Text style={styles.blankCountLabel}>빈칸 {blanksCount}개</Text>
        </View>

        {/* Sentence with blanks */}
        <View style={styles.sentenceCard}>
          <Text style={styles.sentenceLabel}>{current.topic}</Text>
          <Text style={styles.sentence}>
            {sentenceParts.map((part, i) => {
              if (!part.isBlank) {
                return <Text key={i} style={styles.sentenceText}>{part.text}</Text>;
              }
              // Determine display for this blank
              const thisBlankIdx = part.index;
              const isTargetBlank = thisBlankIdx === blankIdx;
              if (isTargetBlank && selectedAnswer !== null) {
                return (
                  <Text
                    key={i}
                    style={[
                      styles.blankFilled,
                      isCorrect ? styles.blankCorrect : styles.blankWrong,
                    ]}
                  >
                    {selectedAnswer}
                  </Text>
                );
              }
              return (
                <Text key={i} style={styles.blank}>___</Text>
              );
            })}
          </Text>
        </View>

        {/* Feedback */}
        {isCorrect !== null && (
          <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackEmoji}>{isCorrect ? '✅' : '❌'}</Text>
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>
                {isCorrect ? '정답입니다! +5 XP' : `오답. 정답: "${correctAnswer}"`}
              </Text>
              {!isCorrect && (
                <Text style={styles.feedbackDesc}>다음에 같은 문제로 다시 도전하세요!</Text>
              )}
            </View>
          </View>
        )}

        {/* Choice buttons */}
        <View style={styles.choicesGrid}>
          {choices.map((choice, i) => {
            let btnStyle = styles.choiceBtn;
            let textStyle = styles.choiceBtnText;
            if (selectedAnswer !== null) {
              if (choice === correctAnswer) {
                btnStyle = { ...styles.choiceBtn, ...styles.choiceBtnCorrect } as any;
                textStyle = { ...styles.choiceBtnText, color: '#fff' } as any;
              } else if (choice === selectedAnswer && !isCorrect) {
                btnStyle = { ...styles.choiceBtn, ...styles.choiceBtnWrong } as any;
                textStyle = { ...styles.choiceBtnText, color: '#fff' } as any;
              } else {
                btnStyle = { ...styles.choiceBtn, opacity: 0.4 } as any;
              }
            }
            return (
              <TouchableOpacity
                key={i}
                style={btnStyle}
                onPress={() => handleChoice(choice)}
                disabled={selectedAnswer !== null}
              >
                <Text style={textStyle}>{choice}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedAnswer !== null && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {questionIndex + 1 >= clozeQuestions.length ? '결과 보기' : '다음 문제 →'}
            </Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: '#26C6A6',
  },
  backBtn: { paddingVertical: 4, minWidth: 60 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  cardCount: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.9)', minWidth: 60, textAlign: 'right' },
  progressBarBg: { height: 6, backgroundColor: '#B2EFE5' },
  progressBarFill: { height: '100%', backgroundColor: '#26C6A6' },
  scroll: { padding: 16, gap: 14 },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelLabel: { fontSize: 13, fontWeight: '700', color: '#26C6A6' },
  blankCountLabel: { fontSize: 12, color: '#888', fontWeight: '600' },
  sentenceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sentenceLabel: { fontSize: 12, fontWeight: '700', color: '#26C6A6', marginBottom: 12, textTransform: 'uppercase' },
  sentence: { fontSize: 18, lineHeight: 30, color: '#1A1A2E', fontWeight: '500' },
  sentenceText: { fontSize: 18, color: '#1A1A2E', fontWeight: '500' },
  blank: {
    fontSize: 18,
    fontWeight: '700',
    color: '#26C6A6',
    textDecorationLine: 'underline',
  },
  blankFilled: {
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  blankCorrect: { color: '#1B7A50', backgroundColor: '#D4EDDA' },
  blankWrong: { color: '#721C24', backgroundColor: '#F8D7DA' },
  feedbackBox: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  feedbackCorrect: { backgroundColor: '#D4EDDA' },
  feedbackWrong: { backgroundColor: '#F8D7DA' },
  feedbackEmoji: { fontSize: 22 },
  feedbackContent: { flex: 1 },
  feedbackTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  feedbackDesc: { fontSize: 13, color: '#555' },
  choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choiceBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  choiceBtnCorrect: { backgroundColor: '#26C6A6', borderColor: '#26C6A6' },
  choiceBtnWrong: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
  choiceBtnText: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
  nextBtn: {
    backgroundColor: '#26C6A6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  nextBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888' },
  // Completion
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  completionEmoji: { fontSize: 64 },
  completionTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A2E' },
  completionSub: { fontSize: 15, color: '#888', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statNum: { fontSize: 32, fontWeight: '900', color: '#26C6A6' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 4, fontWeight: '600' },
  masteryBar: { width: '100%', gap: 8 },
  masteryBarLabel: { fontSize: 13, fontWeight: '700', color: '#555', textAlign: 'center' },
  masteryBarBg: {
    height: 10,
    backgroundColor: '#E8ECF0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  masteryBarFill: { height: '100%', backgroundColor: '#26C6A6', borderRadius: 5 },
  doneBtn: {
    backgroundColor: '#26C6A6',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  doneBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
