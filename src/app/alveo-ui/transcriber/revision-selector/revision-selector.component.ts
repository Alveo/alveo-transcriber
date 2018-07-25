import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-revision-selector',
  templateUrl: './revision-selector.component.html',
  styleUrls: ['./revision-selector.component.css']
})
export class RevisionSelectorComponent implements OnInit {
  public isRevisionWindowOpen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }
}
