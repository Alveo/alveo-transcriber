import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'itemlists',
  templateUrl: './itemlists.component.html',
  styleUrls: ['./itemlists.component.css'],
})

export class ItemListsComponent {
  constructor(
    public router: Router,
    public dataService: DataService) { }

  onSelect(clip): void {
    //this.router.navigate(['./itemlist'], { queryParams: { item: item }});
  }
}
