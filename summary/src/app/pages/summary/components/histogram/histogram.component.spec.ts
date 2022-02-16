import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';
import { assetUrl } from 'src/single-spa/asset-url';

import { HistogramComponent } from './histogram.component';

describe('HistogramComponent', () => {
  let component: HistogramComponent;
  let fixture: ComponentFixture<HistogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramComponent ],
      imports:[IonicModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
