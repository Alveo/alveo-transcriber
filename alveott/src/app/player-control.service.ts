import { Injectable } from '@angular/core';

import { Segment } from './segment';

@Injectable()
export class PlayerControlService {
  activeSegment: Segment;
  test(): Segment {
    console.log(this.activeSegment);
    return this.activeSegment;
  }
}
