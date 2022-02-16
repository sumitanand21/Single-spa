import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertAppComponent } from './upsert-app.component';

describe('UpsertAppComponent', () => {
  let component: UpsertAppComponent;
  let fixture: ComponentFixture<UpsertAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
