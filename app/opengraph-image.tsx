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
          background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)',
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
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), transparent)',
            borderRadius: 200,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            background: 'linear-gradient(to top left, rgba(236, 72, 153, 0.2), transparent)',
            borderRadius: 250,
          }}
        />

        {/* Profile / Brand icon */}
        <div style={{ display: 'flex', marginBottom: '40px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', 
            borderRadius: '24px', 
            background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', 
            marginRight: '20px',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.5)'
          }}></div>
          <div style={{ 
            width: '80px', height: '80px', 
            borderRadius: '40px', 
            background: 'linear-gradient(to top left, #ec4899, #f43f5e)',
            boxShadow: '0 20px 40px rgba(236, 72, 153, 0.5)'
          }}></div>
        </div>
        
        <div style={{ fontSize: 96, fontWeight: '900', marginBottom: '16px', textAlign: 'center', letterSpacing: '-2px' }}>
          Felich
        </div>
        <div style={{ fontSize: 36, color: '#e5e5e5', textAlign: 'center', marginBottom: '80px', fontWeight: '500' }}>
          Software Engineer <span style={{ color: '#3b82f6', margin: '0 16px' }}>&times;</span> AI Enthusiast
        </div>

        <div style={{ 
          display: 'flex',
          fontSize: 24, 
          color: '#3b82f6', 
          letterSpacing: '6px', 
          fontWeight: 'bold',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '16px 32px',
          borderRadius: '100px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          FELICH.DEV
        </div>
      </div>
    ),
    { ...size }
  );
}
