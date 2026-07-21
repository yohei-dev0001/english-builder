import { getPhrases, savePhrases } from "../data/storage";

function MyPage() {
  const phrases = getPhrases();

  const total = phrases.length;
  const workout = phrases.filter((p) => p.isOnHome).length;

  function resetData() {
    const ok = window.confirm(
      "保存したフレーズをすべて削除します。\n本当に実行しますか？"
    );

    if (!ok) return;

    savePhrases([]);
    window.location.reload();
  }

  return (
    <main
      style={{
        width: "min(100%, 760px)",
        margin: "0 auto",
        padding: "40px 20px 120px",
        color: "white",
      }}
    >
      <p
        style={{
          color: "#b7ff3c",
          fontWeight: "900",
          letterSpacing: "2px",
          fontSize: "12px",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        PROFILE
      </p>

      <h1
        style={{
          textAlign: "center",
          marginBottom: "36px",
          fontSize: "36px",
        }}
      >
        My Page
      </h1>

      <div
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "#151515",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2>Total Phrases</h2>

          <p
            style={{
              fontSize: "42px",
              color: "#b7ff3c",
              fontWeight: "900",
              margin: 0,
            }}
          >
            {total}
          </p>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2>Workout List</h2>

          <p
            style={{
              fontSize: "42px",
              color: "#b7ff3c",
              fontWeight: "900",
              margin: 0,
            }}
          >
            {workout}
          </p>
        </div>

        <button
          onClick={resetData}
          style={{
            marginTop: "24px",
            padding: "16px",
            border: "1px solid #ff4d4d",
            background: "transparent",
            color: "#ff4d4d",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          🗑 Reset All Data
        </button>
      </div>
    </main>
  );
}

export default MyPage;