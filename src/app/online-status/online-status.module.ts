import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineStatusService } from './online-status.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    OnlineStatusService
  ],
  declarations: []
})
export class OnlineStatusModule { }

export { OnlineStatusService } from './online-status.service';
