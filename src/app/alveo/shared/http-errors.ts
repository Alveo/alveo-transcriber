import { HttpErrorResponse } from '@angular/common/http';

export function ErrorHandler(error: HttpErrorResponse, caller: any) {
  console.log(
    'Error (' + error.status.toString() + ') received by `'
    + caller.constructor.name + '`: ' + error.message
  );
}
