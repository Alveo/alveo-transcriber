import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'error-notify',
  templateUrl: './error-notify.component.html',
  styleUrls: ['./error-notify.component.css']
})
export class ErrorNotifyComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  public refreshPage(): void {
    window.location.reload();
  }

  public close(data: any): void {
  }
}
