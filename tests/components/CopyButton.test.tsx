import { render, screen, fireEvent, act } from '@/tests/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CopyButton from '@/components/CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  it('renders with correct aria label', () => {
    render(<CopyButton text="test@email.com" label="email" />);
    expect(screen.getByTitle('Copy email')).toBeInTheDocument();
  });

  it('copies text to clipboard on click', async () => {
    const writeTextSpy = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });
    render(<CopyButton text="hello@world.com" label="email" />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy email'));
    });
    expect(writeTextSpy).toHaveBeenCalledWith('hello@world.com');
  });

  it('shows copied toast after successful copy', async () => {
    render(<CopyButton text="test@test.com" label="email" />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy email'));
    });
    expect(screen.getByText('Copied! ✓')).toBeInTheDocument();
  });

  it('falls back to execCommand if clipboard API fails', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn(() => Promise.reject(new Error('fail'))) } });
    document.execCommand = vi.fn(() => true);
    const createElementSpy = vi.spyOn(document, 'createElement');
    render(<CopyButton text="fallback@test.com" label="email" />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy email'));
    });
    expect(createElementSpy).toHaveBeenCalledWith('textarea');
    expect(screen.getByText('Copied! ✓')).toBeInTheDocument();
    createElementSpy.mockRestore();
  });
});
