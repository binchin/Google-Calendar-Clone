import { Appointment } from './appointment.interface';

export interface CalendarDate {
  appointments: Appointment[];
  date: Date;
}
