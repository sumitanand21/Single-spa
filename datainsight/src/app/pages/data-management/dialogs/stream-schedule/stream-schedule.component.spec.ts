import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamScheduleComponent } from './stream-schedule.component';

describe('StreamScheduleComponent', () => {
  let component: StreamScheduleComponent;
  let fixture: ComponentFixture<StreamScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
