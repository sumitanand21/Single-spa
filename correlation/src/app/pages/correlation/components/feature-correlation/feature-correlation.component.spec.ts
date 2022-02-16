import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureCorrelationComponent } from './feature-correlation.component';

describe('FeatureCorrelationComponent', () => {
  let component: FeatureCorrelationComponent;
  let fixture: ComponentFixture<FeatureCorrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureCorrelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureCorrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
