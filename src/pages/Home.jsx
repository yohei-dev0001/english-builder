import { useState } from "react";
import { getPhrases } from "../data/storage";

function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const allPhrases = getPhrases();

  const sentences = allPhrases.filter(
    (phrase) => phrase.isOnHome
  );

  function speakEnglish(text) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  async function startShadowing() {
    if (isPlaying || sentences.length === 0) return;

    setIsPlaying(true);

    for (let index = 0; index < sentences.length; index += 1) {
      setCurrentIndex(index);
      speakEnglish(sentences[index].english);

      await new Promise((resolve) => {
        setTimeout(resolve, 3500);
      });
    }

    setCurrentIndex(null);
    setIsPlaying(false);
  }

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="logo">
  <span className="logo-dot"></span>

  <span className="logo-text">
    <span>ENGLISH</span>
    <span>BUILDER</span>
  </span>
</div>
        <div className="streak-card">
          <span>🔥</span>

          <div>
            <strong>Day 1</strong>
            <p>今日も5分だけ続けよう</p>
          </div>
        </div>

        <button
          className="start-button"
          onClick={startShadowing}
          disabled={isPlaying || sentences.length === 0}
        >
          {isPlaying
            ? "🎧 SHADOWING..."
            : "▶ START SHADOWING"}
        </button>
      </section>

      <section className="workout-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              TODAY&apos;S WORKOUT
            </p>

            <h2>今日練習するフレーズ</h2>
          </div>

          <span className="sentence-count">
            {sentences.length} phrases
          </span>
        </div>

        {sentences.length === 0 ? (
          <div className="empty-deck-card">
            <p className="eyebrow">
              YOUR WORKOUT IS EMPTY
            </p>

            <h2>まだ今日のフレーズがありません</h2>

            <p>
              Libraryから練習したいフレーズを追加しよう。
            </p>
          </div>
        ) : (
          <div className="sentence-list">
            {sentences.map((sentence, index) => (
              <article
                className={`sentence-card ${
                  currentIndex === index
                    ? "active-sentence"
                    : ""
                }`}
                key={sentence.id}
              >
                <span className="sentence-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="sentence-text">
                  <h3>{sentence.english}</h3>
                  <p>{sentence.japanese}</p>
                </div>

                <button
                  className="listen-button"
                  onClick={() =>
                    speakEnglish(sentence.english)
                  }
                  aria-label={`${sentence.english}を再生`}
                >
                  🔊
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="customize-card">
        <div className="customize-content">
          <p className="eyebrow">
            BUILD YOUR ENGLISH
          </p>

          <h2>必要な英語だけを毎日の練習に</h2>

          <p>
            Createでフレーズを作って、Libraryから
            <br />
            今日のワークアウトへ追加できます。
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;