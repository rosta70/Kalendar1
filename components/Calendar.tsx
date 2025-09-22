
import React, { useMemo } from 'react';
import { CalendarDay } from '../types';

interface CalendarProps {
  currentDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate }) => {
  const daysOfWeek = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  const calendarGrid: CalendarDay[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Monday is 0, Sunday is 6
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    const lastDayOfPrevMonth = new Date(year, month, 0);
    const daysInPrevMonth = lastDayOfPrevMonth.getDate();

    const grid: CalendarDay[] = [];

    // Days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      grid.push({
        date: new Date(year, month - 1, day),
        dayOfMonth: day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0,0,0,0);
      grid.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // Days from next month
    const totalCells = 42; // 6 rows * 7 days
    let nextMonthDay = 1;
    while (grid.length < totalCells) {
      grid.push({
        date: new Date(year, month + 1, nextMonthDay),
        dayOfMonth: nextMonthDay,
        isCurrentMonth: false,
        isToday: false,
      });
      nextMonthDay++;
    }

    return grid;
  }, [currentDate]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-400 mb-2">
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {calendarGrid.map((day, index) => {
          const isCurrent = day.isCurrentMonth;
          const isToday = day.isToday;

          let cellClasses = "flex items-center justify-center h-10 w-10 rounded-full cursor-pointer transition-colors duration-200 ";
          
          if (isToday) {
            cellClasses += "bg-blue-500 text-white font-bold shadow-lg";
          } else if (isCurrent) {
            cellClasses += "text-gray-200 hover:bg-gray-700";
          } else {
            cellClasses += "text-gray-500";
          }

          return (
            <div key={index} className={cellClasses}>
              {day.dayOfMonth}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
