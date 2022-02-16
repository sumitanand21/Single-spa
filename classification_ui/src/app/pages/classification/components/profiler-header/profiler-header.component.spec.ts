import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilerHeaderComponent } from './profiler-header.component';

describe('ProfilerHeaderComponent', () => {
  let component: ProfilerHeaderComponent;
  let fixture: ComponentFixture<ProfilerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
