import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'error-notify',
  templateUrl: './error-notify.component.html',
  styleUrls: ['./error-notify.component.css']
})
export class ErrorNotifyComponent {
  public snackBarRef: MatSnackBarRef<ErrorNotifyComponent>;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }

  public refreshPage(): void {
    window.location.reload();
  }
}
