const SESSION_KEY = 'love-piece-session';

export interface FormData {
  selectedImages: string[];
  selectedTone: 'casual' | 'formal' | 'poetic';
  relationship: string;
  occasion: string;
  customMessage: string;
}

export interface SessionData extends FormData {
  generatedText: string | null;
}

const defaultSessionData: SessionData = {
  selectedImages: [],
  selectedTone: 'casual',
  relationship: '',
  occasion: '',
  customMessage: '',
  generatedText: null,
};

export function getSessionData(): SessionData {
  if (typeof window === 'undefined') return defaultSessionData;

  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : defaultSessionData;
  } catch {
    return defaultSessionData;
  }
}

export function setSessionData(data: SessionData): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save session data:', error);
  }
}

export function getFormData(): FormData | null {
  const data = getSessionData();
  return {
    selectedImages: data.selectedImages,
    selectedTone: data.selectedTone,
    relationship: data.relationship,
    occasion: data.occasion,
    customMessage: data.customMessage,
  };
}

export function setFormData(formData: Partial<FormData>): void {
  const current = getSessionData();
  setSessionData({ ...current, ...formData });
}

export function getGeneratedText(): string | null {
  return getSessionData().generatedText;
}

export function setGeneratedText(text: string): void {
  const current = getSessionData();
  setSessionData({ ...current, generatedText: text });
}

export function clearSessionData(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session data:', error);
  }
}
