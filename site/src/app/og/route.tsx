/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site.config';

export const runtime = 'edge';
export const preferredRegion = 'fra1';

export async function GET() {
  const desc = siteConfig.description;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background: 'linear-gradient(135deg, #0a0b14 0%, #1a1b2e 100%)',
          color: 'white',
          fontSize: 48,
          fontFamily: 'Inter, system-ui, Arial',
        }}
      >
        <div style={{ 
          fontSize: 64, 
          fontWeight: 900, 
          background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: 32
        }}>
          {siteConfig.name}
        </div>
        <div style={{ fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>{siteConfig.tagline}</div>
        <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 32, lineHeight: 1.3 }}>{desc}</div>
        <div style={{ fontSize: 22, opacity: 0.7 }}>
          {siteConfig.url.replace('https://', '')}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
