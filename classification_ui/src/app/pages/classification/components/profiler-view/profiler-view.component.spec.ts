import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilerViewComponent } from './profiler-view.component';

describe('ProfilerViewComponent', () => {
  let component: ProfilerViewComponent;
  let fixture: ComponentFixture<ProfilerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
