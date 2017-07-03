import { Component } from '@angular/core';
import { DataService } from './data.service';
import { DurationPipe } from './duration.pipe';

@Component({
  selector: 'selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
})

export class SelectorComponent {
  constructor(public dataService: DataService) { }

  onSelect(clip): void {
    this.dataService.selected = clip;
  }
}
