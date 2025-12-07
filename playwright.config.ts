import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  use: {
    baseURL: 'http://localhost:8081', 
    headless: true,
  },
});

