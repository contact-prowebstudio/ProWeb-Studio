// src/components/LegalContentLayout.tsx
'use client';

import * as React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Shared layout for long-form legal content.
 * - Safe top padding (sticky header friendly)
 * - ~72ch line length for readability
 * - Consistent typography via Tailwind Typography
 */
export default function LegalContentLayout({ children, className }: Props) {
  const base =
    [
      // spacing & container
      'relative mx-auto px-6 pb-24 pt-28 md:pt-32',
      // readable line length (~72ch)
      'max-w-[72ch]',
      // typography
      'prose prose-invert prose-neutral',
      // headings rhythm
      'prose-h1:mb-6 prose-h1:leading-tight',
      'prose-h2:mt-10 prose-h2:mb-4',
      'prose-h3:mt-8 prose-h3:mb-3',
      // paragraphs & lists
      'prose-p:leading-relaxed prose-p:my-4',
      'prose-ul:my-4 prose-ol:my-4',
      'prose-li:my-1.5',
      // links (no underline by default, underline on hover)
      'prose-a:no-underline hover:prose-a:underline',
      // code & hr tweaks
      'prose-code:font-medium',
      'prose-hr:my-8',
    ].join(' ') + (className ? ` ${className}` : '');

  return <main className={base}>{children}</main>;
}
