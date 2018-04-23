import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JsAlveo } from '@alveo-vl/jsalveo';

import { ApiService } from './api.service';
import { SessionService } from './session.service';

import { AuthComponent } from '../auth/auth.component';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  private onLogin: EventEmitter<any> = new EventEmitter();
  private onLogout: EventEmitter<any> = new EventEmitter();

  private loginUrl: string = environment.alveoPaths.mainUrl + '/' + environment.alveoPaths.loginSuffix;

  private clientID: string = environment.clientID;
  private clientSecret: string = environment.clientSecret;
  private callbackUrl: string = environment.callbackURL;

  private loggedIn: boolean = false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }

  private createLoginUrl() {
    return this.loginUrl
          + '?response_type=code'
          + '&client_id='     + encodeURIComponent(this.clientID)
          + '&state='         + encodeURIComponent('')
          + '&redirect_uri='  + encodeURIComponent(this.callbackUrl)
          + '&scope='         + encodeURIComponent('');
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public isApiAuthed(): boolean {
    return this.isLoggedIn();
  }

  public async initiateLogin(callbackRoute?: any): Promise<any>{
    if (callbackRoute == null) {
      callbackRoute = [window.location.pathname];
    }
    await this.sessionService.setCallbackRoute(callbackRoute);
    location.href = this.createLoginUrl();
  }

  public promptLogin(firstRun: boolean= false): void {
    setTimeout(() => {
      if (this.dialog.openDialogs.length < 1) {
        this.dialog.open(AuthComponent, {
          disableClose: firstRun,
          data: {
            firstRun: firstRun,
            loginUrl: this.createLoginUrl()
          }
        });
      }
    }, 50);
  }

  async login(authCode: string): Promise<any> {
    await this.authoriseApi(authCode);
    this.onLogin.emit();
    this.loggedIn = true;
  }

  public logout(): void {
    this.onLogout.emit();
    this.loggedIn = false;
  }

  public authoriseApi(authCode: string): Promise<any> {
    return this.apiService.oAuthenticate(
      this.clientID,
      this.clientSecret,
      authCode,
      this.callbackUrl
    );
  }
}
