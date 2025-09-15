/// <reference types="vitest" />
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// Cleanup React DOM between tests
afterEach(() => {
  cleanup();
});

// Augment Vitest's Assertion interface with jest-dom matchers for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
}
