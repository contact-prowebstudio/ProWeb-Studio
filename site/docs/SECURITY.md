# 🔒 Security Implementation Guide

## Overview

This document outlines the comprehensive security measures implemented for the ProWeb Studio Next.js application. Our security strategy follows defense-in-depth principles with multiple layers of protection.

## 🛡️ Security Architecture

### 1. Middleware Security Layer (`/src/middleware.ts`)

#### Rate Limiting
- **Contact API**: 5 requests per 15 minutes
- **General APIs**: 100 requests per minute
- **Other Routes**: 200 requests per minute
- **IP Whitelist**: Development and admin IPs bypass limits

#### Bot Detection
```typescript
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'scanner', 
  'curl', 'wget', 'python-requests', 'go-http-client'
];
```

#### Request Validation
- Origin header validation for API requests
- User-Agent length validation
- Missing critical headers detection
- CSRF protection via X-Requested-With header

#### Security Headers
- **Content Security Policy**: Strict script/style sources
- **Permissions Policy**: Disabled unnecessary browser features
- **HSTS**: 2-year max-age with preload
- **Frame Options**: DENY to prevent clickjacking
- **Cross-Origin Policies**: Same-origin restrictions

### 2. Contact Form Security (`/src/components/SecureContactForm.tsx`)

#### Client-Side Protection
```typescript
// Honeypot field (hidden from users)
<input 
  type="text" 
  name="website" 
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>

// User interaction tracking
const [userInteractions, setUserInteractions] = useState({
  mouseMovements: 0,
  keystrokes: 0,
  formFocused: false
});
```

#### Input Validation
- **Name**: 2-100 chars, letters/spaces/hyphens only
- **Email**: Standard email + disposable provider blocking
- **Phone**: Optional, format validation
- **Message**: 10-5000 chars, spam pattern detection
- **Project Types**: Whitelist validation

#### Anti-Spam Measures
- Minimum 5 seconds form interaction time
- Mouse movement and keystroke tracking
- reCAPTCHA v3 integration
- Honeypot field detection
- Spam content pattern blocking

### 3. API Security (`/src/app/api/contact/route.ts`)

#### Enhanced Validation Schema
```typescript
const contactSchema = z.object({
  name: z.string()
    .min(2).max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/),
  email: z.string()
    .email().max(254)
    .refine(email => !isDisposableEmail(email)),
  // ... other fields with strict validation
});
```

#### Input Sanitization
```typescript
function sanitizeInput(input: string): string {
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return sanitized
    .replace(/[<>'"&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
}
```

#### reCAPTCHA Verification
- Score threshold: 0.5 (v3)
- Action-specific tokens
- Server-side validation
- Error handling with fallback

### 4. Security Headers (`/next.config.mjs`)

#### Content Security Policy
```javascript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: blob:",
  "frame-src 'self' https://www.google.com https://cal.com",
  "connect-src 'self' https://api.cal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'"
].join('; ')
```

#### Enhanced Security Headers
- **Strict-Transport-Security**: 2-year HSTS with preload
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **Cross-Origin-*-Policy**: Same-origin restrictions
- **Permissions-Policy**: Disabled unnecessary features

### 5. Security Disclosure (`/.well-known/security.txt`)

RFC 9116 compliant security.txt file with:
- Contact information for security reports
- PGP encryption key for sensitive communications
- Security policy and acknowledgments
- Preferred languages and canonical URL

## 🔧 Configuration

### Environment Variables

```bash
# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Security Settings
WHITELIST_IPS=127.0.0.1,::1
CONTACT_INBOX=security@prowebstudio.nl

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://prowebstudio.nl
```

### Production Setup Checklist

#### 1. reCAPTCHA Configuration
```bash
# 1. Visit https://www.google.com/recaptcha/admin/create
# 2. Select reCAPTCHA v3
# 3. Add your domain(s)
# 4. Configure keys in environment variables
```

#### 2. Email Security
```bash
# 1. Configure SPF record
# 2. Set up DKIM signing
# 3. Configure DMARC policy
# 4. Use authenticated SMTP (Brevo)
```

#### 3. HTTPS Configuration
```bash
# 1. Obtain SSL certificate
# 2. Configure HSTS preload
# 3. Update CSP for HTTPS
# 4. Test SSL configuration
```

#### 4. Monitoring Setup
```bash
# 1. Configure error logging
# 2. Set up security alerts
# 3. Monitor rate limiting
# 4. Log security events
```

## 🚨 Security Monitoring

### Logging and Alerts

```typescript
// Security event logging
console.warn(`Suspicious request blocked: ${ip} ${path}`);
console.warn(`Rate limit exceeded: ${ip} ${path}`);
console.warn(`Honeypot triggered from ${clientIP}`);
console.warn(`reCAPTCHA verification failed from ${clientIP}`);
```

### Metrics to Monitor
- Rate limiting triggers
- Bot detection events
- Failed reCAPTCHA verifications
- Suspicious request patterns
- CSP violations
- Failed authentication attempts

## 🔍 Security Testing

### Automated Testing

```bash
# Security headers test
npm run test:security

# Rate limiting test
npm run test:rate-limit

# Contact form security test
npm run test:contact-security
```

### Manual Testing Checklist

#### Rate Limiting
- [ ] Contact form: 5 submissions in 15 minutes triggers limit
- [ ] API endpoints: Proper rate limit responses
- [ ] Whitelisted IPs bypass limits

#### Contact Form Security
- [ ] Honeypot field blocks bots
- [ ] reCAPTCHA prevents automated submissions
- [ ] Input sanitization removes malicious content
- [ ] Validation blocks invalid data
- [ ] Spam patterns are detected

#### Security Headers
- [ ] CSP prevents XSS attacks
- [ ] HSTS enforces HTTPS
- [ ] Frame options prevent clickjacking
- [ ] Content type sniffing disabled

#### Bot Protection
- [ ] Common bot user agents blocked
- [ ] Suspicious patterns detected
- [ ] Human interaction required

## 🔐 Best Practices

### Development
1. **Never commit secrets** to version control
2. **Use TypeScript** for type safety
3. **Validate all inputs** client and server-side
4. **Sanitize outputs** to prevent XSS
5. **Test security features** regularly

### Production
1. **Enable HTTPS** with proper certificates
2. **Configure firewalls** and access controls
3. **Monitor security logs** for anomalies
4. **Keep dependencies updated** regularly
5. **Perform security audits** quarterly

### Incident Response
1. **Document all security events**
2. **Have incident response plan**
3. **Regular security backups**
4. **Emergency contact procedures**
5. **Post-incident analysis**

## 📋 Security Compliance

### Standards Adherence
- **OWASP Top 10**: Protection against common vulnerabilities
- **RFC 9116**: Security.txt implementation
- **CSP Level 3**: Content Security Policy compliance
- **GDPR**: Privacy and data protection
- **ISO 27001**: Information security management

### Regular Updates
- Monthly dependency updates
- Quarterly security reviews
- Annual penetration testing
- Continuous monitoring

## 🆘 Incident Reporting

### Security Contact
- **Email**: security@prowebstudio.nl
- **Contact Form**: https://prowebstudio.nl/contact
- **PGP Key**: https://prowebstudio.nl/.well-known/pgp-key.txt

### Responsible Disclosure
1. Report vulnerabilities via secure channels
2. Provide clear reproduction steps
3. Allow reasonable time for fixes
4. Receive acknowledgment and updates

---

**Last Updated**: September 7, 2025  
**Next Review**: December 7, 2025  
**Security Version**: 2.0
