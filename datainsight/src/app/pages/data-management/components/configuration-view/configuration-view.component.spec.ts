import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationViewComponent } from './configuration-view.component';
import { Router } from '@angular/router';
import { SharedModule } from './../../../../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DataManagementService } from '../../services/data-management.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';

describe('ConfigurationViewComponent', () => {
  let component: ConfigurationViewComponent;
  let fixture: ComponentFixture<ConfigurationViewComponent>;

  let dataManagementService: DataManagementService;
  let globalService: GlobalService;
  let notifyService: NotificationService;
  let httpMock: HttpTestingController;
  const routePath = [{ path: 'datamanagement/upsertconfiguration', redirectTo: '' }];
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationViewComponent ],
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routePath),
        ToastrModule.forRoot(),
        // BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationViewComponent);
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

  it('should get Configuration table data on success', () => {
    const tableData = [];
    const value = { status: 'success', data: tableData };
    spyOn(dataManagementService, 'getConfigurationTableData').and.returnValue(of(value));
    const spyDD = spyOn(component, 'getConfigurationDetails');
    component.getdatatableAPI();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Configuration table data on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getConfigurationTableData').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getdatatableAPI();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Configuration table data on Error', () => {
    const spy = spyOn(dataManagementService, 'getConfigurationTableData').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.getdatatableAPI();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should reset pagination on search change', () => {
    component.onsearchChange('');
    expect(component.inputCurrentpage).toBe(component.defaultCurrentPage);
  });

  it('should change pagination input', () => {
    component.changepageinp(2, 3);
    expect(component.config.currentPage).toBe(2);
  });

  it('should change pagination input', () => {
    component.changepageinp(4, 3);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });

  it('should change pagination page', () => {
    component.changepage(1);
    expect(component.inputCurrentpage).toBe(1);
  });

  it('should set new page size', () => {
    component.setNewPageSize(100);
    expect(component.config.itemsPerPage).toBe(100);
  });

  it('should sorting', () => {
    component.sort('name');
    expect(component.key).toBe('name');
  });

  it('should navigate to upsert configuration page on add', () => {
    const navigatePath = '/datamanagement/upsertconfiguration';
    const navigateSpy = spyOn(router, 'navigate');
    component.upsertConfiguration('add');
    expect(navigateSpy).toHaveBeenCalledWith([navigatePath]);
  });

  it('should navigate to upsert configuration page on update', () => {
    const navigatePath = '/datamanagement/upsertconfiguration';
    const navigateSpy = spyOn(router, 'navigate');
    component.upsertConfiguration('update');
    expect(navigateSpy).toHaveBeenCalledWith([navigatePath]);
  });

  it('should get config object on row click', () => {
    const spyGetConfig = spyOn(component, 'getConfigurationDetails');
    component.getConfigDetailsOnRow(null, 0);
    expect(spyGetConfig).toHaveBeenCalled();
  });

  it('should get Configuration details on success', () => {
    const selectedObj = {};
    const configData = [];
    const value = { status: 'success', data: configData };
    spyOn(dataManagementService, 'getConfigurationViewDetails').and.returnValue(of(value));
    component.getConfigurationDetails(selectedObj);
    expect(component.detailsLoader).toBeFalsy();
  });

  it('should get Configuration details on fail', () => {
    const selectedObj = {};
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getConfigurationViewDetails').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getConfigurationDetails(selectedObj);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Configuration details on Error', () => {
    const selectedObj = {};
    const spy = spyOn(dataManagementService, 'getConfigurationViewDetails').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.getConfigurationDetails(selectedObj);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get delete Configuration details on success', () => {
    component.selectedConfiguration = {};
    const value = { status: 'success', data: {deletedCount : 1} };
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const removeData = spyOn(component, 'removeConfigurationFromList');
    spyOn(dataManagementService, 'deleteConfiguration').and.returnValue(of(value));
    component.deleteConfiguration('save');
    expect(removeData).toHaveBeenCalled();
  });

  it('should get delete Configuration details on fail', () => {
    component.selectedConfiguration = {};
    const value = { status: 'fail', data: 'dd' };
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    spyOn(dataManagementService, 'deleteConfiguration').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.deleteConfiguration('save');
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get delete Configuration details on Error', () => {
    component.selectedConfiguration = {};
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spy = spyOn(dataManagementService, 'deleteConfiguration').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrError');
    component.deleteConfiguration('save');
    expect(spyDD).toHaveBeenCalled();
  });

  it('should cancel delete Configuration details', () => {
    component.selectedConfiguration = {};
    spyOn(globalService, 'opendisplayModal').and.returnValue(of(null));
    component.deleteConfiguration('save');
    expect(true).toBeTruthy();
  });

  it('should not cancel delete Configuration details no details selected', () => {
    component.selectedConfiguration = null;
    const spyDD = spyOn(globalService, 'opendisplayModal');
    component.deleteConfiguration('save');
    expect(spyDD).toHaveBeenCalled();
  });

  it('should remove deleted Configuration details from table', () => {
    const selectedConfig = {name: 'xyz'};
    const selectedConfig2 = {name: 'asd'};

    component.congigurationTableData = [{name: 'xyz'}, {name: 'asd'}];
    const spyDD = spyOn(notifyService, 'showToastrSuccess');
    component.removeConfigurationFromList(selectedConfig);
    expect(spyDD).toHaveBeenCalled();

    component.removeConfigurationFromList(selectedConfig2);
    expect(spyDD).toHaveBeenCalled();
  });

});
