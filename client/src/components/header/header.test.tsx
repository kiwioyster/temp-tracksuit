import { describe, expect, it, afterEach, vi } from 'vitest';
import { Header, HEADER_TEXT } from './header.tsx';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

describe('header', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders header text', () => {
    render(<Header />);
    expect(screen.getByText(HEADER_TEXT)).toBeTruthy();
  });

  it('renders add insight button', () => {
    render(<Header />);
    expect(screen.getByText('Add insight')).toBeTruthy();
  });

  it('opens add insight modal when button is clicked', () => {
    render(<Header />);
    const button = screen.getByText('Add insight');
    fireEvent.click(button);
    expect(screen.getByText('Add a new insight')).toBeTruthy();
  });
});
