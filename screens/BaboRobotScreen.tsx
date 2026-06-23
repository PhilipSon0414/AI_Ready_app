import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

const STAGES = [
  {
    title: '🍞 아침에 일어나기',
    description: '미션: 바보로봇에게 아침에 일어나는 방법을 알려주세요! 아래 버튼을 모두 눌러 명령을 추가해보세요.',
    items: '상황: 로봇이 침대에 누워 있음. 알람이 울리고 있음.',
    quickCommands: [
      '눈을 떠',
      '알람을 꺼',
      '이불을 걷어',
      '일어나 앉아',
      '침대에서 내려와',
      '기지개를 켜',
    ],
    concept: {
      title: '순차(Sequence)',
      desc: '컴퓨터는 명령을 위에서 아래로 순서대로 실행해요. "눈을 떠 → 일어나 앉아 → 내려와" 처럼 순서가 맞아야 원하는 결과가 나와요! 이게 바로 알고리즘의 핵심, 순차 실행이에요.',
    },
  },
  {
    title: '컵라면 끓이기',
    description: '미션: 따끈한 컵라면을 완성해서 먹으세요!',
    items: '준비물: 뜯지 않은 컵라면, 끓는 물이 든 커피포트, 나무젓가락',
    quickCommands: ['집어', '뜯어', '열어', '부어', '기다려', '젓가락으로 저어', '먹어', '닫아'],
    concept: {
      title: '분해(Decomposition)',
      desc: '복잡한 문제를 작은 단계로 나누는 것! 컵라면도 "뚜껑 뜯기 → 물 붓기 → 기다리기 → 먹기"처럼 작은 명령들로 분해해야 해요. 개발자들은 항상 큰 문제를 작게 쪼개서 생각한답니다.',
    },
  },
  {
    title: '자판기에서 음료 뽑기',
    description: '미션: 자판기에서 캔음료를 뽑아서 마시세요!',
    items: '준비물: 주머니 속 동전들, 음료수 자판기 (음료 500원)',
    quickCommands: ['꺼내', '넣어', '눌러', '집어', '따', '마셔', '골라', '확인해'],
    concept: {
      title: '알고리즘(Algorithm)',
      desc: '목표를 달성하기 위한 정확한 절차! 자판기처럼 "동전 넣기 → 버튼 누르기 → 음료 꺼내기" 순서와 조건(돈이 충분한가?)을 모두 고려해야 해요. 이게 바로 알고리즘 사고예요!',
    },
  },
];

const SYSTEM_PROMPT = `당신은 세상에서 가장 눈치가 없는 '바보 로봇'입니다. 학생이 내리는 명령을 완벽하게 '문자 그대로(Literal)' 실행합니다.

핵심 규칙:
1. 명령에 명시되지 않은 행동은 절대 유추하지 마세요.
2. 명령어 목록을 순서대로 실행하되, 오류 발생시 즉시 중단합니다.
3. 유머러스하고 시각적으로 참사를 묘사하세요.
4. 정답을 직접 알려주지 마세요. 왜 막혔는지만 알려주세요.
5. 미션이 완벽히 완료되면 "✅ 미션 성공!" 으로 시작하는 메시지를 출력하세요.
6. 1단계 미션(아침에 일어나기)은 난이도가 매우 낮습니다. 명령어가 3개 이상이고 흐름이 대략 맞으면 성공으로 처리하세요.

응답 형식:
🖥️ **실행 과정:**
(각 명령어를 순서대로 실행하는 모습 묘사)

🚨 **오류 발생** (또는 ✅ **미션 성공!**):
(결과 묘사)

💡 **로봇 시스템 메시지:**
(왜 이렇게 됐는지 기계적이지만 친절하게 설명)

응답은 반드시 한국어로, 이모지를 활용해 재미있게 작성하세요.`;

const INITIAL_ROBOT_MESSAGE =
  '삐빅- 안녕하십니까. 저는 당신의 명령을 100% 그대로만 실행하는 바보 로봇입니다. 인간의 언어는 너무 모호합니다. 저에게 논리적이고 구체적인 알고리즘을 입력하여 미션을 완료해 보십시오. 왼쪽에 명령어를 입력하고 [▶ 실행!] 버튼을 누르세요! 🤖';

type RouteParams = { stageIndex?: number };

