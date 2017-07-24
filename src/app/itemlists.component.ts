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
    this.appService.alveo.pullToken(this.appService.auth.key);
    setTimeout(() => {this.appService.alveo.pullAPI()}, 3000);
    setTimeout(() => {this.appService.alveo.pullLists()}, 5000);
  }

  getLists(): any {
    console.log(this.appService.alveo.lists);
    return this.appService.alveo.lists;
  }

  onSelect(list): void {
    //this.router.navigate(['./itemlist'], { queryParams: { item: item }});
  }
}
