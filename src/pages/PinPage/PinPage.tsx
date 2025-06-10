import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PinPage.css';
import type {
  AuthError,
  LoginEmailRequest,
  RegisterEmailRequest,
  SessionSuccess,
} from '../../types/api';

const API = '/v1';

type PinPageLocationState = { email?: string };

export default function PinPage({
  initialTimer = 60,
}: { initialTimer?: number } = {}) {
  const [pin, setPin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState(initialTimer);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PinPageLocationState | null;
  const email = state?.email || '';

  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const body: RegisterEmailRequest = { email, lang: 'ru' };
      await fetch(`${API}/user/register/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setTimer(60);
      toast.success('PIN отправлен повторно!');
    } catch {
      toast.error('Ошибка при повторной отправке PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(pin)) {
      toast.error('Введите 6-значный PIN');
      return;
    }
    if (!email) {
      toast.error('Email не найден. Попробуйте войти заново.');
      return;
    }
    setLoading(true);
    try {
      const body: LoginEmailRequest = { email, pincode: Number(pin) };
      const res = await fetch(`${API}/auth/login/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data: SessionSuccess = await res.json();
        localStorage.setItem('session', data.data.session);
        toast.success('Вход выполнен!');
        navigate('/profile');
      } else {
        const data: AuthError = await res.json();
        toast.error(data?.error?.message || 'Ошибка входа');
      }
    } catch {
      toast.error('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-root">
      <form className="pin-form" onSubmit={handleSubmit} data-testid="pin-form">
        <h2>Введите PIN</h2>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          placeholder="6-значный PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || loading}
          style={{ marginTop: 8 }}
        >
          {timer > 0
            ? `Отправить PIN повторно через ${timer} сек`
            : 'Отправить PIN повторно'}
        </button>
      </form>
    </div>
  );
}
