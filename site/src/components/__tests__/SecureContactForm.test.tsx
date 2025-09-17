import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SecureContactForm from '@/components/SecureContactForm';

// Mock global grecaptcha
global.window = Object.create(window);
Object.defineProperty(window, 'grecaptcha', {
  value: {
    ready: vi.fn((callback) => callback()),
    execute: vi.fn().mockResolvedValue('test-recaptcha-token')
  },
  writable: true
});

// Mock fetch
global.fetch = vi.fn() as unknown as typeof fetch;

describe('SecureContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        ok: true,
        message: 'Bericht succesvol verzonden'
      })
    });
  });

  it('should render the contact form with honeypot field', () => {
    render(<SecureContactForm />);
    
    // Check that visible fields are present
    expect(screen.getByLabelText(/Naam/)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mailadres/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefoonnummer/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vertel ons over jouw project/)).toBeInTheDocument();
    
    // Check that honeypot field exists but is hidden
    const honeypotField = document.getElementById('website');
    expect(honeypotField).toBeInTheDocument();
    expect(honeypotField).toHaveAttribute('name', 'website');
    expect(honeypotField).toHaveAttribute('tabindex', '-1');
    expect(honeypotField).toHaveAttribute('autocomplete', 'off');
    expect(honeypotField).toHaveAttribute('aria-hidden', 'true');
    
    // Verify the field is hidden
    const honeypotContainer = honeypotField?.parentElement;
    expect(honeypotContainer).toHaveStyle('display: none');
  });

  it('should submit form successfully when honeypot field is empty', async () => {
    render(<SecureContactForm />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Naam/), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/E-mailadres/), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Vertel ons over jouw project/), {
      target: { value: 'This is a test message with more than 10 characters.' }
    });
    
    // Select a project type
    fireEvent.click(screen.getByText(/🌐 Website/));
    
    // Submit the form
    fireEvent.click(screen.getByText(/Verstuur bericht/));
    
    // Wait for submission
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('"website":""')
      }));
    });
  });

  it('should prevent submission when honeypot field is filled', async () => {
    render(<SecureContactForm />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Naam/), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/E-mailadres/), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Vertel ons over jouw project/), {
      target: { value: 'This is a test message with more than 10 characters.' }
    });
    
    // Select a project type
    fireEvent.click(screen.getByText(/🌐 Website/));
    
    // Fill the honeypot field (simulating bot behavior)
    const honeypotField = document.getElementById('website');
    fireEvent.change(honeypotField!, {
      target: { value: 'https://spam-site.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Verstuur bericht/));
    
    // Wait for validation
    await waitFor(() => {
      expect(screen.getByText(/Bot gedetecteerd/)).toBeInTheDocument();
    });
    
    // Verify fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    render(<SecureContactForm />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByText(/Verstuur bericht/));
    
    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Naam moet minimaal 2 karakters zijn/)).toBeInTheDocument();
      expect(screen.getByText(/Ongeldig e-mailadres/)).toBeInTheDocument();
      expect(screen.getByText(/Selecteer minimaal één projecttype/)).toBeInTheDocument();
      expect(screen.getByText(/Bericht moet minimaal 10 karakters zijn/)).toBeInTheDocument();
    });
    
    // Verify fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();
  });
});