import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Felich Portfolio';
    const description = searchParams.get('description') || 'Software Engineer | AI & FinTech';
    const type = searchParams.get('type') || 'page'; // blog, project, page
    const category = searchParams.get('category') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background Gradient Mesh */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -150,
              left: -150,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#3b82f6',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {type === 'blog' ? '📝 Article' : type === 'project' ? '🚀 Project' : '🌐 Felich.dev'}
              {category ? ` • ${category}` : ''}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '24px',
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: '#a3a3a3',
              lineHeight: 1.4,
              maxWidth: '800px',
              marginBottom: '48px',
              display: 'flex',
            }}
          >
            {description}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '32px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginRight: '16px',
              }}
            >
              F
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Felich</span>
              <span style={{ fontSize: '14px', color: '#737373' }}>felich.dev</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
