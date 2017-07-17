import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { DurationPipe } from './duration.pipe';

@Component({
  selector: 'selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
})

export class SelectorComponent {
  constructor(
    public router: Router,
    public dataService: DataService) { }

  onSelect(clip): void {
    this.dataService.selected = clip;
    this.router.navigate(['./annotator']);
  }
}
