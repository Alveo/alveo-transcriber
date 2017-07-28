import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppUtilService } from './app-util.service';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent implements OnInit {
  constructor(
    public router: Router,
    public appService: AppUtilService) { }

  ngOnInit() {
    setTimeout(() => {this.appService.alveo.pullIndex()}, 2000);
  }

  getLists(): any {
    return this.appService.alveo.storage.data;
  }

  onSelect(list): void {
    //this.appService.alveo.pullItems(list.item_list_url);
    this.router.navigate(['./dataview']);
  }
}
