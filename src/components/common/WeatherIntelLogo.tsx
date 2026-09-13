import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const WeatherIntelLogo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconDimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Abstract combination of cloud + location pin + atmospheric wave signal */}
      <div className={`relative ${iconDimensions} rounded-xl bg-gradient-to-br from-[#087E9B] to-[#07556B] flex items-center justify-center shadow-md shadow-[#087E9B]/20 border border-white/40 flex-shrink-0`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 text-white"
        >
          {/* Atmospheric radar pulse circles */}
          <circle cx="18" cy="18" r="14" stroke="#5BBFEF" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.6" />
          <circle cx="18" cy="18" r="9" stroke="#25BFA5" strokeWidth="1.2" opacity="0.4" />
          
          {/* Stylized Cloud Body */}
          <path
            d="M11 20C9.34315 20 8 18.6569 8 17C8 15.4542 9.16786 14.1819 10.6698 14.0207C11.1685 11.7197 13.2147 10 15.6667 10C17.7547 10 19.5518 11.2505 20.2796 13.0422C20.6631 12.8715 21.0886 12.7778 21.5333 12.7778C23.1902 12.7778 24.5333 14.121 24.5333 15.7778C24.5333 16.0357 24.501 16.2863 24.4402 16.525C25.3615 17.0694 26 18.0645 26 19.2222C26 20.8791 24.6569 22.2222 23 22.2222H11"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Location Pin Point with Signal Dot */}
          <path
            d="M18 16V26"
            stroke="#5BBFEF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="18" cy="27.5" r="1.8" fill="#5BBFEF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-[#12313D] ${titleSize}`}>
            WEATHER<span className="text-[#087E9B]">INTEL</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EAF7FD] text-[#087E9B] border border-[#D8EAF0]">
            INDIA
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium tracking-normal text-[#607B86]">
            National Big Data Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
