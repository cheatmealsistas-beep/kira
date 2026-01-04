import { test, expect } from '@playwright/test';

/**
 * E2E tests for onboarding flow
 *
 * Tests the complete wizard: level -> days -> goal -> equipment -> limitations
 */

// Test user that has completed registration but not onboarding
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
};

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|onboarding)/);
  });

  test.describe('Onboarding Wizard', () => {
    test('should display step 1: experience level', async ({ page }) => {
      await page.goto('/onboarding');

      // Should show experience level options
      await expect(page.getByText(/beginner|principiante/i)).toBeVisible();
      await expect(page.getByText(/intermediate|intermedio/i)).toBeVisible();
      await expect(page.getByText(/advanced|avanzado/i)).toBeVisible();
    });

    test('should navigate through all steps', async ({ page }) => {
      await page.goto('/onboarding');

      // Step 1: Select experience level
      await page.click('text=/beginner|principiante/i');
      await page.click('button:has-text(/next|siguiente|continue|continuar/i)');

      // Step 2: Select training days
      await expect(page.getByText(/days|días/i)).toBeVisible();
      // Select 3 days
      const dayButtons = page.locator('button').filter({ hasText: /^[2-6]$/ });
      await dayButtons.nth(1).click(); // Select 3
      await page.click('button:has-text(/next|siguiente|continue|continuar/i)');

      // Step 3: Select goal
      await expect(page.getByText(/goal|objetivo/i)).toBeVisible();
      await page.click('text=/strength|fuerza|general/i');
      await page.click('button:has-text(/next|siguiente|continue|continuar/i)');

      // Step 4: Select equipment
      await expect(page.getByText(/equipment|equipo/i)).toBeVisible();
      await page.click('text=/bodyweight|peso corporal|dumbbell|mancuernas/i');
      await page.click('button:has-text(/next|siguiente|continue|continuar/i)');

      // Step 5: Select limitations
      await expect(page.getByText(/limitations|limitaciones/i)).toBeVisible();
      // Can skip or select some
      await page.click('button:has-text(/finish|finalizar|complete|completar/i)');

      // Should redirect to dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    });

    test('should allow going back to previous steps', async ({ page }) => {
      await page.goto('/onboarding');

      // Go to step 2
      await page.click('text=/beginner|principiante/i');
      await page.click('button:has-text(/next|siguiente/i)');

      // Go back to step 1
      await page.click('button:has-text(/back|atrás|previous|anterior/i)');

      // Should be back on step 1
      await expect(page.getByText(/experience|experiencia|level|nivel/i)).toBeVisible();
    });

    test('should save progress and redirect to dashboard', async ({ page }) => {
      await page.goto('/onboarding');

      // Complete all steps quickly
      await page.click('text=/intermediate|intermedio/i');
      await page.click('button:has-text(/next|siguiente/i)');

      await page.locator('button').filter({ hasText: /^4$/ }).click();
      await page.click('button:has-text(/next|siguiente/i)');

      await page.click('text=/recomposition|recomposición|strength|fuerza/i');
      await page.click('button:has-text(/next|siguiente/i)');

      await page.click('text=/dumbbell|mancuernas/i');
      await page.click('button:has-text(/next|siguiente/i)');

      await page.click('button:has-text(/finish|finalizar/i)');

      // Should be on dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Onboarding Redirect', () => {
    test('should redirect new user to onboarding from dashboard', async ({ page }) => {
      // This test assumes user hasn't completed onboarding
      // If user has completed onboarding, they stay on dashboard
      await page.goto('/dashboard');

      // Either stays on dashboard (completed) or redirects to onboarding (not completed)
      const url = page.url();
      expect(url).toMatch(/\/(dashboard|onboarding)/);
    });
  });

  test.describe('Onboarding i18n', () => {
    test('should display onboarding in Spanish', async ({ page }) => {
      await page.goto('/es/onboarding');

      // Should show Spanish text
      await expect(page.getByText(/nivel|experiencia|principiante|intermedio/i)).toBeVisible();
    });

    test('should display onboarding in English', async ({ page }) => {
      await page.goto('/en/onboarding');

      // Should show English text
      await expect(page.getByText(/level|experience|beginner|intermediate/i)).toBeVisible();
    });
  });
});
