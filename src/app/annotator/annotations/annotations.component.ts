import { Component, Input } from '@angular/core';

import { Annotation } from '../shared/annotator.service';

@Component({
  selector: 'annotations',
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css'],
})

export class AnnotationsComponent {
  @Input() annotation: Annotation;
}
