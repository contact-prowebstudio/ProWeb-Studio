'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/reportWebVitals';

export function WebVitalsReporter() {
  const isProd = process.env.NODE_ENV === 'production';
  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true';
  // Always call the hook to respect Rules of Hooks; noop when disabled
  useReportWebVitals((metric) => {
    if (isProd && enabled) {
      reportWebVitals(metric);
    }
  });
  return null;
}