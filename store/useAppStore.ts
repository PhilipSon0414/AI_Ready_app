import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, UnitProgress, WrongAnswer, Question, DailyRecord } from '../types';
import { UNITS, XP_PER_CORRECT, LEVEL_XP_THRESHOLD, BADGES } from '../constants/data';

const STORAGE_KEY = 'aiready_state';

const getToday = () => new Date().toISOString().split('T')[0];

const initialState = (): AppState => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: '',
  unitProgress: Object.fromEntries(
    UNITS.map((u, i) => [
      u.id,
      { unitId: u.id, completed: 0, correct: 0, total: 0, unlocked: i === 0 },
    ])
  ),
  wrongAnswers: [],
  badges: [],
  dailyRecords: [],
});

let _state: AppState = initialState();
let _listeners: Array<() => void> = [];

const notify = () => _listeners.forEach((fn) => fn());

const persist = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch {}
};

export const loadStore = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as AppState;
      _state = { ...initialState(), ...saved };
    }
  } catch {}
};

const checkAndAwardBadges = (state: AppState): string[] => {
  const earned: string[] = [];
  const has = (id: string) => state.badges.includes(id);

  if (!has('first_correct') && state.xp > 0) earned.push('first_correct');
  if (!has('streak_3') && state.streak >= 3) earned.push('streak_3');
  if (!has('streak_7') && state.streak >= 7) earned.push('streak_7');
  if (!has('unit_1_done') && state.unitProgress[1]?.completed >= 10) earned.push('unit_1_done');
  if (!has('unit_4_done') && state.unitProgress[4]?.completed >= 10) earned.push('unit_4_done');
  if (!has('unit_8_done') && state.unitProgress[8]?.completed >= 10) earned.push('unit_8_done');
  if (!has('xp_500') && state.xp >= 500) earned.push('xp_500');

  return earned;
};

export const useAppStore = () => {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  }, []);

  const recordAnswer = useCallback(
    (unitId: number, question: Question, userAnswer: string, isCorrect: boolean) => {
      const today = getToday();
      const prev = _state.unitProgress[unitId] ?? {
        unitId,
        completed: 0,
        correct: 0,
        total: 0,
        unlocked: true,
      };

      const newProgress: UnitProgress = {
        ...prev,
        completed: prev.completed + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      };

      const newXp = _state.xp + (isCorrect ? XP_PER_CORRECT : 0);
      const newLevel = Math.floor(newXp / LEVEL_XP_THRESHOLD) + 1;

      const newUnitProgress = { ..._state.unitProgress, [unitId]: newProgress };

      // Unlock next unit when current unit reaches 10 completions
      if (newProgress.completed >= 10 && unitId < 8) {
        const nextUnit = newUnitProgress[unitId + 1];
        if (nextUnit && !nextUnit.unlocked) {
          newUnitProgress[unitId + 1] = { ...nextUnit, unlocked: true };
        }
      }

      // Update streak
      let newStreak = _state.streak;
      let newLastStudyDate = _state.lastStudyDate;
      if (_state.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        newStreak = _state.lastStudyDate === yStr ? _state.streak + 1 : 1;
        newLastStudyDate = today;
      }

      // Update daily records
      const dailyRecords = [..._state.dailyRecords];
      const todayIdx = dailyRecords.findIndex((r) => r.date === today);
      if (todayIdx >= 0) {
        dailyRecords[todayIdx] = {
          ...dailyRecords[todayIdx],
          xp: dailyRecords[todayIdx].xp + (isCorrect ? XP_PER_CORRECT : 0),
          questionsAnswered: dailyRecords[todayIdx].questionsAnswered + 1,
        };
      } else {
        dailyRecords.push({ date: today, xp: isCorrect ? XP_PER_CORRECT : 0, questionsAnswered: 1 });
      }

      // Wrong answers
      const wrongAnswers = [..._state.wrongAnswers];
      if (!isCorrect) {
        wrongAnswers.push({
          id: `${Date.now()}`,
          question,
          userAnswer,
          timestamp: Date.now(),
        });
      }

      _state = {
        ..._state,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastStudyDate: newLastStudyDate,
        unitProgress: newUnitProgress,
        wrongAnswers,
        dailyRecords,
      };

      const newBadges = checkAndAwardBadges(_state);
      if (newBadges.length > 0) {
        _state = { ..._state, badges: [..._state.badges, ...newBadges] };
      }

      persist();
      notify();
      return newBadges;
    },
    []
  );

  const removeWrongAnswer = useCallback((id: string) => {
    _state = { ..._state, wrongAnswers: _state.wrongAnswers.filter((w) => w.id !== id) };
    persist();
    notify();
  }, []);

  return {
    state: _state,
    recordAnswer,
    removeWrongAnswer,
  };
};
