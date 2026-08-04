import { useState } from "react";
import { getPhrases, savePhrases } from "../data/storage";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableWorkoutPhrase from "../components/SortableWorkoutPhrase";

function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.8);
  const [repeatCount, setRepeatCount] = useState(1);
  const [phrases, setPhrases] = useState(getPhrases());

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 220,
        tolerance: 8,
      },
    })
  );

  const sentences = phrases
    .filter((phrase) => phrase.isOnHome)
    .sort((a, b) => {
      const orderA =
        typeof a.workoutOrder === "number"
          ? a.workoutOrder
          : Number.MAX_SAFE_INTEGER;

      const orderB =
        typeof b.workoutOrder === "number"
          ? b.workoutOrder
          : Number.MAX_SAFE_INTEGER;

      return orderA - orderB;
    });

  function wait(milliseconds) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }

  function speakEnglish(text) {
    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      const speech = new SpeechSynthesisUtterance(text);

      speech.lang = "en-US";
      speech.rate = speechRate;
      speech.pitch = 1;

      speech.onend = resolve;
      speech.onerror = resolve;

      window.speechSynthesis.speak(speech);
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (
      isPlaying ||
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex = sentences.findIndex(
      (phrase) => phrase.id === active.id
    );

    const newIndex = sentences.findIndex(
      (phrase) => phrase.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedWorkout = arrayMove(
      sentences,
      oldIndex,
      newIndex
    );

    const orderById = new Map(
      reorderedWorkout.map((phrase, index) => [
        phrase.id,
        index,
      ])
    );

    const updatedPhrases = phrases.map((phrase) => {
      if (!orderById.has(phrase.id)) {
        return phrase;
      }

      return {
        ...phrase,
        workoutOrder: orderById.get(phrase.id),
      };
    });

    setPhrases(updatedPhrases);
    savePhrases(updatedPhrases);
  }

  async function startShadowing() {
    if (isPlaying || sentences.length === 0) {
      return;
    }

    setIsPlaying(true);

    try {
      for (
        let index = 0;
        index < sentences.length;
        index += 1
      ) {
        setCurrentIndex(index);

        for (
          let repeatIndex = 0;
          repeatIndex < repeatCount;
          repeatIndex += 1
        ) {
          await speakEnglish(sentences[index].english);

          if (repeatIndex < repeatCount - 1) {
            await wait(900);
          }
        }

        await wait(1500);
      }
    } finally {
      setCurrentIndex(null);
      setIsPlaying(false);
    }
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
          type="button"
          className="start-button"
          onClick={startShadowing}
          disabled={isPlaying || sentences.length === 0}
        >
          {isPlaying
            ? "🎧 SHADOWING..."
            : "▶ START SHADOWING"}
        </button>

        <div className="shadowing-settings">
          <div className="setting-group">
            <p className="setting-label">SPEED</p>

            <div className="setting-buttons">
              {[0.5, 0.8, 1, 1.2].map((rate) => (
                <button
                  type="button"
                  key={rate}
                  className={
                    speechRate === rate ? "active" : ""
                  }
                  onClick={() => setSpeechRate(rate)}
                  disabled={isPlaying}
                >
                  {rate.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <p className="setting-label">REPEAT</p>

            <div className="setting-buttons">
              {[1, 2, 3].map((count) => (
                <button
                  type="button"
                  key={count}
                  className={
                    repeatCount === count ? "active" : ""
                  }
                  onClick={() => setRepeatCount(count)}
                  disabled={isPlaying}
                >
                  ×{count}
                </button>
              ))}
            </div>
          </div>
        </div>
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
          <>
            <p
              style={{
                margin: "0 0 14px",
                color: "#888888",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              緑の番号を少し長押しして並べ替え
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sentences.map(
                  (sentence) => sentence.id
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="sentence-list">
                  {sentences.map((sentence, index) => (
                    <SortableWorkoutPhrase
                      key={sentence.id}
                      phrase={sentence}
                      index={index}
                      active={currentIndex === index}
                      isPlaying={isPlaying}
                      onListen={speakEnglish}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
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