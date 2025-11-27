export default function SecurityIllustration() {
  return (
    <svg viewBox="0 0 400 500" className="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
      {/* Background - Light gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Decorative Background Circles */}
      <circle cx="50" cy="100" r="80" fill="url(#bgGradient)" opacity="0.2" />
      <circle cx="350" cy="400" r="100" fill="url(#bgGradient)" opacity="0.15" />

      {/* Store Building */}
      <g>
        {/* Building Wall */}
        <rect x="100" y="150" width="200" height="200" fill="#1e3a5f" stroke="#2563EB" strokeWidth="2" rx="8" />

        {/* Building Roof */}
        <polygon points="100,150 200,80 300,150" fill="#2563EB" opacity="0.6" />

        {/* Door Frame */}
        <rect x="150" y="220" width="100" height="130" fill="#0f172a" stroke="#FF6B35" strokeWidth="3" rx="4" />

        {/* Door Handle */}
        <circle cx="240" cy="285" r="6" fill="#FF6B35" />
      </g>

      {/* Person Walking Towards Door */}
      <g>
        {/* Head */}
        <circle cx="130" cy="260" r="20" fill="#FFD4A3" />
        {/* Hair */}
        <path d="M 115 255 Q 120 245 130 243 Q 140 245 145 255" fill="#1e293b" />
        {/* Body */}
        <rect x="117" y="282" width="26" height="45" rx="4" fill="#3B82F6" />
        {/* Left Arm (swinging forward) */}
        <line x1="117" y1="290" x2="100" y2="310" stroke="#FFD4A3" strokeWidth="7" strokeLinecap="round" />
        {/* Right Arm (swinging back) */}
        <line x1="143" y1="290" x2="155" y2="275" stroke="#FFD4A3" strokeWidth="7" strokeLinecap="round" />
        {/* Left Leg (stepping forward) */}
        <line x1="122" y1="327" x2="115" y2="355" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" />
        {/* Right Leg (behind) */}
        <line x1="137" y1="327" x2="145" y2="350" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" />
        {/* Left Shoe */}
        <ellipse cx="115" cy="357" rx="9" ry="5" fill="#0f172a" />
        {/* Right Shoe */}
        <ellipse cx="145" cy="352" rx="9" ry="5" fill="#0f172a" />
        {/* Shopping Bag */}
        <rect x="98" y="308" width="14" height="16" rx="2" fill="#FF6B35" opacity="0.9" />
        <path d="M 100 308 Q 105 303 110 308" fill="none" stroke="#FF6B35" strokeWidth="1.5" />
      </g>

      {/* Welcome Arrow/Path */}
      <g opacity="0.4">
        <path
          d="M 120 380 Q 150 370 170 300"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="2"
          strokeDasharray="5,5"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#FF6B35" />
          </marker>
        </defs>
      </g>

      {/* Welcome Text */}
      <g>
        <text x="200" y="50" fontSize="20" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
          Selamat Datang
        </text>
        <text x="200" y="75" fontSize="14" fill="#94a3b8" textAnchor="middle">
          Masuk ke Toko Anda
        </text>
      </g>

      {/* Store Sign */}
      <g>
        <rect x="140" y="120" width="120" height="30" fill="#FF6B35" rx="4" />
        <text x="200" y="142" fontSize="16" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
          MyStore
        </text>
      </g>

      {/* Decorative Stars/Sparkles */}
      <g opacity="0.5" fill="#FF6B35">
        <circle cx="320" cy="120" r="3" />
        <circle cx="280" cy="200" r="2" />
        <circle cx="340" cy="280" r="2.5" />
      </g>
    </svg>
  )
}
