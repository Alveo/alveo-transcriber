import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export function ErrorHandler(error: HttpErrorResponse, caller: any) {
  console.log("Caller: `"+caller.constructor.name+"` Error: "+error.error);
}
