import { describe, expect, it, afterEach, vi } from 'vitest';
import { Insights } from './insights.tsx';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

describe('insights', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockInsights = [
    { id: 1, brand: 0, createdAt: new Date(), text: 'Test 1' },
    { id: 2, brand: 1, createdAt: new Date(), text: 'Test 2' },
  ];

  it('renders empty state when no insights', () => {
    render(<Insights insights={[]} />);
    expect(screen.getByText('We have no insight!')).toBeTruthy();
  });

  it('renders insights list when insights exist', () => {
    render(<Insights insights={mockInsights} />);
    expect(screen.getByText('Test 1')).toBeTruthy();
    expect(screen.getByText('Test 2')).toBeTruthy();
  });

  it('calls delete and refresh when delete icon is clicked', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true });
    const onRefresh = vi.fn();

    render(<Insights insights={mockInsights} onRefresh={onRefresh} />);

    const deleteButtons = screen.getAllByRole('button');
    await fireEvent.click(deleteButtons[0]);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/insights/1', {
      method: 'DELETE',
    });
    expect(onRefresh).toHaveBeenCalled();
  });

  it('handles delete error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Failed to delete'));

    render(<Insights insights={mockInsights} />);

    const deleteButtons = screen.getAllByRole('button');
    await fireEvent.click(deleteButtons[0]);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
