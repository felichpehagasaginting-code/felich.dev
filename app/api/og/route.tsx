import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ThemeKey = 'vanilla' | 'noir' | 'violet';

const THEME_PALETTE: Record<ThemeKey, {
  bg: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  brand: string;
  brandBg: string;
}> = {
  vanilla: {
    bg: '#EAF4CE',
    surface: '#FAFFEB',
    textPrimary: '#121410',
    textMuted: '#525844',
    border: 'rgba(107, 136, 31, 0.35)',
    brand: '#556B14',
    brandBg: 'rgba(107, 136, 31, 0.12)',
  },
  noir: {
    bg: '#202025',
    surface: '#2B2B31',
    textPrimary: '#F2F2F5',
    textMuted: '#A6A6B0',
    border: 'rgba(212, 212, 220, 0.18)',
    brand: '#CDCDD6',
    brandBg: 'rgba(205, 205, 214, 0.12)',
  },
  violet: {
    bg: '#EFEBFA',
    surface: '#F7F5FF',
    textPrimary: '#241F3D',
    textMuted: '#6B6394',
    border: 'rgba(139, 122, 207, 0.35)',
    brand: '#7C6FC4',
    brandBg: 'rgba(210, 195, 246, 0.35)',
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Felich Portfolio';
    const description = searchParams.get('description') || 'Software Engineer | AI & FinTech';
    const type = searchParams.get('type') || 'page'; // blog, project, page
    const category = searchParams.get('category') || '';
    const themeParam = searchParams.get('theme') as ThemeKey | null;
    const theme = THEME_PALETTE[themeParam as ThemeKey] ? (themeParam as ThemeKey) : 'noir';
    const palette = THEME_PALETTE[theme];

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
            backgroundColor: palette.bg,
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Ambient orb */}
          <div
            style={{
              position: 'absolute',
              top: -120,
              right: -100,
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${palette.brandBg} 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              borderRadius: '9999px',
              backgroundColor: palette.brandBg,
              border: `1px solid ${palette.border}`,
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: palette.brand,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {type === 'blog' ? 'Article' : type === 'project' ? 'Project' : 'Felich.dev'}
              {category ? ` • ${category}` : ''}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: palette.textPrimary,
              lineHeight: 1.1,
              marginBottom: '24px',
              maxWidth: '900px',
              display: 'flex',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: palette.textMuted,
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
              borderTop: `1px solid ${palette.border}`,
              paddingTop: '32px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: palette.brand,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: palette.bg,
                marginRight: '16px',
              }}
            >
              F
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: palette.textPrimary }}>Felich</span>
              <span style={{ fontSize: '14px', color: palette.textMuted }}>felich.dev</span>
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
