export default function appleIcon() {
  return new Response(
    `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="40" fill="url(#grad)"/>
      <g transform="translate(90, 90)">
        <rect x="-50" y="-50" width="100" height="100" rx="10" fill="none" stroke="white" stroke-width="6" opacity="0.3"/>
        <rect x="-35" y="-35" width="70" height="70" rx="8" fill="none" stroke="white" stroke-width="6" opacity="0.5"/>
        <rect x="-22" y="-22" width="44" height="44" rx="6" fill="white" opacity="0.9"/>
        <text x="0" y="8" font-family="system-ui, sans-serif" font-size="36" font-weight="800" fill="#6366f1" text-anchor="middle">I</text>
      </g>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
