import { Component } from '@angular/core';
import { DataService } from './data.service';
import { DurationPipe } from './duration.pipe';

@Component({
  selector: 'selector',
  templateUrl: './selector.component.html',
})

export class SelectorComponent {
  constructor(private dataService: DataService) { }
}
