import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutChartComponent } from './donut-chart.component';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


@Component({
  selector  : 'app-test-cmp',
  template  : ' <app-donut-chart [grappData]="selectedModel"></app-donut-chart>',
 })
 class TestCmpWrapperComponent {
  temptabledatadetails = {
    status: 'success',
    data: {
        modelConfigName: 'OP1_AM1',
        modelName: 'Ae_loieas_hhgvh',
        status: 'Active',
        modelType: 'Model 1',
        dataSet: 'Config ABC',
        acuracy: '0.98877',
        lossFunction: 'Mean Square Error',
        anmdResult: {
            normalData: 2000,
            abnormalData: 243,
            timeUsed: '12 Hours 30 Min 20 Sec',
            speed: '212 KB/Sec',
            noOfJobsRunning: 13,
            gpuMemoryUsages: 0,
              gpuUsages: 0,
             cpuUsages: 0,
            memoryUsages: 0
            },
        training: {
            dataRange: 'Oct-17-2020 15:30 To Oct-19-2020 15:30 (48 hrs)',
            startTime: '14:32:01 Oct-19-2020',
            timeused: '12 hours 30 minutes 20 seconds',
            taskName: 'AM2erv',
            noOfObs: 32211,
            noOfComp: '10 > 7 > 3> 7',
            features: [
                {
                    name: 'adasf',
                    rank: 1,
                    count: 121,
                    value: 100
                },
                {
                    name: 'adahsf',
                    rank: 2,
                    count: 121,
                    value: 90
                },
                {
                    name: 'ada2sf',
                    rank: 3,
                    count: 121,
                    value: 80
                },
                {
                    name: 'ad0asf',
                    rank: 5,
                    count: 121,
                    value: 60
                },
                {
                    name: 'adaskf',
                    rank: 4,
                    count: 121,
                    value: 70
                },
                {
                    name: 'adaskhf',
                    rank: 6,
                    count: 121,
                    value: 50
                },
                {
                    name: 'ada78sf',
                    rank: 7,
                    count: 121,
                    value: 40
                },
                {
                    name: 'ada891sf',
                    rank: 8,
                    count: 121,
                    value: 30
                },
                {
                    name: 'ad99asf',
                    rank: 9,
                    count: 121,
                    value: 20
                },
                {
                    name: 'adsdasf',
                    rank: 10,
                    count: 121,
                    value: 10
                }
            ],
            featureCount: 39
        }
    }
};
  selectedModel = this.temptabledatadetails.data; // mock your input
 }

describe('DonutChartComponent', () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<TestCmpWrapperComponent>;
  const routes: Routes = [

  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutChartComponent,
      TestCmpWrapperComponent],
      imports: [RouterTestingModule,
      ChartsModule, HttpClientTestingModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      NgxPaginationModule,
      FilterPipeModule,
      Ng2SearchPipeModule,
      OrderModule,
      ModalModule.forRoot(),
      ToastrModule.forRoot(),
      BrowserAnimationsModule],
      providers: [DatePipe, BsModalService, ThemeService,
        { provide: ToastrService, useClass: ToastrService }],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCmpWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



