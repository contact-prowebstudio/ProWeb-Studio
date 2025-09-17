'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/reportWebVitals';

export function WebVitalsReporter() {
  const isProd = process.env.NODE_ENV === 'production';
  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true';
  // Only attach the reporter in production when explicitly enabled.
  if (isProd && enabled) {
    useReportWebVitals(reportWebVitals);
  }
  return null;
}