import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import AIBuilder from "./pages/AIBuilder";
import Library from "./pages/Library";
import MyPage from "./pages/MyPage";
import Navigation from "./components/Navigation";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  function showPage() {
    if (currentPage === "ai") {
      return <AIBuilder />;
    }

    if (currentPage === "library") {
      return <Library />;
    }

    if (currentPage === "mypage") {
      return <MyPage />;
    }

    return <Home />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        paddingBottom: "90px",
      }}
    >
      {showPage()}

      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;