import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md">
        {isLoginView ? (
          <LoginPage onLogin={onLogin} onToggleView={toggleView} />
        ) : (
          <RegisterPage onRegister={onLogin} onToggleView={toggleView} />
        )}
      </div>
    </main>
  );
};

export default AuthPage;