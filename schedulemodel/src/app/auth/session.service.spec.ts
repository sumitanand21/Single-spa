import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SessionService', () => {
  // tslint:disable-next-line:prefer-const
  let component: SessionService;
  let fixture: ComponentFixture<SessionService>;
  let httpMock: HttpTestingController;
 // beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    fixture = TestBed.createComponent(SessionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });
  it('should be created', () => {
    const service: SessionService = TestBed.get(SessionService);
    expect(service).toBeTruthy();
  });
  it('should set key value', () => {
    component.setKeyValue('key', 'value');
    expect(component.setKeyValue).toBe('testdata');
    expect(component.setKeyValue).toBe('1');
  });

  it('should get key value', () => {
    component.getKeyValue('key');
    expect(component.getKeyValue).toBe('testdata');
  });
  it('should remove key value', () => {
    component.removeKey('key');
    expect(component.removeKey).toBe('testdata');
  });
});
