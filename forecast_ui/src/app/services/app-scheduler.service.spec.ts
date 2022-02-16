import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';

import { AppSchedulerService } from './app-scheduler.service';

describe('AppSchedulerService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [HttpClientTestingModule, MatDialogModule]}));

  it('should be created', () => {
    const service: AppSchedulerService = TestBed.get(AppSchedulerService);
    expect(service).toBeTruthy();
  });
});
