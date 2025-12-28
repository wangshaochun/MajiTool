import React from "react";

export const PercentIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="percentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="50" fill="white" fillOpacity="0.8" filter="url(#softShadow)" />
    <g filter="url(#softShadow)">
      <circle cx="40" cy="40" r="12" stroke="url(#percentGrad)" strokeWidth="8" fill="none" />
      <path d="M80 40L40 80" stroke="url(#percentGrad)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="80" cy="80" r="12" stroke="url(#percentGrad)" strokeWidth="8" fill="none" />
    </g>
    {/* Cute Face */}
    <circle cx="52" cy="58" r="2" fill="#4B5563" />
    <circle cx="68" cy="58" r="2" fill="#4B5563" />
    <path d="M56 68C56 68 58 71 60 71C62 71 64 68 64 68" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
    <circle cx="48" cy="62" r="3" fill="#FDA4AF" fillOpacity="0.5" />
    <circle cx="72" cy="62" r="3" fill="#FDA4AF" fillOpacity="0.5" />
  </svg>
);

export const PasswordIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="softShadowLock" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="50" fill="white" fillOpacity="0.8" filter="url(#softShadowLock)" />
    <g filter="url(#softShadowLock)">
      <rect x="35" y="55" width="50" height="40" rx="10" fill="url(#lockGrad)" />
      <path d="M45 55V45C45 36.7157 51.7157 30 60 30C68.2843 30 75 36.7157 75 45V55" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" />
      <circle cx="60" cy="75" r="5" fill="white" />
    </g>
    {/* Cute Face */}
    <circle cx="52" cy="70" r="2" fill="#92400E" />
    <circle cx="68" cy="70" r="2" fill="#92400E" />
    <path d="M58 78C58 78 59 80 60 80C61 80 62 78 62 78" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DeathIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <filter id="softShadowDeath" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="50" fill="white" fillOpacity="0.8" filter="url(#softShadowDeath)" />
    <g filter="url(#softShadowDeath)">
      <path d="M40 35H80L75 55C75 55 60 60 60 60C60 60 45 55 45 55L40 35Z" fill="url(#deathGrad)" fillOpacity="0.2" stroke="url(#deathGrad)" strokeWidth="4" />
      <path d="M40 85H80L75 65C75 65 60 60 60 60C60 60 45 65 45 65L40 85Z" fill="url(#deathGrad)" fillOpacity="0.6" stroke="url(#deathGrad)" strokeWidth="4" />
      <rect x="35" y="30" width="50" height="5" rx="2.5" fill="url(#deathGrad)" />
      <rect x="35" y="85" width="50" height="5" rx="2.5" fill="url(#deathGrad)" />
    </g>
    {/* Cute Face */}
    <circle cx="55" cy="60" r="2" fill="#4B5563" />
    <circle cx="65" cy="60" r="2" fill="#4B5563" />
    <path d="M58 65C58 65 59 66 60 66C61 66 62 65 62 65" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BodyFatIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <filter id="softShadowFat" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="50" fill="white" fillOpacity="0.8" filter="url(#softShadowFat)" />
    <g filter="url(#softShadowFat)">
      <rect x="35" y="40" width="50" height="50" rx="12" fill="url(#fatGrad)" fillOpacity="0.1" stroke="url(#fatGrad)" strokeWidth="6" />
      <rect x="45" y="48" width="30" height="15" rx="4" fill="white" />
      <path d="M60 63V53" stroke="url(#fatGrad)" strokeWidth="3" strokeLinecap="round" />
    </g>
    {/* Cute Face */}
    <circle cx="52" cy="75" r="2" fill="#065F46" />
    <circle cx="68" cy="75" r="2" fill="#065F46" />
    <path d="M56 82C56 82 58 85 60 85C62 85 64 82 64 82" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
    <circle cx="48" cy="78" r="3" fill="#A7F3D0" fillOpacity="0.6" />
    <circle cx="72" cy="78" r="3" fill="#A7F3D0" fillOpacity="0.6" />
  </svg>
);
