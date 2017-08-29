import { Response } from '@angular/http';
import { Observable } from 'rxjs';

export function ErrorHandler(error: Response, caller: any) {
  console.log("Caller: `"+caller.constructor.name+"` Error: "+error.toString())
}
