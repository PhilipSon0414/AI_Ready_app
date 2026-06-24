import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Modal, useWindowDimensions, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

type StageVariant = {
  title: string;
  description: string;
  items: string;
  quickCommands: string[];
  distractors: string[];
  answer: string[];
  hint1: string;
  hint2: string;
};

type Stage = {
  timeLimit: number; // seconds
  variants: StageVariant[];
  concept: { title: string; desc: string };
};

const STAGES: Stage[] = [
  {
    timeLimit: 45,
    variants: [
      {
        title: '🍞 아침에 일어나기',
        description: '바보로봇이 침대에서 일어날 수 있도록 명령을 알려주세요!',
        items: '상황: 로봇이 침대에 누워 있음. 알람이 울리고 있음.',
        quickCommands: ['눈을 떠', '알람을 꺼', '이불을 걷어', '일어나 앉아', '침대에서 내려와', '기지개를 켜'],
        distractors: ['밥을 먹어', 'TV를 켜', '샤워를 해', '신발을 신어'],
        answer: ['눈을 떠', '알람을 꺼', '이불을 걷어', '일어나 앉아', '침대에서 내려와', '기지개를 켜'],
        hint1: '💡 힌트: 로봇은 침대에 누워 있어요. 가장 먼저 해야 할 일이 뭘까요?',
        hint2: '💡 힌트: 눈을 뜨기 → 알람 끄기 → 이불 걷기 → 앉기 → 내려오기 순서예요!',
      },
      {
        title: '🪥 세수하고 양치하기',
        description: '바보로봇이 세수하고 양치할 수 있도록 명령을 알려주세요!',
        items: '상황: 욕실 앞에 서 있음. 세면대, 칫솔, 치약, 수건이 있음.',
        quickCommands: ['수도꼭지를 틀어', '손에 물을 받아', '얼굴에 물을 뿌려', '수건으로 닦아', '치약을 짜', '칫솔로 이를 닦아', '입을 헹궈', '수도꼭지를 잠가'],
        distractors: ['냉장고를 열어', '옷을 입어', '머리를 말려', '밥을 먹어'],
        answer: ['수도꼭지를 틀어', '손에 물을 받아', '얼굴에 물을 뿌려', '수건으로 닦아', '치약을 짜', '칫솔로 이를 닦아', '입을 헹궈', '수도꼭지를 잠가'],
        hint1: '💡 힌트: 물을 쓰려면 수도꼭지를 먼저 틀어야 해요!',
        hint2: '💡 힌트: 틀기→물 받기→세수→닦기→치약→양치→헹구기→잠그기 순서예요.',
      },
      {
        title: '🧥 옷 입고 외출하기',
        description: '바보로봇이 옷을 입고 외출할 수 있도록 명령을 알려주세요!',
        items: '상황: 침실에 있음. 옷장, 신발, 가방이 있음.',
        quickCommands: ['옷장을 열어', '옷을 꺼내', '옷을 입어', '가방을 들어', '신발을 신어', '문을 열어', '밖으로 나가', '문을 잠가'],
        distractors: ['이불을 덮어', '알람을 꺼', '양치를 해', '냉장고를 열어'],
        answer: ['옷장을 열어', '옷을 꺼내', '옷을 입어', '가방을 들어', '신발을 신어', '문을 열어', '밖으로 나가', '문을 잠가'],
        hint1: '💡 힌트: 옷장을 먼저 열어야 옷을 꺼낼 수 있어요!',
        hint2: '💡 힌트: 열기→꺼내기→입기→가방→신발→문 열기→나가기→잠그기 순서예요.',
      },
    ],
    concept: { title: '순차(Sequence)', desc: '컴퓨터는 명령을 위에서 아래로 순서대로 실행해요.\n\n순서가 틀리면 엉뚱한 결과가 나와요! 논리적인 순서가 핵심입니다.' },
  },
  {
    timeLimit: 35,
    variants: [
      {
        title: '🍜 컵라면 끓이기',
        description: '따끈한 컵라면을 완성해서 먹으세요!',
        items: '준비물: 뜯지 않은 컵라면, 끓는 물이 든 커피포트, 나무젓가락',
        quickCommands: ['컵라면을 집어', '뚜껑을 열어', '스프를 넣어', '끓는 물을 부어', '뚜껑을 닫아', '3분 기다려', '뚜껑을 열어', '젓가락으로 저어', '먹어'],
        distractors: ['냉장고를 열어', '프라이팬을 올려', '전자레인지를 켜', '소금을 뿌려'],
        answer: ['컵라면을 집어', '뚜껑을 열어', '스프를 넣어', '끓는 물을 부어', '뚜껑을 닫아', '3분 기다려', '뚜껑을 열어', '젓가락으로 저어', '먹어'],
        hint1: '💡 힌트: 뚜껑을 열고 → 스프 넣고 → 물 붓고 → 기다려야 해요!',
        hint2: '💡 힌트: 집기→열기→스프→물붓기→닫기→3분기다려→다시열기→젓기→먹기 순서예요!',
      },
      {
        title: '🍳 계란 프라이 만들기',
        description: '계란 프라이를 만들어 먹으세요!',
        items: '준비물: 계란 2개, 프라이팬, 식용유, 가스레인지, 뒤집개',
        quickCommands: ['프라이팬을 올려', '가스레인지를 켜', '기름을 부어', '계란을 깨', '계란을 넣어', '익을 때까지 기다려', '불을 꺼', '접시에 담아'],
        distractors: ['물을 끓여', '소금을 뿌려', '냄비를 올려', '뚜껑을 닫아'],
        answer: ['프라이팬을 올려', '가스레인지를 켜', '기름을 부어', '계란을 깨', '계란을 넣어', '익을 때까지 기다려', '불을 꺼', '접시에 담아'],
        hint1: '💡 힌트: 팬을 올린 후 불을 켜야 해요! 계란을 넣기 전에 기름이 필요해요.',
        hint2: '💡 힌트: 팬→불→기름→계란깨기→넣기→기다리기→불끄기→담기 순서예요.',
      },
      {
        title: '🥤 스무디 만들기',
        description: '과일 스무디를 만들어 마시세요!',
        items: '준비물: 바나나, 딸기, 우유, 믹서기, 컵',
        quickCommands: ['바나나 껍질을 벗겨', '바나나를 넣어', '딸기를 넣어', '우유를 부어', '뚜껑을 닫아', '믹서기를 켜', '30초 기다려', '믹서기를 꺼', '컵에 따라'],
        distractors: ['설탕을 넣어', '냄비를 올려', '물을 끓여', '오렌지를 깎아'],
        answer: ['바나나 껍질을 벗겨', '바나나를 넣어', '딸기를 넣어', '우유를 부어', '뚜껑을 닫아', '믹서기를 켜', '30초 기다려', '믹서기를 꺼', '컵에 따라'],
        hint1: '💡 힌트: 바나나는 껍질째 넣으면 안 돼요! 뚜껑을 닫아야 켤 수 있어요.',
        hint2: '💡 힌트: 껍질→재료→우유→뚜껑→켜기→기다리기→끄기→따르기 순서예요.',
      },
    ],
    concept: { title: '분해(Decomposition)', desc: '복잡한 문제를 작은 단계로 나누는 것!\n\n컵라면도 "열기→스프→물→기다리기→젓기→먹기"처럼 작은 명령으로 분해해야 해요.' },
  },
  {
    timeLimit: 25,
    variants: [
      {
        title: '🥤 자판기에서 음료 뽑기',
        description: '자판기에서 캔음료를 뽑아서 마시세요!',
        items: '준비물: 주머니 속 동전들, 음료수 자판기 (음료 500원)',
        quickCommands: ['주머니에서 동전을 꺼내', '자판기에 동전을 넣어', '원하는 음료 버튼을 눌러', '나온 음료를 집어', '캔 뚜껑을 따', '마셔'],
        distractors: ['영수증을 받아', '거스름돈을 넣어', '카드를 꽂아', '전원을 켜'],
        answer: ['주머니에서 동전을 꺼내', '자판기에 동전을 넣어', '원하는 음료 버튼을 눌러', '나온 음료를 집어', '캔 뚜껑을 따', '마셔'],
        hint1: '💡 힌트: 돈을 먼저 넣어야 버튼을 누를 수 있어요!',
        hint2: '💡 힌트: 동전→넣기→버튼→집기→따기→마시기 순서예요.',
      },
      {
        title: '🚌 버스 타고 학교 가기',
        description: '버스를 타고 학교까지 가세요!',
        items: '상황: 버스 정류장 앞, 교통카드 있음. 102번 버스가 학교 방향.',
        quickCommands: ['버스 번호를 확인해', '102번 버스를 기다려', '버스가 오면 손을 들어', '버스에 올라타', '교통카드를 태그해', '자리에 앉아', '학교 정류장에서 하차 벨을 눌러', '내려'],
        distractors: ['택시를 잡아', '지하철을 타', '자전거를 타', '걸어가'],
        answer: ['버스 번호를 확인해', '102번 버스를 기다려', '버스가 오면 손을 들어', '버스에 올라타', '교통카드를 태그해', '자리에 앉아', '학교 정류장에서 하차 벨을 눌러', '내려'],
        hint1: '💡 힌트: 아무 버스나 타면 안 돼요! 번호를 확인하세요.',
        hint2: '💡 힌트: 확인→기다리기→손 들기→타기→카드→앉기→벨→내리기 순서예요.',
      },
      {
        title: '🏧 ATM에서 돈 뽑기',
        description: 'ATM에서 만원을 출금하세요!',
        items: '상황: ATM 앞에 있음. 카드와 PIN번호 알고 있음.',
        quickCommands: ['카드를 넣어', '출금을 선택해', 'PIN번호를 입력해', '10000원을 입력해', '확인을 눌러', '돈을 꺼내', '카드를 뽑아'],
        distractors: ['잔액을 확인해', '입금을 선택해', '통장을 꺼내', '비밀번호를 바꿔'],
        answer: ['카드를 넣어', '출금을 선택해', 'PIN번호를 입력해', '10000원을 입력해', '확인을 눌러', '돈을 꺼내', '카드를 뽑아'],
        hint1: '💡 힌트: 카드를 먼저 넣어야 ATM이 작동해요!',
        hint2: '💡 힌트: 카드→출금선택→PIN→금액→확인→돈→카드 뽑기 순서예요.',
      },
    ],
    concept: { title: '알고리즘(Algorithm)', desc: '목표를 달성하기 위한 정확한 절차!\n\n순서와 조건을 모두 고려해야 해요. 이게 바로 알고리즘 사고예요!' },
  },
  {
    timeLimit: 20,
    variants: [
      {
        title: '🛒 마트에서 장보기',
        description: '마트에서 우유와 계란을 사고 계산하세요!',
        items: '상황: 마트 입구에 있음. 바구니, 지갑, 쇼핑 목록이 있음.',
        quickCommands: ['바구니를 들어', '우유 코너로 이동해', '우유를 집어 담아', '계란 코너로 이동해', '계란을 집어 담아', '계산대로 이동해', '물건을 올려놔', '카드로 결제해', '영수증을 받아', '마트를 나가'],
        distractors: ['화장실을 찾아', '직원을 불러', '장바구니를 반납해', '주차장으로 가'],
        answer: ['바구니를 들어', '우유 코너로 이동해', '우유를 집어 담아', '계란 코너로 이동해', '계란을 집어 담아', '계산대로 이동해', '물건을 올려놔', '카드로 결제해', '영수증을 받아', '마트를 나가'],
        hint1: '💡 힌트: 바구니를 먼저 들어야 물건을 담을 수 있어요! 계산대는 마지막에 가요.',
        hint2: '💡 힌트: 바구니→이동→담기→이동→담기→계산대→올려놓기→결제→영수증→나가기 순서예요.',
      },
      {
        title: '📚 도서관에서 책 빌리기',
        description: '도서관에서 읽고 싶은 책을 빌리세요!',
        items: '상황: 도서관 입구에 있음. 도서관 카드와 책 제목 알고 있음.',
        quickCommands: ['도서관 카드를 꺼내', '검색 컴퓨터로 이동해', '책 제목을 검색해', '위치를 확인해', '책장으로 이동해', '책을 찾아', '대출 데스크로 가', '카드를 제시해', '책을 받아', '도서관을 나가'],
        distractors: ['책을 반납해', '조용히 앉아서 읽어', '복사기를 써', '사서에게 커피를 사줘'],
        answer: ['도서관 카드를 꺼내', '검색 컴퓨터로 이동해', '책 제목을 검색해', '위치를 확인해', '책장으로 이동해', '책을 찾아', '대출 데스크로 가', '카드를 제시해', '책을 받아', '도서관을 나가'],
        hint1: '💡 힌트: 책 위치를 먼저 검색해야 찾을 수 있어요!',
        hint2: '💡 힌트: 카드→검색→제목입력→위치확인→이동→찾기→데스크→카드→받기→나가기 순서예요.',
      },
      {
        title: '🏥 약국에서 약 사기',
        description: '감기약을 사러 약국에 가세요!',
        items: '상황: 약국 앞에 있음. 처방전과 지갑이 있음.',
        quickCommands: ['약국 문을 열어', '약사에게 처방전을 건네', '처방전을 내밀어', '약을 기다려', '약 복용법을 들어', '약값을 계산해', '약을 받아', '약국을 나가'],
        distractors: ['혼자 약을 골라', '유통기한을 확인해', '인터넷으로 주문해', '의사에게 전화해'],
        answer: ['약국 문을 열어', '약사에게 처방전을 건네', '처방전을 내밀어', '약을 기다려', '약 복용법을 들어', '약값을 계산해', '약을 받아', '약국을 나가'],
        hint1: '💡 힌트: 처방전을 먼저 건네야 약을 받을 수 있어요!',
        hint2: '💡 힌트: 문열기→약사→처방전→기다리기→복용법→계산→약 받기→나가기 순서예요.',
      },
    ],
    concept: { title: '조건(Condition)', desc: '상황에 따라 다른 행동을 해야 할 때!\n\n마트에서는 "원하는 물건이 있으면 담고, 없으면 다른 코너로" 처럼 조건을 따져야 해요.' },
  },
  {
    timeLimit: 15,
    variants: [
      {
        title: '🖨️ 프린터로 문서 인쇄하기',
        description: '컴퓨터로 문서를 프린터에서 인쇄하세요!',
        items: '상황: 컴퓨터 앞에 있음. 프린터 연결됨. 용지와 잉크 있음.',
        quickCommands: ['컴퓨터를 켜', '문서를 열어', '인쇄 메뉴를 선택해', '프린터를 선택해', '용지 설정을 확인해', '인쇄 버튼을 눌러', '프린터에서 출력물을 꺼내', '컴퓨터를 종료해'],
        distractors: ['복사 버튼을 눌러', '스캔을 해', '팩스를 보내', '프린터를 분해해', '잉크를 갈아'],
        answer: ['컴퓨터를 켜', '문서를 열어', '인쇄 메뉴를 선택해', '프린터를 선택해', '용지 설정을 확인해', '인쇄 버튼을 눌러', '프린터에서 출력물을 꺼내'],
        hint1: '💡 힌트: 컴퓨터를 켜고 문서를 열어야 인쇄할 수 있어요!',
        hint2: '💡 힌트: 켜기→열기→인쇄메뉴→프린터선택→설정확인→인쇄→꺼내기 순서예요.',
      },
      {
        title: '📱 스마트폰 앱 설치하기',
        description: '앱스토어에서 원하는 앱을 설치하세요!',
        items: '상황: 스마트폰이 있음. 인터넷 연결됨. 앱스토어 계정 있음.',
        quickCommands: ['스마트폰을 켜', '앱스토어를 열어', '검색창에 앱 이름을 입력해', '원하는 앱을 선택해', '설치 버튼을 눌러', '다운로드를 기다려', '설치 완료를 확인해', '앱을 실행해'],
        distractors: ['앱을 삭제해', '설정을 변경해', '공장초기화를 해', '충전기를 꽂아', '블루투스를 켜'],
        answer: ['스마트폰을 켜', '앱스토어를 열어', '검색창에 앱 이름을 입력해', '원하는 앱을 선택해', '설치 버튼을 눌러', '다운로드를 기다려', '설치 완료를 확인해', '앱을 실행해'],
        hint1: '💡 힌트: 앱스토어를 먼저 열어야 앱을 찾을 수 있어요!',
        hint2: '💡 힌트: 켜기→앱스토어→검색→선택→설치→기다리기→확인→실행 순서예요.',
      },
      {
        title: '🔒 공유 자전거 빌리기',
        description: '공유 자전거 앱으로 자전거를 빌리세요!',
        items: '상황: 자전거 거치대 앞에 있음. 앱 설치됨. 신용카드 등록됨.',
        quickCommands: ['앱을 열어', '주변 자전거를 검색해', '가까운 자전거를 선택해', 'QR코드를 스캔해', '잠금이 해제될 때까지 기다려', '자전거를 꺼내', '헬멧을 착용해', '목적지까지 이동해', '거치대에 반납해', '앱에서 반납을 완료해'],
        distractors: ['자전거를 사', '자전거를 수리해', '걸어가', '택시를 불러', '잠금을 부숴'],
        answer: ['앱을 열어', '주변 자전거를 검색해', '가까운 자전거를 선택해', 'QR코드를 스캔해', '잠금이 해제될 때까지 기다려', '자전거를 꺼내', '목적지까지 이동해', '거치대에 반납해', '앱에서 반납을 완료해'],
        hint1: '💡 힌트: 앱을 먼저 열고 QR코드를 스캔해야 잠금이 풀려요!',
        hint2: '💡 힌트: 앱→검색→선택→QR스캔→기다리기→꺼내기→이동→반납→완료 순서예요.',
      },
    ],
    concept: { title: '반복과 최적화(Loop & Optimization)', desc: '같은 과정을 반복하면서 더 효율적인 방법을 찾는 것!\n\n앱 설치처럼 절차를 외우면 다음엔 더 빠르게 할 수 있어요. 프로그래머는 항상 더 빠른 방법을 생각해요 🚀' },
  },
];

