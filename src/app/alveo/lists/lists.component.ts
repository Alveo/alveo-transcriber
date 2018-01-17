import { Component, Input } from '@angular/core';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';
import { SessionService } from '../shared/session.service';

import { AuthComponent } from '../auth/auth.component';

import { AnnotatorService } from '../../annotator/shared/annotator.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})

export class ListsComponent {
  constructor(
    private sessionService: SessionService,
    private alveoService: AlveoService) {
  }

  public getList(): Array<any> {
    // If Null?
    return this.sessionService.getActiveList();
  }

  public getListSize(): number {
    let list = this.getList();
    if (list === null) {
      return 0;
    }
    return list['num_items'];
  }

  public getListName(): string {
    let list = this.getList();
    if (list === null) {
      return 'null';
    }
    return list['name'];
  }

  public getListItems(): Array<any> {
    let list = this.getList();
    if (list === null) {
      return [];
    }
    return list['items'];
  }

  public actionBack(): void {
    this.sessionService.navigate(['../']).subscribe();
  }
}
