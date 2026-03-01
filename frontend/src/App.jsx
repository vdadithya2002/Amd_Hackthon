import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import TeachPage from "./pages/TeachPage";
import HistoryPage from "./pages/HistoryPage";
import LearnPage from "./pages/LearnPage";
import AdminDemoPage from "./pages/AdminDemoPage";

function resolveRoute(pathname) {
  if (pathname === "/teach") return "teach";
  if (pathname === "/history") return "history";
  if (pathname === "/learn") return "learn";
  if (pathname === "/demo" || pathname === "/admin") return "demo";
  return "home";
}

export default function App() {
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname));

  useEffect(() => {
    const onNav = () => setRoute(resolveRoute(window.location.pathname));
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);

  if (route === "teach") return <TeachPage />;
  if (route === "history") return <HistoryPage />;
  if (route === "learn") return <LearnPage />;
  if (route === "demo") return <AdminDemoPage />;
  return <HomePage />;
}
