import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Input, Textarea, Select, Modal, Badge } from './NeoBrutalism';

// ============================================================
// UploadModal.tsx — Form upload snippet baru
// Hanya untuk user yang sudah login (dicek via session).
// ============================================================
const LANGUAGES = [
  'javascript', 'typescript', 'python', 'rust', 'go', 'java',
  'cpp', 'php', 'sql', 'html', 'css', 'bash', 'json', 'yaml', 'plaintext',
];

export default function UploadModal({ open, onClose, user }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <Modal open={open} onClose={onClose} title="Upload Snippet">
        <p className="border-2 border-black bg-[#FFD93D] p-4 font-bold shadow-[4px_4px_0_0_#000]">
          ⚠️ Kamu harus login dulu untuk upload snippet.
        </p>
      </Modal>
    );
  }

  function addTag(e) {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const t = tagInput.trim().toLowerCase().replace(/,/g, '');
    if (t && !tags.includes(t) && tags.length < 5) setTags([...tags, t]);
    setTagInput('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Insert snippet
      const { data: snippet, error: sErr } = await supabase
        .from('snippets')
        .insert({ user_id: user.id, title, code, language, description: description || null })
        .select()
        .single();
      if (sErr) throw sErr;

      // 2. Upsert tags lalu hubungkan via snippet_tags
      if (tags.length > 0) {
        const { data: savedTags, error: tErr } = await supabase
          .from('tags')
          .upsert(tags.map((name) => ({ name })), { onConflict: 'name' })
          .select();
        if (tErr) throw tErr;
        const { error: rErr } = await supabase
          .from('snippet_tags')
          .insert(savedTags.map((t) => ({ snippet_id: snippet.id, tag_id: t.id })));
        if (rErr) throw rErr;
      }

      // reset form
      setTitle(''); setCode(''); setDescription(''); setTags([]); setTagInput('');
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan snippet');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Snippet Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul"
          placeholder="Debounce function in JS"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={120}
        />

        <Select label="Bahasa" value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>

        <Textarea
          label="Kode"
          placeholder={'function debounce(fn, ms) {\n  // ...\n}'}
          rows={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <Textarea
          label="Deskripsi (opsional)"
          placeholder="Penjelasan singkat snippet ini..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="font-sans"
        />

        <div>
          <Input
            label="Tags (maks 5, tekan Enter)"
            placeholder="react, utils"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  title="Hapus tag"
                >
                  <Badge color="lime">{t} ✕</Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="border-2 border-black bg-[#FF5747] px-3 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_#000]">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            BATAL
          </Button>
          <Button type="submit" disabled={loading} variant="primary" className="flex-1">
            {loading ? 'UPLOADING...' : 'UPLOAD ⚡'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
