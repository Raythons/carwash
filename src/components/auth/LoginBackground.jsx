import React from 'react';

const PawPrint = ({ color, className }) => (
  <svg 
    className={className}
    viewBox="0 0 48.839 48.839" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" 
      fill={color}
    />
  </svg>
);

export const BubbleBackground = () => {
  const pawPrints = [
    // Top Area
    { top: '5%', left: '10%', size: 'w-10 h-10', opacity: 'opacity-25', delay: '0s', duration: '7s', rotate: 'rotate-[45deg]', color: '#4285f4' },
    { top: '8%', right: '15%', size: 'w-8 h-8', opacity: 'opacity-20', delay: '1.2s', duration: '9s', rotate: '-rotate-[10deg]', color: '#ea4335' },
    { top: '3%', left: '33%', size: 'w-9 h-9', opacity: 'opacity-20', delay: '2.8s', duration: '6s', rotate: 'rotate-[200deg]', color: '#fbbc04' },
    { top: '12%', right: '25%', size: 'w-7 h-7', opacity: 'opacity-15', delay: '0.7s', duration: '8s', rotate: '-rotate-[250deg]', color: '#34a853' },
    // Left Side
    { top: '25%', left: '5%', size: 'w-8 h-8', opacity: 'opacity-20', delay: '3.1s', duration: '10s', rotate: 'rotate-[320deg]', color: '#4285f4' },
    { top: '50%', left: '8%', size: 'w-10 h-10', opacity: 'opacity-25', delay: '1.8s', duration: '5s', rotate: '-rotate-[50deg]', color: '#ea4335' },
    { top: '66%', left: '3%', size: 'w-9 h-9', opacity: 'opacity-15', delay: '4.5s', duration: '11s', rotate: 'rotate-[100deg]', color: '#fbbc04' },
    // Right Side
    { top: '20%', right: '10%', size: 'w-9 h-9', opacity: 'opacity-20', delay: '2.3s', duration: '8s', rotate: '-rotate-[60deg]', color: '#34a853' },
    { top: '40%', right: '5%', size: 'w-7 h-7', opacity: 'opacity-20', delay: '0.9s', duration: '12s', rotate: 'rotate-[350deg]', color: '#4285f4' },
    { top: '60%', right: '12%', size: 'w-10 h-10', opacity: 'opacity-25', delay: '3.7s', duration: '6s', rotate: '-rotate-[130deg]', color: '#ea4335' },
    // Bottom Area
    { bottom: '10%', left: '12%', size: 'w-8 h-8', opacity: 'opacity-15', delay: '1.4s', duration: '9s', rotate: 'rotate-[160deg]', color: '#fbbc04' },
    { bottom: '15%', right: '18%', size: 'w-9 h-9', opacity: 'opacity-20', delay: '4.2s', duration: '7s', rotate: '-rotate-[275deg]', color: '#34a853' },
    { bottom: '5%', left: '33%', size: 'w-7 h-7', opacity: 'opacity-20', delay: '2.6s', duration: '10s', rotate: 'rotate-[55deg]', color: '#4285f4' },
    { bottom: '20%', right: '25%', size: 'w-10 h-10', opacity: 'opacity-25', delay: '0.3s', duration: '8s', rotate: '-rotate-[210deg]', color: '#ea4335' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/20" />

      {pawPrints.map((paw, index) => (
        <div 
          key={index} 
          className={`absolute animate-fade-in-out ${paw.size} ${paw.opacity} ${paw.rotate}`}
          style={{
            top: paw.top, 
            left: paw.left, 
            right: paw.right, 
            bottom: paw.bottom,
            animationDuration: paw.duration,
            animationDelay: paw.delay,
          }}
        >
          <PawPrint color={paw.color} className="w-full h-full" />
        </div>
      ))}
    </div>
  );
};
