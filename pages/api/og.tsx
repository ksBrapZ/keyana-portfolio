import { ImageResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get title and date from query parameters
    const title = searchParams.get('title') || 'Blog Post';
    const date = searchParams.get('date') || '';
    
    // Font handling
    const interFont = await fetch(
      new URL('../../public/fonts/Inter-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    
    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: 'linear-gradient(to bottom, #1e1e2e, #2c2c3a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            color: 'white',
            fontFamily: 'Inter',
            position: 'relative',
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
            }}
          />
          
          {/* Text content */}
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              textAlign: 'center',
              maxWidth: '900px',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          
          {date && (
            <div
              style={{
                fontSize: '32px',
                opacity: 0.8,
                marginTop: '20px',
              }}
            >
              {date}
            </div>
          )}
          
          {/* Author info */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                opacity: 0.8,
              }}
            >
              Keyana Sapp
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interFont,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    console.error(`Error generating OG image: ${e}`);
    return new Response(`Error generating image`, {
      status: 500,
    });
  }
} 