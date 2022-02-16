import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { nwSnapshotService } from './nwsnapshot.service';

describe('nwSnapshotService', () => {

  let httpMock: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [],
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: nwSnapshotService = TestBed.get(nwSnapshotService);
    expect(service).toBeTruthy();
  });
});
