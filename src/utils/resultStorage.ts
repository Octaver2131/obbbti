import { PersonalityResult } from '../types';

const STORAGE_KEY = '@llti_latest_result';

export function saveLatestResult(result: PersonalityResult) {
  try {
    const serialized = JSON.stringify(result);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch (e) {
    console.warn('Failed to save result:', e);
  }
}

export function getLatestResult(): PersonalityResult | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
  } catch (e) {
    console.warn('Failed to load result:', e);
  }
  return null;
}

export function hasLatestResult(): boolean {
  return getLatestResult() !== null;
}
