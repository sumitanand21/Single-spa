import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ForecastSelectionComponent } from './forecast-selection.component';
import { MatDialog, MatDialogModule } from '@angular/material';
import { DatePipe } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForecastService } from '../../services/forecast.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationService } from 'src/app/services/notification.service';
import { GlobalService } from 'src/app/services/global.service';

describe('ForecastSelectionComponent', () => {
  let component: ForecastSelectionComponent;
  let fixture: ComponentFixture<ForecastSelectionComponent>;
  // tslint:disable-next-line:prefer-const
  let headText;
  // tslint:disable-next-line:prefer-const
  let forecastService: ForecastService;
  let notifyService: NotificationService;
  let globalService: GlobalService;
  let dialogSpy: jasmine.Spy;
  let httpMock: HttpTestingController;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastSelectionComponent],
      imports: [HttpClientTestingModule, SharedModule, ModalModule.forRoot(),
        ToastrModule.forRoot(), BrowserAnimationsModule, MatDialogModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastSelectionComponent);
    forecastService = TestBed.get(ForecastService);
    notifyService = TestBed.get(NotificationService);
    globalService = TestBed.get(GlobalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should get data table details', () => {
    component.selectedDataId = 'dataSetName';
    const valueSuccess = { status: 'success', data: [] };
    const valueFail = { status: 'fail', data: [] };
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyError = spyOn(notifyService , 'showToastrError');
    const dataSetService  = spyOn(forecastService, 'ForecastSelectiontable');
    dataSetService.and.returnValue(of(valueSuccess));
    component.getdatatableAPI();
    expect(component.tempforecast.length).toBe(0);

    dataSetService.and.returnValue(of(valueFail));
    component.getdatatableAPI();
    expect(spyWarning).toHaveBeenCalled();

    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.getdatatableAPI(true);
    expect(spyError).toHaveBeenCalled();
  });

  it('should schedule forecast', () => {
    const value = [{dataId : 1, checkboxdata  : true},
      {dataId : 2, checkboxdata  : false}];
    component.tempforecast = [...value];
    const valueSuccess = { status: 'success', data: [] };
    const valueFail = { status: 'fail', data: [] };
    const spyWarning = spyOn(notifyService , 'showToastrWarning');
    const spyError = spyOn(notifyService , 'showToastrError');
    const spySuccess = spyOn(notifyService , 'showToastrSuccess');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const dataSetService  = spyOn(forecastService, 'scheduleSelectionDetails');
    dataSetService.and.returnValue(of(valueSuccess));
    component.scheduleSelection();
    expect(spySuccess).toHaveBeenCalled();

    component.tempforecast = [...value];
    dataSetService.and.returnValue(of(valueFail));
    component.scheduleSelection();
    expect(spyWarning).toHaveBeenCalled();

    component.tempforecast = [...value];
    dataSetService.and.returnValue(
      throwError({ status: 404 })
    );
    component.scheduleSelection();
    expect(spyError).toHaveBeenCalled();
  });

  it('should refresh data', () => {
    const spyFunction = spyOn(component , 'getdatatableAPI');
    component.refreshData();
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should create data Set List', () => {
    component.createDataSetList();
    expect(component.selectionDataSet.length).toBe(0);
  });

  it('should load data', () => {
    const spyFunction = spyOn(component , 'getdatatableAPI');
    component.loadData();
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should change page on search to Default', () => {
    component.onsearchChange('forecast');
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should check current and page that has changed', () => {
    component.changepage(0);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
  });
  it('should set all as true', () => {
    component.tempforecast = [{ checkboxdata: false }, { checkboxdata: false }];
    component.checkAlls(true);
    const result = component.tempforecast.every(it => it.checkboxdata === true);
    expect(result).toBeTruthy();
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
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(1);
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

  it('should check open modal', () => {
    const forecastObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.opentEditpopup(forecastObj);
    expect(dialogSpy).toHaveBeenCalled();

    // You can also do things with this like:
    expect(dialogSpy).toHaveBeenCalled();

  });
  // editforecast
});
