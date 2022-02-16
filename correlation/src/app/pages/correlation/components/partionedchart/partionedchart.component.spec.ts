import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartionedchartComponent } from './partionedchart.component';

describe('PartionedchartComponent', () => {
  let component: PartionedchartComponent;
  let fixture: ComponentFixture<PartionedchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartionedchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartionedchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
