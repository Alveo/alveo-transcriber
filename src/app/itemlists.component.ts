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

  pullData(): any {
    this.appService.alveo.pullIndex();
  }

  getLists(): any {
    return this.appService.alveo.getLists();
  }

  onSelect(list): void {
    this.appService.alveo.selectedList = list;
    this.router.navigate(['./dataview']);
  }
}
