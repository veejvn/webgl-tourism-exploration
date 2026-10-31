import { defineConfig, devices } from '@playwright/test';
import { createRequire } from 'node:module';
import path from 'path';

const apiRequire = createRequire(path.resolve(__dirname, '../api/package.json'));
const prismaRequire = createRequire(apiRequire.resolve('prisma/package.json'));
const windowsSchemaEngine = path.join(
  path.dirname(prismaRequire.resolve('@prisma/engines/package.json')),
  'schema-engine-windows.exe',
);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60 * 1000,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader',
            '--ignore-gpu-blocklist',
          ],
        },
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter api e2e:serve',
      url: 'http://localhost:3001/destinations',
      reuseExistingServer: false,
      cwd: path.resolve(__dirname, '../../'),
      timeout: 300 * 1000,
      env: {
        USE_SQLITE: 'true',
        SQLITE_DATABASE_FILE: 'e2e.db',
        JWT_SECRET: process.env.JWT_SECRET || 'playwright-local-only',
        ...(process.platform === 'win32' && !process.env.PRISMA_SCHEMA_ENGINE_BINARY
          ? { PRISMA_SCHEMA_ENGINE_BINARY: windowsSchemaEngine }
          : {}),
      },
    },
    {
      command: 'pnpm --filter web start',
      url: 'http://localhost:3000',
      reuseExistingServer: false,
      cwd: path.resolve(__dirname, '../../'),
      timeout: 300 * 1000,
    },
  ],
});
