import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelconfComponent } from './modelconf.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ForecastService } from '../../services/forecast.service';
import { of, throwError } from 'rxjs';
const routes: Routes = [

];
describe('ModelconfComponent', () => {
  let component: ModelconfComponent;
  let fixture: ComponentFixture<ModelconfComponent>;
  const valueArr = [{ id: 1 }, { id: 2 }];
  // let toasterServiceSpy: jasmine.Spy;
  let forecastService: ForecastService;
  let notifyService: NotificationService;
  let globalService: GlobalService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ModelconfComponent],
      imports: [
        HttpClientTestingModule, RouterModule.forRoot(routes),
        SharedModule,
        FormsModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        {provide: APP_BASE_HREF, useValue : '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelconfComponent);
    forecastService = TestBed.get(ForecastService);
    notifyService = TestBed.get(NotificationService);
    globalService = TestBed.get(GlobalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have selected Model Object', () => {
    const spySuccess = spyOn(component, 'loadAllModelConfigs');
    component.ngOnInit();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should not have selected Model Object', () => {
    const selectedVal = {};
    component.modelDetails = [];
    component.ngOnInit();
    expect(component.selectedModelObject).toEqual(selectedVal);
  });


  it('should change selected Model Object', () => {
    const selectedVal = { id: 1 };
    component.displayModel(selectedVal);
    expect(component.selectedModel).toEqual(selectedVal);
  });

  it('should delete Model', () => {
    const msgSuccess = {status  : 'success', data : {deletedCount  : 1}};
    const msgFail = {status  : 'fail', data : {deletedCount  : 0}};
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spySuccess = spyOn(notifyService, 'showToastrSuccess');
    const spyWarning = spyOn(notifyService, 'showToastrWarning');
    const spyError = spyOn(notifyService, 'showToastrError');
    const dataService = spyOn(forecastService, 'deleteModelConfigDetails');
    dataService.and.returnValue(of(msgSuccess));
    component.deleteModelConfig('OPRMAX');
    expect(spySuccess).toHaveBeenCalled();

    dataService.and.returnValue(of(msgFail));
    component.deleteModelConfig('OPRMAX');
    expect(spyWarning).toHaveBeenCalled();

    dataService.and.returnValue(
      throwError({ status: 404 })
    );
    component.deleteModelConfig('OPRMAX');
    expect(spyError).toHaveBeenCalled();

  });

  it('should load all model configs', () => {
    const msgSuccess = {status  : 'success', data : {}};
    const msgFail = {status  : 'fail', data : {}};
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyFunction = spyOn(component, 'setModelsTable');
    const dataService = spyOn(forecastService, 'getAllModelConfigs');
    dataService.and.returnValue(of(msgSuccess));
    component.loadAllModelConfigs();
    expect(spyFunction).toHaveBeenCalled();

    dataService.and.returnValue(of(msgFail));
    component.loadAllModelConfigs();
    expect(component.tableErrorMsg ).toEqual('No Records found');

    dataService.and.returnValue(
      throwError({ status: 404 })
    );
    component.loadAllModelConfigs();
    expect(component.tableErrorMsg ).toEqual('Failed in reaching to server');

  });


  it('should get model config data', () => {
    component.modelConfigName = 'OPRMAX';
    const msgSuccess = {status  : 'success', data : {modelName: 'OPRMAX'}};
    const msgFail = {status  : 'fail', data : {}};
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyError = spyOn(notifyService, 'showToastrError');
    const dataService = spyOn(forecastService, 'getModelConfigDetails');

    dataService.and.returnValue(of(msgSuccess));
    component.getModelConfigData();
    expect(component.selectedModelObject ).not.toBeNull();

    dataService.and.returnValue(of(msgFail));
    component.getModelConfigData();
    expect(true).toBeTruthy();

    dataService.and.returnValue(
      throwError({ status: 404 })
    );
    component.getModelConfigData();
    expect(spyError ).toHaveBeenCalled();

  });

  it('should toggle details', () => {
    component.isShown = false;
    component.toggleShow();
    expect(component.isShown ).toBeTruthy();
  });

  it('should set Model table', () => {
    const spyFunction = spyOn(component, 'displayModel');
    const spyEmpty = spyOn(component, 'emptyDetails');

    component.setModelsTable();
    expect(spyEmpty).toHaveBeenCalled();

    component.modelConfigs = [{modeName: 'OPR'}];
    component.setModelsTable();
    expect(spyFunction).toHaveBeenCalled();

  });

  it('should change page on search to Default', () => {
    component.onsearchChange('forecast');
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
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

  it('should check current and page that has changed', () => {
    component.changepage(0);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
  });

  it('should set the PageSize', () => {
    component.setNewPageSize(5);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });

  it('should Sort the table based on the keys', () => {
    component.sortTask('name');
    expect(component.keyTask ).toBe('name');
    expect(component.reverseTask ).toBe(true);

    component.sortTask('dataSet');
    expect(component.keyTask ).toBe('dataSet');
    expect(component.reverseTask ).toBe(true);
  });

  it('should navigate to update page', () => {
    const navPat = '/forecast/updateconfig';
    // const navigatePath = [['/' + globalService.prefixUrl + '/forecast/updateconfig'], Object({queryParams: Object({name: undefined})})];
    const modelval = { id: 1 };
    component.navigateTo(navPat, modelval);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should check for model Object present', () => {
    component.selectedModelObject = { id: 1 };
    const result = component.checkifObjectExist(component.selectedModelObject);
    expect(result).toBeTruthy();
  });

  it('should check for model Object not present', () => {
    component.selectedModelObject = {};
    const result = component.checkifObjectExist(component.selectedModelObject);
    expect(result).toBeFalsy();
  });

});
