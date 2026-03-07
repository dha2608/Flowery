import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Homepage', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Flowers', path: '/flowers' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
  { name: 'Cart', path: '/cart' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

test.describe('Accessibility Tests', () => {
  for (const page of pages) {
    test(`${page.name} page should have no critical accessibility violations`, async ({
      page: p,
    }) => {
      await p.goto(page.path);

      // Wait for page to fully load
      await p.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page: p })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter only serious and critical violations
      const seriousViolations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      // Log all violations for debugging
      if (results.violations.length > 0) {
        console.log(`\n${page.name} accessibility issues:`);
        results.violations.forEach((v) => {
          console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
          console.log(`    Help: ${v.helpUrl}`);
          console.log(`    Affected: ${v.nodes.length} element(s)`);
        });
      }

      expect(seriousViolations).toHaveLength(0);
    });
  }
});
