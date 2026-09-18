'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
          <h1>Terjadi kesalahan</h1>
          <p>Maaf, ada yang tidak beres. Error sudah tercatat otomatis.</p>
          <button
            onClick={() => reset()}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