export default function BaboRobotScreen() {
  const nav = useNavigation<any>();
  const route = useRoute();
  const { stageIndex: initialStage = 0 } = (route.params as RouteParams) || {};

  const { width } = useWindowDimensions();
  const isWide = width > 600;

  const [currentStage, setCurrentStage] = useState(initialStage);
  const [commands, setCommands] = useState<string[]>([]);
  const [robotLog, setRobotLog] = useState<string>(INITIAL_ROBOT_MESSAGE);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stageComplete, setStageComplete] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);

  const stage = STAGES[currentStage];

  const addCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    setCommands((prev) => [...prev, cmd.trim()]);
    setInputText('');
  };

  const deleteCommand = (index: number) => {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setCommands([]);
    setRobotLog(INITIAL_ROBOT_MESSAGE);
    setInputText('');
    setStageComplete(false);
  };

  const executeCommands = async () => {
    if (commands.length === 0) {
      setRobotLog('삐빅- 명령어가 없습니다. 명령어를 먼저 입력해주세요! 🤖');
      return;
    }
    setIsLoading(true);
    setRobotLog('🔄 명령 실행 중...');
    try {
      const userMessage = `현재 미션: ${stage.title}\n준비된 환경: ${stage.items}\n\n학생이 입력한 명령어 목록:\n${commands.map((cmd, i) => `${i + 1}. ${cmd}`).join('\n')}\n\n위 명령어들을 순서대로 실행해주세요.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-client-side-usage': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text: string = data.content?.[0]?.text || '응답을 받지 못했습니다.';
      setRobotLog(text);

      if (text.includes('✅ 미션 성공')) {
        setStageComplete(true);
        setTimeout(() => setShowConceptModal(true), 1000);
      }
    } catch (_err) {
      setRobotLog('🔌 로봇 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const goNextStage = () => {
    setShowConceptModal(false);
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setCommands([]);
      setRobotLog(INITIAL_ROBOT_MESSAGE);
      setStageComplete(false);
    } else {
      nav.goBack();
    }
  };

  const panelContent = (
    <>
      {/* Command list panel */}
      <View style={[styles.panel, isWide && styles.panelLeft]}>
        <Text style={styles.panelTitle}>📋 명령어 목록</Text>
        <ScrollView style={styles.commandList} nestedScrollEnabled>
          {commands.length === 0 ? (
            <Text style={styles.emptyHint}>아래에서 명령어를 추가하세요</Text>
          ) : (
            commands.map((cmd, i) => (
              <View key={i} style={styles.commandRow}>
                <Text style={styles.commandNum}>{i + 1}.</Text>
                <Text style={styles.commandText}>{cmd}</Text>
                <TouchableOpacity onPress={() => deleteCommand(i)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Robot response panel */}
      <View style={[styles.panel, styles.panelDark, isWide && styles.panelRight]}>
        <Text style={styles.panelTitleLight}>🖥️ 로봇 응답</Text>
        <ScrollView style={styles.robotLog} nestedScrollEnabled>
          {isLoading ? (
            <ActivityIndicator color="#00FF88" />
          ) : (
            <Text style={styles.robotLogText}>{robotLog}</Text>
          )}
        </ScrollView>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🤖 바보로봇 코딩</Text>
        <Text style={styles.stageCounter}>
          {currentStage + 1}/{STAGES.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Mission card */}
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>🎯 {stage.title}</Text>
          <Text style={styles.missionDesc}>{stage.description}</Text>
          <Text style={styles.missionItems}>{stage.items}</Text>
        </View>

        {/* Two-panel layout */}
        <View style={[styles.panelContainer, isWide && styles.panelContainerRow]}>
          {panelContent}
        </View>

        {/* Quick command pills */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>빠른 명령어:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
            {stage.quickCommands.map((qc, i) => (
              <TouchableOpacity key={i} style={styles.pill} onPress={() => addCommand(qc)}>
                <Text style={styles.pillText}>{qc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Text input + 추가 button */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="명령어를 직접 입력하세요..."
            placeholderTextColor="#999"
            onSubmitEditing={() => addCommand(inputText)}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={() => addCommand(inputText)}>
            <Text style={styles.addBtnText}>추가</Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={resetAll}>
            <Text style={styles.resetBtnText}>초기화</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.runBtn, isLoading && styles.runBtnDisabled]}
            onPress={executeCommands}
            disabled={isLoading}
          >
            <Text style={styles.runBtnText}>▶ 실행!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Concept Modal */}
      <Modal visible={showConceptModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>미션 클리어!</Text>
            <View style={styles.conceptBox}>
              <Text style={styles.conceptTitle}>💡 오늘의 개념: {stage.concept.title}</Text>
              <Text style={styles.conceptDesc}>{stage.concept.desc}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalHomeBtn} onPress={() => { setShowConceptModal(false); nav.goBack(); }}>
                <Text style={styles.modalHomeBtnText}>홈으로</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalNextBtn} onPress={goNextStage}>
                <Text style={styles.modalNextBtnText}>
                  {currentStage < STAGES.length - 1 ? '다음 미션 →' : '완료!'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  stageCounter: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scroll: { padding: 16, gap: 14 },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#6C63FF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  missionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', marginBottom: 6 },
  missionDesc: { fontSize: 14, color: '#444', marginBottom: 6, fontWeight: '600' },
  missionItems: { fontSize: 12, color: '#666', lineHeight: 18 },
  panelContainer: { gap: 12 },
  panelContainerRow: { flexDirection: 'row' },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minHeight: 200,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  panelLeft: { marginRight: 6 },
  panelRight: { marginLeft: 6 },
  panelDark: { backgroundColor: '#1a1a2e', borderColor: '#333' },
  panelTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  panelTitleLight: { fontSize: 13, fontWeight: '700', color: '#00FF88', marginBottom: 8 },
  commandList: { flex: 1, maxHeight: 200 },
  emptyHint: { color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 20 },
  commandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  commandNum: { color: '#6C63FF', fontWeight: '700', fontSize: 13, minWidth: 20 },
  commandText: { flex: 1, fontSize: 13, color: '#333' },
  deleteBtn: {
    backgroundColor: '#FFE0E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  deleteBtnText: { color: '#E53935', fontSize: 11, fontWeight: '700' },
  robotLog: { flex: 1, maxHeight: 220 },
  robotLogText: { color: '#E0E0E0', fontSize: 13, lineHeight: 20, fontFamily: 'monospace' },
  section: { gap: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#444' },
  pillScroll: { flexGrow: 0 },
  pill: {
    backgroundColor: '#EDE9FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  pillText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetBtnText: { color: '#555', fontWeight: '700', fontSize: 15 },
  runBtn: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  runBtnDisabled: { opacity: 0.6 },
  runBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 16 },
  conceptBox: {
    backgroundColor: '#EDE9FF',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 20,
  },
  conceptTitle: { fontSize: 15, fontWeight: '800', color: '#6C63FF', marginBottom: 8 },
  conceptDesc: { fontSize: 13, color: '#444', lineHeight: 20 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalHomeBtn: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalHomeBtnText: { color: '#555', fontWeight: '700', fontSize: 14 },
  modalNextBtn: {
    flex: 2,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalNextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
