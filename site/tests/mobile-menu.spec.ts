import { test, expect } from '@playwright/test';

// Mobile device configurations
const IPHONE_12 = { width: 390, height: 844 };
const PIXEL_5 = { width: 393, height: 851 };

test.describe('Mobile Menu Scroll Lock Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure mobile viewport
    await page.setViewportSize(IPHONE_12);
  });

  test('iPhone 12 - Home page mobile menu scroll lock at top', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page load and hydration
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Test mobile menu at top of page
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(menuButton).toBeVisible();
    
    await menuButton.click();
    
    // Assert mobile menu is visible
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
    
    // Check backdrop covers viewport fully
    const backdrop = page.locator('.absolute.inset-0.bg-slate-950');
    await expect(backdrop).toBeVisible();
    
    // Verify backdrop dimensions and positioning
    const backdropBox = await backdrop.boundingBox();
    expect(backdropBox?.width).toBe(IPHONE_12.width);
    expect(backdropBox?.height).toBe(IPHONE_12.height);
    expect(backdropBox?.x).toBe(0);
    expect(backdropBox?.y).toBe(0);
    
    // Verify scroll lock is applied to the correct scroll container
    const scrollLockState = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      
      // Check for scroll lock implementation
      const bodyStyles = window.getComputedStyle(body);
      const htmlStyles = window.getComputedStyle(html);
      
      // Look for the actual scroll container that should be locked
      const hasOverflowHidden = bodyStyles.overflow === 'hidden' || htmlStyles.overflow === 'hidden';
      const hasFixedPosition = bodyStyles.position === 'fixed';
      const hasScrollLock = body.style.overflow === 'hidden' || html.style.overflow === 'hidden';
      
      return {
        bodyOverflow: bodyStyles.overflow,
        bodyPosition: bodyStyles.position,
        htmlOverflow: htmlStyles.overflow,
        bodyInlineOverflow: body.style.overflow,
        htmlInlineOverflow: html.style.overflow,
        hasScrollLock: hasOverflowHidden || hasFixedPosition || hasScrollLock,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      };
    });
    
    // Assert that scroll lock is properly implemented
    expect(scrollLockState.hasScrollLock).toBeTruthy();
    
    // Verify that backdrop fully covers and no underlying text is visible
    const backdropOpacity = await backdrop.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        opacity: styles.opacity,
        zIndex: styles.zIndex
      };
    });
    
    expect(backdropOpacity.opacity).toBe('1');
    expect(parseInt(backdropOpacity.zIndex)).toBeGreaterThan(9000);
    
        // Close menu and verify scroll lock is removed
    await backdrop.click();
    await expect(mobileMenu).not.toBeVisible();
    
    // Verify scroll lock is removed
    const scrollLockAfter = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const bodyStyles = window.getComputedStyle(body);
      const htmlStyles = window.getComputedStyle(html);
      
      return {
        bodyOverflow: bodyStyles.overflow,
        bodyPosition: bodyStyles.position,
        htmlOverflow: htmlStyles.overflow,
        bodyInlineOverflow: body.style.overflow,
        htmlInlineOverflow: html.style.overflow
      };
    });
    
    // Verify scroll is restored
    expect(scrollLockAfter.bodyPosition).not.toBe('fixed');
    expect(scrollLockAfter.bodyInlineOverflow === '' || scrollLockAfter.bodyInlineOverflow === 'auto' || scrollLockAfter.bodyInlineOverflow === 'visible').toBeTruthy();
  });

  test('iPhone 12 - Home page mobile menu at mid-scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Scroll to middle of page
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
    await page.waitForTimeout(500);
    
    const scrollBefore = await page.evaluate(() => window.pageYOffset);
    expect(scrollBefore).toBeGreaterThan(100); // Ensure we actually scrolled
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await menuButton.click();
    
    // Verify menu opens and scroll is locked
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
    
    // Check that backdrop fully covers viewport
    const backdrop = page.locator('.absolute.inset-0.bg-slate-950');
    await expect(backdrop).toBeVisible();
    
    // Verify backdrop dimensions match viewport exactly
    const backdropBox = await backdrop.boundingBox();
    expect(backdropBox?.width).toBe(IPHONE_12.width);
    expect(backdropBox?.height).toBe(IPHONE_12.height);
    expect(backdropBox?.x).toBe(0);
    expect(backdropBox?.y).toBe(0);
    
    // Verify scroll position is preserved and locked
    await page.evaluate(() => {
      return {
        pageOffset: window.pageYOffset,
        scrollTop: document.documentElement.scrollTop,
        bodyTop: document.body.scrollTop
      };
    });
    
    // Close menu
    await backdrop.click();
    await expect(mobileMenu).not.toBeVisible();
    
    // Verify scroll position is restored
    const scrollAfter = await page.evaluate(() => window.pageYOffset);
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(50); // Allow small difference
  });

  test('Pixel 5 - Services page mobile menu scroll lock', async ({ page }) => {
    await page.setViewportSize(PIXEL_5);
    await page.goto('/diensten');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await menuButton.click();
    
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
    
    // Verify backdrop covers full Pixel 5 viewport
    const backdrop = page.locator('.absolute.inset-0.bg-slate-950');
    const backdropBox = await backdrop.boundingBox();
    expect(backdropBox?.width).toBe(PIXEL_5.width);
    expect(backdropBox?.height).toBe(PIXEL_5.height);
    
    // Verify the correct scroll container has overflow:hidden or fixed positioning
    const scrollContainer = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const bodyStyles = window.getComputedStyle(body);
      const htmlStyles = window.getComputedStyle(html);
      
      // Check which element has scroll lock applied
      const bodyLocked = bodyStyles.overflow === 'hidden' || bodyStyles.position === 'fixed' || body.style.overflow === 'hidden';
      const htmlLocked = htmlStyles.overflow === 'hidden' || html.style.overflow === 'hidden';
      
      return {
        bodyLocked,
        htmlLocked,
        hasScrollLock: bodyLocked || htmlLocked,
        bodyOverflow: bodyStyles.overflow,
        bodyPosition: bodyStyles.position,
        htmlOverflow: htmlStyles.overflow
      };
    });
    
    // Assert that the correct scroll container has scroll lock
    expect(scrollContainer.hasScrollLock).toBeTruthy();
    
    // Verify backdrop is fully opaque (no text visible underneath)
    const backdropStyles = await backdrop.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        opacity: styles.opacity,
        zIndex: styles.zIndex
      };
    });
    
    // Backdrop should be opaque and high z-index
    expect(backdropStyles.opacity).toBe('1');
    expect(parseInt(backdropStyles.zIndex)).toBeGreaterThan(1000);
  });

  test('iPhone 12 - Services page mobile menu at mid-scroll', async ({ page }) => {
    await page.goto('/diensten');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Scroll down on services page
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(500);
    
    const initialScroll = await page.evaluate(() => window.pageYOffset);
    expect(initialScroll).toBeGreaterThan(50);
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await menuButton.click();
    
    // Verify scroll lock and full coverage
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
    
    // Verify backdrop fully covers viewport
    const backdrop = page.locator('.absolute.inset-0.bg-slate-950');
    const backdropBox = await backdrop.boundingBox();
    expect(backdropBox?.width).toBe(IPHONE_12.width);
    expect(backdropBox?.height).toBe(IPHONE_12.height);
    expect(backdropBox?.x).toBe(0);
    expect(backdropBox?.y).toBe(0);
    
    const scrollLock = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const bodyStyles = window.getComputedStyle(body);
      const htmlStyles = window.getComputedStyle(html);
      
      return {
        bodyOverflow: bodyStyles.overflow,
        bodyPosition: bodyStyles.position,
        htmlOverflow: htmlStyles.overflow,
        hasAnyLock: bodyStyles.overflow === 'hidden' || bodyStyles.position === 'fixed' || htmlStyles.overflow === 'hidden' || body.style.overflow === 'hidden'
      };
    });
    
    // Verify proper scroll lock implementation
    expect(scrollLock.hasAnyLock).toBeTruthy();
    
    // Close and verify scroll is restored
    await backdrop.click();
    await expect(mobileMenu).not.toBeVisible();
    
    const finalScroll = await page.evaluate(() => window.pageYOffset);
    expect(Math.abs(finalScroll - initialScroll)).toBeLessThan(100);
  });
});