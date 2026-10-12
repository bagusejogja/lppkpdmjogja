import React from 'react';
import { clsx } from 'clsx';
import { SpjStatus, RequestStatus, UserRole } from '@/types/database';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold' | 'muh';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'sm', className }) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full border';
  
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    gold: 'bg-amber-100 text-amber-800 border-amber-300',
    muh: 'bg-[#f0fdf4] text-[#055838] border-[#bbf7d0]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: SpjStatus | RequestStatus | string }> = ({ status }) => {
  switch (status) {
    case 'APPROVED':
    case 'KOMPLIT':
      return <Badge variant="success">✓ {status}</Badge>;
    case 'DISUBMIT':
      return <Badge variant="info">📤 {status}</Badge>;
    case 'DALAM_PROSES':
      return <Badge variant="warning">⏳ DALAM PROSES</Badge>;
    case 'DITERIMA':
      return <Badge variant="neutral">📥 DITERIMA</Badge>;
    case 'REVISION_REQUIRED':
    case 'REVISI':
      return <Badge variant="danger">⚠️ REVISI</Badge>;
    case 'REJECTED':
      return <Badge variant="danger">✕ DITOLAK</Badge>;
    case 'DRAFT':
      return <Badge variant="neutral">📝 DRAFT</Badge>;
    default:
      if (status.startsWith('PENDING_LEVEL_')) {
        const lvl = status.replace('PENDING_LEVEL_', '');
        return <Badge variant="warning">⏳ MENUNGGU LEVEL {lvl}</Badge>;
      }
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const RoleBadge: React.FC<{ role: UserRole | string }> = ({ role }) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return <Badge variant="gold">👑 Super Admin</Badge>;
    case 'AUDITOR_INTERNAL':
      return <Badge variant="muh">🔍 Auditor Internal</Badge>;
    case 'BENDAHARA':
      return <Badge variant="info">💰 Bendahara</Badge>;
    case 'APPROVER_SPJ':
      return <Badge variant="success">✍️ Approver SPJ</Badge>;
    case 'STAFF_UNIT':
      return <Badge variant="neutral">🏢 Staff Unit</Badge>;
    case 'VIEWER_ONLY':
      return <Badge variant="neutral">👀 Viewer Only</Badge>;
    default:
      return <Badge variant="neutral">{role}</Badge>;
  }
};
