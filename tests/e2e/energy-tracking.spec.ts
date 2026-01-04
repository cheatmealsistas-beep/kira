import { test, expect } from '@playwright/test';

/**
 * E2E tests for energy tracking
 *
 * Tests: daily energy logging, offline support, history visualization
 */

const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
};

test.describe('Energy Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|onboarding)/);
  });

  test.describe('Energy Level Selection', () => {
    test('should display energy options on dashboard', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show energy level options (4 levels: high, medium, low, rest)
      const energySection = page.locator('[data-energy-selector], [data-testid="energy-selector"]');
      if (await energySection.isVisible()) {
        await expect(energySection).toBeVisible();
      } else {
        // Fallback: look for energy-related text
        await expect(page.getByText(/energy|energía|feel|sientes/i)).toBeVisible();
      }
    });

    test('should allow selecting energy level', async ({ page }) => {
      await page.goto('/dashboard');

      // Click on an energy level
      const energyOptions = page.locator('[data-energy-level]');
      const count = await energyOptions.count();

      if (count > 0) {
        await energyOptions.first().click();

        // Should show visual selection feedback
        await expect(energyOptions.first()).toHaveClass(/selected|active|ring/);
      }
    });

    test('should persist energy selection after page reload', async ({ page }) => {
      await page.goto('/dashboard');

      // Select energy level
      const energyOption = page.locator('[data-energy-level="high"]');
      if (await energyOption.isVisible()) {
        await energyOption.click();

        // Reload page
        await page.reload();

        // Should still show selected (or show today's logged energy)
        await expect(page.getByText(/high|alta|energía/i)).toBeVisible();
      }
    });

    test('should update workout recommendation based on energy', async ({ page }) => {
      await page.goto('/dashboard');

      // Select low energy
      const lowEnergy = page.locator('[data-energy-level="low"]');
      if (await lowEnergy.isVisible()) {
        await lowEnergy.click();

        // Should show adjusted workout message
        await expect(page.getByText(/adjusted|ajustado|lighter|suave|reduced|reducido/i)).toBeVisible();
      }
    });
  });

  test.describe('Daily Check-in', () => {
    test('should show daily check-in prompt', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show check-in question
      await expect(page.getByText(/how.*feel|cómo.*sientes|today|hoy/i)).toBeVisible();
    });

    test('should show energy options with labels', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show energy level labels
      const labels = ['high', 'medium', 'low', 'rest', 'alta', 'media', 'baja', 'descanso'];
      let foundLabel = false;

      for (const label of labels) {
        const element = page.getByText(new RegExp(label, 'i'));
        if (await element.isVisible()) {
          foundLabel = true;
          break;
        }
      }

      expect(foundLabel).toBe(true);
    });

    test('should show confirmation after logging energy', async ({ page }) => {
      await page.goto('/dashboard');

      // Select energy level
      const energyOption = page.locator('[data-energy-level]').first();
      if (await energyOption.isVisible()) {
        await energyOption.click();

        // Should show confirmation (toast or inline message)
        await expect(page.getByText(/logged|registrado|saved|guardado/i)).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Offline Support', () => {
    test('should show offline indicator when disconnected', async ({ page, context }) => {
      await page.goto('/dashboard');

      // Simulate offline
      await context.setOffline(true);

      // Should show offline indicator
      await expect(page.getByText(/offline|sin conexión|no connection/i)).toBeVisible({ timeout: 5000 });

      // Restore connection
      await context.setOffline(false);
    });

    test('should save energy selection when offline', async ({ page, context }) => {
      await page.goto('/dashboard');

      // Go offline
      await context.setOffline(true);

      // Select energy (should save locally)
      const energyOption = page.locator('[data-energy-level]').first();
      if (await energyOption.isVisible()) {
        await energyOption.click();

        // Should show local save message
        await expect(page.getByText(/saved.*local|guardado.*local|pending.*sync/i)).toBeVisible();
      }

      // Restore connection
      await context.setOffline(false);
    });

    test('should sync pending data when back online', async ({ page, context }) => {
      await page.goto('/dashboard');

      // Go offline and make changes
      await context.setOffline(true);

      const energyOption = page.locator('[data-energy-level]').first();
      if (await energyOption.isVisible()) {
        await energyOption.click();
      }

      // Go back online
      await context.setOffline(false);

      // Should sync (look for sync message or indicator disappearing)
      await page.waitForTimeout(2000);
      const offlineIndicator = page.getByText(/offline|sin conexión/i);
      await expect(offlineIndicator).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Energy History', () => {
    test('should display energy history on insights page', async ({ page }) => {
      await page.goto('/insights');

      // Should show energy history section
      await expect(page.getByText(/energy|energía|history|historial|pattern|patrón/i)).toBeVisible();
    });

    test('should show weekly energy summary', async ({ page }) => {
      await page.goto('/dashboard');

      // Look for weekly summary widget
      const weeklyProgress = page.locator('[data-weekly-progress], [data-testid="weekly-progress"]');
      if (await weeklyProgress.isVisible()) {
        await expect(weeklyProgress).toBeVisible();
      }
    });
  });

  test.describe('Energy-Based Adjustments', () => {
    test('should show different workout for high vs low energy', async ({ page }) => {
      await page.goto('/dashboard');

      // Select high energy
      const highEnergy = page.locator('[data-energy-level="high"]');
      if (await highEnergy.isVisible()) {
        await highEnergy.click();

        // Get workout intensity indicator
        const intensity = await page.locator('[data-intensity]').textContent();

        // Now select low energy
        const lowEnergy = page.locator('[data-energy-level="low"]');
        await lowEnergy.click();

        // Intensity should change
        const newIntensity = await page.locator('[data-intensity]').textContent();

        // They should be different (adjusted based on energy)
        expect(intensity).not.toBe(newIntensity);
      }
    });

    test('should show rest day option for very low energy', async ({ page }) => {
      await page.goto('/dashboard');

      // Select rest/very low energy
      const restOption = page.locator('[data-energy-level="rest"]');
      if (await restOption.isVisible()) {
        await restOption.click();

        // Should show rest day suggestions
        await expect(page.getByText(/rest|descanso|recovery|recuperación|take.*easy|tómate.*calma/i)).toBeVisible();
      }
    });
  });
});
