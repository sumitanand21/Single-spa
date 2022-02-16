import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ForecastProcessingComponent } from './forecast-processing.component';
import { DatePipe } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForecastService } from '../../services/forecast.service';
import { NotificationService } from 'src/app/services/notification.service';
import { GlobalService } from 'src/app/services/global.service';



describe('ForecastProcessingComponent', () => {
  let component: ForecastProcessingComponent;
  let fixture: ComponentFixture<ForecastProcessingComponent>;
  let dialogSpy: jasmine.Spy;
  let forecastService: ForecastService;
  let router: Router;
  let globalService: GlobalService;
  let notifyService: NotificationService;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastProcessingComponent],
      imports: [HttpClientTestingModule, MatDialogModule,
        SharedModule, ModalModule.forRoot(),
        ToastrModule.forRoot(), BrowserAnimationsModule,
        RouterModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastProcessingComponent);
    forecastService = TestBed.get(ForecastService);
    notifyService = TestBed.get(NotificationService);
    router = TestBed.get(Router);
    globalService = TestBed.get(GlobalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('on selection of process', () => {
    const value = {dataId : 2};
    component.grfnUrl = 'forecast_vax_var-PM_name_vax_/dummy';
    const data = Object.assign({
      ...value,
      Url:
        component.sanitizer
          .bypassSecurityTrustResourceUrl(`forecast2/dummy`)
    });
    component.onSelectProcess(value);
    expect(component.selectedProcess).toEqual(data);
  });
  it('should change page on search to Default', () => {
    component.onsearchChange('forecast');
    expect(component.inputCurrentpage).toBe(component.defaultCurrentPage);
    expect(component.config.currentPage).toBe(component.defaultCurrentPage);
  });
  it('should check current and page that has changed', () => {
    component.changepage(0);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
  });
  it('should check current and page that has changed', () => {
    component.tempforecastprocess =
      [{ checkboxdata: false }, { checkboxdata: false }];
    component.checkAlls(true);
    const result = component.tempforecastprocess.every(it => it.checkboxdata === true);
    expect(result).toBeTruthy();
  });
  it('should check all checked', () => {
    component.tempforecastprocess = [{ checkboxdata: false }, { checkboxdata: false }];
    let result = component.isAllChecked();
    expect(result).toBeFalsy();

    component.tempforecastprocess = [];
    result = component.isAllChecked();
    expect(result).toBeFalsy();
  });
  it('should set the PageSize', () => {
    component.setNewPageSize(5);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });
  it('should Sort the table based on the keys', () => {
    component.sort('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBe(true);

    component.sort('dataSet');
    expect(component.key).toBe('dataSet');
    expect(component.reverse).toBe(true);
  });
  it('should change the dropdown values for edit modelparam', () => {
    component.editForecastparam = { Data: 'tets' };
    const valueSuccess: any = {status: 'success', data: [{ Data: 'tets' }]};
    spyOn(forecastService, 'getModelConfig').and.returnValue(of(valueSuccess));
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(2);
  });

  it('should navigate to compare', () => {
    component.tempforecastprocess = [{ checkboxdata : true }];
    component.navigateToCompare();
    expect(routerSpy.navigate).toHaveBeenCalled();

    const spyDisplay = spyOn(globalService, 'opendisplayModal');
    component.tempforecastprocess = [{ checkboxdata : false }];
    component.navigateToCompare();
    expect(spyDisplay).toHaveBeenCalled();
  });

  it('should refrsh data', () => {
    const spyDisplay = spyOn(component, 'getdatatableAPI');
    component.refreshData();
    expect(spyDisplay).toHaveBeenCalled();
  });


  it('should display Model in right panel', () => {
    component.selectedModel = {dataId: '1MQR1'};
    const modelVal = {jobStatus: 'Completed', dataSetName: 'pmData', dataId : '1MQR'};
    const valueSuccess = { status: 'success', grfnUrl : 'forecast_vax',
    data: {lossValue : 1, timeOfRunning  : '1:3:4:5', speed  : '2records3', defaultDataRange : '1,4'} };
    const valueFail = { status: 'fail', data: {} };
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyFunction = spyOn(component , 'onSelectProcess');
    const dataSetService: any  = spyOn(forecastService, 'forecastProcessingModelDetails');
    dataSetService.and.returnValue(of(valueSuccess));
    component.displayModel(modelVal, true);
    expect(spyFunction).toHaveBeenCalled();

    component.selectedModel = {dataId: '1MQR1'};
    dataSetService.and.returnValue(of(valueFail));
    component.displayModel(modelVal, true);
    expect(spyWarning).toHaveBeenCalled();

    component.selectedModel = {dataId: '1MQR1'};
    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.displayModel(modelVal, false);
    expect(component.selectedModel ).toEqual({});
  });


  it('should get foreast process table data', () => {

    component.getdatatableAPI(false, false);
    expect(component.tempforecastprocess.length).toBe(0);

    component.selectedDataId  = 'pmData';
    const valueSuccess = { status: 'success', data: [{jobStatus : 'running', dataId: '1MQ2'},
    {jobStatus : 'waiting', dataId: '1MQ22'}]};
    const valueSuccessEmpty = { status: 'success', data: []};
    const valueFail = { status: 'fail', data: [] };
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyError = spyOn(notifyService , 'showToastrError');
    const spyFunction = spyOn(component , 'displayModel');
    const spyEmptyFunc = spyOn(component , 'emptyDetails');
    const dataSetService: any  = spyOn(forecastService, 'forecastProcessingtable');
    dataSetService.and.returnValue(of(valueSuccess));
    component.getdatatableAPI(true);
    expect(spyFunction).toHaveBeenCalled();

    dataSetService.and.returnValue(of(valueSuccessEmpty));
    component.getdatatableAPI(true);
    expect(spyEmptyFunc).toHaveBeenCalled();

    dataSetService.and.returnValue(of(valueFail));
    component.getdatatableAPI(false, true);
    expect(spyWarning).toHaveBeenCalled();

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.getdatatableAPI(true, false);
    expect(spyError).toHaveBeenCalled();
  });

  it('should first selected Obj', () => {
    const forecastDetails = [{jobStatus : 'waiting', dataId : '1MQ1'}, {jobStatus : 'running', dataId : '1MQ'}];
    const forecastVal = component.getFirstSelectedDataObj(forecastDetails);
    expect(forecastVal).not.toBeNull();
  });

  it('should update table data for forecast process', () => {
    component.selectedDataId = 'PmData';
    const modelVal = [{dataSetName : 'PmData', dataId : '1MQ', checkboxdata : true}];
    component.tempforecastprocess = [...modelVal];
    component.updateTableData(modelVal);
    expect(component.tempforecastprocess.length).not.toBe(0);
  });

  it('should update forecast process', () => {
    component.tempSlectedProcess = {uid: '1MQR1'};
    const modelVal = {lossValue : 1, timeOfRunning  : '1:3:4:5', speed  : '2records3', defaultDataRange : '1,4', uid : '1MQR1'};
    component.updateForecastProcDetails(modelVal);
    expect(component.tempSlectedProcess).not.toBeNull();
  });

  it('changing the page on user input changepageinp', () => {
    component.config.currentPage = 2;
    component.changepageinp(2, 5);
    expect(component.config.currentPage).toBe(2);
    component.changepageinp(0, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.changepageinp(10, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });
  it('should check editforecast datarangesplit', () => {
    const forcastval: any = {
      threadId: 3,
  defaultDataRange: 'tsts',
  ne: '1MJF901',
  timeForForwardPrediction: 360,
  jobStatus: 'DELETED', sampleTime: 30,
  modelParameter: 'OPRMIN', podNumber: -1,
  pmId: '1MJF901@1-20-19@OPRMIN@PM_NEAR_END_Rx',
  pmType: 'OPRMIN' };
    const spySuccess = spyOn(component, 'checkmodelparam');
    component.editforecast(forcastval);
    expect(spySuccess).toHaveBeenCalled();

    forcastval.timeForForwardPrediction = '360h';
    component.editforecast(forcastval);
    expect(spySuccess).toHaveBeenCalled();

    forcastval.timeForForwardPrediction = '360m';
    component.editforecast(forcastval);
    expect(spySuccess).toHaveBeenCalled();

    forcastval.timeForForwardPrediction = '360s';
    component.editforecast(forcastval);
    expect(spySuccess).toHaveBeenCalled();

    forcastval.timeForForwardPrediction = '360D';
    component.editforecast(forcastval);
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should toggle view', () => {
    const flag = component.toggle;
    component.toggleView();
    expect(component.toggle).toEqual(!flag);
  });
  it('should toggle show', () => {
    const flag = component.isShown;
    component.toggleShow();
    expect(component.isShown).toEqual(!flag);
  });
  it('should set on destroy ', () => {
    component.ngOnDestroy();
    expect(component.forecastService.ForeCastProcessing).toEqual(false);
  });
  it('should set on page load ', () => {
    const spySuccess = spyOn(component, 'getdatatableAPI');
    component.loadData();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should get All data Set', () => {
    const valueSuccess = { status: 'success', data: [] };
    const valueFail = { status: 'fail', data: [] };
    const spyError = spyOn(notifyService , 'showToastrError');
    const spyFunction = spyOn(component , 'getdatatableAPI');
    const dataSetService  = spyOn(forecastService, 'datasetname');
    dataSetService.and.returnValue(of(valueSuccess));
    component.getDatasetlist();
    expect(spyFunction).toHaveBeenCalled();

    dataSetService.and.returnValue(of(valueFail));
    component.getDatasetlist();
    expect(spyFunction).toHaveBeenCalled();

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.getDatasetlist();
    expect(spyError).toHaveBeenCalled();
  });

  it('should check if Object Exist ', () => {
    const res = component.checkifObjectExist(null);
    const actual = Object.keys(component.selectedProcess).length === 0 ? false : true;
    expect(res).toEqual(actual);
  });
  it('should check open edit modal', () => {
    const forecastObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.opentEditpopup(forecastObj);
    expect(dialogSpy).toHaveBeenCalled();
  });
  it('should check open stop modal', () => {
    const forecastObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.openStopmodal(forecastObj);
    expect(dialogSpy).toHaveBeenCalled();
  });
  // it('should check open forecast Edit ', () => {
  //   const temp: any = '1';
  //   expect(component.openforecastEdit(temp)).toThrowError();
  // });
  it('should change the values for edit forecast page', () => {
    component.editForecastparam = { Data: 'tets' };
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(0);
  });
});


