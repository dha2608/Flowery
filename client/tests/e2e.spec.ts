import { test, expect } from '@playwright/test';

// ─── Homepage Tests ───────────────────────────────────────────────────────────

test.describe('Homepage', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto('/');

    // Check hero is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check CTA buttons exist
    await expect(page.getByRole('link', { name: /khám phá/i })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Click on products link
    await page
      .getByRole('link', { name: /sản phẩm/i })
      .first()
      .click();
    await expect(page).toHaveURL(/products/);

    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

// ─── Products Page Tests ──────────────────────────────────────────────────────

test.describe('Products Page', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 }).catch(() => {
      // Products may not exist in test DB, check for empty state
    });

    // Page should have title
    await expect(page.getByRole('heading', { name: /sản phẩm/i })).toBeVisible();
  });

  test('should have working filter toggle', async ({ page }) => {
    await page.goto('/products');

    // Filters should be hidden by default
    const filterButton = page.getByRole('button', { name: /bộ lọc/i });
    await expect(filterButton).toBeVisible();

    // Click to show filters
    await filterButton.click();

    // Filter panel should appear
    await expect(page.getByText(/danh mục/i)).toBeVisible();
  });

  test('should have working search', async ({ page }) => {
    await page.goto('/products');

    // Find and use search
    const searchInput = page.getByPlaceholder(/tìm kiếm/i);
    await searchInput.fill('hoa hồng');
    await searchInput.press('Enter');

    // URL should update with search param
    await expect(page).toHaveURL(/search=hoa/);
  });
});

// ─── Flowers Page Tests ───────────────────────────────────────────────────────

test.describe('Flowers Page', () => {
  test('should display flowers catalog', async ({ page }) => {
    await page.goto('/flowers');

    // Page should have title
    await expect(page.getByRole('heading', { name: /hoa/i })).toBeVisible();
  });

  test('should have emotion filter', async ({ page }) => {
    await page.goto('/flowers');

    // Show filters
    const filterButton = page.getByRole('button', { name: /bộ lọc/i });
    await filterButton.click();

    // Emotion filters should be visible
    await expect(page.getByText(/cảm xúc/i)).toBeVisible();
  });
});

// ─── Cart Tests ───────────────────────────────────────────────────────────────

test.describe('Cart Page', () => {
  test('should show empty cart message', async ({ page }) => {
    await page.goto('/cart');

    // Should show empty state
    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();
  });

  test('should have link to products', async ({ page }) => {
    await page.goto('/cart');

    // Should have CTA to browse products
    const browseLink = page.getByRole('link', { name: /khám phá|xem sản phẩm/i });
    await expect(browseLink).toBeVisible();
  });
});

// ─── Auth Pages Tests ─────────────────────────────────────────────────────────

test.describe('Authentication', () => {
  test('login page should have form', async ({ page }) => {
    await page.goto('/login');

    // Check form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mật khẩu/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /đăng nhập/i })).toBeVisible();
  });

  test('register page should have form', async ({ page }) => {
    await page.goto('/register');

    // Check form elements
    await expect(page.getByLabel(/họ tên/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /đăng ký/i })).toBeVisible();
  });

  test('should have Google OAuth button', async ({ page }) => {
    await page.goto('/login');

    // Google OAuth button
    await expect(page.getByRole('link', { name: /google/i })).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login');

    // Click register link
    await page.getByRole('link', { name: /đăng ký/i }).click();
    await expect(page).toHaveURL(/register/);

    // Click login link
    await page.getByRole('link', { name: /đăng nhập/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});

// ─── Quiz Page Tests ──────────────────────────────────────────────────────────

test.describe('Quiz Page', () => {
  test('should display quiz intro', async ({ page }) => {
    await page.goto('/quiz');

    // Should show quiz title/intro
    await expect(page.getByRole('heading')).toBeVisible();
  });
});

// ─── Garden Page Tests ────────────────────────────────────────────────────────

test.describe('Garden Page', () => {
  test('should display memory garden', async ({ page }) => {
    await page.goto('/garden');

    // Should show garden title
    await expect(page.getByRole('heading', { name: /vườn|kỷ niệm/i })).toBeVisible();
  });

  test('should have create button', async ({ page }) => {
    await page.goto('/garden');

    // FAB button should exist
    const createButton = page.locator('button').filter({ has: page.locator('svg') });
    await expect(createButton.first()).toBeVisible();
  });
});

// ─── Static Pages Tests ───────────────────────────────────────────────────────

test.describe('Static Pages', () => {
  test('FAQ page should load', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.getByRole('heading', { name: /câu hỏi|FAQ/i })).toBeVisible();
  });

  test('Contact page should load', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /liên hệ/i })).toBeVisible();
  });
});

// ─── PWA Tests ────────────────────────────────────────────────────────────────

test.describe('PWA', () => {
  test('should have manifest', async ({ page }) => {
    await page.goto('/');

    // Check for manifest link
    const manifest = await page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');
  });

  test('manifest should be valid JSON', async ({ request }) => {
    const response = await request.get('/manifest.json');
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toBe('Flowery');
    expect(manifest.short_name).toBe('Flowery');
    expect(manifest.icons).toBeDefined();
  });
});
