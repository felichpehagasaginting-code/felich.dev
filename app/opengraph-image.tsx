import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Felich Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          color: 'white',
        }}
      >
        {/* Simple geometric decorations */}
        <div style={{ display: 'flex', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#3b82f6', marginRight: '20px' }}></div>
          <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: '#ec4899' }}></div>
        </div>
        
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
          Felich
        </div>
        <div style={{ fontSize: 36, color: '#a3a3a3', textAlign: 'center', marginBottom: '64px' }}>
          Software Engineer • AI Enthusiast
        </div>
        <div style={{ fontSize: 24, color: '#3b82f6', letterSpacing: '4px', fontWeight: 'bold' }}>
          FELICH.DEV
        </div>
      </div>
    ),
    { ...size }
  );
}
