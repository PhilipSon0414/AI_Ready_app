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

type Store = {
  answers: AnswerRecord[];
  unitProgress: Record<string, UnitProgress>;
  streak: number;
  lastStudyDate: string | null;
};

const STORAGE_KEY = 'aiready_store_v1';

let store: Store = {
  answers: [],
  unitProgress: {},
  streak: 0,
  lastStudyDate: null,
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
        store = { ...store, ...JSON.parse(raw) };
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

export function recordAnswer(q: Question, selectedIndex: number) {
  const correct = selectedIndex === q.answer;
  store.answers.push({
    questionId: q.id,
    unit: q.unit,
    correct,
    timestamp: Date.now(),
  });

  const prog = store.unitProgress[q.unit];
  if (prog) {
    const answered = store.answers.filter(
      (a) => a.unit === q.unit
    );
    const unique = new Set(answered.map((a) => a.questionId));
    prog.completed = unique.size;
    prog.lastStudied = Date.now();
  }

  updateStreak();
  save();
  return correct;
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
    if (!a.correct) {
      wrongMap.set(a.questionId, a);
    }
  });
  store.answers.forEach((a) => {
    if (a.correct) {
      wrongMap.delete(a.questionId);
    }
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
