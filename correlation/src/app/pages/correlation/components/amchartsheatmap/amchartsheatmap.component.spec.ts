import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartsheatmapComponent } from './amchartsheatmap.component';

describe('AmchartsheatmapComponent', () => {
  let component: AmchartsheatmapComponent;
  let fixture: ComponentFixture<AmchartsheatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmchartsheatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmchartsheatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
