import React, { useState } from 'react';
import { User } from '../types';

interface RegisterPageProps {
  onRegister: (user: User) => void;
  onToggleView: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onToggleView }) => {
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
    if (password.length < 6) {
        setError('Heslo musí mít alespoň 6 znaků.');
        return;
    }

    try {
      const storedUsers = localStorage.getItem('calendarUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        setError('Uživatel s tímto e-mailem již existuje.');
        return;
      }
      
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('calendarUsers', JSON.stringify(users));
      
      onRegister({ email });

    } catch (err) {
      setError('Došlo k chybě při registraci.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 transform animate-fade-in-scale">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Registrace</h2>
      {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="register-email" className="sr-only">E-mail</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="register-password" className="sr-only">Heslo</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo (min. 6 znaků)"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Zaregistrovat se
        </button>
      </form>
      <p className="text-center text-gray-400 mt-6">
        Máte již účet?{' '}
        <button onClick={onToggleView} className="font-semibold text-blue-400 hover:text-blue-300">
          Přihlaste se
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

export default RegisterPage;