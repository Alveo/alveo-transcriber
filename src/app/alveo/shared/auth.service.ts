import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

import { AuthComponent } from '../auth/auth.component';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  private loginStatus: EventEmitter<any> = new EventEmitter();
  private loggedIn: boolean = false;

  private loginUrl: string = environment.alveoPaths.mainUrl + '/' + environment.alveoPaths.loginSuffix;

  private clientID: string = environment.clientID;
  private clientSecret: string = environment.clientSecret;
  private callbackUrl: string = environment.callbackURL;

  private apiKey: string = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) { }

  private createLoginUrl() {
    return this.loginUrl
          + '?response_type=code'
          + '&client_id='     + encodeURIComponent(this.clientID)
          + '&state='         + encodeURIComponent('')
          + '&redirect_uri='  + encodeURIComponent(this.callbackUrl)
          + '&scope='         + encodeURIComponent('');
  };

  public getApiKey(): string {
    return this.apiKey;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public isApiAuthed(): boolean {
    return (this.apiKey.length > 0);
  }

  public promptLogin(firstRun: boolean= false) {
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

  public login(authCode: string): Promise<any> {
    this.loginStatus.emit('true');
    this.loggedIn = true;
    return this.authoriseApi(authCode);
  }

  public logout(): void {
    this.loginStatus.emit('false')
    this.loggedIn = false;
    this.apiKey = '';
  }

  private authoriseApi(authCode: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.apiService.getOAuthToken(
          this.clientID,
          this.clientSecret,
          authCode,
          this.callbackUrl,
        ).subscribe(
          data => {
            this.apiService.getApiKey(data['access_token'])
              .subscribe(
                data => {
                  this.apiKey = data['apiKey'];
                  resolve();
                },
                error => {
                  reject(error);
                }
              );
          },
          error => {
            reject(error);
          }
        );
      }
    );
  }
}
