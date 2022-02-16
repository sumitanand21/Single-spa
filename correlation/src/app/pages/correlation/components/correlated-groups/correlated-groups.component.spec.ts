import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelatedGroupsComponent } from './correlated-groups.component';

describe('CorrelatedGroupsComponent', () => {
  let component: CorrelatedGroupsComponent;
  let fixture: ComponentFixture<CorrelatedGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelatedGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelatedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
