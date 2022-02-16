import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelatedGroupsViewComponent } from './correlated-groups-view.component';

describe('CorrelatedGroupsViewComponent', () => {
  let component: CorrelatedGroupsViewComponent;
  let fixture: ComponentFixture<CorrelatedGroupsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelatedGroupsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelatedGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
