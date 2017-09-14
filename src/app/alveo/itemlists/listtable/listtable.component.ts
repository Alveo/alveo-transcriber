import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'listtable',
  templateUrl: './listtable.component.html',
  styleUrls: ['./listtable.component.css'],
})

export class ListTableComponent implements OnInit {
  @Input() tableData: any;
  @Output() onSelection = new EventEmitter<any>();
  selection: any;

  displayedColumns = ['listName', 'items', 'shared'];
  dataSource: ListDataSource = null;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  ngOnInit(): void {
    this.dataSource = new ListDataSource(this.paginator, this.tableData);
  }

  onSelect(item): void {
    this.selection = item;
    this.onSelection.emit(item);
  }
}

export class ListDataSource extends DataSource<any> {
  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get data(): any { return this.dataChange.value; }

  constructor(private _paginator: MdPaginator, tableData: any) {
    super();

    for (var list of tableData) {
      this.addList(list);
    }
  }

  addList(list: any) {
    const copiedData = this.data.slice();
    copiedData.push(list);
    this.dataChange.next(copiedData);
  }

  /* This is based on the material.angular.io pagination example */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.dataChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.data.slice();

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {}
}
