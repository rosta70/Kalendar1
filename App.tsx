import React, { useState, useCallback, useEffect } from 'react';
import Calendar from './components/Calendar';
import CalendarHeader from './components/CalendarHeader';
import { DownloadIcon } from './components/Icons';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string,
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

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
      console.log('Uživatel přijal instalaci');
      setInstallPrompt(null);
    } else {
      console.log('Uživatel odmítl instalaci');
    }
  }, [installPrompt]);

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-sm mx-auto text-white flex flex-col items-center">
        <div className="w-full bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300">
          <div className="p-6">
            <CalendarHeader 
              currentDate={currentDate} 
              onPrevMonth={handlePrevMonth} 
              onNextMonth={handleNextMonth} 
            />
            <Calendar currentDate={currentDate} />
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
    </main>
  );
};

export default App;