import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Appointment } from '../../interfaces/appointment.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-appointment',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
  ],
  templateUrl: './delete-appointment.component.html',
  styleUrl: './delete-appointment.component.scss',
})
export class DeleteAppointmentComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteAppointmentComponent>);
  readonly data = inject<Appointment>(MAT_DIALOG_DATA);

  deleteAppointment(): void {
    this.dialogRef.close(true);
  }
}
