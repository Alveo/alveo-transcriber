import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
})

export class AnnotatorComponent {
  constructor(private dataService: DataService) { }
}
