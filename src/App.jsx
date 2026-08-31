import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import HomePage from './pages/HomePage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import DocsPage from './pages/DocsPage';
import AuthModal from './components/AuthModal';
import UploadModal from './components/UploadModal';
import { Button, Badge } from './components/NeoBrutalism';

// ============================================================
// App — routing + auth state (Supabase Provider Auth via session)
// ============================================================
export default function App() {
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;

  function openUpload() {
    if (!user) setAuthOpen(true);
    else setUploadOpen(true);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b-[3px] border-black bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="text-2xl font-black uppercase tracking-tighter">
              {'{'}Snippets{'}'}<span className="text-[#FF5747]">{'}'}</span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link to="/docs" className="hidden sm:block">
                <Badge color="yellow">DOCS</Badge>
              </Link>
              <Button size="sm" variant="secondary" onClick={openUpload}>+ UPLOAD</Button>
              {user ? (
                <>
                  <span className="hidden md:inline text-sm font-bold">
                    @{user.email.split('@')[0]}
                  </span>
                  <Button size="sm" variant="dark" onClick={() => supabase.auth.signOut()}>
                    LOGOUT
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="primary" onClick={() => setAuthOpen(true)}>
                  LOGIN
                </Button>
              )}
            </nav>
          </div>
        </header>

        {/* Routes */}
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage onUploadClick={openUpload} user={user} />} />
            <Route path="/snippet/:id" element={<SnippetDetailPage user={user} />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>

        <footer className="border-t-[3px] border-black py-6 text-center text-sm font-bold">
          SNIPPETS ⚡ NEO BRUTALISM EDITION — built with React + Tailwind + Supabase
        </footer>

        {/* Modals */}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} user={user} />
      </div>
    </BrowserRouter>
  );
}
