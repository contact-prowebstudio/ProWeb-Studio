import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const preferredRegion = 'fra1';

// Enhanced validation schema with security considerations
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address too long')
    .refine(email => {
      // Block temporary/disposable email services
      const disposableProviders = ['10minutemail', 'tempmail', 'guerrillamail', 'mailinator'];
      return !disposableProviders.some(provider => email.includes(provider));
    }, 'Temporary email addresses are not allowed'),
  phone: z.string()
    .optional()
    .refine(phone => !phone || /^[\+]?[0-9\s\-\(\)]+$/.test(phone), 'Invalid phone number format'),
  projectTypes: z.array(z.string())
    .min(1, 'Select at least one project type')
    .max(10, 'Too many project types selected')
    .refine(types => {
      const validTypes = ['website', 'webshop', 'webapp', 'mobile-app', 'seo', 'hosting', 'maintenance', 'consulting'];
      return types.every(type => validTypes.includes(type));
    }, 'Invalid project type selected'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters long')
    .max(5000, 'Message too long')
    .refine(msg => {
      // Block common spam patterns
      const spamPatterns = [
        /\b(viagra|cialis|pharmacy|casino|poker|loan|mortgage|bitcoin|crypto)\b/i,
        /\b(click here|visit now|act now|limited time|free money)\b/i,
        /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
        /(.)\1{10,}/i // Repeated characters
      ];
      return !spamPatterns.some(pattern => pattern.test(msg));
    }, 'Message contains prohibited content'),
  // Honeypot field (should be empty)
  website: z.string().max(0).optional(),
  // reCAPTCHA token
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required'),
  // Timestamp to prevent replay attacks
  timestamp: z.number().refine(timestamp => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return timestamp > (now - fiveMinutes) && timestamp <= now;
  }, 'Form submission expired, please refresh and try again'),
});

// Input sanitization function
function sanitizeInput(input: string): string {
  // First pass: HTML sanitization
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Second pass: Remove potentially dangerous characters
  return sanitized
    .replace(/[<>'"&]/g, '') // Remove HTML chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
}

// reCAPTCHA verification
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('reCAPTCHA secret key not configured');
    return false;
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });
    
    const data = await response.json();
    
    // Check score for v3 (score should be > 0.5 for legitimate users)
    return data.success && (data.score === undefined || data.score > 0.5);
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

// Email content validation and sanitization
type ContactData = {
  name: string;
  email: string;
  phone?: string;
  projectTypes: string[];
  message: string;
};

function createSafeEmailContent(data: ContactData) {
  const sanitizedData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : 'Niet opgegeven',
    projectTypes: data.projectTypes.map((type: string) => sanitizeInput(type)),
    message: sanitizeInput(data.message),
  };
  
  return `
    <h1>Nieuwe contactaanvraag via ProWeb Studio</h1>
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Contactgegevens</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Naam:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${sanitizedData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">E-mail:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${sanitizedData.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Telefoon:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${sanitizedData.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Projecttypes:</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${sanitizedData.projectTypes.join(', ')}</td>
        </tr>
      </table>
      
      <h2>Bericht</h2>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: inherit;">
${sanitizedData.message}
      </div>
      
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Dit bericht is verzonden via het beveiligde contactformulier van ProWeb Studio.
        <br>Verzonden op: ${new Date().toLocaleString('nl-NL')}
      </p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP for logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Parse and validate request body
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      console.warn(`Invalid contact form submission from ${clientIP}:`, parsed.error.flatten());
      const res = NextResponse.json(
        { ok: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
      res.headers.set('Cache-Control', 'no-store');
      return res;
    }

    const { name, email, phone, projectTypes, message, website, recaptchaToken } = parsed.data;

    // Check honeypot field - handle spam gracefully
    if (website && website.length > 0) {
      console.warn(`Honeypot triggered from ${clientIP}`);
      // Return success response to avoid leaking spam detection signals
      const res = NextResponse.json({ 
        ok: true,
        message: 'Bericht succesvol verzonden'
      });
      res.headers.set('Cache-Control', 'no-store');
      return res;
    }

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      console.warn(`reCAPTCHA verification failed from ${clientIP}`);
      const res = NextResponse.json(
        { ok: false, error: 'reCAPTCHA verification failed' },
        { status: 400 },
      );
      res.headers.set('Cache-Control', 'no-store');
      return res;
    }

    // Configure email transporter with security settings
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
      // Security options
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
      requireTLS: true,
    });

    // Create sanitized email content
    const html = createSafeEmailContent({ name, email, phone, projectTypes, message });

    // Send email with security headers
    const info = await transporter.sendMail({
      from: '"ProWeb Studio Contact" <contact@prowebstudio.nl>',
      to: process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
      subject: `Nieuwe aanvraag van ${sanitizeInput(name)}`,
      replyTo: email,
      html,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Mailer': 'ProWeb Studio Contact Form v2.0',
        'X-Originating-IP': clientIP,
      },
    });

    console.log(`Contact form submitted successfully from ${clientIP}: ${info.messageId}`);
    
    const res = NextResponse.json({ 
      ok: true,
      message: 'Bericht succesvol verzonden',
      messageId: info.messageId
    });
    res.headers.set('Cache-Control', 'no-store');
    return res;
    
  } catch (error) {
    console.error('Error sending contact email:', error);
    
    // Don't expose internal errors to client
    const errorMessage = error instanceof Error ? 
      (process.env.NODE_ENV === 'development' ? error.message : 'Internal server error') :
      'Unknown error occurred';
    
    const res = NextResponse.json(
      { ok: false, error: 'Failed to send message', details: errorMessage },
      { status: 500 },
    );
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}
