import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreviewDMComponent } from './data-preview-dm.component';

describe('DataPreviewDMComponent', () => {
  let component: DataPreviewDMComponent;
  let fixture: ComponentFixture<DataPreviewDMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPreviewDMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPreviewDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
