'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_PROJECT,
  isAllowedImageUrl,
  parseYouTubeId,
  toYouTubeEmbed,
  type Project,
  type ProjectFormValue,
} from '@/lib/projects';
import { applyImport, fetchRepo, mapRepoToFields, parseRepoRef, type ImportedFields } from '@/lib/github-import';
import { useFormDraft } from '@/lib/useFormDraft';
import { ProjectCover, ProjectGallery, ProjectVideo } from '@/components/ProjectMedia';

const inputCls =
  'w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]';
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1';
const errCls = 'text-[11px] text-[var(--danger)] mt-1';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
      {error && <span className={errCls}>{error}</span>}
    </label>
  );
}

export default function ProjectForm({
  initial,
  saving,
  formError,
  draftKey,
  clearDraftSignal,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Project>;
  saving: boolean;
  formError: string | null;
  /** Key localStorage autosave (null = nonaktif). */
  draftKey: string | null;
  /** Naikkan untuk menghapus draft (dipanggil setelah simpan sukses). */
  clearDraftSignal?: number;
  onSubmit: (value: ProjectFormValue) => void;
  onCancel: () => void;
}) {
  const baseline = useMemo<ProjectFormValue>(() => ({ ...EMPTY_PROJECT, ...initial }), [initial]);
  const [v, setV] = useState<ProjectFormValue>(baseline);
  const [touched, setTouched] = useState(false);
  const [galleryDraft, setGalleryDraft] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [lastImport, setLastImport] = useState<ImportedFields | null>(null);
  const [tab, setTab] = useState<'form' | 'preview'>('form');

  const draft = useFormDraft<ProjectFormValue>(draftKey, v, baseline);
  const signalRef = useRef(clearDraftSignal);
  useEffect(() => {
    // Lewati mount pertama — hanya hapus saat parent menaikkan sinyal (simpan sukses)
    if (signalRef.current === clearDraftSignal) return;
    signalRef.current = clearDraftSignal;
    draft.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearDraftSignal]);

  const set = <K extends keyof ProjectFormValue>(k: K, val: ProjectFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const ytEmbed = useMemo(() => (v.demoVideo ? toYouTubeEmbed(v.demoVideo) : null), [v.demoVideo]);
  const ytId = useMemo(() => (v.demoVideo ? parseYouTubeId(v.demoVideo) : null), [v.demoVideo]);
  const coverOk = !v.coverImage || isAllowedImageUrl(v.coverImage);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!v.title.trim()) e.title = 'Title wajib diisi.';
    if (!v.description.trim()) e.description = 'Description wajib diisi.';
    if (v.coverImage && !isAllowedImageUrl(v.coverImage)) e.coverImage = 'URL gambar tidak diizinkan (pakai jsDelivr / ImageKit / Cloudinary / Unsplash / Sanity / YouTube thumbnail).';
    if (v.demoVideo && !parseYouTubeId(v.demoVideo) && !/^https?:\/\//.test(v.demoVideo)) e.demoVideo = 'Isi URL YouTube valid.';
    return e;
  }, [v]);

  const invalid = Object.keys(errors).length > 0;
  const show = (k: string): string | undefined => (touched ? errors[k] : undefined);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (invalid) return;
        onSubmit(v);
      }}
      className="space-y-4"
    >
      {/* ── Tab Form / Preview ── */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Mode form">
        {(['form', 'preview'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === t
                ? 'bg-[var(--brand)] text-[var(--brand-contrast)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t === 'form' ? '✏️ Form' : '👁 Preview publik'}
          </button>
        ))}
        {v.status === 'draft' && tab === 'preview' && (
          <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-[var(--warning)]">
            Draft — tidak tampil di /projects
          </span>
        )}
      </div>

      {tab === 'preview' ? (
        /* ── Preview persis tampilan publik ── */
        <div className="space-y-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] overflow-hidden">
          <div className="group">
            <ProjectCover project={v} tall />
          </div>
          <div className="px-5 pb-5 space-y-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="px-2 py-0.5 bg-[var(--brand-bg)] text-[var(--brand)] text-[10px] font-semibold uppercase tracking-wider rounded">
                  {v.type || 'Web'}
                </span>
                <span className="px-2 py-0.5 bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider rounded">
                  {v.category}
                </span>
                {v.featured && (
                  <span className="px-2 py-0.5 bg-[var(--warning)]/10 border border-[var(--warning)]/25 text-[var(--warning)] text-[10px] font-semibold uppercase tracking-wider rounded">
                    ★ Featured
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                {v.title || <span className="text-[var(--text-muted)]">(belum ada title)</span>}
              </h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mt-1">
                {v.description || <span>(belum ada description)</span>}
              </p>
            </div>
            {v.demoVideo && <ProjectVideo url={v.demoVideo} title={v.title || 'Project'} />}
            <ProjectGallery project={v} />
            {v.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {v.techStack.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[10px] font-semibold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-default)] rounded">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {v.features.length > 0 && (
              <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Key Capabilities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {v.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-primary)]">
                      <span className="w-1 h-1 rounded-full bg-[var(--brand)] flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {v.github && (
                <span className="px-3 py-1.5 text-[11px] font-semibold bg-[var(--text-primary)] text-[var(--bg-base)] rounded-md">Repo →</span>
              )}
              {v.live && (
                <span className="px-3 py-1.5 text-[11px] font-semibold bg-[var(--brand)] text-[var(--brand-contrast)] rounded-md">Live →</span>
              )}
            </div>
          </div>
        </div>
      ) : (
      <>
      {/* ── Draft tersimpan ── */}
      {draft.showBanner && (
        <div role="status" className="p-3 rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="flex-1 min-w-40">
            Ada draft tersimpan otomatis
            {draft.savedAt && (
              <> ({new Date(draft.savedAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})</>
            )}
            . Muat untuk melanjutkan.
          </span>
          <button
            type="button"
            onClick={() => {
              const d = draft.restore();
              if (d) setV(d);
              draft.dismiss();
            }}
            className="px-3 py-1.5 rounded-md bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold"
          >
            Muat draft
          </button>
          <button
            type="button"
            onClick={() => draft.dismiss()}
            className="px-3 py-1.5 rounded-md border border-[var(--border-default)]"
          >
            Buang
          </button>
        </div>
      )}

      {/* ── Import dari GitHub ── */}
      <div className="p-4 rounded-lg border border-dashed border-[var(--brand)]/50 bg-[var(--brand-bg)]/40 space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
          Import dari GitHub — isi form otomatis
        </p>
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={importUrl}
            onChange={(e) => {
              setImportUrl(e.target.value);
              setImportMsg(null);
            }}
            placeholder="https://github.com/owner/repo atau owner/repo"
            inputMode="url"
            aria-label="URL repo GitHub untuk import"
          />
          <button
            type="button"
            disabled={importing || !importUrl.trim()}
            onClick={async () => {
              const ref = parseRepoRef(importUrl);
              if (!ref) {
                setImportMsg('Format tidak dikenali. Pakai URL repo atau owner/repo.');
                return;
              }
              setImporting(true);
              setImportMsg(null);
              try {
                const repo = await fetchRepo(ref);
                const imported = mapRepoToFields(repo);
                const { value, changed } = applyImport(v, imported, 'fill-empty');
                setV(value);
                setLastImport(imported);
                setImportMsg(
                  changed.length > 0
                    ? `Terisi dari ${ref.owner}/${ref.repo}: ${changed.join(', ')}. Field yang sudah ada isinya tidak ditimpa.`
                    : `Semua field sudah terisi — tidak ada yang diubah. Pakai "Timpa semua" bila ingin paksa.`
                );
              } catch (err) {
                setImportMsg(err instanceof Error ? err.message : 'Import gagal.');
              } finally {
                setImporting(false);
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-md bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110 disabled:opacity-50 shrink-0"
          >
            {importing ? 'Mengambil…' : 'Import'}
          </button>
        </div>
        {importMsg && (
          <p role="status" className="text-[11px] text-[var(--text-primary)]">{importMsg}</p>
        )}
        {lastImport && (
          <button
            type="button"
            onClick={() => {
              const { changed } = applyImport(v, lastImport, 'overwrite');
              setV((p) => applyImport(p, lastImport, 'overwrite').value);
              setImportMsg(changed.length > 0 ? `Ditimpa dengan data repo: ${changed.join(', ')}.` : 'Sudah sama dengan data repo.');
            }}
            className="text-[11px] text-[var(--brand)] underline underline-offset-2 hover:brightness-110"
          >
            Timpa semua field dengan data repo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title *" error={show('title')}>
          <input className={inputCls} value={v.title} onChange={(e) => set('title', e.target.value)} placeholder="Nama project" maxLength={120} />
        </Field>
        <Field label="Date">
          <input type="date" className={inputCls} value={v.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
      </div>

      <Field label="Description * (maks 500)" error={show('description')}>
        <textarea className={inputCls} rows={3} value={v.description} onChange={(e) => set('description', e.target.value)} placeholder="Satu-dua kalimat menjelaskan project" maxLength={500} />
      </Field>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Type">
          <select className={inputCls} value={v.type} onChange={(e) => set('type', e.target.value)}>
            {['Web', 'Mobile', 'IoT'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select className={inputCls} value={v.category} onChange={(e) => set('category', e.target.value)}>
            {['Personal Project', 'Freelance'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls} value={v.status} onChange={(e) => set('status', e.target.value as 'published' | 'draft')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Order (0 = auto)">
          <input type="number" min={0} max={9999} className={inputCls} value={v.order} onChange={(e) => set('order', Number(e.target.value))} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer select-none">
        <input type="checkbox" checked={v.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-[var(--brand)]" />
        <span className="font-semibold">Featured (tampil besar di atas)</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tech stack (koma)">
          <input
            className={inputCls}
            value={v.techStack.join(', ')}
            onChange={(e) => set('techStack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            placeholder="Next.js, TypeScript, Tailwind"
          />
        </Field>
        <Field label="Features (satu per baris di textarea bawah? koma)">
          <input
            className={inputCls}
            value={v.features.join(', ')}
            onChange={(e) => set('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            placeholder="Realtime sync, Offline mode"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="GitHub URL">
          <input className={inputCls} value={v.github} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/..." inputMode="url" />
        </Field>
        <Field label="Live URL">
          <input className={inputCls} value={v.live} onChange={(e) => set('live', e.target.value)} placeholder="https://..." inputMode="url" />
        </Field>
      </div>

      {/* ── Media URL-only ── */}
      <div className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] space-y-4">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
          Media — URL saja (gratis, tanpa upload)
        </p>
        <Field label="Cover image URL" error={show('coverImage')}>
          <input
            className={inputCls}
            value={v.coverImage}
            onChange={(e) => set('coverImage', e.target.value)}
            placeholder="https://cdn.jsdelivr.net/gh/username/repo@main/cover.webp"
            inputMode="url"
          />
        </Field>
        {!coverOk && <p className={errCls}>Host belum diizinkan — pakai jsDelivr, ImageKit, Cloudinary, Unsplash, Sanity, atau GitHub.</p>}
        {v.coverImage && coverOk && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.coverImage} alt="Preview cover" className="w-full max-h-52 object-cover rounded-md border border-[var(--border-default)]" loading="lazy" />
        )}

        <div>
          <span className={labelCls}>Galeri (maks 8)</span>
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={galleryDraft}
              onChange={(e) => setGalleryDraft(e.target.value)}
              placeholder="Tempel URL foto lalu Tambah"
              inputMode="url"
            />
            <button
              type="button"
              onClick={() => {
                const url = galleryDraft.trim();
                if (!url || v.gallery.length >= 8 || !isAllowedImageUrl(url)) return;
                set('gallery', [...v.gallery, url]);
                setGalleryDraft('');
              }}
              className="px-3 py-2 text-xs font-semibold rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] hover:border-[var(--brand)] shrink-0"
            >
              Tambah
            </button>
          </div>
          {v.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {v.gallery.map((g, i) => (
                <div key={`${g}-${i}`} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt={`Galeri ${i + 1}`} className="w-full h-16 object-cover rounded border border-[var(--border-default)]" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => set('gallery', v.gallery.filter((_, x) => x !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px] opacity-0 group-hover:opacity-100"
                    aria-label={`Hapus galeri ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Demo video — URL YouTube (Unlisted disarankan)" error={show('demoVideo')}>
          <input
            className={inputCls}
            value={v.demoVideo}
            onChange={(e) => set('demoVideo', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            inputMode="url"
          />
        </Field>
        {ytEmbed && (
          <div className="aspect-video w-full overflow-hidden rounded-md border border-[var(--border-default)]">
            <iframe
              src={ytEmbed}
              title="Preview demo video"
              className="w-full h-full"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {v.demoVideo && !ytId && <p className={errCls}>Bukan URL YouTube yang dikenali — embed preview tidak tampil, tapi link tetap disimpan.</p>}
      </div>

      <Field label="Konten (markdown sederhana: ### heading, - list, **bold**)">
        <textarea className={`${inputCls} font-mono`} rows={8} value={v.content} onChange={(e) => set('content', e.target.value)} placeholder={'### Problem & Motivation\nCeritakan masalah...\n\n- **Poin penting**: penjelasan'} />
      </Field>

      {formError && (
        <p role="alert" className="p-3 rounded-md bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger)] text-xs">
          {formError}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        {draft.savedAt && !draft.showBanner && (
          <span className="mr-auto text-[10px] font-mono text-[var(--text-muted)]">
            Draft tersimpan otomatis
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            draft.clear();
            onCancel();
          }}
          className="px-4 py-2 text-xs font-semibold rounded-md border border-[var(--border-default)] hover:border-[var(--brand)]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs font-semibold rounded-md bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110 disabled:opacity-50"
        >
          {saving ? 'Menyimpan…' : 'Simpan project'}
        </button>
      </div>
      </>
      )}
    </form>
  );
}
