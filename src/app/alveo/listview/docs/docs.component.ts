import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlveoService } from '../../shared/alveo.service';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})

export class DocsComponent {
  @Input() docs: any;

  constructor(
    public router: Router,
    public alveoService: AlveoService) { }

  onSelect(item): void {
    //this.selection = item;
    this.alveoService.getAudioFile(item['alveo:url'], (data) => {
      this.router.navigate(['./annotator']);
    });
  }
}
