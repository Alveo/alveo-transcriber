import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'avl-ngt-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  title: string;
  text: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
    this.text = data.text;
  }

  getTitle(): string {
    return this.title;
  }

  getText(): string {
    return this.text;
  }
}
