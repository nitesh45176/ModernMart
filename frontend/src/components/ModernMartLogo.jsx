const ModernMartLogo = ({ width = 400, height = 80 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
          <stop offset="50%" stopColor="#14b8a6" stopOpacity={1} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
        </linearGradient>
        
        <linearGradient id="martGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
        </linearGradient>
        
        <filter id="textShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="rgba(0,0,0,0.2)"/>
        </filter>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Modern text with stylish effects */}
      <text x="20" y="50" 
            fontFamily="'Segoe UI', 'Roboto', sans-serif" 
            fontSize="38" 
            fontWeight="900" 
            fill="url(#modernGradient)" 
            filter="url(#glow)"
            letterSpacing="2px">
        MODERN
      </text>
      
      {/* Mart text with different styling */}
      <text x="220" y="50" 
            fontFamily="'Segoe UI', 'Roboto', sans-serif" 
            fontSize="38" 
            fontWeight="300" 
            fill="url(#martGradient)" 
            filter="url(#textShadow)"
            letterSpacing="1px"
            fontStyle="italic">
        Mart
      </text>
      
      {/* Stylish geometric accent */}
      <path d="M 340 25 L 355 25 L 355 40 L 370 40 L 370 55 L 340 55 Z" 
            fill="url(#modernGradient)" 
            opacity="0.8"/>
      
      {/* Decorative line */}
      <line x1="20" y1="60" x2="200" y2="60" 
            stroke="url(#modernGradient)" 
            strokeWidth="2" 
            opacity="0.6"/>
    </svg>
  );
};

export default ModernMartLogo;