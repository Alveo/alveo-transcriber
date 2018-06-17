import {
  Injector,
  Injectable
} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AlveoClientService } from './alveo-client.service';

@Injectable()
export class AlveoClientInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const alveoClientService = this.injector.get(AlveoClientService);

    let accept = "";
    if (request.responseType == "json") {
      accept = "application/json"
    } else {
      accept = request.responseType;
    }

    // Alveo won't by default return JSON, so we inject the 
    // 'Accept' parameter into the headers based on the
    // responseType expected.
    request = request.clone({
      setHeaders: {
        'Accept': accept
      }
    });

    const apiKey = alveoClientService.getApiKey();
    if (apiKey != null) {
      request = request.clone({
        setHeaders: {
          'X-Api-Key': apiKey
        }
      });

      console.log('Made authenticated API request to (AlveoClient) ' + request.url);
    } else {
      console.log('Made unauthenticated API request to (AlveoClient) ' + request.url);
    }

    return next.handle(request);
  }
}
