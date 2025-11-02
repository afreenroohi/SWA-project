import { TestBed } from '@angular/core/testing';

import { DocumentHandleService } from './document-handle.service';

describe('DocumentHandleService', () => {
  let service: DocumentHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
