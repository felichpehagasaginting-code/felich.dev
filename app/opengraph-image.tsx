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
          background: '#0F0F0F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 420,
            height: 420,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06), transparent 70%)',
            borderRadius: 210,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            right: -120,
            width: 520,
            height: 520,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04), transparent 70%)',
            borderRadius: 260,
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            background: '#FFFFFF',
            color: '#0F0F0F',
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '40px',
          }}
        >
          F
        </div>

        <div style={{ fontSize: 96, fontWeight: '700', marginBottom: '16px', textAlign: 'center', letterSpacing: '-2px' }}>
          Felich
        </div>
        <div style={{ fontSize: 32, color: '#A1A1A1', textAlign: 'center', marginBottom: '80px', fontWeight: '500' }}>
          Software Engineer <span style={{ color: '#FFFFFF' }}>&times;</span> AI Enthusiast
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#0F0F0F',
            letterSpacing: '6px',
            fontWeight: '700',
            background: '#FFFFFF',
            padding: '16px 32px',
            borderRadius: '100px',
          }}
        >
          FELICH.DEV
        </div>
      </div>
    ),
    { ...size }
  );
}
