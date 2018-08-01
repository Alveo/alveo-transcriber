import { Component, Input } from '@angular/core';

/* The LoadingSpinnerComponent provides us a lazy but consistent
 * way to have a mat-spinner active for the incredible amounts
 * of Promises and Observables the application is built upon.
 *
 * It takes the following inputs:
 * @ spinnerSize: string: Supported values are:
 *    'tiny', 'small', 'medium', 'large'
 *
 *   Labels are used to keep sizing consistent across components,
 *   but perhaps this is not completely needed and should be
 *   explored further.
 *
 *   If set to 'large', the component will utilise most of the view
 *   space, generally useful if no further action can be done until
 *   a promise completes.
 *
 *   Default is 'large'.
 *
 * @ inline: boolean
 *   If set to true, the component will avoid making line breaks.
 *
 *   Default is false.
 */
@Component({
  selector: 'loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() spinnerSize = 'large';
  @Input() inline = false;

  constructor() { }

  public usePageFill(): boolean {
    if (this.spinnerSize === 'large') {
      return true;
    }
    return false;
  }

  public getSpinnerDiameter(): number {
    switch (this.spinnerSize) {
      case 'tiny': {
        return 20;
      }
      case 'small': {
        return 40;
      }
      case 'medium': {
        return 80;
      }
      case 'large': {
        return 140;
      }
    }
  }
}
