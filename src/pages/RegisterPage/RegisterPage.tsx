import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RegisterPage.css';
import type {
  AuthError,
  RegisterCodeSuccess,
  RegisterEmailRequest,
} from '../../types/api';

const API = '/v1';

export default function RegisterPage() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  function isEmail(value: string) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  }

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast.error('Введите корректный email');
      return;
    }
    setLoading(true);
    try {
      const body: RegisterEmailRequest = { email, lang: 'ru' };
      const res = await fetch(`${API}/user/register/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success('PIN отправлен на email');
        navigate('/auth/email', { state: { email } });
      } else {
        const data: AuthError = await res.json();
        toast.error(data?.error?.message || 'Ошибка отправки PIN');
      }
    } catch {
      toast.error('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/user/register/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data: RegisterCodeSuccess = await res.json();
        toast.success('Анонимный код успешно создан!');
        navigate('/reg/code', { state: { code: data.data.login_code } });
      } else {
        const data: AuthError = await res.json();
        toast.error(data?.error?.message || 'Ошибка анонимной регистрации');
      }
    } catch {
      toast.error('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-card">
        <h2>Регистрация</h2>
        <form
          data-testid="register-form"
          onSubmit={handleEmail}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться по email'}
          </button>
        </form>
        <button type="button" onClick={handleAnonymous} disabled={loading}>
          {loading ? 'Загрузка...' : 'Анонимная регистрация'}
        </button>
      </div>
    </div>
  );
}
