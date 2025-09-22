import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onToggleView: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onToggleView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vyplňte prosím všechna pole.');
      return;
    }

    try {
      const storedUsers = localStorage.getItem('calendarUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        onLogin({ email: user.email });
      } else {
        setError('Neplatný e-mail nebo heslo.');
      }
    } catch (err) {
      setError('Došlo k chybě při přihlašování.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 transform animate-fade-in-scale">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Přihlášení</h2>
      {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="login-email" className="sr-only">E-mail</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="login-password" className="sr-only">Heslo</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Přihlásit se
        </button>
      </form>
      <p className="text-center text-gray-400 mt-6">
        Nemáte účet?{' '}
        <button onClick={onToggleView} className="font-semibold text-blue-400 hover:text-blue-300">
          Zaregistrujte se
        </button>
      </p>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LoginPage;