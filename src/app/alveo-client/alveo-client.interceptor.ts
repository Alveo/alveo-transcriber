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
import { environment } from '../../../environments/environment';

import { AlveoClientService } from './alveo-client.service';

@Injectable()
export class AlveoClientInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const alveoClientService = this.injector.get(AlveoClientService);

    if (request.url.startsWith(environment.alveoPaths.mainUrl)) {
      request = request.clone({
        setHeaders: {
          'X-Api-Key': alveoClientService.getApiKey()
        }
      });

      console.log('Made API request to (AlveoClient) ' + request.url);
    }

    return next.handle(request);
  }
}
