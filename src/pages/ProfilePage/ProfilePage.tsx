import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('session');
    setSession(s);
    if (!s) navigate('/');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/');
  };

  return (
    <div className="profile-root">
      <div className="profile-card">
        <h2>Профиль</h2>
        <div>
          <div className="profile-session-label">Session:</div>
          <div className="profile-session-value">{session}</div>
        </div>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
}
