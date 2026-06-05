import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UNITS } from '../data/questions';
import { addXP, awardBadge } from '../store/useAppStore';

export default function FlashcardScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { unitId } = route.params as { unitId: string };

  const unit = UNITS.find((u) => u.id === unitId);
  const allCards = unit ? [...unit.questions] : [];

  const [deck, setDeck] = useState(allCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [done, setDone] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(flipAnim, { toValue: 0, useNativeDriver: true }).start();
    } else {
      Animated.spring(flipAnim, { toValue: 1, useNativeDriver: true }).start();
    }
    setFlipped(!flipped);
  };

  const handleKnow = () => {
    const earned = addXP(5);
    setTotalXP((prev) => prev + 5);
    const newMastered = masteredCount + 1;
    setMasteredCount(newMastered);

    // Award badge if all cards mastered
    if (newMastered === allCards.length) {
      const badgeAwarded = awardBadge('perfect_unit');
      if (badgeAwarded) setNewBadges((prev) => [...prev, 'perfect_unit']);
    }

    const newDeck = deck.filter((_, i) => i !== currentIndex);
    if (newDeck.length === 0) {
      setDone(true);
    } else {
      setDeck(newDeck);
      setCurrentIndex(Math.min(currentIndex, newDeck.length - 1));
    }
    resetFlip();
  };

  const handleAgain = () => {
    // Move card to end of deck
    const card = deck[currentIndex];
    const newDeck = deck.filter((_, i) => i !== currentIndex);
    newDeck.push(card);
    setDeck(newDeck);
    setCurrentIndex(Math.min(currentIndex, newDeck.length - 1));
    resetFlip();
  };

  const resetFlip = () => {
    flipAnim.setValue(0);
    setFlipped(false);
  };

  if (!unit) return null;

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionTitle}>학습 완료!</Text>
          <Text style={styles.completionSub}>{unit.title} 플래시카드를 모두 마쳤어요</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{masteredCount}</Text>
              <Text style={styles.statLabel}>마스터한 카드</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FFB300' }]}>+{totalXP}</Text>
              <Text style={styles.statLabel}>획득 XP</Text>
            </View>
          </View>

          {newBadges.includes('perfect_unit') && (
            <View style={styles.badgeAlert}>
              <Text style={styles.badgeAlertText}>⭐ 만점왕 뱃지를 획득했습니다!</Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneBtn} onPress={() => nav.goBack()}>
            <Text style={styles.doneBtnText}>학습 모드로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const card = deck[currentIndex];
  const progress = allCards.length - deck.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backBtnText}>‹ 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>플래시카드</Text>
        <Text style={styles.cardCount}>{progress}/{allCards.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: allCards.length === 0 ? '0%' : (`${(progress / allCards.length) * 100}%` as any) },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.remaining}>남은 카드: {deck.length}장</Text>

        {/* Flip card */}
        <TouchableOpacity onPress={flipCard} activeOpacity={0.95} style={styles.cardWrapper}>
          {/* Front */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              { transform: [{ rotateY: frontInterpolate }] },
            ]}
          >
            <Text style={styles.cardSide}>앞면 — 개념</Text>
            <Text style={styles.cardTopic}>{card.topic}</Text>
            <Text style={styles.cardQuestion}>{card.question}</Text>
            <Text style={styles.tapHint}>탭하여 답 확인 👆</Text>
          </Animated.View>

          {/* Back */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] },
            ]}
          >
            <Text style={styles.cardSide}>뒷면 — 해설</Text>
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>정답</Text>
              <Text style={styles.answerText}>{card.options[card.answer]}</Text>
            </View>
            <Text style={styles.explanationText}>{card.explanation}</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Action buttons - show only when flipped */}
        {flipped && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.againBtn} onPress={handleAgain}>
              <Text style={styles.againBtnText}>다시 볼게요 ↩</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.knowBtn} onPress={handleKnow}>
              <Text style={styles.knowBtnText}>알아요 ✓  +5 XP</Text>
            </TouchableOpacity>
          </View>
        )}

        {!flipped && (
          <Text style={styles.flipInstruction}>카드를 탭하면 답을 볼 수 있어요</Text>
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
    backgroundColor: '#FF6B6B',
  },
  backBtn: { paddingVertical: 4, minWidth: 60 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  cardCount: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.9)', minWidth: 60, textAlign: 'right' },
  progressBarBg: { height: 6, backgroundColor: '#FFD5D5' },
  progressBarFill: { height: '100%', backgroundColor: '#FF6B6B' },
  scroll: { padding: 16, gap: 16, alignItems: 'center' },
  remaining: { fontSize: 13, color: '#888', alignSelf: 'flex-start' },
  cardWrapper: { width: '100%', height: 280 },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    backfaceVisibility: 'hidden',
  },
  cardFront: { backgroundColor: '#fff' },
  cardBack: { backgroundColor: '#FFF0F4' },
  cardSide: { fontSize: 11, fontWeight: '700', color: '#FF6B6B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  cardTopic: { fontSize: 13, color: '#888', marginBottom: 10, fontWeight: '600' },
  cardQuestion: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', lineHeight: 26, marginBottom: 16 },
  tapHint: { fontSize: 13, color: '#ccc', textAlign: 'center' },
  answerBox: {
    backgroundColor: '#FFE8EC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  answerLabel: { fontSize: 11, fontWeight: '800', color: '#FF6B6B', marginBottom: 6, textTransform: 'uppercase' },
  answerText: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', lineHeight: 22 },
  explanationText: { fontSize: 14, color: '#555', lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  againBtn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  againBtnText: { fontSize: 15, fontWeight: '700', color: '#555' },
  knowBtn: {
    flex: 1.4,
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  knowBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  flipInstruction: { fontSize: 13, color: '#bbb', textAlign: 'center' },
  // Completion screen
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
  statNum: { fontSize: 32, fontWeight: '900', color: '#6C63FF' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 4, fontWeight: '600' },
  badgeAlert: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  badgeAlertText: { fontSize: 14, fontWeight: '700', color: '#856404' },
  doneBtn: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  doneBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
