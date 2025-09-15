import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15000, // Reduced timeout for faster feedback
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2, // Reduce workers
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Simplified mobile testing - just use Pixel 5 to start
    {
      name: 'Pixel 5 Mobile',
      use: { 
        ...devices['Pixel 5'],
        // Use headless mode to avoid browser dependency issues
        headless: true,
        // Disable some features that might cause issues
        video: 'off',
        screenshot: 'off'
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});