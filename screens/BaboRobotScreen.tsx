import React, { useState, useRef } from 'react';
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

type StageVariant = {
  title: string;
  description: string;
  items: string;
  quickCommands: string[];
  answer: string[];
  hint1: string;
  hint2: string;
};

type Stage = {
  variants: StageVariant[];
  concept: { title: string; desc: string };
};

const STAGES: Stage[] = [
  {
    variants: [
      {
        title: '🍞 아침에 일어나기',
        description: '미션: 바보로봇에게 아침에 일어나는 방법을 알려주세요!',
        items: '상황: 로봇이 침대에 누워 있음. 알람이 울리고 있음.',
        quickCommands: ['눈을 떠', '알람을 꺼', '이불을 걷어', '일어나 앉아', '침대에서 내려와', '기지개를 켜'],
        answer: ['눈을 떠', '알람을 꺼', '이불을 걷어', '일어나 앉아', '침대에서 내려와', '기지개를 켜'],
        hint1: '💡 힌트: 로봇은 지금 침대에 누워 있어요. 가장 먼저 해야 할 일이 뭘까요?',
        hint2: '💡 힌트: 눈을 뜨고 → 알람을 끄고 → 이불을 걷어야 일어날 수 있어요. 순서를 맞춰보세요!',
      },
      {
        title: '🪥 세수하고 양치하기',
        description: '미션: 바보로봇이 세수하고 양치할 수 있도록 명령을 알려주세요!',
        items: '상황: 로봇이 욕실 앞에 서 있음. 세면대, 칫솔, 치약, 수건이 있음.',
        quickCommands: ['수도꼭지를 틀어', '손에 물을 받아', '얼굴에 물을 뿌려', '수도꼭지를 잠가', '수건으로 닦아', '치약을 짜', '칫솔로 이를 닦아', '입을 헹궈'],
        answer: ['수도꼭지를 틀어', '손에 물을 받아', '얼굴에 물을 뿌려', '수건으로 닦아', '치약을 짜', '칫솔로 이를 닦아', '입을 헹궈', '수도꼭지를 잠가'],
        hint1: '💡 힌트: 물을 쓰려면 먼저 수도꼭지를 틀어야겠죠? 물→세수→닦기→양치 순서로 생각해보세요.',
        hint2: '💡 힌트: 세수 먼저, 양치 나중! 수도꼭지 틀기 → 물 받기 → 얼굴 씻기 → 수건 닦기 → 치약 짜기 → 양치 → 헹구기 순서예요.',
      },
      {
        title: '🧥 옷 입고 외출 준비하기',
        description: '미션: 바보로봇이 옷을 입고 외출할 수 있도록 명령을 알려주세요!',
        items: '상황: 로봇이 침실에 있음. 옷장, 신발, 가방이 있음.',
        quickCommands: ['옷장을 열어', '옷을 꺼내', '옷을 입어', '신발을 신어', '가방을 들어', '문을 열어', '밖으로 나가', '문을 잠가'],
        answer: ['옷장을 열어', '옷을 꺼내', '옷을 입어', '가방을 들어', '신발을 신어', '문을 열어', '밖으로 나가', '문을 잠가'],
        hint1: '💡 힌트: 옷을 입으려면 먼저 옷장을 열어야 해요! 옷 입기 → 신발 → 가방 순서로 생각해보세요.',
        hint2: '💡 힌트: 옷장 열기 → 옷 꺼내기 → 옷 입기 → 가방 들기 → 신발 신기 → 문 열기 → 나가기 순서예요.',
      },
    ],
    concept: {
      title: '순차(Sequence)',
      desc: '컴퓨터는 명령을 위에서 아래로 순서대로 실행해요. 순서가 틀리면 엉뚱한 결과가 나온답니다!\n\n"눈을 떠 → 이불을 걷어 → 일어나 앉아" 처럼 논리적인 순서가 중요해요.',
    },
  },
  {
    variants: [
      {
        title: '🍜 컵라면 끓이기',
        description: '미션: 따끈한 컵라면을 완성해서 먹으세요!',
        items: '준비물: 뜯지 않은 컵라면, 끓는 물이 든 커피포트, 나무젓가락',
        quickCommands: ['컵라면을 집어', '뚜껑을 열어', '스프를 넣어', '끓는 물을 부어', '뚜껑을 닫아', '3분 기다려', '저어', '먹어'],
        answer: ['컵라면을 집어', '뚜껑을 열어', '스프를 넣어', '끓는 물을 부어', '뚜껑을 닫아', '3분 기다려', '뚜껑을 열어', '저어', '먹어'],
        hint1: '💡 힌트: 뚜껑을 열기 전에 컵라면을 먼저 집어야 해요. 물 붓기 전에 스프를 넣었나요?',
        hint2: '💡 힌트: 집기→열기→스프→물붓기→뚜껑닫기→3분 기다리기→열기→젓기→먹기 순서예요. "기다리기"를 빠뜨리지 마세요!',
      },
      {
        title: '🍳 계란 프라이 만들기',
        description: '미션: 계란 프라이를 만들어 먹으세요!',
        items: '준비물: 계란 2개, 프라이팬, 식용유, 가스레인지, 뒤집개',
        quickCommands: ['가스레인지를 켜', '프라이팬을 올려', '기름을 부어', '계란을 깨', '계란을 넣어', '익을 때까지 기다려', '불을 꺼', '접시에 담아'],
        answer: ['프라이팬을 올려', '가스레인지를 켜', '기름을 부어', '계란을 깨', '계란을 넣어', '익을 때까지 기다려', '불을 꺼', '접시에 담아'],
        hint1: '💡 힌트: 불을 켜기 전에 프라이팬을 먼저 올려야 해요! 계란을 넣기 전엔 기름이 필요해요.',
        hint2: '💡 힌트: 팬 올리기→불 켜기→기름 붓기→계란 깨기→넣기→기다리기→불 끄기→담기 순서예요.',
      },
      {
        title: '🥤 믹서기로 스무디 만들기',
        description: '미션: 과일 스무디를 만들어 마시세요!',
        items: '준비물: 바나나, 딸기, 우유, 믹서기, 컵',
        quickCommands: ['바나나 껍질을 벗겨', '바나나를 넣어', '딸기를 넣어', '우유를 부어', '뚜껑을 닫아', '믹서기를 켜', '30초 기다려', '믹서기를 꺼', '컵에 따라'],
        answer: ['바나나 껍질을 벗겨', '바나나를 넣어', '딸기를 넣어', '우유를 부어', '뚜껑을 닫아', '믹서기를 켜', '30초 기다려', '믹서기를 꺼', '컵에 따라'],
        hint1: '💡 힌트: 바나나는 껍질째 넣으면 안 돼요! 뚜껑을 닫아야 켤 수 있어요.',
        hint2: '💡 힌트: 껍질 벗기기→재료 넣기→우유 붓기→뚜껑 닫기→켜기→기다리기→끄기→따르기 순서예요.',
      },
    ],
    concept: {
      title: '분해(Decomposition)',
      desc: '복잡한 문제를 작은 단계로 나누는 것!\n\n컵라면도 "뚜껑 열기 → 스프 넣기 → 물 붓기 → 기다리기 → 먹기"처럼 작은 명령들로 분해해야 해요. 개발자들은 항상 큰 문제를 작게 쪼개서 생각한답니다.',
    },
  },
  {
    variants: [
      {
        title: '🥤 자판기에서 음료 뽑기',
        description: '미션: 자판기에서 캔음료를 뽑아서 마시세요!',
        items: '준비물: 주머니 속 동전들, 음료수 자판기 (음료 500원)',
        quickCommands: ['주머니에서 동전을 꺼내', '자판기에 동전을 넣어', '원하는 음료 버튼을 눌러', '나온 음료를 집어', '캔 뚜껑을 따', '마셔'],
        answer: ['주머니에서 동전 500원을 꺼내', '자판기에 동전을 넣어', '원하는 음료 버튼을 눌러', '나온 음료를 집어', '캔 뚜껑을 따', '마셔'],
        hint1: '💡 힌트: 돈이 없으면 음료를 뽑을 수 없어요! 먼저 주머니에서 동전을 꺼내야 해요.',
        hint2: '💡 힌트: 동전 꺼내기→넣기→버튼 누르기→음료 집기→뚜껑 따기→마시기 순서예요. 금액이 맞아야 해요!',
      },
      {
        title: '🚌 버스 타고 학교 가기',
        description: '미션: 버스를 타고 학교까지 가세요!',
        items: '상황: 버스 정류장 앞, 교통카드 있음. 102번 버스가 학교 방향.',
        quickCommands: ['버스 번호를 확인해', '102번 버스를 기다려', '버스가 오면 손을 들어', '버스에 올라타', '교통카드를 태그해', '자리에 앉아', '학교 정류장에서 하차 벨을 눌러', '내려'],
        answer: ['버스 번호를 확인해', '102번 버스를 기다려', '버스가 오면 손을 들어', '버스에 올라타', '교통카드를 태그해', '자리에 앉아', '학교 정류장에서 하차 벨을 눌러', '내려'],
        hint1: '💡 힌트: 아무 버스나 타면 안 돼요! 번호를 확인하고 맞는 버스를 기다려야 해요.',
        hint2: '💡 힌트: 번호 확인→기다리기→손 들기→타기→카드 태그→앉기→벨 누르기→내리기 순서예요.',
      },
      {
        title: '🏧 ATM에서 돈 뽑기',
        description: '미션: ATM에서 만원을 출금하세요!',
        items: '상황: ATM 앞에 있음. 카드와 PIN번호 알고 있음.',
        quickCommands: ['카드를 넣어', '출금을 선택해', 'PIN번호를 입력해', '10000원을 입력해', '확인을 눌러', '돈을 꺼내', '카드를 뽑아'],
        answer: ['카드를 넣어', '출금을 선택해', 'PIN번호를 입력해', '10000원을 입력해', '확인을 눌러', '돈을 꺼내', '카드를 뽑아'],
        hint1: '💡 힌트: 카드를 먼저 넣어야 ATM이 작동해요! PIN번호는 메뉴 선택 후 입력해요.',
        hint2: '💡 힌트: 카드 넣기→출금 선택→PIN 입력→금액 입력→확인→돈 꺼내기→카드 뽑기 순서예요.',
      },
    ],
    concept: {
      title: '알고리즘(Algorithm)',
      desc: '목표를 달성하기 위한 정확한 절차!\n\n자판기처럼 "동전 넣기 → 버튼 누르기 → 음료 꺼내기" 순서와 조건을 모두 고려해야 해요. 이게 바로 알고리즘 사고예요!\n\n이제 여러분도 알고리즘을 만들 수 있어요 🎉',
    },
  },
];

