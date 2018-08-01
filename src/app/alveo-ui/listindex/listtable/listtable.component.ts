import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-listindex-listtable',
  templateUrl: './listtable.component.html',
  styleUrls: ['./listtable.component.css'],
})

export class ListTableComponent implements OnInit {
  @Input() tableData: any;
  @Output() itemListSelect = new EventEmitter<any>();

  public displayedColumns = ['listName', 'items', 'shared'];
  public dataSource = new MatTableDataSource<Element>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // Create a new datasource
    this.dataSource = new MatTableDataSource<Element>(this.tableData);

    // Let the table datasource know of our paginator object
    // so that it can automatically handle it for us
    this.dataSource.paginator = this.paginator;
  }

  /* Narrows down the table to results matching the searchQuery */
  public applySearchFilter(searchQuery: string): void {
    // Remove white space and convert to lower case as
    // material only filters by lower case, then set it
    // as our data source.
    this.dataSource.filter = searchQuery.trim().toLowerCase();
  }
}
