export function PanelVerseLogo({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Background gradient */}
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B8CFF" />
          <stop offset="100%" stopColor="#4A70DB" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#bg)" />

      {/* P letter */}
      <path
        d="M35 25 
           L35 75
           M35 25 
           L60 25
           C70 25 75 32 75 40
           C75 48 70 55 60 55
           L35 55"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}