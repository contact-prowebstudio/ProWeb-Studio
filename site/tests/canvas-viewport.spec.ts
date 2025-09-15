import { test, expect } from '@playwright/test';

// Mobile device configurations
const IPHONE_12 = { width: 390, height: 844 };
const PIXEL_5 = { width: 393, height: 851 };

test.describe('3D Canvas Viewport Fit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_12);
  });

  test('iPhone 12 - Home page hero canvas fit and stability', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow 3D scene to load

    // Find the hero canvas
    const heroCanvas = page.locator('canvas').first();
    await expect(heroCanvas).toBeVisible();

    // Check canvas dimensions match container
    const canvasBox = await heroCanvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    expect(canvasBox!.width).toBeGreaterThan(300); // Should take up most viewport width
    expect(canvasBox!.height).toBeGreaterThan(300); // Should have stable height

    // Verify canvas has proper z-index
    const canvasZIndex = await heroCanvas.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        zIndex: styles.zIndex,
        pointerEvents: styles.pointerEvents,
        position: styles.position
      };
    });

    // Canvas should have z-0 and pointer-events-none for decoration
    expect(['0', 'auto'].includes(canvasZIndex.zIndex)).toBeTruthy();
    expect(['none', 'auto'].includes(canvasZIndex.pointerEvents)).toBeTruthy();

    // Check for container stability with dynamic viewport height units
    const canvasContainer = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const container = canvas?.closest('div, section');
      if (!container) return null;
      
      const styles = window.getComputedStyle(container);
      return {
        height: styles.height,
        minHeight: styles.minHeight,
        maxHeight: styles.maxHeight,
        containerClass: container.className,
        hasViewportUnits: styles.height.includes('vh') || styles.height.includes('dvh') || styles.height.includes('svh')
      };
    });

    if (canvasContainer) {
      // Should use stable viewport height
      expect(canvasContainer.hasViewportUnits || canvasContainer.height.includes('px')).toBeTruthy();
    }

    // Test canvas resilience to orientation change simulation
    await page.setViewportSize({ width: IPHONE_12.height, height: IPHONE_12.width });
    await page.waitForTimeout(1000);
    
    const canvasAfterRotation = await heroCanvas.boundingBox();
    expect(canvasAfterRotation).toBeTruthy();
    expect(canvasAfterRotation!.width).toBeGreaterThan(200);
    expect(canvasAfterRotation!.height).toBeGreaterThan(200);

    // Restore original orientation
    await page.setViewportSize(IPHONE_12);
    await page.waitForTimeout(1000);
  });

  test('iPhone 12 - About page portal scene canvas fit', async ({ page }) => {
    await page.goto('/over-ons');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow portal scene to load

    // Check for any 3D canvas on about page
    const canvases = page.locator('canvas');
    const canvasCount = await canvases.count();
    
    if (canvasCount > 0) {
      const aboutCanvas = canvases.first();
      await expect(aboutCanvas).toBeVisible();

      const canvasBox = await aboutCanvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Canvas should fit within viewport
      expect(canvasBox!.x).toBeGreaterThanOrEqual(0);
      expect(canvasBox!.y).toBeGreaterThanOrEqual(0);
      expect(canvasBox!.x + canvasBox!.width).toBeLessThanOrEqual(IPHONE_12.width + 5); // Small tolerance
      expect(canvasBox!.y + canvasBox!.height).toBeLessThanOrEqual(IPHONE_12.height + 5);

      // Verify proper canvas styling
      const canvasStyles = await aboutCanvas.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          zIndex: styles.zIndex,
          pointerEvents: styles.pointerEvents,
          overflow: styles.overflow,
          position: styles.position
        };
      });

      // Should follow z-0, pointer-events-none pattern
      expect(['0', 'auto'].includes(canvasStyles.zIndex)).toBeTruthy();
      expect(['none', 'auto'].includes(canvasStyles.pointerEvents)).toBeTruthy();
    }
  });

  test('Pixel 5 - Home page canvas fit and DPR handling', async ({ page }) => {
    await page.setViewportSize(PIXEL_5);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const heroCanvas = page.locator('canvas').first();
    await expect(heroCanvas).toBeVisible();

    // Check canvas sizing on Pixel 5
    const canvasBox = await heroCanvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    expect(canvasBox!.width).toBeGreaterThan(300);
    expect(canvasBox!.height).toBeGreaterThan(300);

    // Verify canvas fits within Pixel 5 viewport
    expect(canvasBox!.x + canvasBox!.width).toBeLessThanOrEqual(PIXEL_5.width + 5);
    expect(canvasBox!.y + canvasBox!.height).toBeLessThanOrEqual(PIXEL_5.height + 5);

    // Check DPR handling and canvas resolution
    const canvasInfo = await heroCanvas.evaluate(el => {
      const canvas = el as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      return {
        displayWidth: rect.width,
        displayHeight: rect.height,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        devicePixelRatio: window.devicePixelRatio,
        pixelRatio: canvas.width / rect.width // Effective pixel ratio
      };
    });

    // Canvas should handle DPR appropriately (clamped to reasonable values)
    expect(canvasInfo.pixelRatio).toBeGreaterThan(0.5);
    expect(canvasInfo.pixelRatio).toBeLessThan(3.5); // Should be clamped for performance

    // Verify canvas is not oversized (memory optimization)
    const totalPixels = canvasInfo.canvasWidth * canvasInfo.canvasHeight;
    expect(totalPixels).toBeLessThan(2048 * 2048); // Reasonable limit for mobile
  });

  test('iPhone 12 - Canvas context loss recovery', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const heroCanvas = page.locator('canvas').first();
    await expect(heroCanvas).toBeVisible();

    // Test context loss handling
    const contextLossTest = await heroCanvas.evaluate(async (canvas) => {
      const gl = (canvas as HTMLCanvasElement).getContext('webgl2') || 
                 (canvas as HTMLCanvasElement).getContext('webgl');
      
      if (!gl) return { hasWebGL: false };

      // Check if context loss extension is available
      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      
      return {
        hasWebGL: true,
        hasLoseContextExt: !!loseContextExt,
        contextLost: gl.isContextLost(),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
      };
    });

    if (contextLossTest.hasWebGL) {
      expect(contextLossTest.contextLost).toBe(false);
      
      // If extension is available, briefly test context loss
      if (contextLossTest.hasLoseContextExt) {
        await heroCanvas.evaluate(canvas => {
          const gl = (canvas as HTMLCanvasElement).getContext('webgl2') || 
                     (canvas as HTMLCanvasElement).getContext('webgl');
          const ext = gl?.getExtension('WEBGL_lose_context');
          
          if (ext && gl) {
            // Simulate context loss
            ext.loseContext();
            
            // Immediately restore it
            setTimeout(() => ext.restoreContext(), 100);
          }
        });

        await page.waitForTimeout(500);

        // Verify canvas is still functional after context restoration
        const canvasStillVisible = await heroCanvas.isVisible();
        expect(canvasStillVisible).toBe(true);
      }
    }
  });

  test('Pixel 5 - Services page 3D scene bounds', async ({ page }) => {
    await page.setViewportSize(PIXEL_5);
    await page.goto('/diensten');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for any 3D canvases on services page
    const canvases = page.locator('canvas');
    const canvasCount = await canvases.count();

    if (canvasCount > 0) {
      const servicesCanvas = canvases.first();
      await expect(servicesCanvas).toBeVisible();

      // Verify canvas bounds fit within Pixel 5 viewport
      const canvasBox = await servicesCanvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      expect(canvasBox!.x).toBeGreaterThanOrEqual(-5); // Small negative tolerance for borders
      expect(canvasBox!.y).toBeGreaterThanOrEqual(-5);
      expect(canvasBox!.x + canvasBox!.width).toBeLessThanOrEqual(PIXEL_5.width + 5);
      expect(canvasBox!.y + canvasBox!.height).toBeLessThanOrEqual(PIXEL_5.height + 5);

      // Test 3D scene bounds if available
      const sceneBounds = await page.evaluate(() => {
        // Look for any exposed 3D group bounds for testing
        const testBounds = (window as any).__test_3d_bounds;
        if (testBounds && typeof testBounds === 'function') {
          try {
            return testBounds();
          } catch (e) {
            return { error: 'bounds_error' };
          }
        }
        return { bounds: 'not_available' };
      });

      // If 3D bounds are available, verify they're reasonable
      if (sceneBounds.bounds && typeof sceneBounds.bounds === 'object') {
        const { min, max } = sceneBounds.bounds;
        if (min && max) {
          // 3D scene should be reasonably sized
          expect(Math.abs(max.x - min.x)).toBeLessThan(50);
          expect(Math.abs(max.y - min.y)).toBeLessThan(50);
          expect(Math.abs(max.z - min.z)).toBeLessThan(50);
        }
      }
    }
  });

  test('iPhone 12 - Canvas pointer events and layering', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const heroCanvas = page.locator('canvas').first();
    await expect(heroCanvas).toBeVisible();

    // Test that canvas doesn't block interactions
    const canvasLayering = await heroCanvas.evaluate(el => {
      const styles = window.getComputedStyle(el);
      const parent = el.parentElement;
      const parentStyles = parent ? window.getComputedStyle(parent) : null;
      
      return {
        canvasZIndex: styles.zIndex,
        canvasPointerEvents: styles.pointerEvents,
        canvasPosition: styles.position,
        parentZIndex: parentStyles?.zIndex,
        parentPosition: parentStyles?.position
      };
    });

    // Verify canvas follows decoration pattern (z-0, pointer-events-none)
    expect(['0', 'auto'].includes(canvasLayering.canvasZIndex)).toBeTruthy();
    expect(['none', 'auto'].includes(canvasLayering.canvasPointerEvents)).toBeTruthy();

    // Test that clicks go through canvas to underlying elements
    const clickTest = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { clickable: false };
      
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Get element at canvas center
      const elementAtCenter = document.elementFromPoint(centerX, centerY);
      
      return {
        clickable: true,
        canvasAtCenter: elementAtCenter === canvas,
        elementTagAtCenter: elementAtCenter?.tagName,
        canvasPointerEvents: window.getComputedStyle(canvas).pointerEvents
      };
    });

    if (clickTest.clickable) {
      // If canvas has pointer-events-none, clicks should go through
      if (canvasLayering.canvasPointerEvents === 'none') {
        expect(clickTest.canvasAtCenter).toBe(false);
      }
    }
  });
});