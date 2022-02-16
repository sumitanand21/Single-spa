import { TestBed } from '@angular/core/testing';

import { AppSchedulerService } from './app-scheduler.service';

describe('AppSchedulerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppSchedulerService = TestBed.get(AppSchedulerService);
    expect(service).toBeTruthy();
  });
});
