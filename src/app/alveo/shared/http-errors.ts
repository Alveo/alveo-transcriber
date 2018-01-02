import { HttpErrorResponse } from '@angular/common/http';

export function ErrorHandler(error: HttpErrorResponse, caller: any) {
  console.log('Caller: `' + caller.constructor.name + '` Error: ' + error.error);
}
