import { TestBed, inject } from '@angular/core/testing';

import { AlveoClientService } from './alveo-api.service';

describe('AlveoClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlveoClientService]
    });
  });

  it('should be created', inject([AlveoClientService], (service: AlveoClientService) => {
    expect(service).toBeTruthy();
  }));
});
