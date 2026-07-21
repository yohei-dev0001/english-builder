import { useState } from "react";
import { getPhrases, savePhrases } from "../data/storage";

function AIBuilder() {
  const [japanese, setJapanese] = useState("");
  const [english, setEnglish] = useState("");
  const [message, setMessage] = useState("");

  function handleSave() {
    if (!japanese.trim() || !english.trim()) {
      setMessage("日本語と英語を両方入力してな！");
      return;
    }

    const currentPhrases = getPhrases();

    const newPhrase = {
      id: Date.now(),
      japanese: japanese.trim(),
      english: english.trim(),
      isOnHome: false,
      createdAt: new Date().toISOString(),
    };

    savePhrases([...currentPhrases, newPhrase]);

    setJapanese("");
    setEnglish("");
    setMessage("ライブラリに保存したで！");
  }

  return (
    <main className="create-page">
      <section className="create-hero">
        <p className="eyebrow">BUILD YOUR ENGLISH</p>
        <h1>Create Phrase</h1>
        <p>日本語からでも、英語からでも作れるで。</p>
      </section>

      <section className="phrase-form-card">
        <label htmlFor="japanese">日本語</label>

        <textarea
          id="japanese"
          value={japanese}
          onChange={(event) => setJapanese(event.target.value)}
          placeholder="例：この日本酒は京都で造られています。"
          rows="3"
        />

        <label htmlFor="english">英語</label>

        <textarea
          id="english"
          value={english}
          onChange={(event) => setEnglish(event.target.value)}
          placeholder="例：This sake is brewed in Kyoto."
          rows="3"
        />

        <button className="save-phrase-button" onClick={handleSave}>
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