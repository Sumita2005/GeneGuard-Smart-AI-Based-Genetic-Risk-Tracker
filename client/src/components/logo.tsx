export default function Logo() {
  return (
    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
      <svg 
        viewBox="0 0 24 24" 
        className="w-5 h-5 text-white"
        fill="none"
      >
        {/* Shield outline */}
        <path d="M12 2L4 6V10C4 16 7.36 21.09 12 22C16.64 21.09 20 16 20 10V6L12 2Z" 
              stroke="white" 
              strokeWidth="1.5" 
              fill="rgba(255,255,255,0.1)"/>
        
        {/* DNA Helix inside shield */}
        <g transform="translate(12,12)" stroke="white" strokeWidth="1" fill="white">
          {/* DNA strands */}
          <path d="M-2,-4 Q0,-2 2,0 Q0,2 -2,4" fill="none" strokeWidth="0.8"/>
          <path d="M2,-4 Q0,-2 -2,0 Q0,2 2,4" fill="none" strokeWidth="0.8"/>
          
          {/* Base pairs */}
          <circle cx="-1.5" cy="-3" r="0.5"/>
          <circle cx="1.5" cy="-3" r="0.5"/>
          <circle cx="0" cy="-1" r="0.5"/>
          <circle cx="0" cy="1" r="0.5"/>
          <circle cx="-1.5" cy="3" r="0.5"/>
          <circle cx="1.5" cy="3" r="0.5"/>
          
          {/* Connecting lines */}
          <line x1="-1.5" y1="-3" x2="1.5" y2="-3" strokeWidth="0.5"/>
          <line x1="-1.5" y1="3" x2="1.5" y2="3" strokeWidth="0.5"/>
        </g>
      </svg>
    </div>
  );
}