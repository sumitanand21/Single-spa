import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataManagementService } from '../../services/data-management.service';

import { DataSourceComponent } from './data-source.component';

describe('DataSourceComponent', () => {
  let component: DataSourceComponent;
  let fixture: ComponentFixture<DataSourceComponent>;

  let dataManagementService: DataManagementService;
  let globalService: GlobalService;
  let notifyService: NotificationService;
  let httpMock: HttpTestingController;
  const routePath = [{ path: 'datamanagement/upsertconfiguration', redirectTo: '' }];
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSourceComponent ],
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routePath),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataManagementService = TestBed.get(DataManagementService);
    globalService = TestBed.get(GlobalService);
    notifyService = TestBed.get(NotificationService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update job status', () => {
    component.jobTypeStatusObj = {jobStatus : ''};
    component.OnRunningSchedule('running');
    expect(component.showStream).toBeFalsy();
    expect(component.showStopStream).toBeTruthy();

    component.OnRunningSchedule('completed');
    expect(component.showStream).toBeTruthy();
    expect(component.showStopStream).toBeFalsy();
  });

  it('should empty details', () => {
    component.emptyDetails();
    expect(component.selectedDataSource ).toEqual({});
  });

  it('should navigate', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateToUpsert('add');
    expect(navigateSpy).toHaveBeenCalled();

    component.navigateToDataPreview('add', 'stream');
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should check if object exits', () => {
    let objectVal = component.checkifObjectExist({});
    expect(objectVal).toBeFalsy();

    objectVal = component.checkifObjectExist({key: '1'});
    expect(objectVal).toBeTruthy();
  });

  it('should get Data Source table data on success', () => {
    const tableData = [];
    const value = { status: 'success', data: tableData };
    spyOn(dataManagementService, 'getDatasourceList').and.returnValue(of(value));
    const spyDD = spyOn(component, 'getTableDetails');
    component.getdatatableAPI();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Data Source table data on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getDatasourceList').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getdatatableAPI();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Data Source table data on Error', () => {
    const spy = spyOn(dataManagementService, 'getDatasourceList').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.getdatatableAPI();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should sorting', () => {
    component.sortTask('name');
    expect(component.keyTask ).toBe('name');

    component.reverseTask = true;
    component.sortTask('name');
    expect(component.reverseTask).toBeFalsy();
  });

  it('should get Data Source details on success', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'success', data: {data : selectedItem } };
    spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(of(value));
    component.getTableDetails(selectedItem, 0);
    expect(component.selectedDataSourceDetails ).toEqual(selectedItem);
  });

  it('should get Data Source details on fail', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getTableDetails(selectedItem, 0);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Data Source details on Error', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const spy = spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.getTableDetails(selectedItem, 0);
    expect(spyDD).toHaveBeenCalled();
  });


  it('should reset pagination on search change', () => {
    component.onsearchChange('taskPaginate');
    expect(component.inputCurrentpageTask).toBe(component.defaultCurrentPage);
  });

  it('should change pagination input', () => {
    component.changepageinp(2, 3, 'taskPaginate');
    expect(component.configTask.currentPage).toBe(2);
  });

  it('should not change pagination input', () => {
    component.changepageinp(4, 3, 'taskPaginate');
    expect(component.inputCurrentpageTask).toBe(component.configTask.currentPage);
  });

  it('should change pagination page', () => {
    component.changepage(1, 'taskPaginate');
    expect(component.inputCurrentpageTask ).toBe(1);
  });

  it('should set new page size', () => {
    component.setNewPageSize(100, 'taskPaginate');
    expect(component.configTask.itemsPerPage).toBe(100);
  });

  it('should create UTC date from ISO String', () => {
    const dateStr = component.createUTCDatefromISO('2021-09-01T12:12:00.000Z');
    expect(dateStr).toEqual('Sep 1, 2021 12:12');
  });

  it('should delete Data Source details on success', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'success', data: {responseType  : '' } };
    spyOn(dataManagementService, 'deleteDatasource').and.returnValue(of(value));
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyDD = spyOn(notifyService, 'showToastrSuccess');
    component.deleteDataSource(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });


  it('should not delete Data Source details on success', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'success', data: {responseType  : 'ERR' , message : 'Failed to delete' } };
    spyOn(dataManagementService, 'deleteDatasource').and.returnValue(of(value));
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.deleteDataSource(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should delete Data Source details on fail', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'deleteDatasource').and.returnValue(of(value));
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.deleteDataSource(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should delete Data Source details on Error', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const spy = spyOn(dataManagementService, 'deleteDatasource').and.returnValue(
      throwError({ status: 404 })
    );
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.deleteDataSource(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should refresh job status', () => {
    const spyDD = spyOn(component, 'getStreamData');
    component.refreshJobStatus();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should enable or disable stored data and stream data', () => {
    component.selectedDataSourceDetails.dataSourceType = ['stored_data'];
    const storedValEnable = component.checkIfEnableStore();
    expect(storedValEnable).toBeTruthy();

    const streamValDisable = component.checkIfEnableStream();
    expect(streamValDisable).toBeFalsy();

    component.selectedDataSourceDetails.dataSourceType = ['stream_data'];
    const storedValDisable = component.checkIfEnableStore();
    expect(storedValDisable).toBeFalsy();

    const streamValEnable = component.checkIfEnableStream();
    expect(streamValEnable).toBeTruthy();

  });


  it('should check job status', () => {
    component.jobTypeStatusObj = [{scheduleJobType : 'FORECAST', jobStatus : 'running'}];
    let status = component.checkJobStatus('FORECAST');
    expect(status).toEqual('running');

    component.jobTypeStatusObj = [];
    status = component.checkJobStatus('FORECAST');
    expect(status).toEqual('');
  });


  it('should get Stream schedule status on success', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'success', data: {responseType  : '' } };
    spyOn(dataManagementService, 'getstreamDataSchedule').and.returnValue(of(value));
    const spyDD = spyOn(component, 'scheduleSocWithoutInterval');
    component.getStreamScheduleStatus(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });


  it('should get Stream schedule status on fail', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getstreamDataSchedule').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getStreamScheduleStatus(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Stream schedule status on Error', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const spy = spyOn(dataManagementService, 'getstreamDataSchedule').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.getStreamScheduleStatus(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should schedule Stream on success', () => {
    component.selectedDataSourceDetails.dataSetName = 'asd';
    const value = { status: 'success', data: {responseType  : '', message: 'data streamed successfully' } };
    spyOn(dataManagementService, 'streamDataSchedule').and.returnValue(of(value));
    const spyDD = spyOn(component, 'getStreamData');
    component.scheduleStream('stream');
    expect(spyDD).toHaveBeenCalled();
  });


  it('should schedule Stream on fail', () => {
    component.selectedDataSourceDetails.dataSetName = 'asd';
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'streamDataSchedule').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.scheduleStream('stream');
    expect(spyDD).toHaveBeenCalled();

    component.scheduleStream('stop');
    expect(spyDD).toHaveBeenCalled();
  });

  it('should schedule Stream on Error', () => {
    component.selectedDataSourceDetails.dataSetName = 'asd';
    const spy = spyOn(dataManagementService, 'streamDataSchedule').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.scheduleStream('stream');
    expect(spyDD).toHaveBeenCalled();

    component.scheduleStream('stop');
    expect(spyDD).toHaveBeenCalled();
  });

});
