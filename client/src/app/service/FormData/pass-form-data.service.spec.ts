import { TestBed } from '@angular/core/testing';

import { PassFormDataService } from './pass-form-data.service';

describe('PassFormDataService', () => {
  let service: PassFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
