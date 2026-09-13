import React from 'react';
import { VerificationStatus, AlertSeverity } from '../../types';

interface StatusBadgeProps {
  status: VerificationStatus | AlertSeverity | 'Trusted' | 'Monitoring' | 'Restricted' | 'Operational' | 'Warning' | 'Offline';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', pulse = false }) => {
  let bg = 'bg-[#EAF7FD]';
  let text = 'text-[#087E9B]';
  let border = 'border-[#D8EAF0]';
  let dotColor = 'bg-[#087E9B]';

  // Green ONLY communicates verified / safe / operational / trusted
  if (status === 'Verified' || status === 'Trusted' || status === 'Operational') {
    bg = 'bg-[#2AA66F]/10';
    text = 'text-[#2AA66F]';
    border = 'border-[#2AA66F]/25';
    dotColor = 'bg-[#2AA66F]';
  }
  // Amber ONLY communicates warnings / under review / monitoring / moderate / high
  else if (status === 'Under Review' || status === 'Monitoring' || status === 'Warning' || status === 'High' || status === 'Moderate') {
    bg = 'bg-[#E7A23B]/10';
    text = 'text-[#E7A23B]';
    border = 'border-[#E7A23B]/25';
    dotColor = 'bg-[#E7A23B]';
  }
  // Red ONLY communicates critical / suspicious / restricted / offline
  else if (status === 'Critical' || status === 'Suspicious' || status === 'Restricted' || status === 'Offline') {
    bg = 'bg-[#E45C5C]/10';
    text = 'text-[#E45C5C]';
    border = 'border-[#E45C5C]/25';
    dotColor = 'bg-[#E45C5C]';
  }
  // Neutral / duplicate / info
  else if (status === 'Duplicate' || status === 'Information') {
    bg = 'bg-[#607B86]/10';
    text = 'text-[#607B86]';
    border = 'border-[#607B86]/25';
    dotColor = 'bg-[#607B86]';
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${text} ${border} ${paddingClass} tracking-wide whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulse ? 'animate-ping' : ''}`} />
      <span>{status}</span>
    </span>
  );
};
