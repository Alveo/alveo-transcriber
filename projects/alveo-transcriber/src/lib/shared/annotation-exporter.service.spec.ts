import { TestBed, inject } from '@angular/core/testing';

import { AnnotationExporterService } from './annotation-exporter.service';

describe('AnnotationExporterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnotationExporterService]
    });
  });

  it('should be created', inject([AnnotationExporterService], (service: AnnotationExporterService) => {
    expect(service).toBeTruthy();
  }));
});