const SYSTEM_PROMPT = `당신은 세상에서 가장 눈치가 없는 '바보 로봇'입니다. 학생이 내리는 명령을 완벽하게 '문자 그대로(Literal)' 실행합니다.

핵심 규칙:
1. 명령에 명시되지 않은 행동은 절대 유추하지 마세요.
2. 명령어 목록을 순서대로 실행하되, 오류 발생시 즉시 중단합니다.
3. 유머러스하고 시각적으로 참사를 묘사하세요.
4. 정답을 직접 알려주지 마세요. 왜 막혔는지만 알려주세요.
5. 미션이 완벽히 완료되면 반드시 "✅ 미션 성공!" 으로 시작하는 메시지를 출력하세요.
6. 1단계 미션은 난이도가 매우 낮습니다. 명령어가 4개 이상이고 흐름이 대략 맞으면 성공으로 처리하세요.

응답 형식:
🖥️ **실행 과정:**
(각 명령어를 순서대로 실행하는 모습 묘사, 유머러스하게)

🚨 **오류 발생** (또는 ✅ **미션 성공!**):
(결과 묘사)

💡 **로봇 시스템 메시지:**
(왜 이렇게 됐는지 기계적이지만 친절하게 설명)

응답은 반드시 한국어로, 이모지를 활용해 재미있게 작성하세요.`;

