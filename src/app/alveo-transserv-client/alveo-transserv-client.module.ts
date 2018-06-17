import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AlveoTransServClientService } from './alveo-transserv-client.service';
import { AlveoTransServClientInterceptor  } from './alveo-transserv-client.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AlveoTransServClientService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AlveoTransServClientInterceptor,
      multi: true
    }
  ],
  declarations: []
})
export class AlveoTransServClientModule { }

export { AlveoTransServClientService } from './alveo-transserv-client.service';
