import { useState } from "react";
import { getPhrases, savePhrases } from "../data/storage";

function AIBuilder() {
  const [english, setEnglish] = useState("");
  const [japanese, setJapanese] = useState("");
  const [message, setMessage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  async function translateText(text, sourceLanguage, targetLanguage) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage("翻訳する文章を入力してな！");
      return null;
    }

    setIsTranslating(true);
    setMessage("翻訳中...");

    try {
      const params = new URLSearchParams({
        q: trimmedText,
        langpair: `${sourceLanguage}|${targetLanguage}`,
      });

      const response = await fetch(
  "https://api.mymemory.translated.net/get?" + params.toString()
);
      if (!response.ok) {
        throw new Error("翻訳APIへの接続に失敗しました。");
      }

      const data = await response.json();
      const translatedText = data?.responseData?.translatedText;

      if (!translatedText) {
        throw new Error("翻訳結果を取得できませんでした。");
      }

      setMessage("翻訳できたで！内容を確認してな。");
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      setMessage("翻訳に失敗したわ。少し時間を置いて試してな。");
      return null;
    } finally {
      setIsTranslating(false);
    }
  }

  async function handleEnglishToJapanese() {
    const translatedText = await translateText(english, "en", "ja");

    if (translatedText) {
      setJapanese(translatedText);
    }
  }

  async function handleJapaneseToEnglish() {
    const translatedText = await translateText(japanese, "ja", "en");

    if (translatedText) {
      setEnglish(translatedText);
    }
  }

  function handleSave() {
    if (!english.trim() || !japanese.trim()) {
      setMessage("英語と日本語を両方入力してな！");
      return;
    }

    const currentPhrases = getPhrases();

    const newPhrase = {
      id: Date.now(),
      english: english.trim(),
      japanese: japanese.trim(),
      isOnHome: false,
      createdAt: new Date().toISOString(),
    };

    savePhrases([...currentPhrases, newPhrase]);

    setEnglish("");
    setJapanese("");
    setMessage("ライブラリに保存したで！");
  }

  return (
    <main className="create-page">
      <section className="create-hero">
        <p className="eyebrow">BUILD YOUR ENGLISH</p>
        <h1>Create Phrase</h1>
        <p>英語からでも、日本語からでも作れるで。</p>
      </section>

      <section className="phrase-form-card">
        <label htmlFor="english">英語</label>

        <textarea
          id="english"
          value={english}
          onChange={(event) => {
            setEnglish(event.target.value);
            setMessage("");
          }}
          placeholder="例：This sake is brewed in Kyoto."
          rows="3"
        />

        <button
          type="button"
          className="translate-button"
          onClick={handleEnglishToJapanese}
          disabled={isTranslating}
        >
          {isTranslating ? "TRANSLATING..." : "ENGLISH → JAPANESE"}
        </button>

        <label htmlFor="japanese">日本語</label>

        <textarea
          id="japanese"
          value={japanese}
          onChange={(event) => {
            setJapanese(event.target.value);
            setMessage("");
          }}
          placeholder="例：この日本酒は京都で造られています。"
          rows="3"
        />

        <button
          type="button"
          className="translate-button"
          onClick={handleJapaneseToEnglish}
          disabled={isTranslating}
        >
          {isTranslating ? "TRANSLATING..." : "JAPANESE → ENGLISH"}
        </button>

        <button
          type="button"
          className="save-phrase-button"
          onClick={handleSave}
          disabled={isTranslating}
        >
          SAVE TO LIBRARY
        </button>

        {message && <p className="save-message">{message}</p>}
      </section>

      <section className="ai-generate-card">
        <div>
          <p className="eyebrow">COMING NEXT</p>
          <h2>AIで10フレーズ作る</h2>
          <p>テーマを入力して、AIにまとめて作ってもらう機能。</p>
        </div>

        <button disabled>AI GENERATE</button>
      </section>
    </main>
  );
}

export default AIBuilder;