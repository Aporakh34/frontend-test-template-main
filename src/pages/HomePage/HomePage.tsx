import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="home-root">
      <div className="home-card">
        <h1>Добро пожаловать!</h1>
        <button onClick={() => navigate('/auth')}>Войти</button>
        <button onClick={() => navigate('/reg')}>Зарегистрироваться</button>
      </div>
    </div>
  );
}
