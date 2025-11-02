import { TestBed } from '@angular/core/testing';

import { AzureAdAuthService } from './azure-ad-auth.service';

describe('AzureAdAuthService', () => {
  let service: AzureAdAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureAdAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
