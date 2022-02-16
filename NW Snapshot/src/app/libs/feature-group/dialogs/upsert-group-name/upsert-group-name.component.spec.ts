import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertGroupNameComponent } from './upsert-group-name.component';

describe('UpsertGroupNameComponent', () => {
  let component: UpsertGroupNameComponent;
  let fixture: ComponentFixture<UpsertGroupNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertGroupNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertGroupNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
