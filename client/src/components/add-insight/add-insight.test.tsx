import { describe, expect, it, afterEach } from 'vitest';
import { AddInsight } from './add-insight.tsx';
import { render, screen, cleanup } from '@testing-library/react';
import { BRANDS } from '../../lib/consts.ts';

describe('add-insight', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders when open', () => {
    render(<AddInsight open={true} onClose={() => {}} />);
    expect(screen.getByText('Add a new insight')).toBeTruthy();
  });

  it('shows brand dropdown with options', () => {
    render(<AddInsight open={true} onClose={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeTruthy();
    BRANDS.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('shows textarea for insight text', () => {
    render(<AddInsight open={true} onClose={() => {}} />);
    const textarea = screen.getByPlaceholderText('Something insightful...');
    expect(textarea).toBeTruthy();
  });

  it('shows submit button', () => {
    render(<AddInsight open={true} onClose={() => {}} />);
    expect(screen.getByText('Add insight')).toBeTruthy();
  });
});
