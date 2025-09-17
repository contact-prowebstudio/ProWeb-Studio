/**
 * Server-side environment validation for production deployments
 * Validates critical environment variables and logs missing ones without breaking the app
 */

interface EnvValidationResult {
  missing: string[];
  warnings: string[];
  isValid: boolean;
}

/**
 * Critical environment variables required for production
 */
const CRITICAL_ENV_VARS = [
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'CONTACT_INBOX',
] as const;

/**
 * URL variables - at least one is required
 */
const URL_VARS = ['NEXT_PUBLIC_SITE_URL', 'SITE_URL'] as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'BREVO_SMTP_USER',
  'BREVO_SMTP_PASS',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'SITE_NAME',
] as const;

/**
 * Validates environment variables in production
 * Logs clear errors to console without throwing exceptions
 */
export function validateProductionEnv(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Only validate in production environment
  if (process.env.NODE_ENV !== 'production') {
    return { missing: [], warnings: [], isValid: true };
  }

  // Check critical environment variables
  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      missing.push(envVar);
    }
  }

  // Check URL variables - at least one must be present
  const hasUrl = URL_VARS.some(envVar => {
    const value = process.env[envVar];
    return value && value.trim() !== '';
  });
  
  if (!hasUrl) {
    missing.push('SITE_URL or NEXT_PUBLIC_SITE_URL');
  }

  // Check recommended environment variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      warnings.push(envVar);
    }
  }

  const isValid = missing.length === 0;

  // Log results to console for observability
  if (!isValid) {
    console.error('🚨 [ENV VALIDATION] Critical environment variables missing:');
    missing.forEach(envVar => {
      console.error(`   ❌ ${envVar}`);
    });
    console.error('   Check your Vercel environment variables configuration.');
  }

  if (warnings.length > 0) {
    console.warn('⚠️  [ENV VALIDATION] Recommended environment variables missing:');
    warnings.forEach(envVar => {
      console.warn(`   📝 ${envVar}`);
    });
    console.warn('   Some features may not work as expected.');
  }

  if (isValid && warnings.length === 0) {
    console.log('✅ [ENV VALIDATION] All environment variables configured correctly');
  }

  return { missing, warnings, isValid };
}

/**
 * Initialize environment validation - call once during app startup
 * Safe to call multiple times, will only validate once in production
 */
let hasLogged = false;
export function initProductionEnvValidation(): void {
  // Only validate in production runtime, not during build
  if (process.env.NODE_ENV === 'production' && !hasLogged && typeof window === 'undefined') {
    // Additional check to avoid logging during build
    if (!process.env.NEXT_PHASE || process.env.NEXT_PHASE === 'phase-production-server') {
      hasLogged = true;
      validateProductionEnv();
    }
  } else if (process.env.NODE_ENV !== 'production') {
    validateProductionEnv();
  }
}