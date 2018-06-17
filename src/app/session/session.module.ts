import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatSnackBarModule
} from '@angular/material';

import { SessionService } from './session.service';
import { ErrorNotifyComponent } from './error-notify/error-notify.component';

@NgModule({
  declarations: [
    ErrorNotifyComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [
    SessionService
  ],
  entryComponents: [
    ErrorNotifyComponent
  ],
})
export class SessionModule { }

export { SessionService } from './session.service';
