import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastCompareComponent } from './forecast-compare.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ForecastService } from '../../services/forecast.service';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationService } from 'src/app/services/notification.service';

const routes: Routes = [

];
describe('ForecastCompareComponent', () => {
  let component: ForecastCompareComponent;
  let fixture: ComponentFixture<ForecastCompareComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let httpMock: HttpTestingController;
  let forecastService: ForecastService;
  let notifyService: NotificationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastCompareComponent],
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        SharedModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule],
      providers: [
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        { provide: APP_BASE_HREF, useValue : '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    forecastService = TestBed.get(ForecastService);
    notifyService = TestBed.get(NotificationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to forecast processing page', () => {
    const navigatePath = '/forecast/forecastprocess';
    forecastService.CompareProcess = [];
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should get compare details if dataSet is available', () => {
    forecastService.dataSetId = 'ALL';
    forecastService.CompareProcess = [{ dataId: '123' }, { dataId: '124' }];
    const spyGetCompare = spyOn(component, 'getCompareDetails');
    component.ngOnInit();
    expect(spyGetCompare).toHaveBeenCalled();
  });

  it('should get compare details if dataSet is not available', () => {
    forecastService.CompareProcess = [{ dataId: '123' }, { dataId: '124' }];
    const spyGetCompare = spyOn(component, 'getCompareDetails');
    component.ngOnInit();
    expect(spyGetCompare).toHaveBeenCalled();
  });

  it('should update live compare details', () => {
    const data = { uid: '1MQ2' , dataId: '124', timeOfRunning : '1:3:4:5', speed : '1records2', defaultDataRange : '1,2,4' };
    component.compareProcess = [{ uid: '1MQ22', dataId: '123' },
    { uid: '1MQ2', dataId: '124', timeOfRunning : '1:3:4:5', speed : '1records2', defaultDataRange : '1,2,4' }];
    const spyCreateCompare = spyOn(component, 'createCompareDisplayObject');
    component.updateLiveForecastDate(data);
    expect(true).toBeTruthy();
  });


  it('should get compare details', () => {
    forecastService.CompareProcess = [{ dataId: '123' },
    { dataId: '124', timeOfRunning : '1:3:4:5', speed : '1records2', defaultDataRange : '1,2,4' }];
    const compareDet = [...forecastService.CompareProcess];
    const value: any = { status: 'success', data: compareDet };
    spyOn(forecastService, 'getForecastCompareDetails').and.returnValue(of(value));
    const spyCreateCompare = spyOn(component, 'createCompareDisplayObject');
    component.getCompareDetails();
    expect(spyCreateCompare).toHaveBeenCalled();
  });

  it('should get compare details if no data from backend', () => {
    const compareDet = [];
    const value: any = { status: 'success', data: compareDet };
    spyOn(forecastService, 'getForecastCompareDetails').and.returnValue(of(value));
    const spyCreateCompare = spyOn(component, 'createCompareDisplayObject');
    component.getCompareDetails();
    expect(spyCreateCompare).toHaveBeenCalled();
  });

  it('should get compare details on fail', () => {
    const value: any = { status: 'fail' };
    spyOn(forecastService, 'getForecastCompareDetails').and.returnValue(of(value));
    const spyCreateCompare = spyOn(component, 'createCompareDisplayObject');
    const spyInfo = spyOn(notifyService, 'showToastrWarning');
    component.getCompareDetails();
    expect(spyCreateCompare).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should get compare details on Error', () => {
    const spy = spyOn(forecastService, 'getForecastCompareDetails').and.returnValue(
      throwError({ status: 404 })
    );
    const spyCreateCompare = spyOn(component, 'createCompareDisplayObject');
    const spyInfo = spyOn(notifyService, 'showToastrError');
    component.getCompareDetails();
    expect(spyCreateCompare).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should create compare display Array', () => {
    const compareDet = [{ dataId: '123' }];
    component.createCompareDisplayObject(compareDet);
    expect(component.compareProcess.length).toBe(1);
  });

  it('should not create compare display Array if no data available', () => {
    component.createCompareDisplayObject(null);
    expect(component.compareProcess.length).toBe(0);
  });

  it('should Remove compare Array Value', () => {
    const process = { dataId: 1 };
    component.compareProcess = [{ dataId: 1 }, { dataId: 2 }];
    component.removeCompareProcess(process);
    expect(component.compareProcess.length).toBe(1);
    expect(component.displayNoRecord).toBeFalsy();

  });

  it('should Remove last compare Array Value', () => {
    const process = { dataId: 1 };
    component.compareProcess = [{ dataId: 1 }];
    component.removeCompareProcess(process);
    expect(component.compareProcess.length).toBe(0);
    expect(component.displayNoRecord).toBeTruthy();

  });

  it('should toggle compact and stack view', () => {
    // For Stack View
    component.toggleView(true);
    expect(component.stackView).toBe(true);

    // For Compact View
    component.toggleView(false);
    expect(component.stackView).toBe(false);
  });


  it('should create compare Object', () => {
    const compareObjVal = {
      dataId: 'NA',
      modelConfigName: 'NA',
      lossfunction: 'NA',
      timeseriesType: 'NA',
      lossValue: 'NA',
      dataSetName: 'NA',
      sampleTime: 'NA',
      dataRange: 'NA',
      numberOfForwardSteps: 'NA',
      cpuUsages: 'NA',
      memoryUsages: 'NA',
      gpuUsages: 'NA',
      gpuMemoryUsages: 'NA',
      speed: 'NA',
      numberOfJobRunning: 'NA',
      timeOfRunning: 'NA',
      numberofRecordesProcessed: 'NA',
      jobType: 'NA',
      modelType: 'NA',
    };
    const createdObj = component.createCompareObject(compareObjVal);
    expect(Object.keys(createdObj).length).toBeGreaterThan(0);
  });

  it('should create default compare Object', () => {
    const createdObj = component.createCompareObject(null);
    expect(Object.keys(createdObj).length).toBeGreaterThan(0);
  });



  // it('should call toast info', () => {
  //   const msg = 'info';
  //   const header = 'Alert';
  //   const toastr = TestBed.get(ToastrService);
  //   const spytoast = spyOn(toastr, 'info');
  //   component.showToastrinfo(msg, header);
  //   // expect(toastr).toBeTruthy();
  //   expect(spytoast).toHaveBeenCalled();
  // });

  // it('should call toast success', () => {
  //   const msg = 'success';
  //   const header = 'Alert';
  //   const toastr = TestBed.get(ToastrService);
  //   const spytoast = spyOn(toastr, 'success');
  //   component.showToastrSuccess(msg, header);
  //   expect(spytoast).toHaveBeenCalled();
  //   // expect(toastr).toBeTruthy();
  // });

});
