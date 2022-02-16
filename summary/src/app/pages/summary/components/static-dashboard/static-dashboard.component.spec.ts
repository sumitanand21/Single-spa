import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { SessionService } from 'src/app/auth/session.service';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';
import { ExactFilterPipe } from 'src/app/libs/exact-filter.pipe';
import { SearchFilterPipe } from 'src/app/libs/search-filter.pipe';
import { SummaryService } from '../../services/summary.service';
import { AnomalyViewComponent } from '../anomaly-view/anomaly-view.component';
import { DatelinechartComponent } from '../datelinechart/datelinechart.component';

import { StaticDashboardComponent } from './static-dashboard.component';

describe('StaticDashboardComponent', () => {
  let component: StaticDashboardComponent;
  let fixture: ComponentFixture<StaticDashboardComponent>;
  let summaryService: SummaryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,MatNativeDateModule, HttpClientTestingModule, ReactiveFormsModule, IonicModule, MatProgressSpinnerModule, MatSelectModule, MatMenuModule, MatDatepickerModule, NgxPaginationModule,ToastrModule.forRoot()],
      declarations: [StaticDashboardComponent, DatelinechartComponent, AnomalyViewComponent, AlphaNumericDirective, ExactFilterPipe, SearchFilterPipe, OrderPipe],
      providers: [ { provide: ToastrService, useClass: ToastrService }],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticDashboardComponent);
    summaryService = TestBed.get(SummaryService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for empty value returns true', () => {
    const value = "Test";
    var result = component.checkEmptyVal(value);
    expect(result).toBe(true);
  })

  it('should check for empty value returns false', () => {
    const value = "";
    var result = component.checkEmptyVal(value);
    expect(result).toBe(false);
  })

  it('should convert local date to UTC',()=>{
    var localDate=null;
    localDate = localDate ? localDate : new Date();
    const resultDate = new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
    expect(component.convertDateToUTC(localDate)).toEqual(resultDate)
  });

  it("Should have called buildChartData function",()=>{
    const data = [{ data: {} }];
    const value = { status: 'success', data: data };
    spyOn(summaryService, 'getChartData').and.returnValue(of(value));
    const spyDD = spyOn(component, 'buildChartData');
    component.setChartData();
    expect(spyDD).toHaveBeenCalled();
  })
});
