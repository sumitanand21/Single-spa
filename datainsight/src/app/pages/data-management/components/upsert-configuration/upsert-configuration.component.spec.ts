import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertConfigurationComponent } from './upsert-configuration.component';

describe('UpsertConfigurationComponent', () => {
  let component: UpsertConfigurationComponent;
  let fixture: ComponentFixture<UpsertConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
