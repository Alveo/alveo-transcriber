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
    setTimeout(() => {this.appService.alveo.pullLists()}, 1000);
  }

  getLists(): any {
    return this.appService.alveo.storage.lists;
  }

  onSelect(list): void {
    this.appService.alveo.pullList(list.item_list_url);
    this.router.navigate(['./items']);
  }
}
