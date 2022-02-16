import { TestBed } from '@angular/core/testing';

import { PreloadApiService } from './preload-api.service';

describe('PreloadApiService', () => {
  let service: PreloadApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreloadApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
