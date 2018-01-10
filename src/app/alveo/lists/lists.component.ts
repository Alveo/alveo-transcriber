import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlveoService } from '../shared/alveo.service';
import { AuthService } from '../shared/auth.service';

import { AuthComponent } from '../auth/auth.component';

import { AnnotatorService } from '../../annotator/shared/annotator.service';

@Component({
  selector: 'lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})

export class ListsComponent {
  constructor(
    private router: Router,
    private alveoService: AlveoService) {
  }

  public getList(): Array<any> {
    return this.alveoService.tmp_list;
  }

  public getListSize(): number {
    let list = this.getList();
    if (list === undefined) {
      return 0;
    }
    return list['num_items'];
  }

  public getListName(): string {
    let list = this.getList();
    if (list === undefined) {
      return 'null';
    }
    return list['name'];
  }

  public getListItems(): Array<any> {
    let list = this.getList();
    if (list === undefined) {
      return [];
    }
    return list['items'];
  }

  public actionBack(): void {
    this.router.navigate(['./']);
  }
}
