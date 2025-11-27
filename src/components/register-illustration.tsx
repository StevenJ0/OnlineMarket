export default function FormFillingIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-sm" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="200" cy="200" r="180" fill="rgba(59, 130, 246, 0.05)" opacity="0.3" />

      {/* Store Counter */}
      <rect
        x="80"
        y="220"
        width="240"
        height="100"
        rx="8"
        fill="rgba(30, 41, 59, 0.3)"
        stroke="rgba(34, 197, 94, 0.3)"
        strokeWidth="2"
      />

      {/* Paper/Form on Counter */}
      <rect
        x="110"
        y="140"
        width="180"
        height="120"
        rx="4"
        fill="#1e293b"
        stroke="rgba(148, 163, 184, 0.4)"
        strokeWidth="2"
      />

      {/* Form Lines */}
      <line x1="130" y1="160" x2="270" y2="160" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />
      <line x1="130" y1="180" x2="270" y2="180" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />
      <line x1="130" y1="200" x2="220" y2="200" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />
      <line x1="130" y1="220" x2="270" y2="220" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />

      {/* Person Standing at Counter */}
      <g>
        {/* Head */}
        <circle cx="100" cy="100" r="22" fill="#FFD4A3" />
        {/* Hair */}
        <path d="M 80 95 Q 85 80 100 78 Q 115 80 120 95" fill="#1e293b" />
        {/* Body */}
        <rect x="85" y="125" width="30" height="50" rx="4" fill="#3B82F6" />
        {/* Left Arm holding pen */}
        <line x1="85" y1="135" x2="60" y2="160" stroke="#FFD4A3" strokeWidth="8" strokeLinecap="round" />
        <circle cx="55" cy="165" r="5" fill="#FF6B35" /> {/* Pen tip */}
        {/* Right Arm */}
        <line x1="115" y1="135" x2="140" y2="130" stroke="#FFD4A3" strokeWidth="8" strokeLinecap="round" />
        {/* Left Leg */}
        <line x1="92" y1="175" x2="85" y2="210" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" />
        {/* Right Leg */}
        <line x1="108" y1="175" x2="115" y2="210" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" />
        {/* Left Shoe */}
        <ellipse cx="85" cy="213" rx="10" ry="6" fill="#0f172a" />
        {/* Right Shoe */}
        <ellipse cx="115" cy="213" rx="10" ry="6" fill="#0f172a" />
      </g>

      {/* Person on Right - Reviewing Form */}
      <g>
        {/* Head */}
        <circle cx="280" cy="110" r="20" fill="#FFD4A3" />

        {/* Hair */}
        <path d="M 263 105 Q 268 92 280 91 Q 292 92 297 105" fill="#1e293b" />

        {/* Body */}
        <rect x="267" y="133" width="26" height="48" rx="4" fill="#10B981" />

        {/* Left Arm pointing at form */}
        <line x1="267" y1="142" x2="235" y2="170" stroke="#FFD4A3" strokeWidth="7" strokeLinecap="round" />

        {/* Right Arm */}
        <line x1="293" y1="142" x2="315" y2="155" stroke="#FFD4A3" strokeWidth="7" strokeLinecap="round" />

        {/* Left Leg */}
        <line x1="273" y1="181" x2="265" y2="215" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

        {/* Right Leg */}
        <line x1="287" y1="181" x2="298" y2="215" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

        {/* Left Shoe */}
        <ellipse cx="265" cy="218" rx="9" ry="6" fill="#0f172a" />

        {/* Right Shoe */}
        <ellipse cx="298" cy="218" rx="9" ry="6" fill="#0f172a" />
      </g>

      {/* Checkmark / Approval Icon */}
      <g>
        <circle cx="340" cy="160" r="28" fill="rgba(34, 197, 94, 0.2)" stroke="#22C55E" strokeWidth="2" />
        <path
          d="M 330 160 L 340 170 L 355 150"
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Decorative Stars */}
      <circle cx="50" cy="80" r="3" fill="#FF6B35" opacity="0.6" />
      <circle cx="320" cy="280" r="2" fill="#3B82F6" opacity="0.5" />
      <circle cx="100" cy="320" r="2.5" fill="#FF6B35" opacity="0.4" />

      {/* Text Elements */}
      <text x="200" y="50" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">
        Isi Formulir
      </text>
      <text x="200" y="75" fontSize="14" fill="rgba(203, 213, 225, 0.6)" textAnchor="middle">
        Lengkapi data dengan benar
      </text>
    </svg>
  )
}
