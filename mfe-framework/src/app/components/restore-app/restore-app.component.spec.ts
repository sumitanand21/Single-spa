import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreAppComponent } from './restore-app.component';

describe('RestoreAppComponent', () => {
  let component: RestoreAppComponent;
  let fixture: ComponentFixture<RestoreAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
