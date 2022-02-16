import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationHeaderComponent } from './correlation-header.component';
import { CorrelationService } from '../../services/correlation.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('CorrelationHeaderComponent', () => {
  let component: CorrelationHeaderComponent;
  let fixture: ComponentFixture<CorrelationHeaderComponent>;

  const routePath = [{ path: 'forecast/modelconfig', redirectTo: '' }];
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelationHeaderComponent ],
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes(routePath),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
