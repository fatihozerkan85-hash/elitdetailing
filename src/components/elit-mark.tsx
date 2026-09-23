export function ElitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 72"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="elit-gold" x1="8" y1="4" x2="56" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E0A8" />
          <stop offset="0.45" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#8A6A12" />
        </linearGradient>
      </defs>
      <path
        d="M32 3.5L56.5 13.2v24.6c0 14.8-11.2 26.6-24.5 31.2C19 64.4 7.5 52.6 7.5 37.8V13.2L32 3.5Z"
        stroke="url(#elit-gold)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M32 10.2L50.2 17.4v18.8c0 11.2-8.3 20.4-18.2 24.1C22.1 56.6 13.8 47.4 13.8 36.2V17.4L32 10.2Z"
        stroke="url(#elit-gold)"
        strokeWidth="1.15"
        strokeOpacity="0.55"
      />
      <path
        d="M16 41.5c1.8-1.4 6.2-6.2 9.4-8.4 2.2-1.5 4.1-1.8 7.6-1.8h9.2c2.4 0 3.7.4 5.2 1.6 1.8 1.4 4.4 4.6 5.6 6.2v2.4c0 1.2-.8 2.2-2 2.4h-2.2c-.4 2.6-2.4 4.6-5 4.6-2.6 0-4.6-2-5-4.6H28.4c-.4 2.6-2.4 4.6-5 4.6s-4.6-2-5-4.6H18c-1.2-.2-2-1.2-2-2.4v-3.4Z"
        fill="url(#elit-gold)"
      />
      <path
        d="M26.8 31.4c1.6-3.6 4.1-6.2 7.4-7.4 1.1-.4 2.2.4 2.2 1.6v4.2c0 .9-.6 1.6-1.5 1.6H28c-.8 0-1.4-.7-1.2-1.5Z"
        fill="url(#elit-gold)"
      />
      <circle cx="23.4" cy="46.2" r="2.15" fill="#0B0C0E" stroke="url(#elit-gold)" strokeWidth="1.1" />
      <circle cx="43.4" cy="46.2" r="2.15" fill="#0B0C0E" stroke="url(#elit-gold)" strokeWidth="1.1" />
    </svg>
  );
}
