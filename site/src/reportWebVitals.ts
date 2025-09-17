interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
}

interface BaseMetric {
  name: string;
  value: number;
  id: string;
  delta?: number;
  navigationType?: string;
}

function getVitalRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}

export function reportWebVitals(metric: BaseMetric) {
  const vitalMetric: WebVitalMetric = {
    ...metric,
    rating: getVitalRating(metric.name, metric.value),
  };

  // Send to our API endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vitalMetric),
    }).catch(() => {
      // Silently fail - don't throw errors for analytics
    });
  }
}