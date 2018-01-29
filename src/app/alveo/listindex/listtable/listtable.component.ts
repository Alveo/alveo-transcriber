import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'listtable',
  templateUrl: './listtable.component.html',
  styleUrls: ['./listtable.component.css'],
})

export class ListTableComponent {
  @Input() tableData: any;
  @Output() onSelection = new EventEmitter<any>();

  private displayedColumns = ['listName', 'items', 'shared'];
  private dataSource = new MatTableDataSource<Element>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Element>(this.tableData);
    this.dataSource.paginator = this.paginator;
  }

  onSelect(item): void {
    this.onSelection.emit(item);
  }
}
