import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders the button with the correct text', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('has the correct href attribute', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('href', '/test');
  });

  it('applies the primary variant class by default', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveClass('bg-gradient-to-r from-cyan-500 to-magenta-500');
  });

  it('applies the secondary variant class when specified', () => {
    render(
      <Button href="/test" variant="secondary">
        Click me
      </Button>,
    );
    const button = screen.getByRole('link');
    expect(button).toHaveClass('border border-cyan-500/60');
  });

  it('applies the normal size class by default', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveClass('px-6 py-3');
  });

  it('applies the large size class when specified', () => {
    render(
      <Button href="/test" size="large">
        Click me
      </Button>,
    );
    const button = screen.getByRole('link');
    expect(button).toHaveClass('md:px-10 md:py-4');
  });
});
