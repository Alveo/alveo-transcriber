import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css'],
})

export class ItemListComponent {
  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  getList(): any {
    return this.appService.alveo.storage.list;
  }

  onSelect(list): void {
    //this.appSerice.alveo.pullList(list.item_list_url);
    //this.router.navigate(['./itemlist']);
  }

  actionBack(): void {
    this.router.navigate(['./itemlists']);
  }
}
