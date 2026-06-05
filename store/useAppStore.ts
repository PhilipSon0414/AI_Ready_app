import { Platform } from 'react-native';
import { UNITS, Question } from '../data/questions';

export type AnswerRecord = {
  questionId: string;
  unit: string;
  correct: boolean;
  timestamp: number;
};

export type UnitProgress = {
  unitId: string;
  completed: number;
  total: number;
  lastStudied?: number;
};

export type BadgeId =
  | 'first_quiz'
  | 'streak_3'
  | 'perfect_unit'
  | 'level_up'
  | 'master';

export const BADGE_INFO: Record<BadgeId, { emoji: string; name: string; desc: string }> = {
  first_quiz:  { emoji: '🎯', name: '첫 퀴즈',   desc: '첫 번째 퀴즈를 완료했습니다.' },
  streak_3:    { emoji: '🔥', name: '3일 연속',   desc: '3일 연속으로 학습했습니다.' },
  perfect_unit:{ emoji: '⭐', name: '만점왕',     desc: '한 단원에서 100% 정답률을 달성했습니다.' },
  level_up:    { emoji: '🚀', name: '레벨업',     desc: '새로운 레벨을 잠금 해제했습니다.' },
  master:      { emoji: '🏆', name: '마스터',     desc: '모든 레벨을 완료했습니다.' },
};

type Store = {
  answers: AnswerRecord[];
  unitProgress: Record<string, UnitProgress>;
  xp: number;
  badges: BadgeId[];
  unlockedLevels: number[];
  diagnosticDone: boolean;
  diagnosticLevel: number | null;
  streak: number;
  lastStudyDate: string | null;
  clozeLevel: { [questionId: string]: number };
};

const STORAGE_KEY = 'aiready_store_v2';

let store: Store = {
  answers: [],
  unitProgress: {},
  xp: 0,
  badges: [],
  unlockedLevels: [1],
  diagnosticDone: false,
  diagnosticLevel: null,
  streak: 0,
  lastStudyDate: null,
  clozeLevel: {},
};

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export async function loadStore(): Promise<void> {
  try {
    const storage = getStorage();
    if (storage) {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        store = { ...store, ...parsed };
      }
    }
    initUnitProgress();
  } catch {
    initUnitProgress();
  }
}

function initUnitProgress() {
  UNITS.forEach((unit) => {
    if (!store.unitProgress[unit.id]) {
      store.unitProgress[unit.id] = {
        unitId: unit.id,
        completed: 0,
        total: unit.questions.length,
      };
    } else {
      store.unitProgress[unit.id].total = unit.questions.length;
    }
  });
}

function save() {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch {}
}

function updateStreak() {
  const today = new Date().toDateString();
  if (store.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    store.streak = store.lastStudyDate === yesterday ? store.streak + 1 : 1;
    store.lastStudyDate = today;
  }
}

// ─── Public API ────────────────────────────────────────────────

export function completeDiagnostic(level: number) {
  store.diagnosticDone = true;
  store.diagnosticLevel = level;
  store.unlockedLevels = [];
  for (let l = 1; l <= level; l++) {
    store.unlockedLevels.push(l);
  }
  save();
}

export function addXP(amount: number): BadgeId[] {
  store.xp += amount;
  const newBadges = checkBadgeAwards();
  save();
  return newBadges;
}

function checkBadgeAwards(): BadgeId[] {
  const awarded: BadgeId[] = [];

  // 3-day streak
  if (store.streak >= 3 && !store.badges.includes('streak_3')) {
    store.badges.push('streak_3');
    awarded.push('streak_3');
  }

  // master – all 4 levels unlocked and all units done ≥70%
  if (!store.badges.includes('master')) {
    const allLevels = [1, 2, 3, 4];
    const allComplete = allLevels.every((l) => {
      const prog = getLevelProgress(l);
      return prog.completed === prog.total && prog.total > 0 && prog.accuracy >= 70;
    });
    if (allComplete) {
      store.badges.push('master');
      awarded.push('master');
    }
  }

  return awarded;
}

export function awardBadge(badgeId: BadgeId): boolean {
  if (store.badges.includes(badgeId)) return false;
  store.badges.push(badgeId);
  save();
  return true;
}

export function checkLevelUnlock(levelId: number): boolean {
  const nextLevel = levelId + 1;
  if (nextLevel > 4) return false;
  if (store.unlockedLevels.includes(nextLevel)) return false;

  const prog = getLevelProgress(levelId);
  if (prog.completed === prog.total && prog.total > 0 && prog.accuracy >= 70) {
    store.unlockedLevels.push(nextLevel);
    store.xp += 100; // bonus for unlocking level
    awardBadge('level_up');
    if (nextLevel === 4 && store.unlockedLevels.length === 4) {
      // check master after final unlock
      checkBadgeAwards();
    }
    save();
    return true;
  }
  return false;
}