const STAGE_TIMES = [45, 35, 25, 20, 15];

const RANKINGS = [
  { maxTime: 60,  emoji: '🏆', label: '알고리즘 천재!',    desc: '놀라운 속도예요! 타고난 개발자 감각을 가졌어요.' },
  { maxTime: 90,  emoji: '🥇', label: '코딩 마스터',       desc: '매우 빠른 논리 사고력! 개발자의 길이 열려있어요.' },
  { maxTime: 120, emoji: '🥈', label: '논리적 사고자',     desc: '체계적으로 잘 생각했어요! 조금만 더 연습하면 최고!' },
  { maxTime: 160, emoji: '🥉', label: '열심히 하는 학습자', desc: '꾸준히 노력하는 자세가 멋져요! 계속 도전해보세요.' },
  { maxTime: 9999, emoji: '💪', label: '노력 중인 개발자',  desc: '처음엔 누구나 어렵답니다. 다시 도전해보세요!' },
];

const SYSTEM_PROMPT = `당신은 세상에서 가장 눈치가 없는 '바보 로봇'입니다.

핵심 규칙:
1. 명령에 명시되지 않은 행동은 절대 유추하지 마세요.
2. 명령어를 순서대로 실행하되, 오류 발생시 즉시 중단합니다.
3. 유머러스하고 시각적으로 참사를 묘사하세요.
4. 정답을 직접 알려주지 마세요. 왜 막혔는지만 알려주세요.
5. 미션이 완벽히 완료되면 반드시 "✅ 미션 성공!" 으로 시작하세요.
6. 1단계는 난이도가 낮습니다. 흐름이 대략 맞으면 성공으로 처리하세요.

응답: 한국어, 이모지 활용, 간결하게 (3~5문장).`;

