'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface DraftMeta<T> {
  value: T;
  savedAt: string;
}

function readDraft<T>(key: string): DraftMeta<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DraftMeta<T>;
  } catch {
    return null;
  }
}

/**
 * Autosave nilai form ke localStorage (debounce) + banner restore.
 *
 * - `key`: unik per entitas, mis. `admin-project-draft:<slug|new>`.
 * - `value`: nilai form saat ini (disimpan otomatis).
 * - `baseline`: nilai awal dari server — banner hanya muncul bila draft beda dari baseline.
 */
export function useFormDraft<T>(key: string | null, value: T, baseline: T, delay = 800) {
  const [meta, setMeta] = useState<DraftMeta<T> | null>(() => (key ? readDraft<T>(key) : null));
  const [dismissed, setDismissed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baselineJson = JSON.stringify(baseline);
  const valueJson = JSON.stringify(value);

  // Muat ulang bila key berganti (pindah create ↔ edit project lain)
  useEffect(() => {
    setMeta(key ? readDraft<T>(key) : null);
    setDismissed(false);
  }, [key]);

  // Simpan otomatis (debounce), lewati bila sama dengan baseline agar tidak menumpuk draft kosong
  useEffect(() => {
    if (!key || typeof window === 'undefined') return;
    if (valueJson === baselineJson) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        const m: DraftMeta<T> = { value: JSON.parse(valueJson) as T, savedAt: new Date().toISOString() };
        window.localStorage.setItem(key, JSON.stringify(m));
        setMeta((prev) => (JSON.stringify(prev?.value) === valueJson ? prev : m));
      } catch {
        /* storage penuh / non-serializable — abaikan */
      }
    }, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [key, valueJson, baselineJson, delay]);

  const clear = useCallback(() => {
    if (key && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* abaikan */
      }
    }
    setMeta(null);
    setDismissed(false);
  }, [key]);

  const showBanner =
    !dismissed && meta !== null && JSON.stringify(meta.value) !== baselineJson && JSON.stringify(meta.value) !== valueJson;

  return {
    /** Nilai draft tersimpan (null bila tidak ada). */
    draftValue: meta?.value ?? null,
    savedAt: meta?.savedAt ?? null,
    showBanner,
    /** Pakai draft sebagai nilai form — return nilainya agar parent setState. */
    restore: () => meta?.value ?? null,
    dismiss: () => setDismissed(true),
    clear,
  };
}
