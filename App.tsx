import React, { useState, useCallback, useEffect } from 'react';
import Calendar from './components/Calendar';
import CalendarHeader from './components/CalendarHeader';
import EventModal from './components/EventModal';
import { DownloadIcon } from './components/Icons';
import { CalendarEvent, User } from './types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string,
  }>;
  prompt(): Promise<void>;
}

interface AppProps {
    currentUser: User;
    onLogout: () => void;
}

const App: React.FC<AppProps> = ({ currentUser, onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getEventsKey = useCallback(() => `calendarEvents_${currentUser.email}`, [currentUser.email]);

  // Načtení událostí z localStorage při prvním renderu nebo změně uživatele
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(getEventsKey());
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Nepodařilo se načíst události z localStorage", error);
      setEvents([]);
    }
  }, [getEventsKey]);

  // Uložení událostí do localStorage při každé změně
  useEffect(() => {
    try {
      localStorage.setItem(getEventsKey(), JSON.stringify(events));
    } catch (error) {
        console.error("Nepodařilo se uložit události do localStorage", error);
    }
  }, [events, getEventsKey]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!installPrompt) {
      alert('Aplikaci lze nainstalovat pouze v podporovaném prohlížeči (např. Chrome na Androidu). Zkuste v menu prohlížeče vybrat "Přidat na plochu".');
      return;
    }
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }, []);

  const handleAddEvent = useCallback((title: string) => {
    if (selectedDate) {
      const newEvent: CalendarEvent = {
        date: selectedDate.toISOString().split('T')[0],
        title,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
      handleCloseModal();
    }
  }, [selectedDate, handleCloseModal]);

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-2xl mx-auto text-white flex flex-col items-center">
        <div className="w-full bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <CalendarHeader 
              currentDate={currentDate} 
              onPrevMonth={handlePrevMonth} 
              onNextMonth={handleNextMonth}
              currentUser={currentUser}
              onLogout={onLogout}
            />
            <Calendar currentDate={currentDate} events={events} onDayClick={handleDayClick} />
          </div>
        </div>
        {installPrompt && (
          <button
            onClick={handleInstallClick}
            aria-label="Nainstalovat aplikaci"
            className="mt-8 flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg transform hover:scale-105"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Nainstalovat aplikaci
          </button>
        )}
      </div>
      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddEvent}
        date={selectedDate}
      />
    </main>
  );
};

export default App;