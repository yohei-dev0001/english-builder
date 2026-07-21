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

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
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
        gridTemplateColumns: "42px minmax(0, 1fr) auto",
        alignItems: "center",
        gap: "12px",
        padding: "14px",
        border: isDragging
          ? "1px solid #b7ff3c"
          : "1px solid #343434",
        borderRadius: "8px",
        background: isDragging ? "#1c2414" : "#151515",
        boxShadow: isDragging
          ? "0 14px 32px rgba(0, 0, 0, 0.4)"
          : "none",
        touchAction: "none",
      }}
    >
      <button
        type="button"
        aria-label={`${phrase.english}を並び替える`}
        style={{
          width: "42px",
          height: "42px",
          padding: 0,
          border: "1px solid #353535",
          borderRadius: "6px",
          background: "#1d1d1d",
          color: "#b7ff3c",
          fontSize: "22px",
          lineHeight: 1,
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        ≡
      </button>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            color: "#ffffff",
            fontSize: "19px",
            lineHeight: "1.35",
            overflowWrap: "anywhere",
          }}
        >
          {phrase.english}
        </h2>

        <p
          style={{
            margin: 0,
            color: "#999999",
            fontSize: "14px",
            lineHeight: "1.5",
            overflowWrap: "anywhere",
          }}
        >
          {phrase.japanese}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => onToggleWorkout(phrase.id)}
          style={{
            minWidth: "126px",
            padding: "10px 12px",
            border: phrase.isOnHome
              ? "1px solid #b7ff3c"
              : "1px solid transparent",
            borderRadius: "5px",
            background: phrase.isOnHome
              ? "#1a2112"
              : "#b7ff3c",
            color: phrase.isOnHome
              ? "#b7ff3c"
              : "#101010",
            fontSize: "12px",
            fontWeight: "900",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {phrase.isOnHome
            ? "✓ IN WORKOUT"
            : "＋ WORKOUT"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(phrase.id)}
          aria-label={`${phrase.english}を削除`}
          style={{
            width: "38px",
            height: "38px",
            padding: 0,
            border: "1px solid #3b3b3b",
            borderRadius: "5px",
            background: "#1c1c1c",
            color: "#999999",
            fontSize: "16px",
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