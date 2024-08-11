import { Component, inject, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Observable, take, withLatestFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { CalendarDate } from '../../interfaces/calendar-date.interface';
import { Appointment } from '../../interfaces/appointment.interface';
import { DeleteAppointmentComponent } from '../delete-appointment/delete-appointment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    AddAppointmentComponent,
    MatButtonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  private calendarService = inject(CalendarService);
  readonly dialog = inject(MatDialog);
  public daysInMonth$!: Observable<CalendarDate[]>;
  public currentMonth$ = this.calendarService.currentMonth$;
  public dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public emptySpaces: number[] = [];

  ngOnInit(): void {
    this.daysInMonth$ = this.calendarService.generateDaysInMonth$();

    this.currentMonth$.subscribe((date) => {
      this.calculateEmptySpaces(date);
    });
  }

  public prevMonth() {
    this.calendarService.prevMonth();
  }

  public nextMonth() {
    this.calendarService.nextMonth();
  }

  public onAppointmentAdd(appointment: Appointment) {
    this.calendarService.addAppointment(appointment);
  }

  public deleteAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(DeleteAppointmentComponent, {
      width: '300px',
      data: { appointment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarService.deleteAppointment(appointment);
      }
    });
  }

  public drop(event: CdkDragDrop<Appointment[]>): void {
    this.currentMonth$
      .pipe(withLatestFrom(this.calendarService.appointments$), take(1))
      .subscribe(([currentMonth, appointments]) => {
        const target = event.event.target as HTMLElement;
        const firstChild = target.childNodes[0];
        if (!firstChild || !firstChild.textContent) {
          console.error('Invalid day extracted from drop target.');
          return;
        }
        const droppedToDay = +firstChild.textContent.trim();
        if (droppedToDay == 0 || isNaN(droppedToDay)) {
          console.error('Invalid day extracted from drop target.');
          return;
        }
        const droppedToDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          droppedToDay
        );
        const movedAppointment =
          event.previousContainer.data[event.previousIndex];
        const updatedAppointments = appointments.map((e: Appointment) => {
          if (e === movedAppointment) {
            return { ...e, date: droppedToDate.toISOString() };
          }
          return e;
        });
        this.calendarService.updateAppointments(updatedAppointments);
      });
  }

  private calculateEmptySpaces(date: Date): void {
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
    this.emptySpaces = Array(firstDayOfMonth).fill(0);
  }
}
