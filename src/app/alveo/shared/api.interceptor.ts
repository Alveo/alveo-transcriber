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
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);

    if (request.url.startsWith(environment.alveoPaths.mainUrl)) {
      request = request.clone({
        setHeaders: {
          'X-Api-Key': authService.getApiKey(),
          'Accept': 'application/json'
        }
      });

      console.log('Made API request to ' + request.url);
    }

    return next.handle(request);
  }
}
