import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Appointment } from '../../interfaces/appointment.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;

  @Output() appointmentAdded = new EventEmitter<Appointment>();

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const event = this.appointmentForm.value;
      this.appointmentAdded.emit(event);
      this.appointmentForm.reset();
    }
  }
}
