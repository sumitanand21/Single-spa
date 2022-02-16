import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilerUpsertFeatureGroupComponent } from './profiler-upsert-feature-group.component';

describe('ProfilerUpsertFeatureGroupComponent', () => {
  let component: ProfilerUpsertFeatureGroupComponent;
  let fixture: ComponentFixture<ProfilerUpsertFeatureGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilerUpsertFeatureGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilerUpsertFeatureGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
