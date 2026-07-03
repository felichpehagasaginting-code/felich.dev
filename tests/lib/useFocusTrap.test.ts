import { renderHook, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { createRef } from 'react';

describe('useFocusTrap', () => {
  let containerRef: React.RefObject<HTMLDivElement | null>;

  beforeEach(() => {
    vi.clearAllMocks();
    containerRef = createRef<HTMLDivElement>();
    const container = document.createElement('div');
    container.innerHTML = `
      <button>First</button>
      <a href="#">Link</a>
      <input type="text" />
      <button disabled>Disabled</button>
      <button style="display:none">Hidden</button>
      <button>Last</button>
    `;
    document.body.appendChild(container);
    (containerRef as any).current = container;
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('sets up event listeners when active', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    renderHook(() => useFocusTrap(containerRef, true));
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    addSpy.mockRestore();
  });

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useFocusTrap(containerRef, true));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('does not set up listeners when inactive', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    renderHook(() => useFocusTrap(containerRef, false));
    expect(addSpy).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });

  it('auto-focuses first focusable element by default', () => {
    (containerRef as any).current = document.createElement('div');
    const btn = document.createElement('button');
    btn.textContent = 'Test';
    (containerRef as any).current.appendChild(btn);
    document.body.appendChild((containerRef as any).current);
    const focusSpy = vi.spyOn(btn, 'focus');
    renderHook(() => useFocusTrap(containerRef, true));
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it('does not auto-focus when autoFocusFirst is false', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Test';
    (containerRef as any).current.appendChild(btn);
    const focusSpy = vi.spyOn(btn, 'focus');
    renderHook(() => useFocusTrap(containerRef, true, { autoFocusFirst: false }));
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});
