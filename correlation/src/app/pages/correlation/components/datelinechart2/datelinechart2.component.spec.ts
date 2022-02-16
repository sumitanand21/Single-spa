import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Datelinechart2Component } from './datelinechart2.component';

describe('DatelinechartComponent', () => {
  let component: Datelinechart2Component;
  let fixture: ComponentFixture<Datelinechart2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Datelinechart2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Datelinechart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
