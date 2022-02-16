import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertFeatureGroupComponent } from './upsert-feature-group.component';

describe('UpsertFeatureGroupComponent', () => {
  let component: UpsertFeatureGroupComponent;
  let fixture: ComponentFixture<UpsertFeatureGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertFeatureGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertFeatureGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
