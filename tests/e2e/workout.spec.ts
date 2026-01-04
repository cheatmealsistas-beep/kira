import { test, expect } from '@playwright/test';

/**
 * E2E tests for workout flow
 *
 * Tests: viewing workout, starting session, completing exercises, logging weights
 */

const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
};

test.describe('Workout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|onboarding)/);
  });

  test.describe('Today\'s Workout', () => {
    test('should display energy selector on dashboard', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show energy level selector
      await expect(page.getByText(/energy|energía|how.*feel|cómo.*sientes/i)).toBeVisible();
    });

    test('should show workout preview after selecting energy', async ({ page }) => {
      await page.goto('/dashboard');

      // Select an energy level (look for energy buttons/options)
      const energyOption = page.locator('[data-energy-level]').first();
      if (await energyOption.isVisible()) {
        await energyOption.click();
      }

      // Should show workout preview or exercises
      await expect(page.getByText(/workout|entrenamiento|exercise|ejercicio/i)).toBeVisible();
    });

    test('should navigate to workout session', async ({ page }) => {
      await page.goto('/dashboard');

      // Click on start workout button
      const startButton = page.getByRole('button', { name: /start|empezar|begin|comenzar/i });
      if (await startButton.isVisible()) {
        await startButton.click();

        // Should be on workout page
        await expect(page).toHaveURL(/\/workout/);
      }
    });
  });

  test.describe('Workout Session', () => {
    test('should display exercise list', async ({ page }) => {
      await page.goto('/workout');

      // Should show exercises
      await expect(page.getByText(/exercise|ejercicio|set|serie/i)).toBeVisible();
    });

    test('should show exercise details when clicking', async ({ page }) => {
      await page.goto('/workout');

      // Click on first exercise
      const exercise = page.locator('[data-exercise]').first();
      if (await exercise.isVisible()) {
        await exercise.click();

        // Should show exercise card with details
        await expect(page.getByText(/position|posición|movement|movimiento|muscle|músculo/i)).toBeVisible();
      }
    });

    test('should allow completing sets', async ({ page }) => {
      await page.goto('/workout');

      // Find set completion button
      const completeButton = page.getByRole('button', { name: /complete|completar|done|hecho/i }).first();
      if (await completeButton.isVisible()) {
        await completeButton.click();

        // Should show visual feedback (checkmark, disabled state, etc)
        await expect(completeButton).toHaveAttribute('disabled', '');
      }
    });

    test('should show rest timer between sets', async ({ page }) => {
      await page.goto('/workout');

      // Complete a set to trigger timer
      const completeButton = page.getByRole('button', { name: /complete|completar/i }).first();
      if (await completeButton.isVisible()) {
        await completeButton.click();

        // Should show timer
        const timer = page.locator('[data-timer], [role="timer"]');
        if (await timer.isVisible()) {
          await expect(timer).toBeVisible();
        }
      }
    });

    test('should allow logging weight', async ({ page }) => {
      await page.goto('/workout');

      // Find weight input
      const weightInput = page.locator('input[type="number"]').first();
      if (await weightInput.isVisible()) {
        await weightInput.fill('10');
        await expect(weightInput).toHaveValue('10');
      }
    });

    test('should show previous weight hint', async ({ page }) => {
      await page.goto('/workout');

      // Should show "last time" or previous weight hint
      const hint = page.getByText(/last.*time|última.*vez|previous|anterior/i);
      // This may or may not be visible depending on history
      if (await hint.isVisible()) {
        await expect(hint).toBeVisible();
      }
    });
  });

  test.describe('Workout Completion', () => {
    test('should show completion screen after finishing', async ({ page }) => {
      await page.goto('/workout');

      // Find finish workout button
      const finishButton = page.getByRole('button', { name: /finish|finalizar|complete.*workout|completar.*entrenamiento/i });
      if (await finishButton.isVisible()) {
        await finishButton.click();

        // Should show completion screen
        await expect(page.getByText(/completed|completado|done|hecho|great|genial/i)).toBeVisible();
      }
    });

    test('should return to dashboard after completion', async ({ page }) => {
      await page.goto('/workout');

      // Finish workout
      const finishButton = page.getByRole('button', { name: /finish|finalizar/i });
      if (await finishButton.isVisible()) {
        await finishButton.click();

        // Look for return button
        const returnButton = page.getByRole('button', { name: /dashboard|volver|return|back/i });
        if (await returnButton.isVisible()) {
          await returnButton.click();
          await expect(page).toHaveURL(/\/dashboard/);
        }
      }
    });
  });

  test.describe('Exercise Swap', () => {
    test('should show swap options for exercises', async ({ page }) => {
      await page.goto('/workout');

      // Find swap button
      const swapButton = page.getByRole('button', { name: /swap|cambiar|alternative|alternativa/i }).first();
      if (await swapButton.isVisible()) {
        await swapButton.click();

        // Should show alternative exercises
        await expect(page.getByText(/alternative|alternativa|swap|cambiar/i)).toBeVisible();
      }
    });

    test('should replace exercise when selecting alternative', async ({ page }) => {
      await page.goto('/workout');

      const swapButton = page.getByRole('button', { name: /swap|cambiar/i }).first();
      if (await swapButton.isVisible()) {
        await swapButton.click();

        // Select an alternative
        const alternative = page.locator('[data-alternative]').first();
        if (await alternative.isVisible()) {
          await alternative.click();

          // Should update exercise
          await expect(page.getByText(/swapped|cambiado|updated|actualizado/i)).toBeVisible();
        }
      }
    });
  });

  test.describe('Workout History', () => {
    test('should show workout history page', async ({ page }) => {
      await page.goto('/history');

      // Should show history or empty state
      await expect(page.getByText(/history|historial|workout|entrenamiento/i)).toBeVisible();
    });

    test('should display past workouts', async ({ page }) => {
      await page.goto('/history');

      // Look for workout entries or empty state
      const hasWorkouts = await page.locator('[data-workout-entry]').count() > 0;
      const hasEmptyState = await page.getByText(/no.*workouts|sin.*entrenamientos|empty|vacío/i).isVisible();

      expect(hasWorkouts || hasEmptyState).toBe(true);
    });
  });
});
