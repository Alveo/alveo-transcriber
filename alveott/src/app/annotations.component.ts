import { Component, Input } from '@angular/core';

import { Clip } from './clip';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  @Input() clip: Clip;
}
