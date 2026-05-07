import React from 'react';

export default function RecommendationDisplay({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`space-${i}`} style={{ height: '10px' }} />);
      i++;
      continue;
    }

    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const text2 = trimmed.replace(/^#{1,3}\s+/, '');
      elements.push(
        <div key={i} style={{
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: '20px', fontWeight: 700,
          background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginTop: '28px', marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid #C9A84C22',
        }}>
          {text2}
        </div>
      );
      i++;
      continue;
    }

    if (/^\d+[.)]\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)/)[1];
      const content = trimmed.replace(/^\d+[.)]\s+/, '');
      elements.push(
        <div key={i} style={{
          display: 'flex', gap: '14px', alignItems: 'flex-start',
          marginBottom: '12px',
        }}>
          <div style={{
            minWidth: '28px', height: '28px',
            background: 'linear-gradient(135deg, #6B0F1A, #9B1A2A)',
            border: '1px solid #C9A84C55', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cinzel', serif", fontSize: '11px', color: '#F0D080',
            flexShrink: 0, marginTop: '2px',
          }}>
            {num}
          </div>
          <div style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '17px', color: '#D4C4A0', lineHeight: 1.8,
          }}>
            {renderInline(content)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    if (/^[-*•]\s/.test(trimmed)) {
      const content = trimmed.replace(/^[-*•]\s+/, '');
      elements.push(
        <div key={i} style={{
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          marginBottom: '9px', paddingLeft: '8px',
        }}>
          <span style={{ color: '#C9A84C', marginTop: '6px', fontSize: '10px', flexShrink: 0 }}>✦</span>
          <div style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '17px', color: '#C4A87A', lineHeight: 1.8,
          }}>
            {renderInline(content)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    if (/^[-_]{3,}$/.test(trimmed)) {
      elements.push(
        <div key={i} style={{
          height: '1px', margin: '20px 0',
          background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)',
        }} />
      );
      i++;
      continue;
    }

    elements.push(
      <div key={i} style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: '17px', color: '#D4C4A0',
        lineHeight: 1.9, marginBottom: '8px',
      }}>
        {renderInline(trimmed)}
      </div>
    );
    i++;
  }

  return <div>{elements}</div>;
}

function renderInline(text) {
  if (!text) return null;

  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }

    const raw = match[0];

    if (raw.startsWith('**')) {
      parts.push(
        <strong key={match.index} style={{ color: '#F0D080', fontStyle: 'normal' }}>
          {raw.slice(2, -2)}
        </strong>
      );
    } else if (raw.startsWith('*')) {
      parts.push(
        <em key={match.index} style={{ color: '#C9A84C', fontStyle: 'italic' }}>
          {raw.slice(1, -1)}
        </em>
      );
    } else if (raw.startsWith('`')) {
      parts.push(
        <code key={match.index} style={{
          background: '#C9A84C18',
          border: '1px solid #C9A84C33',
          borderRadius: '4px', padding: '1px 8px',
          fontFamily: 'monospace', fontSize: '14px', color: '#F0D080',
        }}>
          {raw.slice(1, -1)}
        </code>
      );
    }

    last = match.index + raw.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}