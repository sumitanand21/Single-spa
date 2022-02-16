import { TestBed } from '@angular/core/testing';

import { GlobalService } from './global.service';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule,MatDialog} from '@angular/material';

describe('GlobalService', () => {
  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule,MatDialogModule],
    providers: [],

  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: GlobalService = TestBed.get(GlobalService);
    expect(service).toBeTruthy();
  });
});
