import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

  displayedColumns = ['listName', 'items', 'shared'];
  dataSource: ListDataSource = null;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  ngOnInit(): void {
    this.dataSource = new ListDataSource(this.paginator, this.tableData);
  }
}

export interface ListData {
  listName: string;
  items: number;
  shared: boolean;
}

export class ListDataSource extends DataSource<any> {
  dataChange: BehaviorSubject<ListData[]> = new BehaviorSubject<ListData[]>([]);
  get data(): ListData[] { return this.dataChange.value; }

  constructor(private _paginator: MdPaginator, tableData: any) {
    super();

    for (var list of tableData) {
      this.addList(list);
    }
  }

  /** Adds a new user to the database. */
  addList(list: any) {
    const copiedData = this.data.slice();
    copiedData.push({
      listName: list.name,
      items: list.num_items,
      shared: list.shared,
    });
    this.dataChange.next(copiedData);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ListData[]> {
    const displayDataChanges = [
      this.dataChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.data.slice();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {}
}

