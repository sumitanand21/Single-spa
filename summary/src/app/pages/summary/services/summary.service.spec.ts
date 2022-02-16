import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SummaryService } from './summary.service';

describe('SummaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: SummaryService = TestBed.get(SummaryService);
    expect(service).toBeTruthy();
  });
});
