'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/reportWebVitals';

export function WebVitalsReporter() {
  useReportWebVitals(reportWebVitals);
  return null;
}