type RouteParams = { stageIndex?: number };

function getRanking(totalSec: number) {
  return RANKINGS.find((r) => totalSec <= r.maxTime) ?? RANKINGS[RANKINGS.length - 1];
}

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
  const [robotLog, setRobotLog] = useState('삐빅- 명령을 입력하고 [▶ 실행!] 버튼을 누르세요! 🤖');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(STAGE_TIMES[initialStage]);
  const [totalTime, setTotalTime] = useState(0);
  const [stageStartTime, setStageStartTime] = useState(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logScrollRef = useRef<ScrollView>(null);

  const stageData = STAGES[currentStage];
  const variant = stageData.variants[variantIndex];

  const shuffledCommands = React.useMemo(() => {
    const arr = [...variant.quickCommands, ...variant.distractors];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentStage, variantIndex]);

  const currentHint = failCount === 1 ? variant.hint1 : failCount === 2 ? variant.hint2 : null;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const limit = STAGE_TIMES[currentStage];
    setTimeLeft(limit);
    setStageStartTime(Date.now());
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [currentStage]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentStage, variantIndex]);

  // Time's up → auto fail
  useEffect(() => {
    if (timeLeft === 0 && !isLoading) {
      setRobotLog('⏰ 시간 초과! 삐빅- 제한 시간이 지났어요!\n\n명령어 순서를 더 빠르게 정리해보세요.');
      const newFail = failCount + 1;
      setFailCount(newFail);
      if (newFail >= 3) setTimeout(() => setShowAnswerModal(true), 500);
    }
  }, [timeLeft]);

  const isClientSuccess = () => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const userNorm = commands.map(normalize);
    let matches = 0;
    for (const step of variant.answer) {
      const stepNorm = normalize(step);
      if (userNorm.some((u) => u === stepNorm || u.includes(stepNorm) || stepNorm.includes(u))) {
        matches++;
      }
    }
    return matches / variant.answer.length >= 0.6;
  };

  const recordFail = (newFail: number) => {
    setFailCount(newFail);
    if (newFail >= 3) setTimeout(() => setShowAnswerModal(true), 800);
  };

  const handleSuccess = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - stageStartTime) / 1000);
    setTotalTime((t) => t + elapsed);
    setRobotLog('✅ 미션 성공!\n\n삐빅- 명령 순서가 정확합니다! 바보로봇이 미션을 완료했습니다! 🎉🤖');
    setTimeout(() => setShowConceptModal(true), 800);
  };

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
    setRobotLog('삐빅- 명령을 입력하고 [▶ 실행!] 버튼을 누르세요! 🤖');
    setInputText('');
  };

  const executeCommands = async () => {
    if (commands.length === 0) { setRobotLog('삐빅- 명령어가 없습니다! 🤖'); return; }
    setIsLoading(true);
    setRobotLog('🔄 명령 실행 중...');

    const clientOk = isClientSuccess();
    if (clientOk) {
      await new Promise((r) => setTimeout(r, 400));
      handleSuccess();
      setIsLoading(false);
      return;
    }

    if (!ANTHROPIC_API_KEY) {
      await new Promise((r) => setTimeout(r, 400));
      setRobotLog('🚨 삐빅! 명령 순서나 내용을 다시 확인해보세요.\n\n정답 명령어의 60% 이상 일치해야 성공이에요!');
      recordFail(failCount + 1);
      setIsLoading(false);
      return;
    }

    try {
      const userMessage = `미션: ${variant.title}\n환경: ${variant.items}\n\n명령어:\n${commands.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n실행해주세요.`;
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
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      const data = await response.json();
      const text: string = data.content?.[0]?.text || '응답 없음';
      setRobotLog(text);
      setTimeout(() => logScrollRef.current?.scrollToEnd({ animated: true }), 100);
      if (text.includes('미션 성공') || text.includes('✅')) {
        handleSuccess();
      } else {
        recordFail(failCount + 1);
      }
    } catch {
      if (isClientSuccess()) {
        handleSuccess();
      } else {
        setRobotLog('🔌 연결 오류가 발생했습니다.\n\n명령 순서를 다시 확인해보세요.');
        recordFail(failCount + 1);
      }
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
    setRobotLog('삐빅- 새 미션이에요! 명령을 입력하세요! 🤖');
  };

  const goNextStage = () => {
    setShowConceptModal(false);
    const nextStage = currentStage + 1;
    if (nextStage < STAGES.length) {
      setCurrentStage(nextStage);
      setVariantIndex(0);
      setFailCount(0);
      setCommands([]);
      setRobotLog('삐빅- 새 단계 시작! 명령을 입력하세요! 🤖');
    } else {
      setShowRankingModal(true);
    }
  };

  const timerColor = timeLeft > 10 ? '#4CAF50' : timeLeft > 5 ? '#FF9800' : '#EF5350';
  const ranking = getRanking(totalTime);

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.missionCard}>
        <View style={styles.missionTop}>
          <Text style={styles.missionTitle}>{variant.title}</Text>
          <View style={[styles.timerBadge, { backgroundColor: timerColor }]}>
            <Text style={styles.timerText}>⏱ {timeLeft}s</Text>
          </View>
        </View>
        <Text style={styles.stageLabel}>단계 {currentStage + 1}/5 · 제한 {STAGE_TIMES[currentStage]}초</Text>
        <Text style={styles.missionDesc}>{variant.description}</Text>
        <Text style={styles.missionItems}>📦 {variant.items}</Text>
      </View>

      <View style={[styles.body, isWide && styles.bodyRow]}>
        <View style={[styles.panel, isWide && styles.panelLeft]}>
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
          {currentHint && (
            <View style={[styles.hintBar, failCount >= 2 && styles.hintBar2]}>
              <Text style={styles.hintText}>{currentHint}</Text>
            </View>
          )}

          <Text style={styles.panelTitle}>📋 명령어 목록</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
            {shuffledCommands.map((qc, i) => (
              <TouchableOpacity key={i} style={styles.pill} onPress={() => addCommand(qc)}>
                <Text style={styles.pillText}>+ {qc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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

          <ScrollView style={styles.cmdList} nestedScrollEnabled>
            {commands.length === 0
              ? <Text style={styles.emptyHint}>위 버튼을 눌러 명령어를 추가하세요</Text>
              : commands.map((cmd, i) => (
                  <View key={i} style={styles.cmdRow}>
                    <Text style={styles.cmdNum}>{i + 1}.</Text>
                    <Text style={styles.cmdText}>{cmd}</Text>
                    <TouchableOpacity onPress={() => deleteCommand(i)} style={styles.delBtn}>
                      <Text style={styles.delBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))
            }
          </ScrollView>

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

        <View style={[styles.panel, styles.panelDark, isWide && styles.panelRight]}>
          <Text style={styles.panelTitleLight}>🖥️ 바보로봇 반응</Text>
          <ScrollView ref={logScrollRef} style={styles.terminal} nestedScrollEnabled>
            <Text style={styles.terminalText}>{robotLog}</Text>
          </ScrollView>
        </View>
      </View>

      {/* 정답 모달 */}
      <Modal visible={showAnswerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>😅</Text>
            <Text style={styles.modalTitle}>3번 실패! 정답을 볼게요</Text>
            <Text style={styles.answerLabel}>"{variant.title}" 정답 예시:</Text>
            <ScrollView style={styles.answerScroll}>
              <View style={styles.answerBox}>
                {variant.answer.map((step, i) => (
                  <Text key={i} style={styles.answerStep}>{i + 1}. {step}</Text>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.answerNote}>💪 괜찮아요! 비슷한 상황으로 다시 도전해봐요!</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={tryNextVariant}>
              <Text style={styles.retryBtnText}>
                {variantIndex + 1 < stageData.variants.length ? '다른 상황으로 다시 도전! →' : '처음 상황으로 다시! →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 개념 모달 */}
      <Modal visible={showConceptModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>미션 클리어!</Text>
            <View style={styles.conceptBox}>
              <Text style={styles.conceptTitle}>💡 {stageData.concept.title}</Text>
              <Text style={styles.conceptDesc}>{stageData.concept.desc}</Text>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.homeBtn} onPress={() => { setShowConceptModal(false); nav.goBack(); }}>
                <Text style={styles.homeBtnText}>홈으로</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={goNextStage}>
                <Text style={styles.nextBtnText}>
                  {currentStage < STAGES.length - 1 ? `${currentStage + 2}단계로 →` : '결과 보기 🏆'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 랭킹 모달 */}
      <Modal visible={showRankingModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>{ranking.emoji}</Text>
            <Text style={styles.modalTitle}>{ranking.label}</Text>
            <View style={styles.rankingTimeBox}>
              <Text style={styles.rankingTimeLabel}>총 소요 시간</Text>
              <Text style={styles.rankingTime}>{Math.floor(totalTime / 60)}분 {totalTime % 60}초</Text>
            </View>
            <Text style={styles.rankingDesc}>{ranking.desc}</Text>
            <View style={styles.rankingTable}>
              {RANKINGS.map((r, i) => (
                <View key={i} style={[styles.rankingRow, ranking === r && styles.rankingRowActive]}>
                  <Text style={styles.rankingRowEmoji}>{r.emoji}</Text>
                  <Text style={[styles.rankingRowLabel, ranking === r && styles.rankingRowLabelActive]}>{r.label}</Text>
                  <Text style={styles.rankingRowTime}>
                    {i === 0 ? '~60초' : i === RANKINGS.length - 1 ? `${RANKINGS[i-1].maxTime}초+` : `~${r.maxTime}초`}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => { setShowRankingModal(false); nav.goBack(); }}>
              <Text style={styles.nextBtnText}>홈으로 돌아가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#6C63FF', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  stageIndicator: { flexDirection: 'row', gap: 5 },
  stageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  stageDotActive: { backgroundColor: '#fff', width: 16, borderRadius: 3 },
  missionCard: {
    backgroundColor: '#fff', margin: 10, marginBottom: 0, borderRadius: 14,
    padding: 12, borderLeftWidth: 5, borderLeftColor: '#6C63FF', elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
  },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  missionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', flex: 1 },
  timerBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  timerText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  stageLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '600', marginBottom: 4 },
  missionDesc: { fontSize: 13, color: '#444', marginBottom: 3, fontWeight: '600' },
  missionItems: { fontSize: 12, color: '#777' },
  body: { flex: 1, padding: 10, gap: 10 },
  bodyRow: { flexDirection: 'row' },
  panel: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#E8ECF0' },
  panelLeft: { marginRight: 5 },
  panelRight: { marginLeft: 5 },
  panelDark: { backgroundColor: '#1A1A2E', borderColor: '#333' },
  panelTitle: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 6 },
  panelTitleLight: { fontSize: 12, fontWeight: '700', color: '#00FF88', marginBottom: 6 },
  failRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  failDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0E0E0', marginRight: 4 },
  failDotActive: { backgroundColor: '#EF5350' },
  failHint: { fontSize: 10, color: '#aaa', flex: 1 },
  hintBar: { backgroundColor: '#FFF8E1', borderRadius: 8, padding: 8, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#FFC107' },
  hintBar2: { backgroundColor: '#FFF3E0', borderLeftColor: '#FF9800' },
  hintText: { fontSize: 12, color: '#E65100', lineHeight: 17 },
  pillRow: { maxHeight: 38, marginBottom: 6 },
  pill: { backgroundColor: '#EDE9FF', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 5, marginRight: 5 },
  pillText: { color: '#6C63FF', fontSize: 11, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 5, marginBottom: 6 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 13, color: '#333', backgroundColor: '#FAFAFA' },
  addBtn: { backgroundColor: '#6C63FF', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cmdList: { flex: 1, marginBottom: 6 },
  emptyHint: { color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 12 },
  cmdRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 5 },
  cmdNum: { color: '#6C63FF', fontWeight: '700', fontSize: 12, minWidth: 18 },
  cmdText: { flex: 1, fontSize: 12, color: '#333' },
  delBtn: { backgroundColor: '#FFE0E0', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  delBtnText: { color: '#E53935', fontSize: 10, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 8 },
  resetBtn: { flex: 1, backgroundColor: '#EEEEEE', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  resetBtnText: { color: '#555', fontWeight: '700', fontSize: 13 },
  runBtn: { flex: 2, backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 11, alignItems: 'center', elevation: 2 },
  runBtnDisabled: { opacity: 0.5 },
  runBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  terminal: { flex: 1 },
  terminalText: { color: '#E0E0E0', fontSize: 13, lineHeight: 21 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', borderRadius: 20, padding: 22, width: '100%', maxWidth: 420, alignItems: 'center' },
  modalEmoji: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 12, textAlign: 'center' },
  answerLabel: { fontSize: 12, color: '#777', alignSelf: 'flex-start', marginBottom: 6 },
  answerScroll: { maxHeight: 180, width: '100%', marginBottom: 10 },
  answerBox: { backgroundColor: '#F1F8E9', borderRadius: 10, padding: 12, borderLeftWidth: 4, borderLeftColor: '#66BB6A' },
  answerStep: { fontSize: 13, color: '#2E7D32', lineHeight: 22, fontWeight: '600' },
  answerNote: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 19, marginBottom: 14 },
  retryBtn: { backgroundColor: '#6C63FF', borderRadius: 12, paddingVertical: 13, width: '100%', alignItems: 'center' },
  retryBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  conceptBox: { backgroundColor: '#EDE9FF', borderRadius: 12, padding: 14, width: '100%', marginBottom: 18 },
  conceptTitle: { fontSize: 15, fontWeight: '800', color: '#6C63FF', marginBottom: 6 },
  conceptDesc: { fontSize: 13, color: '#444', lineHeight: 20 },
  modalBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  homeBtn: { flex: 1, backgroundColor: '#EEE', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  homeBtnText: { color: '#555', fontWeight: '700', fontSize: 14 },
  nextBtn: { flex: 2, backgroundColor: '#6C63FF', borderRadius: 10, paddingVertical: 12, alignItems: 'center', width: '100%' },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  rankingTimeBox: { backgroundColor: '#EDE9FF', borderRadius: 12, padding: 14, width: '100%', alignItems: 'center', marginBottom: 10 },
  rankingTimeLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 4 },
  rankingTime: { fontSize: 32, fontWeight: '800', color: '#6C63FF' },
  rankingDesc: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 19, marginBottom: 14 },
  rankingTable: { width: '100%', marginBottom: 16 },
  rankingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginBottom: 3 },
  rankingRowActive: { backgroundColor: '#EDE9FF' },
  rankingRowEmoji: { fontSize: 18, marginRight: 8 },
  rankingRowLabel: { flex: 1, fontSize: 13, color: '#555', fontWeight: '600' },
  rankingRowLabelActive: { color: '#6C63FF', fontWeight: '800' },
  rankingRowTime: { fontSize: 12, color: '#9E9E9E' },
});
