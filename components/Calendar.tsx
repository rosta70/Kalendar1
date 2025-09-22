import React, { useMemo } from 'react';
import { CalendarDay, CalendarEvent } from '../types';

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, events, onDayClick }) => {
  const daysOfWeek = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const date = event.date;
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(event);
    });
    return map;
  }, [events]);

  const calendarGrid: CalendarDay[][] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const lastDayOfPrevMonth = new Date(year, month, 0);
    const daysInPrevMonth = lastDayOfPrevMonth.getDate();
    
    const toISODateString = (date: Date) => date.toISOString().split('T')[0];
    
    const grid: CalendarDay[] = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      grid.push({
        date,
        dayOfMonth: day,
        isCurrentMonth: false,
        isToday: false,
        events: eventsByDate.get(toISODateString(date)) || [],
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      grid.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        events: eventsByDate.get(toISODateString(date)) || [],
      });
    }

    const totalCells = grid.length > 35 ? 42 : 35;
    let nextMonthDay = 1;
    while (grid.length < totalCells) {
      const date = new Date(year, month + 1, nextMonthDay);
      grid.push({
        date,
        dayOfMonth: nextMonthDay,
        isCurrentMonth: false,
        isToday: false,
        events: eventsByDate.get(toISODateString(date)) || [],
      });
      nextMonthDay++;
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < grid.length; i += 7) {
      weeks.push(grid.slice(i, i + 7));
    }
    return weeks;
  }, [currentDate, eventsByDate]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            {daysOfWeek.map(day => (
              <th key={day} className="text-center text-sm font-normal text-gray-400 pb-2 border-b border-gray-700">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarGrid.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                const isCurrent = day.isCurrentMonth;
                const isToday = day.isToday;

                let cellClasses = "relative h-28 p-2 align-top border border-gray-700 transition-colors duration-200";
                
                if (isCurrent) {
                  cellClasses += " bg-gray-800 hover:bg-gray-700/50 cursor-pointer";
                } else {
                  cellClasses += " bg-gray-900/50 text-gray-500 cursor-default";
                }

                return (
                  <td
                    key={dayIndex}
                    className={cellClasses}
                    onClick={isCurrent ? () => onDayClick(day.date) : undefined}
                    onKeyDown={isCurrent ? (e) => e.key === 'Enter' && onDayClick(day.date) : undefined}
                    aria-label={`Datum ${day.dayOfMonth}, ${isCurrent ? 'klikněte pro přidání události' : 'mimo aktuální měsíc'}`}
                    role={isCurrent ? 'button' : undefined}
                    tabIndex={isCurrent ? 0 : -1}
                  >
                    <div className={`text-sm ${isToday ? 'bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold' : ''}`}>
                      {day.dayOfMonth}
                    </div>
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-16 pr-1">
                      {day.events.slice(0, 2).map((event, eventIndex) => (
                        <div key={eventIndex} className="bg-blue-900/70 text-blue-200 text-xs px-1.5 py-0.5 rounded-md truncate" title={event.title}>
                          {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                         <div className="text-gray-400 text-xs">+ {day.events.length - 2} další</div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;