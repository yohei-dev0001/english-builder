const STORAGE_KEY = "english-builder-phrases";

export function getPhrases() {
  const savedPhrases = localStorage.getItem(STORAGE_KEY);

  if (!savedPhrases) {
    return [];
  }

  try {
    return JSON.parse(savedPhrases);
  } catch (error) {
    console.error("フレーズの読み込みに失敗しました", error);
    return [];
  }
}

export function savePhrases(phrases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
}