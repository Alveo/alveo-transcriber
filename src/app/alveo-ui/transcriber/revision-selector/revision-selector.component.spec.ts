import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionSelectorComponent } from './revision-selector.component';

describe('RevisionSelectorComponent', () => {
  let component: RevisionSelectorComponent;
  let fixture: ComponentFixture<RevisionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
