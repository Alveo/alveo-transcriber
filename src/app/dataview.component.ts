import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css'],
})

export class DataViewComponent {
  @Input() items: any;

  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  onSelect(list): void {
    //this.router.navigate(['./items']);
  }
}
