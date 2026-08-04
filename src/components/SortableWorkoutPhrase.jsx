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

  function stopDrag(event) {
    event.stopPropagation();
  }

  function preventSelection(event) {
    event.preventDefault();
  }

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : "auto",
  };

  return (
    <article
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`sentence-card ${
        active ? "active-sentence" : ""
      }`}
      onContextMenu={preventSelection}
      onSelectStart={preventSelection}
      style={{
        ...sortableStyle,
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "pan-y",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        boxShadow: isDragging
          ? "0 16px 36px rgba(0, 0, 0, 0.45)"
          : "none",
      }}
    >
      <span className="sentence-number">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="sentence-text">
        <h3>{phrase.english}</h3>
        <p>{phrase.japanese}</p>
      </div>

      <button
        type="button"
        className="listen-button"
        onPointerDown={stopDrag}
        onTouchStart={stopDrag}
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