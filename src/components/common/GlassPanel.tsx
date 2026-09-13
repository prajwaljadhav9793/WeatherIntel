import React, { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  subtle?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  subtle = false,
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${
        subtle
          ? 'glass-panel-subtle'
          : 'glass-panel'
      } ${onClick ? 'cursor-pointer hover:border-[#5BBFEF]/60 hover:shadow-lg' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
