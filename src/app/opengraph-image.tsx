import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Indexa - Organize Your Digital World';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function og() {
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
          position: 'relative',
        }}
      >
        {/* Logo and Text Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '200px',
              height: '200px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                border: '10px solid rgba(255,255,255,0.3)',
                borderRadius: '24px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '25px',
                top: '25px',
                width: '150px',
                height: '150px',
                border: '10px solid rgba(255,255,255,0.5)',
                borderRadius: '20px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50px',
                top: '50px',
                width: '100px',
                height: '100px',
                background: 'white',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
                fontWeight: 800,
                color: '#6366f1',
              }}
            >
              I
            </div>
          </div>

          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '96px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Indexa
            </div>
            <div
              style={{
                fontSize: '42px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '10px',
              }}
            >
              Organize Your Digital World
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Hierarchical information indexing platform
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
