import { useState } from "react";
import { getPhrases, savePhrases } from "../data/storage";

import {
  DndContext,
  PointerSensor,
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
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
      setTimeout(resolve, milliseconds);
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

    if (!over || active.id === over.id || isPlaying) {
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

    const workoutOrderMap = new Map(
      reorderedWorkout.map((phrase, index) => [
        phrase.id,
        index,
      ])
    );

    const updatedPhrases = phrases.map((phrase) => {
      if (!workoutOrderMap.has(phrase.id)) {
        return phrase;
      }

      return {
        ...phrase,
        workoutOrder: workoutOrderMap.get(phrase.id),
      };
    });

    setPhrases(updatedPhrases);
    savePhrases(updatedPhrases);
  }

  async function startShadowing() {
    if (isPlaying || sentences.length === 0) return;

    setIsPlaying(true);

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

        <div className="shadowing-settings">
          <div className="setting-group">
            <p className="setting-label">SPEED</p>

            <div className="setting-buttons">
              <button
                type="button"
                className={
                  speechRate === 0.5 ? "active" : ""
                }
                onClick={() => setSpeechRate(0.5)}
                disabled={isPlaying}
              >
                0.5x
              </button>

              <button
                type="button"
                className={
                  speechRate === 0.8 ? "active" : ""
                }
                onClick={() => setSpeechRate(0.8)}
                disabled={isPlaying}
              >
                0.8x
              </button>

              <button
                type="button"
                className={
                  speechRate === 1 ? "active" : ""
                }
                onClick={() => setSpeechRate(1)}
                disabled={isPlaying}
              >
                1.0x
              </button>

              <button
                type="button"
                className={
                  speechRate === 1.2 ? "active" : ""
                }
                onClick={() => setSpeechRate(1.2)}
                disabled={isPlaying}
              >
                1.2x
              </button>
            </div>
          </div>

          <div className="setting-group">
            <p className="setting-label">REPEAT</p>

            <div className="setting-buttons">
              <button
                type="button"
                className={
                  repeatCount === 1 ? "active" : ""
                }
                onClick={() => setRepeatCount(1)}
                disabled={isPlaying}
              >
                ×1
              </button>

              <button
                type="button"
                className={
                  repeatCount === 2 ? "active" : ""
                }
                onClick={() => setRepeatCount(2)}
                disabled={isPlaying}
              >
                ×2
              </button>

              <button
                type="button"
                className={
                  repeatCount === 3 ? "active" : ""
                }
                onClick={() => setRepeatCount(3)}
                disabled={isPlaying}
              >
                ×3
              </button>
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
              カードを少し長押しして並べ替え
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