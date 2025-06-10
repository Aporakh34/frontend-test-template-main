import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AuthPage.css';
import type {
  AuthError,
  LoginCodeRequest,
  RegisterEmailRequest,
  SessionSuccess,
} from '../../types/api';

function isEmail(value: string) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
}
function isCode(value: string) {
  return /^\d{16}$/.test(value);
}
const API = '/v1';

const AuthPage: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmail(value)) {
      setLoading(true);
      try {
        const body: RegisterEmailRequest = { email: value, lang: 'ru' };
        const res = await fetch(`${API}/user/register/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success('PIN отправлен на email');
          navigate('/auth/email', { state: { email: value } });
        } else {
          const data: AuthError = await res.json();
          toast.error(data?.error?.message || 'Ошибка отправки PIN');
        }
      } catch {
        toast.error('Ошибка сети');
      } finally {
        setLoading(false);
      }
    } else if (isCode(value)) {
      setLoading(true);
      try {
        const body: LoginCodeRequest = { login_code: value };
        const res = await fetch(`${API}/auth/login/code`, {
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
          toast.error(data?.error?.message || 'Ошибка входа по коду');
        }
      } catch {
        toast.error('Ошибка сети');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Введите корректный email или 16-значный код');
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('session', 'google-mock-session');
    toast.info('Вход через Google (mock)');
    navigate('/profile');
  };

  return (
    <div className="auth-root">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        data-testid="auth-form"
      >
        <h2>Вход</h2>
        <input
          type="text"
          placeholder="Email или 16-значный код"
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            marginTop: 12,
            background: '#fff',
            color: '#222',
            border: '1px solid #e5e7eb',
          }}
        >
          Войти через Google
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
