import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableWorkoutPhrase({
  phrase,
  index,
  active,
  isPlaying,
  onListen,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: phrase.id,
    disabled: isPlaying,
  });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
    zIndex: isDragging ? 20 : "auto",
    position: "relative",
    touchAction: "pan-y",
    boxShadow: isDragging
      ? "0 16px 36px rgba(0, 0, 0, 0.45)"
      : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      className={`sentence-card ${
        active ? "active-sentence" : ""
      }`}
      style={cardStyle}
    >
      <button
        type="button"
        className="sentence-number"
        {...attributes}
        {...listeners}
        disabled={isPlaying}
        aria-label={`${phrase.english}を並べ替える`}
        onContextMenu={(event) => event.preventDefault()}
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
          color: "#b7ff3c",
          font: "inherit",
          fontWeight: "900",
          cursor: isDragging ? "grabbing" : "grab",

          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </button>

      <div
        className="sentence-text"
        style={{
          WebkitUserSelect: "text",
          userSelect: "text",
        }}
      >
        <h3>{phrase.english}</h3>
        <p>{phrase.japanese}</p>
      </div>

      <button
        type="button"
        className="listen-button"
        onClick={() => onListen(phrase.english)}
        disabled={isPlaying}
        aria-label={`${phrase.english}を再生`}
      >
        🔊
      </button>
    </article>
  );
}

export default SortableWorkoutPhrase;