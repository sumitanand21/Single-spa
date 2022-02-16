import { ComponentPortal } from '@angular/cdk/portal';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataManagementService } from '../../services/data-management.service';

import { UpsertDataSetComponent } from './upsert-data-set.component';

describe('UpsertDataSetComponent', () => {
  let component: UpsertDataSetComponent;
  let fixture: ComponentFixture<UpsertDataSetComponent>;

  let dataManagementService: DataManagementService;
  let globalService: GlobalService;
  let notifyService: NotificationService;
  let httpMock: HttpTestingController;
  const routePath = [{ path: 'datamanagement/upsertconfiguration', redirectTo: '' }];
  let router: Router;
  const dataSetDetails = {
    dataSetName: 'pmdata',
    multivariate: 'True',
    dataSets: ['spanloss_data', 'sample_alarm'],
    flatData: 'True',
    featureToDescribe: ['Date', '_id'],
    lookUpColumns: ['Date', '_id'],
    timeColumn: 'Date',
    startTime: '2021-09-01T12:12:00.000Z',
    endTime: '2021-09-03T01:23:00.000Z',
    timeInterval: 2,
    dataSourceType: [
        'stored_data',
        'stream_data'
    ],
    jobType: [
        'FORECASTEXECUTION',
        'Anomal'
    ],
    fileName: '',
    dbType: 'MongoDB',
    storedData: {
        dbType: 'MongoDB',
        connectionDetails: {
            configurationName: 'mongodb_configuration',
            description: 'mongodb configuration',
            dbType: 'MongoDB',
            dataSourceType: 'stored_data',
            url: 'mongo-node-1.database.svc:27017,mongo-node-2.database.svc:27017,mongo-node-3.database.svc:27017',
            hostName: 'mongo-node-1.database.svc:27017,mongo-node-2.database.svc:27017,mongo-node-3.database.svc:27017',
            portNumber: '27017',
            steps: '2',
            details: []
        },
        configuration: [
            {
                key: 'databaseName',
                value: 'local',
                type: 'step1'
            },
            {
                key: 'collectionName',
                value: 'startup_log',
                type: 'step2'
            }
        ]
    },
    streamData: {
        dbType: 'KAFKA',
        connectionDetails: {
            configurationName: 'kafka_configuration',
            description: 'kafka_configuration',
            dbType: 'KAFKA',
            dataSourceType: 'stream_data',
            url: '',
            hostName: '',
            portNumber: '0',
            steps: '0',
            details: [
                {
                    key: 'kafka_server',
                    value: 'kafka-svc.msgbus'
                },
                {
                    key: 'kafka_topic',
                    value: 'topic1'
                },
                {
                    key: 'kafka_port',
                    value: 9093
                }
            ]
        },
        databaseName: 'pmdata'
    },
    featureMapping: [
        {
            feature: '_id',
            propertyType: 'object'
        },
        {
            feature: 'Date',
            propertyType: 'datetime'
        },
        {
            feature: 'sampleTime',
            propertyType: 'int64'
        },
        {
            feature: 'ne',
            propertyType: 'object'
        },
        {
            feature: 'pmType',
            propertyType: 'object'
        },
        {
            feature: 'defaultDataRange',
            propertyType: 'object'
        },
        {
            feature: 'timeForForwardPrediction',
            propertyType: 'int64'
        },
        {
            feature: 'modelConfigName',
            propertyType: 'object'
        },
        {
            feature: 'jobStatus',
            propertyType: 'object'
        },
        {
            feature: 'dataSetName',
            propertyType: 'object'
        },
        {
            feature: 'jobType',
            propertyType: 'object'
        },
        {
            feature: 'modelType',
            propertyType: 'object'
        },
        {
            feature: '_class',
            propertyType: 'object'
        }
    ],
    timeFilterFeature: []
};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertDataSetComponent ],
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
    fixture = TestBed.createComponent(UpsertDataSetComponent);
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


  it('should get Data Set list on success', () => {
    const value = { status: 'success', data: {data: ['asdf'] , responseType  : '' } };
    spyOn(dataManagementService, 'getDatasourceList').and.returnValue(of(value));
    component.getDataSetList();
    expect(component.multivariateObj.dataSetsDD.length).toBeGreaterThan(0);
  });


  it('should get Data Set list on fail', () => {
    const value = { status: 'fail', data: {data: ['asdf'] , responseType  : '' } };
    spyOn(dataManagementService, 'getDatasourceList').and.returnValue(of(value));
    component.getDataSetList();
    expect(component.multivariateObj.dataSetsDD.length).toEqual(0);
  });

  it('should get Data Set list on Error', () => {
    const spy = spyOn(dataManagementService, 'getDatasourceList').and.returnValue(
      throwError({ status: 404 })
    );
    component.getDataSetList();
    expect(component.multivariateObj.dataSetsDD.length).toEqual(0);
  });

  it('should reset on multivariate', () => {
    component.onMultiVariateChange(false);
    expect(component.multivariateObj.dataSets.length).toEqual(0);

    component.onMultiVariateChange(true);
    expect(component.stored).toBeFalsy();
    expect(component.flatDataObj.flatData).toEqual('');
    expect(component.storedDataConfigurationDisabled).toBeTruthy();
  });

  it('should enable on flat data change', () => {
    component.onFlatDataChange('True');
    expect(component.flatDataObj.featureToDescribe.length).toEqual(0);
    expect(component.flatDataObj.lookUpColumns .length).toEqual(0);

    component.onFlatDataChange('False');
    expect();

  });

  it('should reset pagination on search change', () => {
    component.onsearchChange('taskPaginate');
    expect(component.inputCurrentpage).toBe(component.defaultCurrentPage);
  });

  it('should change pagination input', () => {
    component.changepageinp(2, 3);
    expect(component.config.currentPage).toBe(2);
  });

  it('should not change pagination input', () => {
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

  it('should reset Stream', () => {
    component.resetStreamData();
    expect(component.streamDataConfiguration).toBe('');
  });

  it('should perform on data Source Type change', () => {
    component.stored = true;
    component.stream = true;
    component.dataSourceTypeChange(true);
    expect(component.storedDataConfigurationDisabled).toBeFalsy();
    expect(component.streamDataConfigurationDisabled).toBeFalsy();


    component.stored = false;
    component.stream = false;
    component.dataSourceTypeChange(false);
    expect(component.storedDataConfigurationDisabled).toBeTruthy();
    expect(component.streamDataConfigurationDisabled).toBeTruthy();

  });

  it('should enable and disable dropdown', () => {
    const featureDet = {select: false };
    component.enableDropDown(featureDet);
    expect(featureDet.select).toBeTruthy();

    component.disableDropDown(featureDet);
    expect(featureDet.select).toBeFalsy();
  });

  it('should get data set details on success and not defined', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'success', data: {responseType  : '' } };
    spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(of(value));
    component.getDataSetDetails(selectedItem);
    expect(component.bufferDataSet).toBeNull();
  });

  it('should get data set details on success and defined', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'success', data: {data: dataSetDetails, responseType  : '' } };
    spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(of(value));
    component.getDataSetDetails(selectedItem);
    expect(component.bufferDataSet).toBeDefined();

    value.data.data.fileName = 'asdf';
    const spyDD = spyOn(component, 'setFileDetails');
    component.getDataSetDetails(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get data set details on fail', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getDataSetDetails(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get data set details on Error', () => {
    const selectedItem = {dataSetName  : 'asd'};
    const spy = spyOn(dataManagementService, 'getDatasourceDeatils').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getDataSetDetails(selectedItem);
    expect(spyDD).toHaveBeenCalled();
  });

  it('should set file Details', () => {
    const spyDD = spyOn(component, 'setFeatureDetailsOnLoad');
    component.setFileDetails();
    expect(spyDD).toHaveBeenCalled();

    component.bufferDataSet = dataSetDetails;

    component.setFileDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get job type list on success', () => {
    const value = { status: 'success', data: {data: ['Amomaly'], responseType  : '' } };
    spyOn(dataManagementService, 'getJobType').and.returnValue(of(value));
    component.getJobTypeList();
    expect(component.jobTypeList.length).toBeGreaterThan(0);
  });

  it('should get job type list on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getJobType').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getJobTypeList();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get job type list on Error', () => {
    const spy = spyOn(dataManagementService, 'getJobType').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getJobTypeList();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get property type list on success', () => {
    const value = { status: 'success', data: {data: ['date'], responseType  : '' } };
    spyOn(dataManagementService, 'getPropertyType').and.returnValue(of(value));
    component.getPropertyTypeList();
    expect(component.propertyTypeList .length).toBeGreaterThan(0);
  });

  it('should get property type list on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getPropertyType').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getPropertyTypeList();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get property type list on Error', () => {
    const spy = spyOn(dataManagementService, 'getPropertyType').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getPropertyTypeList();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get configuration list on success', () => {
    const value = { status: 'success', data: {data: ['date'], responseType  : '' } };
    spyOn(dataManagementService, 'getConfigurationNamesList').and.returnValue(of(value));
    component.getConfigurationDetailsList();
    expect(component.configurationDD.length).toBeGreaterThan(0);
  });

  it('should get configuration list on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getConfigurationNamesList').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getConfigurationDetailsList();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get configuration list on Error', () => {
    const spy = spyOn(dataManagementService, 'getConfigurationNamesList').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getConfigurationDetailsList();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get configuration details on success', () => {
    const value = { status: 'success', data: {data: {dbType: 'asd'}, responseType  : '' } };
    spyOn(dataManagementService, 'getConfigurationDet').and.returnValue(of(value));
    component.getConfigDetails('asdf');
    expect(component.configurationDet.storeddataSourceList.length).toBeGreaterThan(0);

    component.getStreamConfigDetails('asdf');
    expect(component.streamConfigurationDet.streamdataSourceList.length).toBeGreaterThan(0);
  });

  it('should get configuration details on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getConfigurationDet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getConfigDetails('asdf');
    expect(spyDD).toHaveBeenCalled();

    component.getStreamConfigDetails('asdf');
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get configuration details on Error', () => {
    const spy = spyOn(dataManagementService, 'getConfigurationDet').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getConfigDetails('asdf');
    expect(spyDD).toHaveBeenCalled();

    component.getStreamConfigDetails('asdf');
    expect(spyDD).toHaveBeenCalled();
  });


  it('should get all step details on success', () => {
    component.bufferDataSet  = dataSetDetails;
    component.configurationDet.selectedDataSrcObj = {dbType: 'asd'};
    const value = { status: 'success', data: {data: {stpe1: {stepName : 'asd'},
    stpe2: {stepName : 'asd'}}, responseType  : '' } };
    const spyDD = spyOn(component, 'onStep1Change');
    spyOn(dataManagementService, 'getStepsDetails').and.returnValue(of(value));
    component.getAllStepDetails();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should get all step details on fail', () => {
    component.configurationDet.selectedDataSrcObj = {dbType: 'asd'};
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getStepsDetails').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getAllStepDetails();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should get all step details on Error', () => {
    component.configurationDet.selectedDataSrcObj = {dbType: 'asd'};
    const spy = spyOn(dataManagementService, 'getStepsDetails').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getAllStepDetails();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should reset Step2', () => {
    component.resetStep2();
    expect(component.searchFilter).toEqual('');

  });

  it('should set Flat data feature Drop Down', () => {
    component.featureDetails = [{propertyType : 'datetime'}];
    component.setFlatDataFeatureDD(true);
    expect(component.flatDataObj.timeColumnDD.length).toBeGreaterThan(0);

    component.setFlatDataFeatureDD(false);
    expect(component.flatDataObj.timeColumn).toEqual('');

  });

  it('should reset all', () => {
    const spyDD = spyOn(component, 'resetAllFeilds');
    component.onOptionChange();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should set feature details on load', () => {
    component.bufferDataSet = dataSetDetails;
    const spyDD = spyOn(component, 'setFlatDataFeatureDD');
    component.setFeatureDetailsOnLoad();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should filter step 2 drop down', () => {
    component.configurationDet.step2Obj = {asd: [{database : 'asdsub', collections: 'qwe'}]};
    let DDdet = component.filterStep2DD('asd', 'asdsub');
    expect(DDdet.length).toBeGreaterThan(0);

    DDdet = component.filterStep2DD('', '');
    expect(DDdet.length).toEqual(0);

  });

  it('should get feature list validation', () => {
    const spyDD = spyOn(globalService, 'opendisplayModal');
    const spyFeatureDD = spyOn(component, 'getFeatureList');

    component.upsertStoredFrm.form.setErrors({ invalid: true });
    component.getFeatureListValidation();
    expect(spyDD).toHaveBeenCalled();

    component.upsertStoredFrm.form.setErrors(null);
    component.options = false;
    component.fileName = '';
    component.getFeatureListValidation();
    expect(spyDD).toHaveBeenCalled();

    component.upsertStoredFrm.form.setErrors(null);
    component.options = true;
    component.getFeatureListValidation();
    expect(spyFeatureDD).toHaveBeenCalled();
  });

  it('should get feature list on success', () => {
    component.configurationDet.step1Name = 'asd';
    component.configurationDet.step2Name = 'asd2';
    const value = { status: 'success', data: {data: [{name: 'XYZ'}], responseType  : '' } };
    const spyDD = spyOn(component, 'setFlatDataFeatureDD');
    spyOn(dataManagementService, 'getFeatureDet').and.returnValue(of(value));
    component.getFeatureList();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should get feature list on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'getFeatureDet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getFeatureList();
    expect(spyDD).toHaveBeenCalled();

  });

  it('should get feature list on Error', () => {
    const spy = spyOn(dataManagementService, 'getFeatureDet').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.getFeatureList();
    expect(spyDD).toHaveBeenCalled();

  });


  it('should validate time', () => {
    let timeValid = component.valdateTime(22, 23);
    expect(timeValid).toBeFalsy();

    timeValid = component.valdateTime(32, 63);
    expect(timeValid).toBeTruthy();

    timeValid = component.valdateTime(24, 63);
    expect(timeValid).toBeTruthy();

    timeValid = component.valdateTime(24, 22);
    expect(timeValid).toBeTruthy();
  });


  it('should Validate data set on save', () => {
    const spyDD = spyOn(globalService, 'opendisplayModal');
    const spysaveDataSetDD = spyOn(component, 'saveDataSetObjCreate');
    const today: any = new Date();
    const tmrw: any = new Date().getDate() + 1;

    component.panelDetailsFrm.form.setErrors({ invalid: true });
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.panelDetailsFrm.form.setErrors(null);
    component.upsertStoredFrm.form.setErrors({ invalid: true });
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.upsertStoredFrm.form.setErrors(null);
    component.stream  = false;
    component.stored  = false;
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.stream  = true;
    component.stored  = true;
    component.selectedJobType = [];
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.selectedJobType = ['Anomaly'];
    component.dataSetName = 'te';
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.dataSetName = '12453';
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.dataSetName = 'test1';
    component.stored = true;
    component.options  = false;
    component.fileName = '';
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.options  = true;
    component.featureDetails = [];
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.featureDetails = [{select: true}];
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();


    component.featureDetails = [{select: false}];
    component.multivariateObj.multivariate = false;
    component.flatDataObj.timeColumn = '';
    component.dateRangeFrm.form.setErrors({ invalid: true });
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.dateRangeFrm.form.setErrors(null);
    component.flatDataObj.fromTimeHr = '23';
    component.flatDataObj.fromTimeMin = '62';
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.flatDataObj.fromTimeHr = '23';
    component.flatDataObj.fromTimeMin = '22';
    component.flatDataObj.toTimeHr = '23';
    component.flatDataObj.toTimeMin = '62';
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

 
    component.flatDataObj.fromTimeHr = '23';
    component.flatDataObj.fromTimeMin = '22';
    component.flatDataObj.fromDate = tmrw;
    component.flatDataObj.toTimeHr = '22';
    component.flatDataObj.toTimeMin = '21';
    component.flatDataObj.toDate = today;
    component.saveDataSetDetails();
    expect(spyDD).toHaveBeenCalled();

    component.flatDataObj.fromTimeHr = '23';
    component.flatDataObj.fromTimeMin = '22';
    component.flatDataObj.fromDate = today;
    component.flatDataObj.toTimeHr = '22';
    component.flatDataObj.toTimeMin = '21';
    component.flatDataObj.toDate = tmrw;
    component.saveDataSetDetails();
    expect(spysaveDataSetDD).toHaveBeenCalled();
  });

  it('should update data set on success', () => {
    const value = { status: 'success', data: {responseType  : '' , message : 'Failed to update' } };
    spyOn(dataManagementService, 'updateDataSet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrSuccess');
    component.updateDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should update data set backend error on success', () => {
    const value = { status: 'success', data: {responseType  : 'ERR' , message : 'Failed to update' } };
    spyOn(dataManagementService, 'updateDataSet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.updateDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should update data set on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'updateDataSet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.updateDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should update data set on Error', () => {
    const spy = spyOn(dataManagementService, 'updateDataSet').and.returnValue(
      throwError({ status: 404 })
    );
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.updateDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should create data set on success', () => {
    const value = { status: 'success', data: {responseType  : '' , message : 'Failed to update' } };
    spyOn(dataManagementService, 'createDataSet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrSuccess');
    component.createDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should create data set backend error on success', () => {
    const value = { status: 'success', data: {responseType  : 'ERR' , message : 'Failed to update' } };
    spyOn(dataManagementService, 'createDataSet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.createDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should create data set on fail', () => {
    const value = { status: 'fail', data: 'dd' };
    spyOn(dataManagementService, 'createDataSet').and.returnValue(of(value));
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.createDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });

  it('should create data set on Error', () => {
    const spy = spyOn(dataManagementService, 'createDataSet').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(notifyService, 'showToastrWarning');
    component.createDataSetDetails({});
    expect(spyDD).toHaveBeenCalled();
  });




});
