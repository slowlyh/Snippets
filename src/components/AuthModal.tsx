import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Input, Modal } from './NeoBrutalism';

// ============================================================
// AuthModal.tsx — Login & Register (Supabase Email/Password)
// ============================================================
export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isLogin = mode === 'login';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;
        setSuccess('Akun dibuat! Cek email untuk konfirmasi jika diperlukan.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isLogin ? 'Masuk' : 'Daftar'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Login/Register */}
        <div className="grid grid-cols-2 border-[3px] border-black">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className={
                'px-4 py-2 text-sm font-black uppercase ' +
                (mode === m ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100')
              }
            >
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {!isLogin && (
          <Input
            label="Username"
            placeholder="brutal_coder"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && (
          <p className="border-2 border-black bg-[#FF5747] px-3 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_#000]">
            {error}
          </p>
        )}
        {success && (
          <p className="border-2 border-black bg-[#DEFF8E] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_0_#000]">
            {success}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full" variant="primary">
          {loading ? 'MEMPROSES...' : isLogin ? 'MASUK →' : 'BUAT AKUN →'}
        </Button>
      </form>
    </Modal>
  );
}
