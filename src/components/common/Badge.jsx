import React from 'react';
import { CATEGORIES, PRIORITIES } from '../../constants/taskConstants';

export function CategoryBadge({ category }) {
  const config = Object.values(CATEGORIES).find(
    (c) => c.id.toLowerCase() === (category || '').toLowerCase()
  ) || {
    label: (category || 'OUTROS').toUpperCase(),
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase transition-colors ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = Object.values(PRIORITIES).find(
    (p) => p.id.toLowerCase() === (priority || '').toLowerCase()
  ) || PRIORITIES.MEDIA;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase transition-colors ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
