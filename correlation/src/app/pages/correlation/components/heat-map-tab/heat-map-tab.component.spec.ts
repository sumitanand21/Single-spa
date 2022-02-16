import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapTabComponent } from './heat-map-tab.component';

describe('HeatMapTabComponent', () => {
  let component: HeatMapTabComponent;
  let fixture: ComponentFixture<HeatMapTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
