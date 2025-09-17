import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransporter: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' })
    }))
  }
}));

// Mock environment variables
vi.mock('process', () => ({
  env: {
    RECAPTCHA_SECRET_KEY: 'test-secret-key',
    BREVO_SMTP_USER: 'test-user',
    BREVO_SMTP_PASS: 'test-pass',
    CONTACT_INBOX: 'test@example.com'
  }
}));

// Mock fetch for reCAPTCHA verification
global.fetch = vi.fn() as unknown as typeof fetch;

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful reCAPTCHA response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        score: 0.9
      })
    });
  });

  const createRequest = (body: Record<string, unknown>) => {
    return new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
  };

  const validFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+31612345678',
    projectTypes: ['website'],
    message: 'This is a test message with more than 10 characters.',
    website: '', // Empty honeypot field
    recaptchaToken: 'test-recaptcha-token',
    timestamp: Date.now()
  };

  it('should process legitimate submission successfully', async () => {
    const request = createRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.message).toBe('Bericht succesvol verzonden');
  });

  it('should gracefully handle spam when website field is filled', async () => {
    const spamData = {
      ...validFormData,
      website: 'https://spam-site.com' // Non-empty honeypot field
    };

    const request = createRequest(spamData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.message).toBe('Bericht succesvol verzonden');
    
    // Verify no email was actually sent by checking nodemailer wasn't called
    // (This would need to be implemented in the actual test with proper mocking)
  });

  it('should reject submission with missing required fields', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      projectTypes: [],
      message: 'short',
      website: '',
      recaptchaToken: 'test-token',
      timestamp: Date.now()
    };

    const request = createRequest(invalidData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Validation failed');
  });

  it('should reject submission when reCAPTCHA verification fails', async () => {
    // Mock failed reCAPTCHA response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: false,
        score: 0.1
      })
    });

    const request = createRequest(validFormData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.error).toBe('reCAPTCHA verification failed');
  });

  it('should reject submission with expired timestamp', async () => {
    const expiredData = {
      ...validFormData,
      timestamp: Date.now() - (10 * 60 * 1000) // 10 minutes ago
    };

    const request = createRequest(expiredData);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.error).toBe('Validation failed');
  });
});