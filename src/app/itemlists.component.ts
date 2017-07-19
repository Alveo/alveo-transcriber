import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent {
  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  onSelect(clip): void {
    //this.router.navigate(['./itemlist'], { queryParams: { item: item }});
  }
}
