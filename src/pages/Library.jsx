import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortablePhrase from "../components/SortablePhrase";
import { getPhrases, savePhrases } from "../data/storage";

function Library() {
  const [phrases, setPhrases] = useState(getPhrases());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function toggleWorkout(id) {
    const updatedPhrases = phrases.map((phrase) =>
      phrase.id === id
        ? {
            ...phrase,
            isOnHome: !phrase.isOnHome,
          }
        : phrase
    );

    setPhrases(updatedPhrases);
    savePhrases(updatedPhrases);
  }

  function deletePhrase(id) {
    const shouldDelete = window.confirm(
      "このフレーズを削除しますか？"
    );

    if (!shouldDelete) return;

    const updatedPhrases = phrases.filter(
      (phrase) => phrase.id !== id
    );

    setPhrases(updatedPhrases);
    savePhrases(updatedPhrases);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setPhrases((currentPhrases) => {
      const oldIndex = currentPhrases.findIndex(
        (phrase) => phrase.id === active.id
      );

      const newIndex = currentPhrases.findIndex(
        (phrase) => phrase.id === over.id
      );

      if (oldIndex === -1 || newIndex === -1) {
        return currentPhrases;
      }

      const reorderedPhrases = arrayMove(
        currentPhrases,
        oldIndex,
        newIndex
      );

      savePhrases(reorderedPhrases);

      return reorderedPhrases;
    });
  }

  return (
    <main
      style={{
        width: "min(100%, 760px)",
        margin: "0 auto",
        color: "#ffffff",
        padding: "40px 20px 120px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#b7ff3c",
          fontSize: "12px",
          fontWeight: "900",
          letterSpacing: "2px",
          textAlign: "center",
        }}
      >
        YOUR PHRASES
      </p>

      <h1
        style={{
          margin: "0 0 10px",
          color: "#ffffff",
          fontSize: "36px",
          textAlign: "center",
        }}
      >
        LIBRARY
      </h1>

      <p
        style={{
          margin: "0 0 28px",
          color: "#8f8f8f",
          fontSize: "13px",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        左の「≡」をつかんで、好きな順番に並べ替え
      </p>

      {phrases.length === 0 ? (
        <p
          style={{
            paddingTop: "30px",
            color: "#888888",
            textAlign: "center",
          }}
        >
          まだフレーズがありません。
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={phrases.map((phrase) => phrase.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {phrases.map((phrase) => (
                <SortablePhrase
                  key={phrase.id}
                  phrase={phrase}
                  onToggleWorkout={toggleWorkout}
                  onDelete={deletePhrase}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </main>
  );
}

export default Library;