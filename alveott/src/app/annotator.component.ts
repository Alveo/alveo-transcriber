import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AudioService } from './audio.service';

@Component({
  selector: 'annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.css'],
})

export class AnnotatorComponent {
  constructor(
    public router: Router,
    public dataService: DataService,
    public audioService: AudioService,
  ) { }

  back(): void {
    this.dataService.selected=null
    this.router.navigate(['./selector']);
  }
}
