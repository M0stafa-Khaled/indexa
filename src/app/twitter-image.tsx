import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Indexa';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function twitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '180px',
              height: '180px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                border: '9px solid rgba(255,255,255,0.3)',
                borderRadius: '22px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '22px',
                top: '22px',
                width: '136px',
                height: '136px',
                border: '9px solid rgba(255,255,255,0.5)',
                borderRadius: '18px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '45px',
                top: '45px',
                width: '90px',
                height: '90px',
                background: 'white',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                fontWeight: 800,
                color: '#6366f1',
              }}
            >
              I
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '86px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '15px',
              }}
            >
              Indexa
            </div>
            <div
              style={{
                fontSize: '38px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              Organize Your Digital World
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
