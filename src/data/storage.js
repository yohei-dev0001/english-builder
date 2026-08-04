const STORAGE_KEY = "english-builder-phrases";
const STORAGE_VERSION = 1;

function migrateData(phrases) {
  return phrases.map((phrase) => ({
    id: phrase.id,
    english: phrase.english ?? "",
    japanese: phrase.japanese ?? "",
    isOnHome: phrase.isOnHome ?? false,
    createdAt: phrase.createdAt ?? Date.now(),

    // 将来追加する項目
  folderId: phrase.folderId ?? null,
xp: phrase.xp ?? 0,
workoutOrder: phrase.workoutOrder ?? null,
  }));
}

export function getPhrases() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    // 旧データ（配列のみ）
    if (Array.isArray(parsed)) {
      const migrated = migrateData(parsed);

      savePhrases(migrated);

      return migrated;
    }

    // 新データ（バージョン管理）
    if (parsed.version && Array.isArray(parsed.phrases)) {
      const migrated = migrateData(parsed.phrases);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: STORAGE_VERSION,
          phrases: migrated,
        })
      );

      return migrated;
    }

    return [];
  } catch (error) {
    console.error("フレーズの読み込みに失敗しました", error);
    return [];
  }
}

export function savePhrases(phrases) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      phrases,
    })
  );
}