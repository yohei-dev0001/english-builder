import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortablePhrase({
  phrase,
  onToggleWorkout,
  onDelete,
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

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <article
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...sortableStyle,
        display: "grid",
        gap: "16px",
        padding: "18px",
        border: isDragging
          ? "1px solid #b7ff3c"
          : "1px solid #343434",
        borderRadius: "12px",
        background: isDragging ? "#1c2414" : "#151515",
        boxShadow: isDragging
          ? "0 16px 36px rgba(0, 0, 0, 0.45)"
          : "none",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      <div
        style={{
          minWidth: 0,
        }}
      >
        <h2
          style={{
            margin: "0 0 8px",
            color: "#ffffff",
            fontSize: "21px",
            fontWeight: "800",
            lineHeight: "1.35",
            textAlign: "left",
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {phrase.english}
        </h2>

        <p
          style={{
            margin: 0,
            color: "#a3a3a3",
            fontSize: "15px",
            lineHeight: "1.6",
            textAlign: "left",
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {phrase.japanese}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onPointerDown={stopDrag}
          onTouchStart={stopDrag}
          onClick={() => onToggleWorkout(phrase.id)}
          style={{
            flex: 1,
            minHeight: "44px",
            padding: "10px 14px",
            border: phrase.isOnHome
              ? "1px solid #b7ff3c"
              : "1px solid transparent",
            borderRadius: "8px",
            background: phrase.isOnHome
              ? "#1a2112"
              : "#b7ff3c",
            color: phrase.isOnHome
              ? "#b7ff3c"
              : "#101010",
            fontSize: "13px",
            fontWeight: "900",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {phrase.isOnHome ? "✓ WORKOUT" : "＋ WORKOUT"}
        </button>

        <button
          type="button"
          onPointerDown={stopDrag}
          onTouchStart={stopDrag}
          onClick={() => onDelete(phrase.id)}
          aria-label={`${phrase.english}を削除`}
          style={{
            width: "44px",
            height: "44px",
            flexShrink: 0,
            padding: 0,
            border: "1px solid #3b3b3b",
            borderRadius: "8px",
            background: "#1c1c1c",
            color: "#999999",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          🗑️
        </button>
      </div>
    </article>
  );
}

export default SortablePhrase;
