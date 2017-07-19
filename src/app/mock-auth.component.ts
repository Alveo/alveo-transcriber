import { Component } from '@angular/core';
import { AppUtilService } from './app-util.service';

@Component({
  selector: 'mock-auth',
  templateUrl: './mock-auth.component.html',
  styleUrls: ['./mock-auth.component.css'],
})

export class MockAuthComponent {
  constructor(public appService: AppUtilService) { }

  actionLogin(): void {
    this.appService.auth.initiateLogin();
  }
}
