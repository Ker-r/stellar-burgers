import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/api.har', {
    url: 'https://norma.education-services.ru/api/**',
    notFound: 'fallback'
  });
});

test.describe('Конструктор бургера', () => {
  test.describe('Добавление ингредиентов', () => {
    test('должен добавлять булку в конструктор', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('[data-cy="ingredient-item"]')
        .filter({ hasText: 'Краторная булка' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await expect(
        page.locator('[data-cy="constructor-bun-top"]')
      ).toContainText('Краторная булка');
    });

    test('должен добавлять начинку в конструктор', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('[data-cy="ingredient-item"]')
        .filter({ hasText: 'Биокотлета' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await expect(
        page.locator('[data-cy="constructor-ingredients"]')
      ).toContainText('Биокотлета');
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('должен открываться при клике на ингредиент', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('[data-cy="ingredient-item"]')
        .filter({ hasText: 'Краторная булка' })
        .click();

      await expect(page.locator('[data-cy="modal"]')).toBeVisible();
      await expect(page.locator('[data-cy="modal"]')).toContainText(
        'Краторная булка'
      );
    });

    test('должен отображать данные того ингредиента на который кликнули', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('[data-cy="ingredient-item"]')
        .filter({ hasText: 'Биокотлета' })
        .click();

      await expect(page.locator('[data-cy="modal"]')).toContainText(
        'Биокотлета'
      );
    });

    test('должен закрываться по клику на крестик', async ({ page }) => {
      await page.goto('/');

      await page.locator('[data-cy="ingredient-item"]').first().click();

      await expect(page.locator('[data-cy="modal"]')).toBeVisible();

      await page.locator('[data-cy="modal-close"]').click();

      await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
    });

    test('должен закрываться по клику на оверлей', async ({ page }) => {
      await page.goto('/');

      await page.locator('[data-cy="ingredient-item"]').first().click();

      await expect(page.locator('[data-cy="modal"]')).toBeVisible();

      await page.mouse.click(10, 300);

      await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'test-refresh-token');
      });
      await page.context().addCookies([
        {
          name: 'accessToken',
          value: 'Bearer test-access-token',
          domain: 'localhost',
          path: '/'
        }
      ]);
    });

    test.afterEach(async ({ page }) => {
      await page.evaluate(() => {
        localStorage.removeItem('refreshToken');
      });
      await page.context().clearCookies();
    });

    test('должен создавать заказ, показывать номер и очищать конструктор', async ({ page }) => {
      await page.goto('/');

      await page
        .locator('[data-cy="ingredient-item"]')
        .filter({ hasText: 'Краторная булка' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await page
        .locator('[data-cy="ingredient-item"]')
        .filter({ hasText: 'Биокотлета' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await page.locator('[data-cy="order-button"]').click();

      await expect(page.locator('[data-cy="modal"]')).toBeVisible();
      await expect(page.locator('[data-cy="order-number"]')).toContainText('12345');

      await page.locator('[data-cy="modal-close"]').click();

      await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();

      await expect(
        page.locator('[data-cy="constructor-bun-top"]')
      ).not.toBeVisible();
      await expect(
      page.locator('[data-cy="constructor-ingredients"]')
      ).not.toContainText('Биокотлета');
    });
  });
});
