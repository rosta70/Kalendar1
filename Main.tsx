import React, { useState, useEffect, useCallback } from 'react';
import App from './App';
import AuthPage from './components/AuthPage';
import { User } from './types';

const Main: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Nepodařilo se načíst uživatele ze sessionStorage", error);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = useCallback((user: User) => {
        setCurrentUser(user);
        try {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        } catch (error) {
            console.error("Nepodařilo se uložit uživatele do sessionStorage", error);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        try {
            sessionStorage.removeItem('currentUser');
        } catch (error) {
            console.error("Nepodařilo se odebrat uživatele ze sessionStorage", error);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Načítání...</div>
            </div>
        );
    }
    
    return currentUser ? (
        <App currentUser={currentUser} onLogout={handleLogout} />
    ) : (
        <AuthPage onLogin={handleLogin} />
    );
};

export default Main;