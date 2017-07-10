import { Component, Input } from '@angular/core';

import { PlayerControlService } from './player-control.service';

import { Clip } from './clip';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  constructor(public playCtrlService: PlayerControlService) { }

  @Input() clip: Clip;
}