export function getLevelProgress(levelId: number): {
  completed: number;
  total: number;
  accuracy: number;
} {
  const levelUnits = UNITS.filter((u) => u.level === levelId);
  let completedUnits = 0;
  let totalCorrect = 0;
  let totalAnswered = 0;

  levelUnits.forEach((unit) => {
    const unitAnswers = store.answers.filter((a) => a.unit === unit.id);
    const uniqueAnswered = new Set(unitAnswers.map((a) => a.questionId));
    if (uniqueAnswered.size >= unit.questions.length) {
      completedUnits++;
    }
    totalCorrect += unitAnswers.filter((a) => a.correct).length;
    totalAnswered += unitAnswers.length;
  });

  const accuracy = totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100);

  return {
    completed: completedUnits,
    total: levelUnits.length,
    accuracy,
  };
}

export function recordAnswer(q: Question, selectedIndex: number): boolean {
  const correct = selectedIndex === q.answer;
  store.answers.push({
    questionId: q.id,
    unit: q.unit,
    correct,
    timestamp: Date.now(),
  });

  const prog = store.unitProgress[q.unit];
  if (prog) {
    const answered = store.answers.filter((a) => a.unit === q.unit);
    const unique = new Set(answered.map((a) => a.questionId));
    prog.completed = unique.size;
    prog.lastStudied = Date.now();
  }

  // XP for correct answer
  if (correct) {
    store.xp += 10;
  }

  updateStreak();
  checkBadgeAwards();
  save();
  return correct;
}

export function completeUnit(unitId: string, correctCount: number, totalCount: number): BadgeId[] {
  const newBadges: BadgeId[] = [];

  // Unit completion bonus XP
  store.xp += 50;

  // First quiz badge
  const allAnswered = store.answers.filter((a) => a.unit !== 'diagnostic');
  if (allAnswered.length > 0 && !store.badges.includes('first_quiz')) {
    store.badges.push('first_quiz');
    newBadges.push('first_quiz');
  }

  // Perfect unit badge
  if (correctCount === totalCount && totalCount > 0 && !store.badges.includes('perfect_unit')) {
    store.badges.push('perfect_unit');
    newBadges.push('perfect_unit');
  }

  const fromCheck = checkBadgeAwards();
  fromCheck.forEach((b) => {
    if (!newBadges.includes(b)) newBadges.push(b);
  });

  save();
  return newBadges;
}

export function getClozeLevel(questionId: string): number {
  return store.clozeLevel[questionId] ?? 0;
}

export function incrementClozeLevel(questionId: string): void {
  store.clozeLevel[questionId] = (store.clozeLevel[questionId] ?? 0) + 1;
  save();
}

export function getClozeMastery(unitId: string): { mastered: number; total: number } {
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return { mastered: 0, total: 0 };
  const questionsWithCloze = unit.questions.filter((q) => q.cloze);
  const mastered = questionsWithCloze.filter((q) => (store.clozeLevel[q.id] ?? 0) >= 2).length;
  return { mastered, total: questionsWithCloze.length };
}

export function getStore(): Store {
  return store;
}

export function getUnitProgress(unitId: string): UnitProgress {
  return store.unitProgress[unitId] ?? { unitId, completed: 0, total: 0 };
}

export function getWrongAnswers(): AnswerRecord[] {
  const wrongMap = new Map<string, AnswerRecord>();
  store.answers.forEach((a) => {
    if (!a.correct) wrongMap.set(a.questionId, a);
  });
  store.answers.forEach((a) => {
    if (a.correct) wrongMap.delete(a.questionId);
  });
  return Array.from(wrongMap.values());
}

export function getStats() {
  const total = store.answers.length;
  const correct = store.answers.filter((a) => a.correct).length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  const byUnit: Record<string, { correct: number; total: number }> = {};
  UNITS.forEach((u) => {
    const unitAnswers = store.answers.filter((a) => a.unit === u.id);
    byUnit[u.id] = {
      total: unitAnswers.length,
      correct: unitAnswers.filter((a) => a.correct).length,
    };
  });

  return {
    total,
    correct,
    accuracy,
    streak: store.streak,
    xp: store.xp,
    badges: store.badges,
    byUnit,
  };
}

export function resetUnit(unitId: string) {
  store.answers = store.answers.filter((a) => a.unit !== unitId);
  store.unitProgress[unitId] = {
    unitId,
    completed: 0,
    total: store.unitProgress[unitId]?.total ?? 0,
  };
  save();
}
