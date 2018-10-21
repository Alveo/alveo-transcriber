import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { SessionService } from '../../session/session.module';

/* Component for displaying a login dialog and explanatory message.
 *
 * This component must be injected through MatDialog in order to
 * function properly. The AuthService has been set up to handle
 * this for you through the promptLogin() method, it also provides
 * other helpful methods related to the login state, so you should
 * make use of this component through the service.
 *
 * The data parameter takes the following key/values:
 * @firstRun: boolean: This will change the text displayed on the
 *  dialog. A first run will explain more about why and where to log
 *  in and also to register, a standard run will just remind you that
 *  you need to do it. It looks a bit cleaner and helps new users.
 *
 *  By default will be false.
 *
 * @callbackRoute: Array<string>: This is an array of strings to build
 *  a path for the application to return you to after you have logged in
 *  and the OAuth route has worked its magic. See the Angular URL path
 *  builder for more information.
 *
 *  By default window.location.pathname will be used.
 *
 * @loginUrl: string: This is the URL we are to redirect to after
 *  the user has clicked the login button. Note that it is not an
 *  Array of strings and is expected to be a final, ready to use string.
 *
 *  An exception will be thrown if null.
 */
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
})
export class LoginDialogComponent {
  public isFirstRun: boolean;
  private loginUrl: string;
  private callbackRoute: Array<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    let isFirstRun = this.data['firstRun'];
    if (isFirstRun == null) {
      isFirstRun = false;
    }
    this.isFirstRun = isFirstRun;

    let callbackRoute = this.data['callbackRoute'];
    if (callbackRoute == null) {
      callbackRoute = [window.location.pathname];
    }
    this.callbackRoute = callbackRoute;

    const loginUrl = this.data['loginUrl'];
    if (loginUrl == null) {
      /* We can't allow a null/undefined loginUrl as we would
       * be redirecting to an undefined location.*/
      throw new Error(('loginUrl should not be null.'));
      console.log('Error for LoginDialog data: loginUrl should not be null.');
    }
    this.loginUrl = loginUrl;
  }

  public async actionLogin(): Promise<any> {
    // Wait for the callback URL to be set, it has to run through
    //  to the indexeddb so we have to wait for the promise to resolve.
    await this.sessionService.setCallbackRoute(this.callbackRoute);

    // Navigate the browser away from the application
    location.href = this.loginUrl;
  }
}
