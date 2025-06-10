import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => navigate };
});

import AuthPage from './AuthPage';

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

describe('AuthPage', () => {
  it('показывает ошибку при невалидном email и коде', async () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'bad' },
    });
    fireEvent.submit(screen.getByTestId('auth-form'));
    expect(await screen.findByText(/корректный email/i)).toBeInTheDocument();
  });

  it('отправляет запрос при валидном email', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as unknown as Response),
    );

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.submit(screen.getByTestId('auth-form'));
    expect(global.fetch).toHaveBeenCalledWith(
      '/v1/user/register/email',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('отправляет запрос при валидном 16-значном коде', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { session: 'abc' } }),
      } as unknown as Response),
    );

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: '1234567890123456' },
    });
    fireEvent.submit(screen.getByTestId('auth-form'));

    await waitFor(() => {
      expect(localStorage.getItem('session')).toBe('abc');
    });
  });

  it('сохраняет сессию и редиректит при Google-моке', () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /google/i }));
    expect(localStorage.getItem('session')).toBe('google-mock-session');
    expect(navigate).toHaveBeenCalledWith('/profile');
  });
});
