// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import AddSnippet from "@/pages/AddSnippet";
import SnippetPage from "@/pages/SnippetPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/add" element={<AddSnippet />} />
      <Route path="/snippets/:slug" element={<SnippetPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
