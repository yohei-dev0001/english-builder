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
  });

  function stopDrag(event) {
    event.stopPropagation();
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`sentence-card ${
        active ? "active-sentence" : ""
      }`}
      style={style}
    >
      <span className="sentence-number">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="sentence-text">
        <h3>{phrase.english}</h3>
        <p>{phrase.japanese}</p>
      </div>

      <button
        className="listen-button"
        onPointerDown={stopDrag}
        onTouchStart={stopDrag}
        onClick={() => onListen(phrase.english)}
        disabled={isPlaying}
      >
        🔊
      </button>
    </article>
  );
}

export default SortableWorkoutPhrase;