export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarEvent {
  date: string; // Uloženo jako YYYY-MM-DD pro zamezení problémů s časovými zónami
  title: string;
}

export interface User {
  email: string;
}