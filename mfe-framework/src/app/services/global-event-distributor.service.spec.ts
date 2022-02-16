import { TestBed } from '@angular/core/testing';

import { GlobalEventDistributorService } from './global-event-distributor.service';

describe('GlobalEventDistributorService', () => {
  let service: GlobalEventDistributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalEventDistributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
