import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditEmailRulesModalComponent } from './add-or-edit-email-rules-modal.component';

describe('AddOrEditEmailRulesModalComponent', () => {
  let component: AddOrEditEmailRulesModalComponent;
  let fixture: ComponentFixture<AddOrEditEmailRulesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditEmailRulesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditEmailRulesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
