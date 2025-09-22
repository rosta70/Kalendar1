import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { User } from '../types';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  currentUser: User;
  onLogout: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, currentUser, onLogout }) => {
  const formattedDate = new Intl.DateTimeFormat('cs-CZ', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div>
        <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-gray-200 w-48">{capitalize(formattedDate)}</h2>
            <div className="flex items-center space-x-2">
                <button
                onClick={onPrevMonth}
                aria-label="Předchozí měsíc"
                className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
                </button>
                <button
                onClick={onNextMonth}
                aria-label="Následující měsíc"
                className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                </button>
            </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>Přihlášen jako: <strong>{currentUser.email}</strong></span>
            <button onClick={onLogout} className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Odhlásit se
            </button>
        </div>
    </div>
  );
};

export default CalendarHeader;