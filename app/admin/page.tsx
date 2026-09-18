'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/lib/useAuth';
import { sortProjects, type Project, type ProjectFormValue } from '@/lib/projects';
import ProjectForm from '@/components/admin/ProjectForm';

type View = { name: 'list' } | { name: 'create' } | { name: 'edit'; slug: string };

async function authHeaders(user: { getIdToken: (f?: boolean) => Promise<string> }) {
  const token = await user.getIdToken();
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function AdminPage() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: 'list' });
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [draftSignal, setDraftSignal] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setListLoading(true);
    setListError(null);
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const res = await fetch('/api/admin/projects?all=1', { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal memuat projects.');
      setProjects(sortProjects((data.projects ?? []) as Project[]));
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Gagal memuat projects.');
    } finally {
      setListLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.techStack ?? []).join(' ').toLowerCase().includes(q)
      );
    });
  }, [projects, query, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setView({ name: 'create' });
  };

  const openEdit = async (slug: string) => {
    if (!user) return;
    setFormError(null);
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal memuat detail.');
      setEditing(data as Project);
      setView({ name: 'edit', slug });
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal memuat detail.');
    }
  };

  const handleSubmit = async (value: ProjectFormValue) => {
    if (!user) return;
    setSaving(true);
    setFormError(null);
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const isEdit = view.name === 'edit';
      const url = isEdit ? `/api/admin/projects/${encodeURIComponent(view.slug)}` : '/api/admin/projects';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers, body: JSON.stringify(value) });
      const data = await res.json();
      if (!res.ok) {
        const detail = Array.isArray(data.details) ? `: ${data.details.map((d: { message: string }) => d.message).join(' ')}` : '';
        throw new Error(`${data.error ?? 'Gagal menyimpan.'}${detail}`);
      }
      setNotice(isEdit ? `Project "${view.slug}" tersimpan.` : `Project "${data.slug}" dibuat.`);
      // Hapus draft localStorage langsung (form akan unmount sebelum sinyal efek diproses)
      try {
        window.localStorage.removeItem(
          view.name === 'edit' ? `admin-project-draft:${view.slug}` : 'admin-project-draft:new'
        );
      } catch {
        /* abaikan */
      }
      setView({ name: 'list' });
      setEditing(null);
      setDraftSignal((s) => s + 1);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!user) return;
    if (!window.confirm(`Hapus project "${slug}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(slug);
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal menghapus.');
      setNotice(`Project "${slug}" dihapus.`);
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal menghapus.');
    } finally {
      setDeleting(null);
    }
  };

  const moveOrder = async (p: Project, dir: -1 | 1) => {
    if (!user) return;
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(p.slug)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ order: Math.max(0, (p.order ?? 0) + dir) }),
      });
      if (!res.ok) throw new Error('Gagal mengubah urutan.');
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal mengubah urutan.');
    }
  };

  const toggleFeatured = async (p: Project) => {
    if (!user) return;
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(p.slug)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (!res.ok) throw new Error('Gagal mengubah featured.');
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal mengubah featured.');
    }
  };

  const toggleStatus = async (p: Project) => {
    if (!user) return;
    try {
      const headers = await authHeaders(user as unknown as { getIdToken: () => Promise<string> });
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(p.slug)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: p.status === 'published' ? 'draft' : 'published' }),
      });
      if (!res.ok) throw new Error('Gagal mengubah status.');
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Gagal mengubah status.');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Restricted</p>
            <h1 id="admin-title" className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)]">
              Project Admin
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              CRUD projects (Firestore) + media URL gratis — tanpa ngoding, tanpa upload berbayar.
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)] max-w-44 truncate">{user.email}</span>
              <button onClick={signOut} className="px-3 py-1.5 text-[11px] rounded-md border border-[var(--border-default)] hover:border-[var(--brand)]">
                Sign out
              </button>
            </div>
          )}
        </div>

        {notice && (
          <p role="status" className="p-3 rounded-md bg-[var(--brand-bg)] border border-[var(--brand)]/30 text-xs text-[var(--text-primary)]">
            {notice}
          </p>
        )}

        {authLoading ? (
          <div className="flex justify-center p-10" aria-label="Memuat auth">
            <div className="w-6 h-6 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="p-8 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-center space-y-3">
            <p className="text-2xl">🔒</p>
            <h2 className="font-bold text-sm text-[var(--text-primary)]">Login dulu untuk mengelola projects</h2>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              Hanya email yang terdaftar di <code className="font-mono">ADMIN_EMAILS</code> yang bisa membuka halaman ini.
            </p>
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs hover:brightness-110"
            >
              Continue with Google
            </button>
          </div>
        ) : view.name === 'list' ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari title / slug / tech…"
                className="flex-1 min-w-52 px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md"
                aria-label="Cari projects"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md"
                aria-label="Filter status"
              >
                <option value="all">Semua status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <button
                onClick={openCreate}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110"
              >
                + Project baru
              </button>
              <button
                onClick={load}
                className="px-3 py-2 text-xs rounded-md border border-[var(--border-default)] hover:border-[var(--brand)]"
              >
                Muat ulang
              </button>
            </div>

            {listLoading ? (
              <div className="space-y-2" aria-label="Memuat daftar">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] animate-pulse" />
                ))}
              </div>
            ) : listError ? (
              <div className="p-4 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger-border)] text-xs text-[var(--danger)]" role="alert">
                {listError}
                {listError.includes('ADMIN_EMAILS') && (
                  <span className="block mt-1 text-[var(--text-muted)]">Minta pemilik menambahkan email kamu ke env ADMIN_EMAILS lalu redeploy.</span>
                )}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center rounded-xl border border-dashed border-[var(--border-default)] text-xs text-[var(--text-muted)]">
                {projects.length === 0
                  ? 'Belum ada project di Firestore. Klik "+ Project baru" atau jalankan migrasi MDX.'
                  : 'Tidak ada yang cocok dengan filter.'}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead>
                    <tr className="bg-[var(--bg-surface)] text-[var(--text-muted)] uppercase text-[10px] tracking-wider">
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Featured</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Media</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.slug} className="border-t border-[var(--border-default)] bg-[var(--bg-base)] hover:bg-[var(--bg-surface)]/60">
                        <td className="px-4 py-3">
                          <p className="font-bold text-[var(--text-primary)]">{p.title}</p>
                          <p className="font-mono text-[10px] text-[var(--text-muted)]">/{p.slug} · {p.type} · {p.category}</p>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleStatus(p)}
                            title="Klik untuk toggle draft/published"
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                              p.status === 'published'
                                ? 'bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]'
                                : 'bg-[var(--bg-muted)] border-[var(--border-default)] text-[var(--text-muted)]'
                            }`}
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleFeatured(p)}
                            title="Klik untuk toggle featured"
                            aria-pressed={p.featured}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                              p.featured
                                ? 'bg-[var(--warning)]/10 border-[var(--warning)]/30 text-[var(--warning)]'
                                : 'bg-transparent border-[var(--border-default)] text-[var(--text-muted)]'
                            }`}
                          >
                            {p.featured ? '★ Featured' : '☆ Biasa'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveOrder(p, -1)} className="w-6 h-6 rounded border border-[var(--border-default)] hover:border-[var(--brand)]" aria-label={`Naikkan urutan ${p.slug}`}>↑</button>
                            <span className="w-8 text-center font-mono">{p.order ?? 0}</span>
                            <button onClick={() => moveOrder(p, 1)} className="w-6 h-6 rounded border border-[var(--border-default)] hover:border-[var(--brand)]" aria-label={`Turunkan urutan ${p.slug}`}>↓</button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[10px] font-mono text-[var(--text-muted)]">
                          {p.coverImage ? '🖼 cover' : '—'}
                          {p.gallery?.length ? ` +${p.gallery.length}` : ''}
                          {p.demoVideo ? ' 🎬' : ''}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => openEdit(p.slug)} className="px-3 py-1.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] hover:border-[var(--brand)] font-semibold">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.slug)}
                              disabled={deleting === p.slug}
                              className="px-3 py-1.5 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger)] font-semibold disabled:opacity-50"
                            >
                              {deleting === p.slug ? '…' : 'Hapus'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              {filtered.length}/{projects.length} projects · klik status/featured untuk toggle cepat · ↑↓ mengatur order tampil
            </p>
          </>
        ) : (
          <div className="p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
            <h2 className="font-bold text-sm mb-4 text-[var(--text-primary)]">
              {view.name === 'create' ? 'Project baru' : `Edit /${view.slug}`}
            </h2>
            <ProjectForm
              initial={editing ?? undefined}
              saving={saving}
              formError={formError}
              draftKey={view.name === 'create' ? 'admin-project-draft:new' : `admin-project-draft:${view.slug}`}
              clearDraftSignal={draftSignal}
              onCancel={() => {
                setView({ name: 'list' });
                setEditing(null);
                setFormError(null);
              }}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
