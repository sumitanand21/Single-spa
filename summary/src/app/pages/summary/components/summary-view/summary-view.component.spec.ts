import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { PaginatePipe } from 'ngx-pagination';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { SummaryService } from '../../services/summary.service';

import { SummaryViewComponent } from './summary-view.component';

describe('SummaryViewComponent', () => {
  let component: SummaryViewComponent;
  let fixture: ComponentFixture<SummaryViewComponent>;
  let summaryService: SummaryService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, MatSelectModule,BrowserAnimationsModule ,FormsModule, RouterTestingModule, HttpClientTestingModule, MatDialogModule, ToastrModule.forRoot()],
      declarations: [SummaryViewComponent],
      providers: [{ provide: ToastrService, useClass: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryViewComponent);
    summaryService = TestBed.get(SummaryService)
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called getDashboardList Function', () => {
    const spyGetModel = spyOn(component, 'getDashboardList');
    component.ngOnInit();
    expect(spyGetModel).toHaveBeenCalled();
  })

  it('should have called getIframeDetails function', () => {
    const data = {
      "dashBoardName": "Static dashboard",
      "dataSetName": "test",
      "dashBoardType": "Static Dashboard",
      "dashBoardUrl": null
    };
    const value = { status: 'success', data: data };
    spyOn(summaryService, 'getIframeList').and.returnValue(of(value));
    const spyDD = spyOn(component, 'getIframeDetails');
    component.getDashboardList();
    expect(spyDD).toHaveBeenCalled();
  })

  it('should set dropDownData to empty', () => {
    const value = { status: 'failed', data: null };
    spyOn(summaryService, 'getIframeList').and.returnValue(of(value));
    component.getDashboardList();
    expect(component.datasetDropdown).toEqual([]);
  })

  it('should navigate to Iframe component', () => {
    const data = {
      "dashBoardName": "Iframe",
      "dataSetName": "test",
      "dashBoardType": "Iframe",
      "dashBoardUrl": null
    };
    const navigationpath='/vax-summary/summary/summaryview/iframe';
    const navigateSpy = spyOn(router, 'navigate');
    component.getIframeDetails(data);
    expect(navigateSpy).toHaveBeenCalledWith([navigationpath]);
  })

  it('should navigate to Static Dashboard component', () => {
    const data = {
      "dashBoardName": "Static Dashboard",
      "dataSetName": "test",
      "dashBoardType": "Static Dashboard",
      "dashBoardUrl": null
    };
    const navigationpath='/vax-summary/summary/summaryview/sdashboard';
    const navigateSpy = spyOn(router, 'navigate');
    component.getIframeDetails(data);
    expect(navigateSpy).toHaveBeenCalledWith([navigationpath]);
  })
});
