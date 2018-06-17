import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BackendClientService } from './backend-client.service';
import { AlveoClientInterceptor } from './alveo-client.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AlveoClientInterceptor,
      multi: true
    },
    BackendClientService
  ]
})
export class AlveoClientModule { }

export { AlveoClientService } from './alveo-client.service';
