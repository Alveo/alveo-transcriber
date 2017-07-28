import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;

  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  onSelect(item): void {
    //this.selection = item;
    this.router.navigate(['./annotator']);
  }
}
