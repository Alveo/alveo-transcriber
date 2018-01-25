import { Component, Input, OnInit } from '@angular/core';

import { AlveoService } from '../shared/alveo.service';
import { SessionService } from '../shared/session.service';

import { Paths } from '../shared/paths';

/* Component to handle an outer list display
 *   Displays list name, size
 *   Provides list items to the items component */
@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  private list: Array<any> = null;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.list = this.sessionService.getActiveList();
  }

  public getList(): Array<any> {
    return this.list;
  }

  public getListSize(): number {
    const list = this.getList();
    if (list === null) {
      return 0;
    }
    return list['num_items'];
  }

  public getListName(): string {
    const list = this.getList();
    if (list === null) {
      return 'null';
    }
    return list['name'];
  }

  public getListItems(): Array<any> {
    const list = this.getList();
    if (list === null) {
      return [];
    }
    return list['items'];
  }

  public actionBack(): void {
    this.sessionService.navigate([Paths.ListIndex]);
  }
}
