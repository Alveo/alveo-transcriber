import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths';

/* Component for handling OAuth callback routes */
@Component({
  selector: 'oauth-callback',
  templateUrl: './oauth-callback.component.html',
})
export class OAuthCallbackComponent implements OnInit, OnDestroy {
  param_sub: any;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private authService: AuthService,
  ) { }

  /* Takes a route, provided by the routing module which requires an oauth token
   *  as a route parameter. This then fires the auth service, prompting a request
   *  for an API key from the Alveo server. Once the session service is ready,
   *  the sessionService will navigate the user to the last stored route, if one
   *  is available. Else it will redirect them to the most relevant place to be.
   */
  ngOnInit() {
    this.param_sub = this.route.queryParams.subscribe(
      params => {
        try {
          const oauthCode = params['code'];
          if (oauthCode == null) {
            throw new Error({
              statusCode: 403,
              message: "No auth code provided in argument parameters",
            });
          }
          this.oauthCallback(oauthCode);
        } catch(error) {
          this.sessionService.navigate([Paths.Index]);
        }
      }
    );
  }

  async oauthCallback(callbackCode: string) {
    await this.authService.login(callbackCode);
    await this.sessionService.onReady();
    this.sessionService.navigateToStoredRoute();
  }

  ngOnDestroy() {
    this.param_sub.unsubscribe();
  }
}
