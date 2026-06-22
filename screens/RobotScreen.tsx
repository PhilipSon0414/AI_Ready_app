import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { callRobotClaude, RobotMessage } from '../api/robot';
import { MISSIONS, Mission, CommandCard } from '../constants/robotMissions';

type Stage = 'select' | 'playing' | 'success';
type InputMode = 'block' | 'text';

export default function RobotScreen() {
  const [stage, setStage] = useState<Stage>('select');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('block');
  const [messages, setMessages] = useState<RobotMessage[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successConcept, setSuccessConcept] = useState('');
  const [availableCards, setAvailableCards] = useState<CommandCard[]>([]);
  const [queuedCards, setQueuedCards] = useState<CommandCard[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startMission = useCallback((mission: Mission) => {
    setCurrentMission(mission);
    setMessages([
      {
        role: 'robot',
        text: `삐빅- 안녕하십니까. 저는 당신의 명령을 100% 그대로만 실행하는 바보 로봇입니다.\n\n🎯 미션: ${mission.title}\n\n${mission.description}\n\n📦 준비된 환경:\n${mission.environment.join('\n')}\n\n첫 번째 명령어를 입력해 주세요.`,
      },
    ]);
    setCommandHistory([]);
    setAvailableCards(mission.commandCards);
    setQueuedCards([]);
    setTextInput('');
    setStage('playing');
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const addCardToQueue = useCallback((card: CommandCard) => {
    setQueuedCards((prev) => [...prev, { ...card, id: `${card.id}_${Date.now()}` }]);
  }, []);

  const removeCardFromQueue = useCallback((idx: number) => {
    setQueuedCards((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const moveCard = useCallback((from: number, to: number) => {
    setQueuedCards((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }, []);

  const sendCommands = useCallback(async () => {
    if (!currentMission) return;

    const commands =
      inputMode === 'block'
        ? queuedCards.map((c, i) => `${i + 1}. ${c.label}`)
        : textInput
            .split('\n')
            .map((l, i) => `${i + 1}. ${l.trim()}`)
            .filter((l) => l.replace(/^\d+\. /, '').length > 0);

    if (commands.length === 0) return;

    const cmdText = commands.join('\n');
    const newHistory = [...commandHistory, ...commands.map((c) => c.replace(/^\d+\. /, ''))];
    setCommandHistory(newHistory);

    const userMsg: RobotMessage = { role: 'user', text: cmdText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setQueuedCards([]);
    setTextInput('');

    try {
      const { reply, isSuccess, concept } = await callRobotClaude(
        currentMission,
        [...messages, userMsg],
        newHistory
      );
      setMessages((prev) => [...prev, { role: 'robot', text: reply }]);

      if (isSuccess) {
        setSuccessConcept(concept ?? '');
        setTimeout(() => setShowSuccessModal(true), 600);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'robot', text: '⚠️ 통신 오류가 발생했습니다. 다시 시도해주세요.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [currentMission, inputMode, queuedCards, textInput, commandHistory, messages]);

  const resetMission = useCallback(() => {
    if (currentMission) startMission(currentMission);
  }, [currentMission, startMission]);

  if (stage === 'select') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🤖 바보 로봇</Text>
          <Text style={styles.headerSub}>Level 0 · 컴퓨팅 사고력</Text>
        </View>
        <ScrollView contentContainerStyle={styles.missionList}>
          <View style={styles.introBox}>
            <Text style={styles.introTitle}>컴퓨터는 왜 내 말을 못 알아들을까?</Text>
            <Text style={styles.introDesc}>
              바보 로봇에게 명령을 내리며{'\n'}알고리즘 사고력을 키워보세요!
            </Text>
          </View>
          {MISSIONS.map((m) => (
            <TouchableOpacity key={m.id} style={styles.missionCard} onPress={() => startMission(m)}>
              <Text style={styles.missionEmoji}>{m.icon}</Text>
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{m.title}</Text>
                <Text style={styles.missionDesc}>{m.shortDesc}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Stage {m.stage}</Text>
                </View>
              </View>
              <Text style={styles.arrow}>▶</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStage('select')} style={styles.backBtn}>
          <Text style={styles.backText}>← 목록</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentMission?.icon} {currentMission?.title}</Text>
        <TouchableOpacity onPress={resetMission}>
          <Text style={styles.resetText}>↺ 리셋</Text>
        </TouchableOpacity>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, inputMode === 'block' && styles.modeBtnActive]}
          onPress={() => setInputMode('block')}
        >
          <Text style={[styles.modeBtnText, inputMode === 'block' && styles.modeBtnTextActive]}>
            🧩 블록 코딩
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, inputMode === 'text' && styles.modeBtnActive]}
          onPress={() => setInputMode('text')}
        >
          <Text style={[styles.modeBtnText, inputMode === 'text' && styles.modeBtnTextActive]}>
            ✏️ 직접 입력
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat area */}
        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.robotBubble]}>
              {msg.role === 'robot' && <Text style={styles.robotLabel}>🤖 바보 로봇</Text>}
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                {msg.text}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={styles.robotBubble}>
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={styles.loadingText}>실행 중...</Text>
            </View>
          )}
        </ScrollView>

        {/* Command history sidebar hint */}
        {commandHistory.length > 0 && (
          <View style={styles.historyBar}>
            <Text style={styles.historyLabel}>📋 명령 히스토리 ({commandHistory.length}줄)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {commandHistory.map((cmd, i) => (
                <View key={i} style={styles.historyChip}>
                  <Text style={styles.historyChipText}>{i + 1}. {cmd}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input area */}
        {inputMode === 'block' ? (
          <BlockInput
            availableCards={availableCards}
            queuedCards={queuedCards}
            onAddCard={addCardToQueue}
            onRemoveCard={removeCardFromQueue}
            onMoveCard={moveCard}
            onSend={sendCommands}
            loading={loading}
          />
        ) : (
          <TextInputArea
            value={textInput}
            onChange={setTextInput}
            onSend={sendCommands}
            loading={loading}
          />
        )}
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>미션 클리어!</Text>
            <Text style={styles.modalConceptLabel}>💡 오늘 배운 컴퓨팅 개념</Text>
            <Text style={styles.modalConcept}>{successConcept}</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => { setShowSuccessModal(false); setStage('select'); }}
            >
              <Text style={styles.modalBtnText}>다음 미션 도전!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSecondBtn}
              onPress={() => { setShowSuccessModal(false); resetMission(); }}
            >
              <Text style={styles.modalSecondBtnText}>다시 풀어보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ─── Block Input Component ─── */
function BlockInput({
  availableCards,
  queuedCards,
  onAddCard,
  onRemoveCard,
  onMoveCard,
  onSend,
  loading,
}: {
  availableCards: CommandCard[];
  queuedCards: CommandCard[];
  onAddCard: (card: CommandCard) => void;
  onRemoveCard: (idx: number) => void;
  onMoveCard: (from: number, to: number) => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <View style={styles.blockPanel}>
      {/* Card palette */}
      <Text style={styles.panelLabel}>명령 카드 (탭하여 추가)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardPalette}>
        {availableCards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.commandCard} onPress={() => onAddCard(card)}>
            <Text style={styles.commandCardEmoji}>{card.emoji}</Text>
            <Text style={styles.commandCardLabel}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Queue */}
      <Text style={styles.panelLabel}>실행 순서 (탭하여 제거 / ← → 로 이동)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.queueRow}>
        {queuedCards.length === 0 ? (
          <Text style={styles.queueEmpty}>위 카드를 탭해서 명령을 추가하세요</Text>
        ) : (
          queuedCards.map((card, i) => (
            <View key={card.id} style={styles.queueItem}>
              <Text style={styles.queueNum}>{i + 1}</Text>
              <TouchableOpacity style={styles.queueCard} onLongPress={() => onRemoveCard(i)}>
                <Text style={styles.queueCardEmoji}>{card.emoji}</Text>
                <Text style={styles.queueCardLabel}>{card.label}</Text>
              </TouchableOpacity>
              <View style={styles.queueArrows}>
                {i > 0 && (
                  <TouchableOpacity onPress={() => onMoveCard(i, i - 1)}>
                    <Text style={styles.arrowBtn}>←</Text>
                  </TouchableOpacity>
                )}
                {i < queuedCards.length - 1 && (
                  <TouchableOpacity onPress={() => onMoveCard(i, i + 1)}>
                    <Text style={styles.arrowBtn}>→</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => onRemoveCard(i)}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.sendBtn, (loading || queuedCards.length === 0) && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={loading || queuedCards.length === 0}
      >
        <Text style={styles.sendBtnText}>▶ 실행!</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ─── Text Input Component ─── */
function TextInputArea({
  value,
  onChange,
  onSend,
  loading,
}: {
  value: string;
  onChange: (t: string) => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <View style={styles.textPanel}>
      <Text style={styles.panelLabel}>명령을 한 줄씩 입력하세요</Text>
      <TextInput
        style={styles.textEditor}
        multiline
        value={value}
        onChangeText={onChange}
        placeholder={'예:\n1. 식빵 봉지를 연다\n2. 잼통 뚜껑을 연다\n3. 버터나이프로 잼을 퍼낸다'}
        placeholderTextColor="#B0B0B0"
      />
      <TouchableOpacity
        style={[styles.sendBtn, (loading || !value.trim()) && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={loading || !value.trim()}
      >
        <Text style={styles.sendBtnText}>▶ 실행!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E', flex: 1, textAlign: 'center' },
  headerSub: { fontSize: 12, color: '#6C63FF', fontWeight: '600', textAlign: 'center' },
  backBtn: { paddingRight: 8 },
  backText: { fontSize: 14, color: '#6C63FF', fontWeight: '600' },
  resetText: { fontSize: 14, color: '#FF6B6B', fontWeight: '600' },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  modeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  modeBtnActive: { borderBottomWidth: 2, borderBottomColor: '#6C63FF' },
  modeBtnText: { fontSize: 13, color: '#9E9E9E', fontWeight: '600' },
  modeBtnTextActive: { color: '#6C63FF' },
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 10 },
  bubble: { borderRadius: 16, padding: 12, maxWidth: '90%' },
  robotBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: { backgroundColor: '#6C63FF', alignSelf: 'flex-end' },
  robotLabel: { fontSize: 11, color: '#6C63FF', fontWeight: '700', marginBottom: 4 },
  bubbleText: { fontSize: 14, color: '#1A1A2E', lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  loadingText: { fontSize: 13, color: '#9E9E9E', marginTop: 4 },
  historyBar: {
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#D8DCF5',
  },
  historyLabel: { fontSize: 11, color: '#6C63FF', fontWeight: '700', marginBottom: 4 },
  historyChip: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  historyChipText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  blockPanel: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
    padding: 12,
    gap: 6,
  },
  panelLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '600', marginBottom: 2 },
  cardPalette: { flexGrow: 0 },
  commandCard: {
    backgroundColor: '#EEF0FF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginRight: 8,
    minWidth: 70,
    borderWidth: 1,
    borderColor: '#D0D4FF',
  },
  commandCardEmoji: { fontSize: 22 },
  commandCardLabel: { fontSize: 11, color: '#4B47A3', fontWeight: '600', textAlign: 'center', marginTop: 3 },
  queueRow: { flexGrow: 0 },
  queueEmpty: { fontSize: 12, color: '#B0B0B0', paddingVertical: 10 },
  queueItem: { alignItems: 'center', marginRight: 6 },
  queueNum: { fontSize: 10, color: '#9E9E9E', fontWeight: '700', marginBottom: 2 },
  queueCard: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    minWidth: 65,
  },
  queueCardEmoji: { fontSize: 18 },
  queueCardLabel: { fontSize: 10, color: '#fff', fontWeight: '600', textAlign: 'center', marginTop: 2 },
  queueArrows: { flexDirection: 'row', gap: 2, marginTop: 2 },
  arrowBtn: { fontSize: 14, color: '#6C63FF', fontWeight: '700', paddingHorizontal: 2 },
  removeBtn: { fontSize: 12, color: '#FF6B6B', fontWeight: '700', paddingHorizontal: 2 },
  sendBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  sendBtnDisabled: { backgroundColor: '#C5C3E8' },
  sendBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  textPanel: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
    padding: 12,
    gap: 6,
  },
  textEditor: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1A1A2E',
    minHeight: 100,
    maxHeight: 150,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    textAlignVertical: 'top',
  },
  missionList: { padding: 16, gap: 12 },
  introBox: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 4,
    alignItems: 'center',
  },
  introTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6, textAlign: 'center' },
  introDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 19 },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  missionEmoji: { fontSize: 40, marginRight: 14 },
  missionInfo: { flex: 1 },
  missionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 3 },
  missionDesc: { fontSize: 13, color: '#666', marginBottom: 6 },
  levelBadge: { backgroundColor: '#EEF0FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  levelText: { fontSize: 11, color: '#6C63FF', fontWeight: '700' },
  arrow: { fontSize: 16, color: '#C5C3E8', marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalEmoji: { fontSize: 56, marginBottom: 8 },
  modalTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 16 },
  modalConceptLabel: { fontSize: 13, color: '#6C63FF', fontWeight: '700', marginBottom: 8 },
  modalConcept: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    width: '100%',
  },
  modalBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  modalSecondBtn: { paddingVertical: 8 },
  modalSecondBtnText: { color: '#9E9E9E', fontSize: 14 },
});