const INITIAL_ROBOT_MESSAGE = '삐빅- 안녕하십니까. 저는 당신의 명령을 100% 그대로만 실행하는 바보 로봇입니다.\n\n명령어를 입력하고 [▶ 실행!] 버튼을 누르세요! 🤖';

type RouteParams = { stageIndex?: number };

export default function BaboRobotScreen() {
  const nav = useNavigation<any>();
  const route = useRoute();
  const { stageIndex: initialStage = 0 } = (route.params as RouteParams) || {};

  const { width } = useWindowDimensions();
  const isWide = width > 600;

  const [currentStage, setCurrentStage] = useState(initialStage);
  const [variantIndex, setVariantIndex] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [commands, setCommands] = useState<string[]>([]);
  const [robotLog, setRobotLog] = useState(INITIAL_ROBOT_MESSAGE);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const logScrollRef = useRef<ScrollView>(null);

  const stageData = STAGES[currentStage];
  const variant = stageData.variants[variantIndex];

  const currentHint = failCount === 1 ? variant.hint1 : failCount === 2 ? variant.hint2 : null;

  const addCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    setCommands((prev) => [...prev, cmd.trim()]);
    setInputText('');
  };

  const deleteCommand = (index: number) => {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const resetCommands = () => {
    setCommands([]);
    setRobotLog(INITIAL_ROBOT_MESSAGE);
    setInputText('');
  };

  const executeCommands = async () => {
    if (commands.length === 0) {
      setRobotLog('삐빅- 명령어가 없습니다! 🤖');
      return;
    }
    setIsLoading(true);
    setRobotLog('🔄 명령 실행 중...');
    try {
      const userMessage = `현재 미션: ${variant.title}\n환경: ${variant.items}\n\n명령어 목록:\n${commands.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n위 명령어를 순서대로 실행해주세요.`;

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

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const text: string = data.content?.[0]?.text || '응답을 받지 못했습니다.';
      setRobotLog(text);
      setTimeout(() => logScrollRef.current?.scrollToEnd({ animated: true }), 100);

      if (text.includes('✅ 미션 성공')) {
        setTimeout(() => setShowConceptModal(true), 800);
      } else {
        const newFail = failCount + 1;
        setFailCount(newFail);
        if (newFail >= 3) {
          setTimeout(() => setShowAnswerModal(true), 800);
        }
      }
    } catch {
      setRobotLog('🔌 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const tryNextVariant = () => {
    setShowAnswerModal(false);
    const next = variantIndex + 1;
    setVariantIndex(next < stageData.variants.length ? next : 0);
    setFailCount(0);
    setCommands([]);
    setRobotLog(INITIAL_ROBOT_MESSAGE);
  };

  const goNextStage = () => {
    setShowConceptModal(false);
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(currentStage + 1);
      setVariantIndex(0);
      setFailCount(0);
      setCommands([]);
      setRobotLog(INITIAL_ROBOT_MESSAGE);
    } else {
      nav.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text style={styles.backBtn}>‹ 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🤖 바보로봇 코딩</Text>
        <View style={styles.stageIndicator}>
          {STAGES.map((_, i) => (
            <View key={i} style={[styles.stageDot, i === currentStage && styles.stageDotActive]} />
          ))}
        </View>
      </View>

      {/* Mission card */}
      <View style={styles.missionCard}>
        <View style={styles.missionTop}>
          <Text style={styles.missionTitle}>{variant.title}</Text>
          <Text style={styles.stageLabel}>단계 {currentStage + 1}/3 · 문제 {variantIndex + 1}</Text>
        </View>
        <Text style={styles.missionDesc}>{variant.description}</Text>
        <Text style={styles.missionItems}>📦 {variant.items}</Text>
      </View>

      <View style={[styles.body, isWide && styles.bodyRow]}>
        {/* Left: command builder */}
        <View style={[styles.panel, isWide && styles.panelLeft]}>
          {/* Fail counter dots */}
          {failCount > 0 && (
            <View style={styles.failRow}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.failDot, i < failCount && styles.failDotActive]} />
              ))}
              <Text style={styles.failHint}>
                {failCount < 3 ? ` 실패 ${failCount}/3 — ${3 - failCount}번 더 실패시 정답 공개` : ' 실패 3/3'}
              </Text>
            </View>
          )}

          {/* Hint bar — inside panel, always visible */}
          {currentHint && (
            <View style={[styles.hintBar, failCount >= 2 && styles.hintBar2]}>
              <Text style={styles.hintText}>{currentHint}</Text>
            </View>
          )}

          <Text style={styles.panelTitle}>📋 명령어 목록</Text>

          {/* Quick commands */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
            {variant.quickCommands.map((qc, i) => (
              <TouchableOpacity key={i} style={styles.pill} onPress={() => addCommand(qc)}>
                <Text style={styles.pillText}>+ {qc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Text input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="직접 입력..."
              placeholderTextColor="#999"
              onSubmitEditing={() => addCommand(inputText)}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={() => addCommand(inputText)}>
              <Text style={styles.addBtnText}>추가</Text>
            </TouchableOpacity>
          </View>

          {/* Command list */}
          <ScrollView style={styles.cmdList} nestedScrollEnabled>
            {commands.length === 0 ? (
              <Text style={styles.emptyHint}>위 버튼을 눌러 명령어를 추가하세요</Text>
            ) : (
              commands.map((cmd, i) => (
                <View key={i} style={styles.cmdRow}>
                  <Text style={styles.cmdNum}>{i + 1}.</Text>
                  <Text style={styles.cmdText}>{cmd}</Text>
                  <TouchableOpacity onPress={() => deleteCommand(i)} style={styles.delBtn}>
                    <Text style={styles.delBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={resetCommands}>
              <Text style={styles.resetBtnText}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.runBtn, (isLoading || commands.length === 0) && styles.runBtnDisabled]}
              onPress={executeCommands}
              disabled={isLoading || commands.length === 0}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.runBtnText}>▶ 실행!</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Right: robot terminal */}
        <View style={[styles.panel, styles.panelDark, isWide && styles.panelRight]}>
          <Text style={styles.panelTitleLight}>🖥️ 바보로봇 반응</Text>
          <ScrollView ref={logScrollRef} style={styles.terminal} nestedScrollEnabled>
            <Text style={styles.terminalText}>{robotLog}</Text>
          </ScrollView>
        </View>
      </View>

      {/* 정답 모달 (3번 실패) */}
      <Modal visible={showAnswerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>😅</Text>
            <Text style={styles.modalTitle}>3번 실패! 정답을 볼게요</Text>
            <Text style={styles.answerLabel}>"{variant.title}" 정답 예시:</Text>
            <View style={styles.answerBox}>
              {variant.answer.map((step, i) => (
                <Text key={i} style={styles.answerStep}>{i + 1}. {step}</Text>
              ))}
            </View>
            <Text style={styles.answerNote}>
              💪 괜찮아요! 비슷한 상황으로 다시 도전해봐요.{'\n'}이번엔 더 잘 할 수 있을 거예요!
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={tryNextVariant}>
              <Text style={styles.retryBtnText}>
                {variantIndex + 1 < stageData.variants.length ? '다른 상황으로 다시 도전! →' : '처음 상황으로 다시 도전! →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 성공 + 개념 모달 */}
      <Modal visible={showConceptModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>미션 클리어!</Text>
            <View style={styles.conceptBox}>
              <Text style={styles.conceptTitle}>💡 오늘의 개념: {stageData.concept.title}</Text>
              <Text style={styles.conceptDesc}>{stageData.concept.desc}</Text>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.homeBtn} onPress={() => { setShowConceptModal(false); nav.goBack(); }}>
                <Text style={styles.homeBtnText}>홈으로</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={goNextStage}>
                <Text style={styles.nextBtnText}>
                  {currentStage < STAGES.length - 1 ? `${currentStage + 2}단계로 →` : '전체 완료! 🏆'}
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
    paddingVertical: 12,
  },
  backBtn: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  stageIndicator: { flexDirection: 'row', gap: 6 },
  stageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  stageDotActive: { backgroundColor: '#fff', width: 20, borderRadius: 4 },
  missionCard: {
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 0,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#6C63FF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  missionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', flex: 1 },
  stageLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '600' },
  missionDesc: { fontSize: 13, color: '#444', marginBottom: 4, fontWeight: '600' },
  missionItems: { fontSize: 12, color: '#777' },
  hintBar: {
    margin: 12,
    marginBottom: 0,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  hintBar2: { backgroundColor: '#FFF3E0', borderLeftColor: '#FF9800' },
  hintText: { fontSize: 13, color: '#E65100', lineHeight: 19 },
  failRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  failLabel: { fontSize: 12, color: '#999', fontWeight: '600' },
  failDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0E0E0', marginRight: 4 },
  failDotActive: { backgroundColor: '#EF5350' },
  failHint: { fontSize: 11, color: '#aaa' },
  body: { flex: 1, padding: 12, gap: 12 },
  bodyRow: { flexDirection: 'row' },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  panelLeft: { marginRight: 6 },
  panelRight: { marginLeft: 6 },
  panelDark: { backgroundColor: '#1A1A2E', borderColor: '#333' },
  panelTitle: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 8 },
  panelTitleLight: { fontSize: 12, fontWeight: '700', color: '#00FF88', marginBottom: 8 },
  pillRow: { maxHeight: 40, marginBottom: 8 },
  pill: {
    backgroundColor: '#EDE9FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  pillText: { color: '#6C63FF', fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  addBtn: { backgroundColor: '#6C63FF', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cmdList: { flex: 1, marginBottom: 8 },
  emptyHint: { color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 16 },
  cmdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 6,
  },
  cmdNum: { color: '#6C63FF', fontWeight: '700', fontSize: 12, minWidth: 18 },
  cmdText: { flex: 1, fontSize: 13, color: '#333' },
  delBtn: { backgroundColor: '#FFE0E0', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  delBtnText: { color: '#E53935', fontSize: 11, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 8 },
  resetBtn: { flex: 1, backgroundColor: '#EEEEEE', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  resetBtnText: { color: '#555', fontWeight: '700', fontSize: 14 },
  runBtn: { flex: 2, backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 12, alignItems: 'center', elevation: 2 },
  runBtnDisabled: { opacity: 0.5 },
  runBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  terminal: { flex: 1 },
  terminalText: { color: '#E0E0E0', fontSize: 13, lineHeight: 21 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 420, alignItems: 'center' },
  modalEmoji: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 14, textAlign: 'center' },
  answerLabel: { fontSize: 13, color: '#777', alignSelf: 'flex-start', marginBottom: 8 },
  answerBox: {
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#66BB6A',
  },
  answerStep: { fontSize: 13, color: '#2E7D32', lineHeight: 22, fontWeight: '600' },
  answerNote: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  retryBtn: { backgroundColor: '#6C63FF', borderRadius: 12, paddingVertical: 14, width: '100%', alignItems: 'center' },
  retryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  conceptBox: { backgroundColor: '#EDE9FF', borderRadius: 12, padding: 14, width: '100%', marginBottom: 20 },
  conceptTitle: { fontSize: 15, fontWeight: '800', color: '#6C63FF', marginBottom: 8 },
  conceptDesc: { fontSize: 13, color: '#444', lineHeight: 20 },
  modalBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  homeBtn: { flex: 1, backgroundColor: '#EEE', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  homeBtnText: { color: '#555', fontWeight: '700', fontSize: 14 },
  nextBtn: { flex: 2, backgroundColor: '#6C63FF', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
