import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatelinechartComponent } from './datelinechart.component';

describe('DatelinechartComponent', () => {
  let component: DatelinechartComponent;
  let fixture: ComponentFixture<DatelinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatelinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatelinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
