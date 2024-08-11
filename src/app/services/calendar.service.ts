import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Appointment } from '../interfaces/appointment.interface';
import { CalendarDate } from '../interfaces/calendar-date.interface';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private currentDate = new Date();
  private currentMonthSubject = new BehaviorSubject<Date>(this.currentDate);
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  appointments$ = this.appointmentsSubject.asObservable();
  currentMonth$ = this.currentMonthSubject.asObservable();

  prevMonth() {
    const current = this.currentMonthSubject.value;
    const newDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.currentMonthSubject.next(newDate);
  }

  nextMonth() {
    const current = this.currentMonthSubject.value;
    const newDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.currentMonthSubject.next(newDate);
  }

  generateDaysInMonth$(): Observable<CalendarDate[]> {
    return combineLatest([this.currentMonth$, this.appointments$]).pipe(
      map(([date, appointments]) => {
        const daysInMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => {
          const dayDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
          const dayAppointments = appointments.filter(
            (appointment) =>
              new Date(appointment.date).toDateString() ===
              dayDate.toDateString()
          );
          return { date: dayDate, appointments: dayAppointments };
        });
        return days;
      })
    );
  }

  addAppointment(event: Appointment) {
    const currentAppointments = this.appointmentsSubject.value;
    this.appointmentsSubject.next([...currentAppointments, event]);
  }

  updateAppointments(appointments: Appointment[]): void {
    this.appointmentsSubject.next(appointments);
  }

  deleteAppointment(appointment: Appointment): void {
    const updatedAppointments = this.appointmentsSubject.value.filter(
      (a) => a !== appointment
    );
    this.appointmentsSubject.next(updatedAppointments);
  }
}
