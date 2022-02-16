import { TestBed } from '@angular/core/testing';

import { ContainerToasterService } from './container-toaster.service';

describe('ContainerToasterService', () => {
  let service: ContainerToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
