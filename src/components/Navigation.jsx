function Navigation({ currentPage, setCurrentPage }) {
  const menus = [
    { id: "home", label: "HOME", icon: "🏠" },
    { id: "ai", label: "CREATE", icon: "➕" },
    { id: "library", label: "LIBRARY", icon: "📚" },
    { id: "mypage", label: "MY", icon: "⚙" },
 ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        background: "#090909",
        borderTop: "1px solid #333",
        padding: "12px 5px",
      }}
    >
      {menus.map((menu) => (
        <button
          key={menu.id}
          onClick={() => setCurrentPage(menu.id)}
          style={{
            background: "transparent",
            border: "none",
            color: currentPage === menu.id ? "#9CFF2E" : "#777",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            minWidth: "70px",
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "4px" }}>
            {menu.icon}
          </div>

          {menu.label}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;