import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('SoundController', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('is enabled by default', async () => {
    const mod = await import('@/lib/sounds');
    expect(mod.sounds.getStatus()).toBe(true);
  });

  it('toggle flips enabled state', async () => {
    const mod = await import('@/lib/sounds');
    const initial = mod.sounds.getStatus();
    mod.sounds.toggle();
    expect(mod.sounds.getStatus()).toBe(!initial);
    mod.sounds.toggle();
    expect(mod.sounds.getStatus()).toBe(initial);
  });

  it('playPop does not throw when called', async () => {
    const mod = await import('@/lib/sounds');
    expect(() => mod.sounds.playPop()).not.toThrow();
  });

  it('playSwitch does not throw when called', async () => {
    const mod = await import('@/lib/sounds');
    expect(() => mod.sounds.playSwitch()).not.toThrow();
  });

  it('playHover does not throw when called', async () => {
    const mod = await import('@/lib/sounds');
    expect(() => mod.sounds.playHover()).not.toThrow();
  });

  it('playClick does not throw when called', async () => {
    const mod = await import('@/lib/sounds');
    expect(() => mod.sounds.playClick()).not.toThrow();
  });

  it('respects disabled state and does not play sounds', async () => {
    const mod = await import('@/lib/sounds');
    mod.sounds.toggle();
    const AudioContextSpy = vi.fn();
    vi.stubGlobal('AudioContext', AudioContextSpy);
    mod.sounds.playPop();
    expect(AudioContextSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('does not throw if AudioContext is not available', async () => {
    const mod = await import('@/lib/sounds');
    vi.stubGlobal('AudioContext', undefined);
    expect(() => mod.sounds.playPop()).not.toThrow();
    vi.unstubAllGlobals();
  });
});
