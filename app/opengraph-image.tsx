import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LLM Cost Calculator';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #030712, #111827, #030712)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
              borderRadius: '12px',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60A5FA, #A78BFA)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            LLM Cost Calculator
          </div>
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#9CA3AF',
            display: 'flex',
          }}
        >
          Compare AI API costs across all major providers
        </div>
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            gap: '24px',
          }}
        >
          {['OpenAI', 'Anthropic', 'Google', 'Mistral', 'DeepSeek'].map((provider) => (
            <div
              key={provider}
              style={{
                padding: '12px 24px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#60A5FA',
                fontSize: '20px',
                display: 'flex',
              }}
            >
              {provider}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
