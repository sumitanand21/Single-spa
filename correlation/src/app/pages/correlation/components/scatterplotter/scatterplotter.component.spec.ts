import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterplotterComponent } from './scatterplotter.component';

describe('ScatterplotterComponent', () => {
  let component: ScatterplotterComponent;
  let fixture: ComponentFixture<ScatterplotterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterplotterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterplotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
