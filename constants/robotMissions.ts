export interface CommandCard {
  id: string;
  emoji: string;
  label: string;
}

export interface Mission {
  id: string;
  stage: number;
  icon: string;
  title: string;
  shortDesc: string;
  description: string;
  environment: string[];
  commandCards: CommandCard[];
  successKeywords: string[];
  conceptExplanation: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'sandwich',
    stage: 1,
    icon: '🥪',
    title: '샌드위치 만들기',
    shortDesc: '피넛버터 젤리 샌드위치를 완성하라!',
    description:
      '피넛버터 젤리 샌드위치를 만들어주세요. 로봇은 명시된 것만 실행합니다!',
    environment: [
      '📦 식빵 1봉지 (묶여 있음)',
      '🫙 잼통 (뚜껑 닫힘)',
      '🔪 버터나이프',
      '🍽️ 접시',
    ],
    commandCards: [
      { id: 'open_bag', emoji: '📦', label: '식빵 봉지를 연다' },
      { id: 'take_bread', emoji: '🍞', label: '식빵 2장을 꺼낸다' },
      { id: 'place_bread', emoji: '🍽️', label: '식빵을 접시에 놓는다' },
      { id: 'open_jar', emoji: '🫙', label: '잼통 뚜껑을 연다' },
      { id: 'take_knife', emoji: '🔪', label: '버터나이프를 든다' },
      { id: 'scoop_jam', emoji: '🥄', label: '나이프로 잼을 퍼낸다' },
      { id: 'spread_jam', emoji: '🍞', label: '식빵에 잼을 바른다' },
      { id: 'stack_bread', emoji: '🥪', label: '식빵을 포개어 닫는다' },
      { id: 'put_plate', emoji: '🍽️', label: '완성된 샌드위치를 접시에 놓는다' },
    ],
    successKeywords: ['완성', '성공', '샌드위치 완료', 'SUCCESS', '클리어'],
    conceptExplanation:
      '🧠 순차(Sequence) — 컴퓨터는 명령을 위에서 아래로 순서대로 실행합니다.\n\n🔍 분해(Decomposition) — 복잡한 작업을 작은 단계들로 쪼개는 것이 알고리즘의 첫걸음입니다.\n\n📌 명시성(Explicitness) — "상식"은 없습니다. 모든 단계를 명확히 써야 합니다.',
  },
  {
    id: 'ramen',
    stage: 2,
    icon: '🍜',
    title: '컵라면 끓이기',
    shortDesc: '뜨거운 물로 컵라면을 완성하라!',
    description: '컵라면을 맛있게 끓여보세요. 단, 모든 단계를 빠짐없이 써야 합니다!',
    environment: [
      '🍜 컵라면 1개 (뜯지 않음)',
      '☕ 끓는 물이 든 커피포트',
      '🥢 나무젓가락 (포장 안됨)',
      '⏱️ 타이머 없음',
    ],
    commandCards: [
      { id: 'unwrap', emoji: '🍜', label: '컵라면 비닐을 뜯는다' },
      { id: 'open_lid_half', emoji: '📋', label: '뚜껑을 반만 열어놓는다' },
      { id: 'open_lid_full', emoji: '📋', label: '뚜껑을 완전히 연다' },
      { id: 'add_powder', emoji: '🧂', label: '스프를 넣는다' },
      { id: 'pour_water', emoji: '💧', label: '물을 표시선까지 붓는다' },
      { id: 'close_lid', emoji: '📋', label: '뚜껑을 닫고 누른다' },
      { id: 'wait_3min', emoji: '⏱️', label: '3분 기다린다' },
      { id: 'stir', emoji: '🥢', label: '젓가락으로 잘 젓는다' },
      { id: 'eat', emoji: '😋', label: '맛있게 먹는다' },
    ],
    successKeywords: ['완성', '성공', '라면 완료', 'SUCCESS', '클리어', '맛있게'],
    conceptExplanation:
      '⏳ 기다림(Delay/Sleep) — 프로그램도 특정 시간을 기다리는 명령(sleep)이 있습니다.\n\n🔄 조건부 실행(Conditional) — "뚜껑을 반만 열어 기다렸다가 닫기"처럼 상태에 따라 다른 행동이 필요할 수 있습니다.\n\n📦 초기화(Initialization) — 스프를 먼저 넣을지, 물을 먼저 넣을지 — 순서가 결과를 바꿉니다!',
  },
  {
    id: 'vending',
    stage: 3,
    icon: '🥤',
    title: '자판기 음료 뽑기',
    shortDesc: '동전으로 원하는 음료를 뽑아라!',
    description: '자판기에서 캔음료를 뽑아 마셔보세요. 변수와 입력/출력 개념을 배웁니다!',
    environment: [
      '💰 주머니 속 동전 (500원×2, 100원×3)',
      '🤖 음료수 자판기',
      '  - 콜라 1,000원',
      '  - 사이다 800원',
      '  - 물 500원',
      '🫙 캔 뚜껑 (당겨서 열기)',
    ],
    commandCards: [
      { id: 'check_pocket', emoji: '🔍', label: '주머니를 확인한다' },
      { id: 'take_coin', emoji: '💰', label: '동전을 꺼낸다' },
      { id: 'insert_500', emoji: '🪙', label: '500원을 투입한다' },
      { id: 'insert_100', emoji: '🪙', label: '100원을 투입한다' },
      { id: 'press_cola', emoji: '🥤', label: '콜라 버튼을 누른다' },
      { id: 'press_cider', emoji: '🫧', label: '사이다 버튼을 누른다' },
      { id: 'press_water', emoji: '💧', label: '물 버튼을 누른다' },
      { id: 'take_can', emoji: '📥', label: '배출구에서 캔을 꺼낸다' },
      { id: 'take_change', emoji: '💵', label: '잔돈을 꺼낸다' },
      { id: 'open_can', emoji: '🔓', label: '캔 뚜껑을 딴다' },
      { id: 'drink', emoji: '😊', label: '음료를 마신다' },
    ],
    successKeywords: ['완성', '성공', '음료 완료', 'SUCCESS', '클리어', '마신다'],
    conceptExplanation:
      '📥📤 입력/출력(Input/Output) — 동전 투입이 "입력(input)", 캔 배출이 "출력(output)"입니다.\n\n🔢 변수(Variable) — 자판기 속 "잔액"은 동전을 넣을 때마다 바뀌는 변수입니다.\n\n❓ 조건문(If/Else) — "잔액 >= 1000원이면 콜라 버튼 활성화" — 이것이 if 문의 시작입니다!',
  },
];
