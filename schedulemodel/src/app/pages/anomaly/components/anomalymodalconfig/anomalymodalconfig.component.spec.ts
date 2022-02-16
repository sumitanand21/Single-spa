import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomalymodalconfigComponent } from './anomalymodalconfig.component';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import { MatProgressSpinnerModule, MatDialogModule, MatDialog } from '@angular/material';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { AnomalyService } from '../../services/anomaly.service';
import { GlobalService } from 'src/app/services/global.service';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';

const routes: Routes = [

];
describe('AnomalymodalconfigComponent', () => {
  let component: AnomalymodalconfigComponent;
  let fixture: ComponentFixture<AnomalymodalconfigComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let httpMock: HttpTestingController;
  let anomalyService: AnomalyService;
  let globalService: GlobalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        Ng2SearchPipeModule,
        OrderModule,
        RouterModule.forRoot(routes),
        FilterPipeModule,
        FormsModule,
        NgxPaginationModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        MatTabsModule,
        ToastrModule.forRoot(),
        NoopAnimationsModule],
      declarations: [ AnomalymodalconfigComponent, AlphaNumericDirective],
      providers: [DatePipe, { provide: Router, useValue: routerSpy }, {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnomalymodalconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
    anomalyService = TestBed.get(AnomalyService);
    globalService = TestBed.get(GlobalService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should set the PageSize', () => {
    component.setNewPageSize(5);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });

  it('should Sort the table based on the keys', () => {
    component.reverse = false;
    component.sort('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBeTruthy();
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

  it('should get All model config', () => {
    const AllModelArr = [{modelName: 'XYZ'}];
    const value = { status: 'success', data: AllModelArr };
    spyOn(anomalyService, 'getAllAnomalyModelConfig').and.returnValue(of(value));
    const spyModelDetails = spyOn(component, 'getModelConfigDetails');
    component.getAllModelConf();
    expect(spyModelDetails).toHaveBeenCalled();
  });

  it('should not get All Model configuration on fail', () => {
    const spy = spyOn(anomalyService, 'getAllAnomalyModelConfig').and.returnValue(
      throwError({ status: 'fail' })
    );
    const spyModelDetails = spyOn(component, 'getModelConfigDetails');
    const spyInfo = spyOn(component, 'showToastrinfo');
    component.getAllModelConf();
    expect(spyModelDetails).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not get All Model configuration on Error', () => {
    const spy = spyOn(anomalyService, 'getAllAnomalyModelConfig').and.returnValue(
      throwError({ status: 404 })
    );
    const spyModelDetails = spyOn(component, 'getModelConfigDetails');
    const spyInfo = spyOn(component, 'showToastrinfo');
    component.getAllModelConf();
    expect(spyModelDetails).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not get Model config Details if no model name', () => {
    const modelObj = null;
    component.getModelConfigDetails(modelObj);
    expect(Object.keys(component.selectedModelObject).length).toBe(0);
  });

  it('should get MODELI Details', () => {
    const modelObj = {modelConfigName: 'XYZ'};
    const modelDetailsObj = {anomalyI : {id: '1'} , anomalyII: null};
    const value = { status: 'success', data: modelDetailsObj };
    spyOn(anomalyService, 'getAnmolayModelConfigByName').and.returnValue(of(value));
    component.getModelConfigDetails(modelObj);
    expect(Object.keys(component.selectedModelObject).length).toBeGreaterThan(0);
  });

  it('should get MODELII Details', () => {
    const modelObj = {modelConfigName: 'XYZ'};
    const modelDetailsObj = {anomalyII : {id: '1'} , anomalyI: null};
    const value = { status: 'success', data: modelDetailsObj };
    spyOn(anomalyService, 'getAnmolayModelConfigByName').and.returnValue(of(value));
    component.getModelConfigDetails(modelObj);
    expect(Object.keys(component.selectedModelObject).length).toBeGreaterThan(0);
  });

  it('should not get Model configuration Details on fail', () => {
    const modelObj = {modelConfigName: 'XYZ'};
    const spy = spyOn(anomalyService, 'getAnmolayModelConfigByName').and.returnValue(
      throwError({ status: 'fail' })
    );
    const spyInfo = spyOn(component, 'showToastrinfo');
    component.getModelConfigDetails(modelObj);
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not get Model configuration Details on Error', () => {
    const modelObj = {modelConfigName: 'XYZ'};
    const spy = spyOn(anomalyService, 'getAnmolayModelConfigByName').and.returnValue(
      throwError({ status: 404 })
    );
    const spyInfo = spyOn(component, 'showToastrinfo');
    component.getModelConfigDetails(modelObj);
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should cancel delete model configuration Details', () => {
    spyOn(globalService, 'opendisplayModal').and.returnValue(of(null));
    component.deleteModelConfig();
    expect(true).toBeTruthy();
  });

  it('should delete MODELI Details', () => {
    component.selectedModelObject = {modelConfigName: 'XYZ', modelType: 'MODELI'};
    const spy = spyOn(anomalyService, 'deleteAnomalyModelConfig').and.returnValue(
      throwError({ status: 'success' })
    );
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyRemove = spyOn(component, 'removeModelFromList');
    component.deleteModelConfig();
    expect(spyRemove).toHaveBeenCalled();
  });

  it('should delete MODELII Details', () => {
    component.selectedModelObject = {modelConfigName: 'XYZ', modelType: 'MODELII'};
    const spy = spyOn(anomalyService, 'deleteAnomalyModelConfig').and.returnValue(
      throwError({ status: 'success' })
    );
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyRemove = spyOn(component, 'removeModelFromList');
    component.deleteModelConfig();
    expect(spyRemove).toHaveBeenCalled();
  });

  it('should not delete Model configuration Details on fail', () => {
    component.selectedModelObject = {modelConfigName: 'XYZ', modelType: 'MODELI'};
    const spy = spyOn(anomalyService, 'deleteAnomalyModelConfig').and.returnValue(
      throwError({ status: 'fail' })
    );
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyInfo = spyOn(component, 'showToastrinfo');
    component.deleteModelConfig();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not delete Model configuration Details on Error', () => {
    component.selectedModelObject = {modelConfigName: 'XYZ', modelType: 'MODELI'};
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spy = spyOn(anomalyService, 'deleteAnomalyModelConfig').and.returnValue(
      throwError({ status: 404 })
    );
    const spyInfo = spyOn(component, 'showToastrinfo');
    component.deleteModelConfig();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should delete Model from All model details', () => {
    component.modelDetails = [{modelConfigName : 'XYZ'}, {modelConfigName : 'PQR'}];
    const modelObjXYZ = {modelConfigName: 'XYZ'};
    const modelObjPQR = {modelConfigName: 'PQR'};
    const modelLength =  component.modelDetails.length;
    component.removeModelFromList(modelObjXYZ);
    expect(component.modelDetails.length).toBe(modelLength - 1);
    component.removeModelFromList(modelObjPQR);
    expect(component.modelDetails.length).toBe(0);

  });

  it('should check if object exist', () => {
    component.selectedModelObject = {modelConfigName: 'OP1_AM1'};
    const returnVal = component.checkifObjectExist('chekobj');
    expect(returnVal).toBeTruthy();
  });
  it('should check if object does not exist', () => {
    component.selectedModelObject = {};
    const returnVal = component.checkifObjectExist('checkobj');
    expect(returnVal).toBeFalsy();
  });

  it('should clear xFeature Search', () => {
    const mockEvt = {index: 0};
    component.onFeatureTabChanged(mockEvt);
    expect(component.xFeatureSearch ).toBe('');
  });

  it('should clear trainFilterSearch Search', () => {
    const mockEvt = {index: 1};
    component.onFeatureTabChanged(mockEvt);
    expect(component.trainFilterSearch ).toBe('');
  });

  it('should clear strFeatureSearch Search', () => {
    const mockEvt = {index: 2};
    component.onFeatureTabChanged(mockEvt);
    expect(component.strFeatureSearch  ).toBe('');
  });

  it('should have no action on Tab Change', () => {
    const mockEvt = {index: 10};
    component.onFeatureTabChanged(mockEvt);
    expect(true).toBeTruthy();
  });

  it('should create str array to Object array and vice versa', () => {
    const Val = ['1', '2', '3'];
    let returnVal = component.createStrArrToObjArr(Val);
    expect(typeof returnVal[0]).not.toBe('string');

    returnVal = component.createStrArrToObjArr(returnVal);
    expect(typeof returnVal[0]).toBe('string');
  });

  it('should check if all provided key exist', () => {
    const mockObj = {name: 'XYZ', value: 50, id: 4};
    const keyArr = ['name', 'value'];
    const returnVal = component.checkkeyExist(keyArr, mockObj);
    expect(returnVal).toBeTruthy();
  });

  it('should check if all provided key exist', () => {
    const mockObj = {name: 'XYZ', id: 4};
    const keyArr = ['name', 'value'];
    const returnVal = component.checkkeyExist(keyArr, mockObj);
    expect(returnVal).toBeFalsy();
  });

  it('should create model Details object', () => {
    const modelObj = {modelConfigName: 'XYZ'};
    const returnVal = component.craeteModelObject(modelObj);
    expect(Object.keys(returnVal).length).toBeGreaterThan(0);
  });
  it('should call toast info', () => {
    const msg = 'info';
    const header = 'Alert';
    const toastr = TestBed.get(ToastrService);
    const spytoast = spyOn(toastr, 'info');
    component.showToastrinfo(msg, header);
    expect(spytoast).toHaveBeenCalled();
  });

  it('should navigate to update page', () => {
    const navigatePath = '/anomaly/anomalymodalconfig';
    const modelval = {modelConfigName: 'XYZ'};
    component.navigateTo(navigatePath, modelval);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

});
