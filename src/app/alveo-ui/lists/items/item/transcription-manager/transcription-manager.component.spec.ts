import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionManagerComponent } from './transcription-manager.component';

describe('TranscriptionManagerComponent', () => {
  let component: TranscriptionManagerComponent;
  let fixture: ComponentFixture<TranscriptionManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptionManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
