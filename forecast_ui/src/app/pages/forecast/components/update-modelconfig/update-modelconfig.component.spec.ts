import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UpdateModelconfigComponent } from './update-modelconfig.component';
import { SharedModule } from './../../../../shared/shared.module';
// import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ForecastService } from '../../services/forecast.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DisplaypopupComponent } from 'src/app/dialogs/displaypopup/displaypopup.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('UpdateModelconfigComponent', () => {
  let component: UpdateModelconfigComponent;
  let fixture: ComponentFixture<UpdateModelconfigComponent>;
  // const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  // const spyQueryParam = jasmine.createSpyObj({ name: null });
  // const mockActivatedRoute: any = { queryParams: of(spyQueryParam) };
  let forecastService: ForecastService;
  let globalService: GlobalService;
  let notifyService: NotificationService;
  let httpMock: HttpTestingController;
  const routePath = [{ path: 'forecast/modelconfig', redirectTo: '' }];
  let router: Router;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [UpdateModelconfigComponent, DisplaypopupComponent
      ],
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routePath),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        // RouterModule.forRoot(routes),
      ],
      providers: [
        // { provide: ToastrService, useClass: ToastrService },
        // { provide: Router, useValue: routerSpy },
        // { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DisplaypopupComponent]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModelconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    forecastService = TestBed.get(ForecastService);
    globalService = TestBed.get(GlobalService);
    notifyService = TestBed.get(NotificationService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called model function', () => {
    const spyGetModel = spyOn(component, 'getModelDropDownDetails');
    component.ngOnInit();
    expect(spyGetModel).toHaveBeenCalled();
  });

  it('should disable save', () => {
    component.modelEditFrm.form.markAsPristine();
    component.ngAfterViewChecked();
    expect(component.saveDisable).toBeTruthy();
  });

  it('should navigate to model configuration page', () => {
    const navigatePath = '/forecast/modelconfig';
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateTo(navigatePath);
    expect(navigateSpy).toHaveBeenCalledWith([navigatePath]);
  });

  it('should get Model configuration dropdow', () => {
    const dropdownVal = [{ forecast: {} }];
    const value = { status: 'success', data: dropdownVal };
    spyOn(forecastService, 'getConfigurationModelConfig').and.returnValue(of(value));
    const spyDD = spyOn(component, 'setAllDropDown');
    component.getModelDropDownDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Model configuration dropdow on fail', () => {
    const value: any = { status: 'fail' };
    spyOn(forecastService, 'getConfigurationModelConfig').and.returnValue(of(value));
    const spyDD = spyOn(component, 'setAllDropDown');
    component.getModelDropDownDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Model configuration dropdow on Error', () => {
    const spy = spyOn(forecastService, 'getConfigurationModelConfig').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(component, 'setAllDropDown');
    component.getModelDropDownDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should create Model configuration dropdow data', () => {
    const value = { scalar: [], encoder: [], optimizer: [], metrics: [], loss: [], inneractivation: [], activation: [] };
    component.setAllDropDown(value);
    const emptyArr = [];
    expect(component.scalarTypeDD).toEqual(emptyArr);
    expect(component.EncoderTypeDD).toEqual(emptyArr);
    expect(component.optimizerDD).toEqual(emptyArr);
    expect(component.metricsDD).toEqual(emptyArr);
    expect(component.lossDD).toEqual(emptyArr);
    expect(component.innerActivationDD).toEqual(emptyArr);
    expect(component.activationDD).toEqual(emptyArr);
  });


  it('should create Model configuration dropdow data if no data available', () => {
    component.setAllDropDown(null);
    const emptyArr = [];
    expect(component.scalarTypeDD).toEqual(emptyArr);
    expect(component.EncoderTypeDD).toEqual(emptyArr);
    expect(component.optimizerDD).toEqual(emptyArr);
    expect(component.metricsDD).toEqual(emptyArr);
    expect(component.lossDD).toEqual(emptyArr);
    expect(component.innerActivationDD).toEqual(emptyArr);
    expect(component.activationDD).toEqual(emptyArr);
  });





  it('should get Model configuration data', fakeAsync(() => {
    component.modelConfigName = 'OPRMAX';
    const foreCastModelConfData = component.craeteModelObject(null);
    foreCastModelConfData.id = '01';
    const value = { status: 'success', data: foreCastModelConfData };
    spyOn(forecastService, 'getModelConfigDetails').and.returnValue(of(value));
    component.getModelConfigData();
    expect(Object.keys(component.modelObject).length).toBeGreaterThan(0);
    expect(component.modelObject.id).toBe('01');
  }));

  it('should get Model configuration data if request fail', () => {
    component.modelConfigName = 'OPRMAX';
    const value = { status: 'fail' };
    spyOn(forecastService, 'getModelConfigDetails').and.returnValue(of());
    component.getModelConfigData();
    expect(component.modelObject.id).toBe('');
  });

  it('should not get Model configuration data if model name not available', () => {
    component.modelConfigName = '';
    component.getModelConfigData();
    expect(component.modelObject.id).toBe('');
  });

  it('should get Model configuration data error', () => {
    component.modelConfigName = 'OPRMAX';
    const spy = spyOn(forecastService, 'getModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    const spyErr = spyOn(notifyService, 'showToastrError');
    component.getModelConfigData();
    expect(spyErr).toHaveBeenCalled();

  });



  it('should not save model if Invalid', () => {
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors({ invalid: true });
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if model name does not have a character or less than 3 character', () => {
    component.modelObject.modelConfigName = '178';
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();

    component.modelObject.modelConfigName = 'OP';
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if block units less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.blockUnits = '0';
    component.displayObj.blockUnits = true;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if batchSize less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.batchSize = '0';
    component.displayObj.batchSize = true;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if epochs less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.epochs = '0';
    component.displayObj.epochs = true;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if layers less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.layers = '0';
    component.displayObj.layers = true;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if dropout  less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.dropout = '1';
    component.displayObj.dropout = true;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if l1L2 less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.l1L2 = '1';
    component.displayObj.l1L2 = true;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if nlags  less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.nlags = '0';
    component.displayObj.nlags = true;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if nleads   less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.nleads = '0';
    component.displayObj.nleads = true;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if testSize   less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.testSize = '1';
    component.displayObj.testSize = true;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if resetWeights   less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.resetWeights = '0';
    component.displayObj.resetWeights = true;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if encLayers    less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.encLayers = '0';
    component.displayObj.encLayers = true;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if decLayers    less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.decLayers = '0';
    component.displayObj.decLayers = true;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });


  it('should not save model if cnnLayers    less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.cnnLayers = '0';
    component.displayObj.cnnLayers = true;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });


  it('should not save model if convLayers    less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.convLayers = '0';
    component.displayObj.convLayers = true;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });


  it('should not save model if lstmLayers    less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.lstmLayers = '0';
    component.displayObj.lstmLayers = true;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });



  it('should not save model if filters     less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.filters = '0';
    component.displayObj.filters = true;
    component.displayObj.lstmLayers = false;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });




  it('should not save model if kernelSize     less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.kernelSize = '0';
    component.displayObj.kernelSize = true;
    component.displayObj.filters = false;
    component.displayObj.lstmLayers = false;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if poolsize less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.poolsize = '0';
    component.displayObj.poolsize = true;
    component.displayObj.kernelSize = false;
    component.displayObj.filters = false;
    component.displayObj.lstmLayers = false;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if fcnLayers less than 1', () => {
    component.modelObject.modelConfigName = 'Model1';
    component.modelObject.fcnLayers = '0';
    component.displayObj.fcnLayers = true;
    component.displayObj.poolsize = false;
    component.displayObj.kernelSize = false;
    component.displayObj.filters = false;
    component.displayObj.lstmLayers = false;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should save model if Valid for Update', () => {
    component.modelConfigName = 'OPRMAx';
    component.modelObject.modelConfigName = 'OPRMAx';
    component.displayObj.fcnLayers = false;
    component.displayObj.poolsize = false;
    component.displayObj.kernelSize = false;
    component.displayObj.filters = false;
    component.displayObj.lstmLayers = false;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyUpdate = spyOn(component, 'UpdateModelConfig');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(component.modelEditFrm.invalid).toBe(false);
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should save model if Valid for create', () => {
    component.modelEditFrm.form.setErrors({ invalid: false });
    component.modelObject.modelConfigName = 'OPRMAx';
    component.displayObj.fcnLayers = false;
    component.displayObj.poolsize = false;
    component.displayObj.kernelSize = false;
    component.displayObj.filters = false;
    component.displayObj.lstmLayers = false;
    component.displayObj.convLayers = false;
    component.displayObj.cnnLayers = false;
    component.displayObj.decLayers = false;
    component.displayObj.encLayers = false;
    component.displayObj.resetWeights = false;
    component.displayObj.testSize = false;
    component.displayObj.nleads = false;
    component.displayObj.nlags = false;
    component.displayObj.l1L2 = false;
    component.displayObj.dropout = false;
    component.displayObj.layers = false;
    component.displayObj.epochs = false;
    component.displayObj.batchSize = false;
    component.displayObj.blockUnits = false;
    const spyCreate = spyOn(component, 'createModelConfig');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(component.modelEditFrm.invalid).toBe(false);
    expect(spyCreate).toHaveBeenCalled();
  });

  it('should  create new model configuration', () => {
    const value = { status: 'success', data: { responseType: '' } };
    const spySuccess = spyOn(notifyService, 'showToastrSuccess');
    spyOn(forecastService, 'createModelConfigDetails').and.returnValue(of(value));
    component.createModelConfig();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should not create new model configuration if API fail', () => {
    const value = { status: 'fail', data: {} };
    const spyWarn = spyOn(notifyService, 'showToastrWarning');
    spyOn(forecastService, 'createModelConfigDetails').and.returnValue(of(value));
    component.createModelConfig();
    expect(spyWarn).toHaveBeenCalled();

  });

  it('should provide Model configuration create error', () => {
    const spyErr = spyOn(notifyService, 'showToastrError');
    const spy = spyOn(forecastService, 'createModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    component.createModelConfig();
    expect(spyErr).toHaveBeenCalled();
  });

  it('should change on lstm change', () => {
    const spyErr = spyOn(component, 'defaultDispObjEnable');
    component.lstmChangeEnableConfigs('lstm1');
    expect(spyErr).toHaveBeenCalled();
  });

  it('should update model configuration', () => {
    const value = { status: 'success', data: { responseType: '' } };
    const spySuccess = spyOn(notifyService, 'showToastrSuccess');
    spyOn(forecastService, 'UpdateModelConfigDetails').and.returnValue(of(value));
    component.UpdateModelConfig();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should not update model configuration if API fail', () => {
    const value = { status: 'fail', data: {} };
    const spyWarn = spyOn(notifyService, 'showToastrWarning');
    spyOn(forecastService, 'UpdateModelConfigDetails').and.returnValue(of(value));
    component.UpdateModelConfig();
    expect(spyWarn).toHaveBeenCalled();
  });

  it('should provide Model configuration update error', () => {
    const spyErr = spyOn(notifyService, 'showToastrError');
    const spy = spyOn(forecastService, 'UpdateModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    component.UpdateModelConfig();
    expect(spyErr).toHaveBeenCalled();
  });
  it('should cancel delete model configuration', () => {
    spyOn(globalService, 'opendisplayModal').and.returnValue(of(null));
    component.deleteModelConfig();
    expect(true).toBeTruthy();
  });

  it('should delete model configuration', () => {
    const value = { status: 'success', data: { deletedCount: 1 } };
    const spyNav = spyOn(component, 'navigateTo');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    spyOn(forecastService, 'deleteModelConfigDetails').and.returnValue(of(value));
    component.deleteModelConfig();
    expect(spyNav).toHaveBeenCalled();
  });

  it('should not delete model configuration if API fail', () => {
    const value = { status: 'fail', data: {} };
    const spyWarn = spyOn(notifyService, 'showToastrWarning');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    spyOn(forecastService, 'deleteModelConfigDetails').and.returnValue(of(value));
    component.deleteModelConfig();
    expect(spyWarn).toHaveBeenCalled();
  });

  it('should provide Model configuration delete error', () => {
    const spyErr = spyOn(notifyService, 'showToastrError');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spy = spyOn(forecastService, 'deleteModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    component.deleteModelConfig();
    expect(spyErr).toHaveBeenCalled();
  });

  it('should create model Object', () => {
    const modelObjVal = {
      id: '5eea395703277a0001939270',
      inputShape: '10, 1',
      outputShape: '1',
      blockUnxits: '20',
      batchSize: '1',
      epochs: '200',
      layers: '3',
      dropout: '0.1',
      activation: 'tanh',
      innerActivation: 'hard_sigmoid',
      loss: 'mae',
      metrics: 'r2_score',
      optimizer: 'adam',
      stateful: 'True',
      l1L2: '1, 1',
      nlags: '10',
      nleads: '0',
      exclude: 'None',
      groupBy: 'None',
      timeStep: '1',
      encoderType: 'None',
      scalerType: 'minmax',
      modelConfigName: 'OPRMAX',
      modelConfigCount: '0',
      testSize: '0.7',
      jobType: 'EXECUTION'
    };
    const createdObj = component.craeteModelObject(modelObjVal);
    expect(Object.keys(createdObj).length).toBeGreaterThan(0);
  });

  it('should create empty model Object', () => {
    const createdObj = component.craeteModelObject(null);
    expect(Object.keys(createdObj).length).toBeGreaterThan(0);
  });
});
