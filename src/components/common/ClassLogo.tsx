import React from 'react';

interface ClassLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  withText?: boolean;
}

export const ClassLogo: React.FC<ClassLogoProps> = ({
  size = 'md',
  className = '',
  withText = false
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 20 },
    md: { box: 'w-12 h-12', icon: 28 },
    lg: { box: 'w-16 h-16', icon: 38 },
    xl: { box: 'w-24 h-24', icon: 56 },
    '2xl': { box: 'w-32 h-32', icon: 76 }
  };

  const { box } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Emblem Logo */}
      <div
        className={`${box} rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 p-0.5 shadow-xl shadow-emerald-700/20 flex items-center justify-center shrink-0 transition-transform hover:scale-105`}
      >
        <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 rounded-full blur-md pointer-events-none" />
          
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[72%] h-[72%] drop-shadow-md"
          >
            {/* Open Book Base */}
            <path
              d="M15 72C22 66 35 65 50 70C65 65 78 66 85 72V42C78 36 65 35 50 40C35 35 22 36 15 42V72Z"
              fill="white"
              fillOpacity="0.95"
            />
            <path
              d="M50 40V70"
              stroke="#0d9488"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Book Pages Lines */}
            <path
              d="M24 50C31 46 39 46 45 49M24 58C31 54 39 54 45 57"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M76 50C69 46 61 46 55 49M76 58C69 54 61 54 55 57"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Graduation Cap (Mũ Cử Nhân) */}
            <path
              d="M50 14L86 28L50 42L14 28L50 14Z"
              fill="#FEF08A"
              stroke="#CA8A04"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M26 33V47C26 54 37 60 50 60C63 60 74 54 74 47V33"
              stroke="#EAB308"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Golden Tassel */}
            <path
              d="M50 28L80 38V52"
              stroke="#FDE047"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="80" cy="53" r="2.5" fill="#EAB308" />

            {/* Little Star on top */}
            <path
              d="M50 6L52 10L56 10.5L53 13.5L54 17.5L50 15.5L46 17.5L47 13.5L44 10.5L48 10L50 6Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="font-black text-slate-800 tracking-tight text-lg sm:text-xl leading-none">
            QUẢN LÝ LỚP HỌC
          </span>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mt-1">
            Chủ nhiệm & Thi đua nề nếp
          </span>
        </div>
      )}
    </div>
  );
};
