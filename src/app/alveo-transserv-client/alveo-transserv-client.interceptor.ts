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
import { Observable } from 'rxjs';

import { AlveoTransServClientService } from './alveo-transserv-client.service';

@Injectable()
export class AlveoTransServClientInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const atsService = this.injector.get(AlveoTransServClientService);

    if (!request.url.startsWith(atsService.getApiUrl())) {
      return next.handle(request);
    }

    const apiKey = atsService.getApiKey();
    const apiAuthDomain = atsService.getApiAuthDomain();
    if (apiKey !== null) {
      request = request.clone({
        setHeaders: {
          'X-Api-Key': apiKey,
          'X-Api-Domain': apiAuthDomain
        }
      });

      console.log('Made authenticated API request to (ATSClient) ' + request.url);
    } else {
      console.log('Made unauthenticated API request to (ATSClient) ' + request.url);
    }

    return next.handle(request);
  }
}

