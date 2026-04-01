'use client';

/**
 * Triggers a subtle 'haptic' screen shake effect by adding a temporary CSS class to the body.
 * This provides visual physical feedback for important user interactions.
 */
export const triggerImpact = () => {
  if (typeof document === 'undefined') return;
  
  const body = document.body;
  body.classList.remove('shake-impact');
  // Force reflow to allow re-triggering the animation
  void body.offsetWidth; 
  body.classList.add('shake-impact');
  
  // Optional: add real haptic feedback for supported mobile devices
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignore vibration errors as it might be blocked by browser policy
    }
  }
};
