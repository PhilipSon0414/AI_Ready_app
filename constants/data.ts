import { Unit } from '../types';

export const UNITS: Unit[] = [
  {
    id: 1,
    title: '파이썬 기초',
    subtitle: '변수, 자료형, 출력',
    level: 'beginner',
    icon: '🐍',
    topics: ['변수', '정수/실수/문자열', 'print()', 'type()', '형변환'],
  },
  {
    id: 2,
    title: '조건문과 반복문',
    subtitle: 'if, for, while',
    level: 'beginner',
    icon: '🔄',
    topics: ['if/elif/else', 'for 루프', 'while 루프', 'break/continue', 'range()'],
  },
  {
    id: 3,
    title: '함수와 스코프',
    subtitle: 'def, return, 클로저',
    level: 'beginner',
    icon: '⚙️',
    topics: ['def', 'return', '기본값 파라미터', '*args/**kwargs', '람다'],
  },
  {
    id: 4,
    title: '자료구조',
    subtitle: '리스트, 딕셔너리, 셋',
    level: 'intermediate',
    icon: '📦',
    topics: ['리스트', '딕셔너리', '셋', '튜플', '컴프리헨션'],
  },
  {
    id: 5,
    title: '객체지향 프로그래밍',
    subtitle: '클래스, 상속, 다형성',
    level: 'intermediate',
    icon: '🏗️',
    topics: ['class', '__init__', '상속', 'super()', '매직 메서드'],
  },
  {
    id: 6,
    title: '파일과 예외처리',
    subtitle: 'I/O, try/except',
    level: 'intermediate',
    icon: '📁',
    topics: ['open()', 'read/write', 'try/except/finally', '예외 클래스', 'with 문'],
  },
  {
    id: 7,
    title: 'AI/ML 기초',
    subtitle: 'NumPy, Pandas, 시각화',
    level: 'advanced',
    icon: '🤖',
    topics: ['NumPy 배열', 'Pandas DataFrame', 'Matplotlib', '데이터 전처리', '통계 기초'],
  },
  {
    id: 8,
    title: '머신러닝 실전',
    subtitle: 'scikit-learn, 모델 학습',
    level: 'advanced',
    icon: '🧠',
    topics: ['선형회귀', '분류 모델', 'train/test split', '평가 지표', '하이퍼파라미터'],
  },
];

export const QUESTIONS_PER_UNIT = 10;
export const XP_PER_CORRECT = 10;
export const XP_PER_HINT = -2;
export const LEVEL_XP_THRESHOLD = 100;

export const BADGES = [
  { id: 'first_correct', name: '첫 정답!', icon: '⭐', condition: '첫 문제 맞추기' },
  { id: 'streak_3', name: '3일 연속', icon: '🔥', condition: '3일 연속 학습' },
  { id: 'streak_7', name: '일주일 습관', icon: '💪', condition: '7일 연속 학습' },
  { id: 'unit_1_done', name: '파이썬 입문 완료', icon: '🐍', condition: '단원 1 완료' },
  { id: 'unit_4_done', name: '자료구조 마스터', icon: '📦', condition: '단원 4 완료' },
  { id: 'unit_8_done', name: 'ML 완주', icon: '🏆', condition: '단원 8 완료' },
  { id: 'xp_500', name: 'XP 500 달성', icon: '💎', condition: 'XP 500 이상' },
  { id: 'no_hint', name: '힌트 없이 10문제', icon: '🎯', condition: '힌트 없이 10문제 연속' },
];
