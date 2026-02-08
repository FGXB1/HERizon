import { test, expect } from '@playwright/test';

test('Expanded Music Lab Tutorial Flow', async ({ page }) => {
  // 1. Navigate to Music Lab
  await page.goto('http://localhost:3000/music-lab');

  // Check for Intro
  await expect(page.locator('text=Welcome to the Lab')).toBeVisible();
  await expect(page.locator('text=The Producer')).toBeVisible();

  // Start Tutorial
  await page.click('button:has-text("Let\'s Make a Beat")');

  // 2. Kick Step (Columns 1, 5, 9, 13 -> Indices 0, 4, 8, 12)
  await expect(page.locator('text=Step 1: The Foundation')).toBeVisible();
  // Click Kick steps
  await page.click('button[aria-label="Toggle kick step 1"]');
  await page.click('button[aria-label="Toggle kick step 5"]');
  await page.click('button[aria-label="Toggle kick step 9"]');
  await page.click('button[aria-label="Toggle kick step 13"]');

  // 3. Snare Step (Columns 5, 13 -> Indices 4, 12)
  await expect(page.locator('text=Step 2: The Snap')).toBeVisible();
  // Click Snare steps
  await page.click('button[aria-label="Toggle snare step 5"]');
  await page.click('button[aria-label="Toggle snare step 13"]');

  // 4. Hi-Hat Step (Columns 3, 7, 11, 15 -> Indices 2, 6, 10, 14)
  await expect(page.locator('text=Step 3: The Drive')).toBeVisible();
  // Click Hi-Hat steps
  await page.click('button[aria-label="Toggle hihat step 3"]');
  await page.click('button[aria-label="Toggle hihat step 7"]');
  await page.click('button[aria-label="Toggle hihat step 11"]');
  await page.click('button[aria-label="Toggle hihat step 15"]');

  // 5. Bass Step (Columns 3, 7, 11, 15 -> Indices 2, 6, 10, 14)
  await expect(page.locator('text=Step 4: The Grounding')).toBeVisible();
  // Click Bass steps
  await page.click('button[aria-label="Toggle bass step 3"]');
  await page.click('button[aria-label="Toggle bass step 7"]');
  await page.click('button[aria-label="Toggle bass step 11"]');
  await page.click('button[aria-label="Toggle bass step 15"]');

  // 6. Synth Step (Columns 5, 13 -> Indices 4, 12)
  await expect(page.locator('text=Step 5: The Harmony')).toBeVisible();
  // Click Synth steps
  await page.click('button[aria-label="Toggle synth step 5"]');
  await page.click('button[aria-label="Toggle synth step 13"]');

  // 7. Reverb Step
  await expect(page.locator('text=Step 6: The Vibe')).toBeVisible();
  // Adjust Reverb
  const reverbSlider = page.locator('div[role="slider"]').first(); // Assuming Reverb is first slider or identifiable
  // Wait, there are multiple sliders (Tempo, Reverb). Need to be specific.
  // In Effects.tsx, Reverb is likely the one associated with the text 'Reverb'.
  // However, I can't see Effects.tsx content here. Assuming layout is consistent with previous.
  // Tempo slider is in Controls. Reverb slider is in Effects.
  // Let's use bounding box or focus.
  // The reverb slider is inside the Effects component.
  // Let's look for the slider near text "Reverb".
  // Or simply press ArrowRight on the focused slider if it's auto-focused? No.
  // Let's try to find the slider by label if aria-label exists, or by proximity.

  // Previously I used keyboard interaction. Let's try to click the Reverb toggle first if needed?
  // The step says "Click 'Reverb' to turn it on, then set the slider...".
  // The code checkPattern checks `reverbMix >= 35 && reverbMix <= 45`. It doesn't check if toggle is on?
  // Ah, the `checkPattern` only checks `reverbMix`.

  // Find the slider for Reverb. It's likely the second slider on the page (Tempo is first).
  // Or simpler: The Reverb slider is likely the one with max=100 (Tempo is 60-180).
  const sliders = await page.locator('span[role="slider"]').all();
  // Assuming the second one is Reverb (index 1).
  if (sliders.length > 1) {
    await sliders[1].focus();
    // Move to ~40. Assuming range 0-100.
    // Default is 0?
    // Pressing ArrowRight 4 times (steps of 10 usually) or 40 times (steps of 1).
    // Let's try forcing the value if possible, or key presses.
    for (let i = 0; i < 40; i++) {
        await page.keyboard.press('ArrowRight');
    }
  } else {
     // Fallback: maybe only one slider visible?
     console.log("Could not find Reverb slider, trying the first one...");
     await sliders[0].focus();
     for (let i = 0; i < 40; i++) {
        await page.keyboard.press('ArrowRight');
    }
  }

  // 8. Complete Step
  await expect(page.locator('text=You\'re a Producer!')).toBeVisible();

  // 9. Minimized State
  await page.click('button:has-text("Free Play")');
  await expect(page.locator('text=You\'re a Producer!')).toBeHidden();

  // Check for Help Button (HelpCircle icon)
  // The button has HelpCircle icon.
  // Locator: button with svg.lucide-help-circle or similar.
  // Or button with title? I didn't add title.
  // It's the fixed bottom-right button.
  // Let's use visual check or look for the icon.
  const helpBtn = page.locator('.lucide-help-circle').locator('xpath=..'); // Parent button
  await expect(helpBtn).toBeVisible();

  // 10. Restart
  await helpBtn.click();
  await expect(page.locator('text=Welcome to the Lab')).toBeVisible();

  // Capture screenshot of expanded state
  // We want to see the Bass/Synth steps highlighted?
  // Let's go to Bass step again to take a screenshot.
  // But we just restarted.
  // Screenshot the Intro.
  await page.screenshot({ path: 'verification/expanded_tutorial_intro.png' });
});
