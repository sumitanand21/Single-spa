import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataManagementService } from '../../services/data-management.service';
import { NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'datainsight-upsert-data-set',
  templateUrl: './upsert-data-set.component.html',
  styleUrls: ['./upsert-data-set.component.scss']
})
export class UpsertDataSetComponent implements OnInit, OnDestroy {
  @ViewChild('upsertStored', { static: false }) public upsertStoredFrm: NgForm;
  @ViewChild('panelDetails', { static: false }) public panelDetailsFrm: NgForm;
  @ViewChild('dateRange', { static: false }) public dateRangeFrm: NgForm;

  prefixUrl = this.global.prefixUrl;
  multivariateObj = {
    multivariate: false,
    dataSets: [],
    dataSetsDD: []
  };

  minToDate: any = '';
  flatDataObj = {
    flatData: '',
    featureToDescribe: [],
    featureToDescribeDD: [],
    lookUpColumns: [],
    lookUpColumnsDD: [],
    timeColumn: '',
    timeColumnDD: [],
    startTime: '',
    endTime: '',
    timeInterval: '0',
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
  };
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  dataSetName = '';
  stored = false;
  stream = false;
  storedNm: any;
  options = true;
  selectedConfiguration = '';
  configurationDD = [];
  featureDetails = [];
  fileName = '';
  bufferDataSet: any = null;
  initialLoad = false;
  upsertType = 'C'; // for create , 'U' for update
  featureLoader = false;
  jobTypeList = [];
  selectedJobType = [];
  configurationDet = {
    storeddataSourceList: [],
    selectedDataSource: '',
    selectedDataSrcObj: null,
    step1Obj: null,
    step2Obj: null,
    step1Name: '',
    step1DD: [],
    selectedStep1: '',
    step2Name: '',
    step2DD: [],
    selectedStep2: '',
  };

  streamConfigurationDet = {
    streamdataSourceList: [],
    selectedDataSource: '',
    selectedDataSrcObj: null,
  };
  propertyTypeList = [];
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  pageArr = [25, 50, 100];
  config = {
    id: 'paginateFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  searchFilter = '';

  disableFetchFeature = false;
  disableSaveDataSet = false;

  storedDataConfigurationDisabled = true;
  streamDataConfigurationDisabled = true;


  // Stream Data Configuration
  streamDataConfiguration = '';
  streamDataConfigurationList;

  constructor(
    public global: GlobalService,
    public notify: NotificationService,
    private router: Router,
    public dataManagementService: DataManagementService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    // this.stream = 'false';
    // this.stored = 'false';
    this.dataManagementService.showUpsertDataSet = true;
    this.getConfigurationDetailsList();
    this.getJobTypeList();
    this.getPropertyTypeList();
    this.getDataSetList();
    this.initialLoad = true;
    if (this.dataManagementService.selectedDataSetName) {
      this.upsertType = 'U';
      this.getDataSetDetails(this.dataManagementService.selectedDataSetName);
    }
  }

  getDataSetList() {
    // let userData = { dataSetName: this.selecteddata };
    this.dataManagementService.getDatasourceList().subscribe((res: any) => {
      if (res.status === 'success' && res.data && res.data.data && res.data.data.length) {
        this.multivariateObj.dataSetsDD = res.data && res.data.data ? res.data.data : [];
      } else {
        this.multivariateObj.dataSetsDD = [];
      }
    }, err => {
      this.multivariateObj.dataSetsDD = [];
    });

  }

  onMultiVariateChange(val) {
    if (!val) {
      this.multivariateObj.dataSets = [];
    } else {
      this.resetAllFeilds();
      this.clearDateRange();
      this.stored = false;
      this.flatDataObj.flatData = '',
      this.storedDataConfigurationDisabled = true;

    }
  }


  clearDateRange() {
      this.flatDataObj.startTime = '';
      this.flatDataObj.endTime = '';
      this.flatDataObj.fromDate = '';
      this.flatDataObj.fromTimeHr = '';
      this.flatDataObj.fromTimeMin = '';
      this.flatDataObj.toDate = '';
      this.flatDataObj.toTimeHr = '';
      this.flatDataObj.toTimeMin = '';
      this.flatDataObj.timeInterval = '0';
  }

  onFlatDataChange(val) {
    if (val === 'True') {
      this.flatDataObj.featureToDescribe = [];
      this.flatDataObj.lookUpColumns = [];
    }
  }

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
    }
  }

  resetStreamData() {
    this.streamDataConfiguration = '';
    this.streamConfigurationDet.streamdataSourceList = [];
    this.streamConfigurationDet.selectedDataSource = '';
    this.streamConfigurationDet.selectedDataSrcObj = null;
  }

  dataSourceTypeChange(selectedvalue) {
    // this.stream = 'false';
    if (!this.stored) {
      this.storedDataConfigurationDisabled = true;
      // this.disableFetchFeature = true;
      this.resetAllFeilds();
    } else {
      this.storedDataConfigurationDisabled = false;
      // this.disableFetchFeature = false;
    }

    if (!this.stream) {
      this.streamDataConfigurationDisabled = true;
      this.resetStreamData();
    } else {
      this.streamDataConfigurationDisabled = false;
    }

    // if (!this.stored && !this.stream) {
    //   this.streamDataConfigurationDisabled = true;
    //   this.storedDataConfigurationDisabled = true;
    //   this.disableFetchFeature = true;
    //   this.resetStreamData();
    //   this.resetAllFeilds();
    // }

    // if (this.stored && !this.stream) {
    //   this.streamDataConfigurationDisabled = true;
    //   this.storedDataConfigurationDisabled = false;
    //   this.disableFetchFeature = false;
    //   this.resetStreamData();
    // }

    // if (!this.stored && this.stream) {
    //   this.streamDataConfigurationDisabled = false;
    //   this.storedDataConfigurationDisabled = true;
    //   this.disableFetchFeature = true;
    //   this.resetAllFeilds();
    // }

    // if (this.stored && this.stream) {
    //   this.streamDataConfigurationDisabled = false;
    //   this.storedDataConfigurationDisabled = false;
    //   this.disableFetchFeature = false;
    // }
  }
  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }
  enableDropDown(featureDet) {
    featureDet.select = true;
  }
  disableDropDown(featureDet) {
    featureDet.select = false;
    this.setTimeColumnDD();
  }

  ngOnDestroy() {
    this.dataManagementService.showUpsertDataSet = false;
  }


  getDataSetDetails(selectedData) {
    const data = { dataSetName: selectedData };
    this.featureLoader = true;
    this.dataManagementService.getDatasourceDeatils(data).subscribe((res: any) => {
      this.featureLoader = false;
      if (res.status === 'success') {
        this.bufferDataSet = res.data && res.data.data ? res.data.data : null;
        this.dataSetName = this.bufferDataSet ? this.bufferDataSet.dataSetName : '';
        this.stored = this.bufferDataSet ? this.bufferDataSet.dataSourceType.some(it => it === 'stored_data') : false;
        this.stream = this.bufferDataSet ? this.bufferDataSet.dataSourceType.some(it => it === 'stream_data') : false;
        this.selectedJobType = this.bufferDataSet ? this.bufferDataSet.jobType : [];
        this.dataSourceTypeChange(true);

        this.multivariateObj.multivariate = this.bufferDataSet && this.bufferDataSet.multivariate &&
          this.bufferDataSet.multivariate === 'True' ? true : false;

        this.multivariateObj.dataSets = this.bufferDataSet && this.bufferDataSet.dataSets ? [...this.bufferDataSet.dataSets] : [];

        this.flatDataObj.flatData = this.bufferDataSet && this.bufferDataSet.dataSets ? this.bufferDataSet.flatData : '';
        this.flatDataObj.featureToDescribe = this.bufferDataSet && this.bufferDataSet.featureToDescribe ?
          [...this.bufferDataSet.featureToDescribe] : [];
        this.flatDataObj.lookUpColumns = this.bufferDataSet && this.bufferDataSet.lookUpColumns ?
          [...this.bufferDataSet.lookUpColumns] : [];
        this.flatDataObj.timeColumn = this.bufferDataSet && this.bufferDataSet.timeColumn ? this.bufferDataSet.timeColumn : '';
        this.flatDataObj.timeInterval = this.bufferDataSet && this.bufferDataSet.timeInterval ? this.bufferDataSet.timeInterval : '0';
        this.flatDataObj.startTime = this.bufferDataSet && this.bufferDataSet.startTime ? this.bufferDataSet.startTime : '';
        this.flatDataObj.endTime = this.bufferDataSet && this.bufferDataSet.endTime ? this.bufferDataSet.endTime : '';

        const startTimeUTCObj: any = this.flatDataObj.startTime ? this.createUTCDatefromISO(this.flatDataObj.startTime) : null;
        const endTimeUTCObj: any = this.flatDataObj.endTime ? this.createUTCDatefromISO(this.flatDataObj.endTime) : null;

        this.flatDataObj.fromDate = startTimeUTCObj ? startTimeUTCObj.dateObj : '';
        this.flatDataObj.fromTimeHr = startTimeUTCObj ? startTimeUTCObj.hrs : '';
        this.flatDataObj.fromTimeMin = startTimeUTCObj ? startTimeUTCObj.mins : '';

        this.flatDataObj.toDate = endTimeUTCObj ? endTimeUTCObj.dateObj : '';
        this.flatDataObj.toTimeHr = endTimeUTCObj ? endTimeUTCObj.hrs : '';
        this.flatDataObj.toTimeMin = endTimeUTCObj ? endTimeUTCObj.mins : '';


        this.options = this.bufferDataSet && this.bufferDataSet.fileName ? false : true;
        this.fileName = this.bufferDataSet ? this.bufferDataSet.fileName : '';


        const streamconnectionDet = this.bufferDataSet && this.bufferDataSet.streamData && this.bufferDataSet.streamData.connectionDetails ?
          this.bufferDataSet.streamData.connectionDetails : null;

        this.streamDataConfiguration = streamconnectionDet && streamconnectionDet.configurationName ?
          streamconnectionDet.configurationName : '';

        this.streamConfigurationDet.streamdataSourceList = streamconnectionDet ? [streamconnectionDet] : [];
        // tslint:disable-next-line:max-line-length
        this.streamConfigurationDet.selectedDataSource = this.streamConfigurationDet.streamdataSourceList.length > 0 ? this.streamConfigurationDet.streamdataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.streamConfigurationDet.selectedDataSrcObj = this.streamConfigurationDet.streamdataSourceList.length > 0 ? Object.assign({}, this.streamConfigurationDet.streamdataSourceList[0]) : null;


        const connectionDet = this.bufferDataSet && this.bufferDataSet.storedData && this.bufferDataSet.storedData.connectionDetails ?
          this.bufferDataSet.storedData.connectionDetails : null;

        this.selectedConfiguration = connectionDet && connectionDet.configurationName ? connectionDet.configurationName : '';
        // if (connectionDet) {
        //   connectionDet.dbType = this.bufferDataSet && this.bufferDataSet.dbType ? this.bufferDataSet.dbType : '';
        // }
        this.configurationDet.storeddataSourceList = connectionDet ? [connectionDet] : [];
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSource = this.configurationDet.storeddataSourceList.length > 0 ? this.configurationDet.storeddataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSrcObj = this.configurationDet.storeddataSourceList.length > 0 ? Object.assign({}, this.configurationDet.storeddataSourceList[0]) : null;

        if (this.options) {
          this.getAllStepDetails();
        } else {
          this.setFileDetails();
        }
      } else {
        this.bufferDataSet = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set details');
        this.featureLoader = false;
      }
    },
      err => {
        this.bufferDataSet = null;
        this.featureLoader = false;
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set details');
      });

  }

  setFileDetails() {
    const step1Arr = this.bufferDataSet && this.bufferDataSet.storedData && this.bufferDataSet.storedData.configuration ?
      this.bufferDataSet.storedData.configuration.filter(it => it.type === 'step1') : [];
    const step1Obj = step1Arr.length > 0 ? step1Arr[0] : null;
    this.configurationDet.selectedStep1 = step1Obj && step1Obj.value ? step1Obj.value : '';
    this.configurationDet.step1Name = step1Obj && step1Obj.key ? step1Obj.key : '';
    this.configurationDet.step1DD = this.configurationDet.selectedStep1 ? [this.configurationDet.selectedStep1] : [];

    this.configurationDet.step1Obj = step1Obj ? Object.assign({
      stepName: this.configurationDet.step1Name,
      [this.configurationDet.step1Name]: this.configurationDet.step1DD
    }) : null;

    const step2Arr = this.bufferDataSet && this.bufferDataSet.storedData && this.bufferDataSet.storedData.configuration ?
      this.bufferDataSet.storedData.configuration.filter(it => it.type === 'step2') : [];
    const step2Obj = step2Arr.length > 0 ? step2Arr[0] : null;
    this.configurationDet.selectedStep2 = step2Obj && step2Obj.value ? step2Obj.value : '';
    this.configurationDet.step2Name = step2Obj && step2Obj.key ? step2Obj.key : '';
    this.configurationDet.step2DD = this.configurationDet.selectedStep2 ? [this.configurationDet.selectedStep2] : [];

    this.configurationDet.step2Obj = step2Obj ? Object.assign({
      stepName: this.configurationDet.step2Name,
      [this.configurationDet.step2Name]: [{
        database: this.configurationDet.selectedStep1,
        collections: this.configurationDet.step2DD
      }]
    }) : null;

    this.setFeatureDetailsOnLoad();

  }

  getJobTypeList() {
    this.dataManagementService.getJobType({}).subscribe((res: any) => {
      if (res.status === 'success') {
        this.jobTypeList = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.jobTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch job type list');
      }
    },
      err => {
        this.jobTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch job type list');
      });
  }

  getPropertyTypeList() {
    this.dataManagementService.getPropertyType({}).subscribe((res: any) => {
      if (res.status === 'success') {
        this.propertyTypeList = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.propertyTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch property type list');
      }
    },
      err => {
        this.propertyTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch property type list');
      });
  }

  getConfigurationDetailsList() {

    const storedData = 'stored_data';
    const streamData = 'stream_data';
    this.dataManagementService.getConfigurationNamesList(storedData).subscribe((res: any) => {
      if (res.status === 'success') {
        this.configurationDD = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.configurationDD = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch configuration list for stored data');
      }
    },
      err => {
        this.configurationDD = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch configuration list for stored data');
      });


    this.dataManagementService.getConfigurationNamesList(streamData).subscribe((res: any) => {
      if (res.status === 'success') {
        this.streamDataConfigurationList = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.streamDataConfigurationList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch configuration list for stream data');
      }
    },
      err => {
        this.streamDataConfigurationList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch configuration list for stream data');
      });
  }

  getConfigDetails(selectedConfig) {
    const data = { configurationName: selectedConfig };
    this.dataManagementService.getConfigurationDet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.configurationDet.storeddataSourceList = res.data && res.data.data ? [res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSource = this.configurationDet.storeddataSourceList.length > 0 ? this.configurationDet.storeddataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSrcObj = this.configurationDet.storeddataSourceList.length > 0 ? Object.assign({}, this.configurationDet.storeddataSourceList[0]) : null;
      } else {
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch db type details');
      }
      this.getAllStepDetails();
    },
      err => {
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch db type details');
        this.getAllStepDetails();
      });
  }

  getStreamConfigDetails(selectedConfig) {
    const data = { configurationName: selectedConfig };
    this.dataManagementService.getConfigurationDet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.streamConfigurationDet.streamdataSourceList = res.data && res.data.data ? [res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        this.streamConfigurationDet.selectedDataSource = this.streamConfigurationDet.streamdataSourceList.length > 0 ? this.streamConfigurationDet.streamdataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.streamConfigurationDet.selectedDataSrcObj = this.streamConfigurationDet.streamdataSourceList.length > 0 ? Object.assign({}, this.streamConfigurationDet.streamdataSourceList[0]) : null;
      } else {

        this.streamConfigurationDet.streamdataSourceList = [];
        this.streamConfigurationDet.selectedDataSource = '';
        this.streamConfigurationDet.selectedDataSrcObj = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch db type details');
      }
    },
      err => {
        this.streamConfigurationDet.streamdataSourceList = [];
        this.streamConfigurationDet.selectedDataSource = '';
        this.streamConfigurationDet.selectedDataSrcObj = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch db type details');
      });
  }


  getAllStepDetails() {
    if (this.configurationDet.selectedDataSrcObj) {
      const data = Object.assign({}, this.configurationDet.selectedDataSrcObj);
      this.dataManagementService.getStepsDetails(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.configurationDet.step1Obj = res.data && res.data.data && res.data.data.step1 ? res.data.data.step1 : null;
          this.configurationDet.step2Obj = res.data && res.data.data && res.data.data.step2 ? res.data.data.step2 : null;

          this.configurationDet.step1Name = this.configurationDet.step1Obj && this.configurationDet.step1Obj.stepName ?
            this.configurationDet.step1Obj.stepName : '';

          this.configurationDet.step1DD = this.configurationDet.step1Obj &&
            this.configurationDet.step1Obj[this.configurationDet.step1Name] ?
            [...this.configurationDet.step1Obj[this.configurationDet.step1Name]] : [];

          if (this.initialLoad === true && this.upsertType === 'U') {
            const step1Arr = this.bufferDataSet && this.bufferDataSet.storedData && this.bufferDataSet.storedData.configuration ?
              this.bufferDataSet.storedData.configuration.filter(it => it.type === 'step1') : [];
            const step1Obj = step1Arr.length > 0 ? step1Arr[0] : null;
            this.configurationDet.selectedStep1 = step1Obj && step1Obj.value ? step1Obj.value : '';
          } else {
            this.configurationDet.selectedStep1 = '';
          }
          this.onStep1Change(this.configurationDet.selectedStep1);

        } else {
          this.initialLoad = false;
          this.resetSteps();
          this.notify.showToastrWarning('Alert', 'API failed to fetch step details');
        }
      },
        err => {
          this.initialLoad = false;
          this.resetSteps();
          this.notify.showToastrWarning('Alert', 'API failed to fetch step details');
        });
    } else {
      this.initialLoad = false;
      this.resetSteps();
    }
  }

  resetStep2() {
    this.configurationDet.step2Name = '';
    this.configurationDet.step2DD = [];
    this.configurationDet.selectedStep2 = '';
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';
  }

  resetSteps() {
    this.configurationDet.step1Obj = null;
    this.configurationDet.step2Obj = null;
    this.configurationDet.step1Name = '';
    this.configurationDet.step1DD = [];
    this.configurationDet.selectedStep1 = '';
    this.configurationDet.step2Name = '';
    this.configurationDet.step2DD = [];
    this.configurationDet.selectedStep2 = '';
    this.featureDetails = [];
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';

    this.resetFlatDataFeature();
  }

  setTimeColumnDD() {
    const dateFeature = this.featureDetails.filter(it =>
      (it.propertyType === 'datetime' || it.propertyType === 'date' || it.propertyType === 'time') &&
      it.select === false);

    this.flatDataObj.timeColumnDD = [...dateFeature];
    if (!this.flatDataObj.timeColumnDD.some(it => it.feature === this.flatDataObj.timeColumn)) {
      this.flatDataObj.timeColumn = '';
    }
  }

  setFlatDataFeatureDD(initialLoad?) {
    const dateFeature = this.featureDetails.filter(it =>
      it.propertyType === 'datetime' || it.propertyType === 'date' || it.propertyType === 'time');
    this.flatDataObj.featureToDescribeDD = [...this.featureDetails];
    this.flatDataObj.lookUpColumnsDD = [...this.featureDetails];
    this.flatDataObj.timeColumnDD = [...dateFeature];
    if (!initialLoad) {
      this.flatDataObj.featureToDescribe = [];
      this.flatDataObj.lookUpColumns = [];
      this.flatDataObj.timeColumn = '';
      // this.clearDateRange();
    }

  }

  resetFlatDataFeature() {
    this.flatDataObj.featureToDescribe = [];
    this.flatDataObj.featureToDescribeDD = [];
    this.flatDataObj.lookUpColumns = [];
    this.flatDataObj.lookUpColumnsDD = [];
    this.flatDataObj.timeColumn = '';
    this.flatDataObj.timeColumnDD = [];
    // this.clearDateRange();
  }

  onOptionChange() {
    this.resetAllFeilds();
  }

  resetAllFeilds() {
    this.selectedConfiguration = '';
    this.fileName = '';
    this.configurationDet.storeddataSourceList = [];
    this.configurationDet.selectedDataSource = '';
    this.configurationDet.selectedDataSrcObj = null;
    this.configurationDet.step1Obj = null;
    this.configurationDet.step2Obj = null;
    this.configurationDet.step1Name = '';
    this.configurationDet.step1DD = [];
    this.configurationDet.selectedStep1 = '';
    this.configurationDet.step2Name = '';
    this.configurationDet.step2DD = [];
    this.configurationDet.selectedStep2 = '';
    this.featureDetails = [];
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';

    this.resetFlatDataFeature();
  }

  onStep1Change(selectedStep1) {
    if (this.configurationDet.step2Obj) {
      this.configurationDet.step2Name = this.configurationDet.step2Obj && this.configurationDet.step2Obj.stepName ?
        this.configurationDet.step2Obj.stepName : '';

      this.configurationDet.step2DD = this.filterStep2DD(this.configurationDet.step2Name, selectedStep1);

      if (this.initialLoad === true && this.upsertType === 'U') {
        const step2Arr = this.bufferDataSet && this.bufferDataSet.storedData && this.bufferDataSet.storedData.configuration ?
          this.bufferDataSet.storedData.configuration.filter(it => it.type === 'step2') : [];
        const step2Obj = step2Arr.length > 0 ? step2Arr[0] : null;
        this.configurationDet.selectedStep2 = step2Obj && step2Obj.value ? step2Obj.value : '';
        this.setFeatureDetailsOnLoad();
      } else {
        this.configurationDet.selectedStep2 = '';
      }
    } else {
      this.resetStep2();
      if (this.initialLoad === true && this.upsertType === 'U') {
        this.setFeatureDetailsOnLoad();
      } else {
        this.featureDetails = [];
        this.resetFlatDataFeature();
      }
    }
  }

  setFeatureDetailsOnLoad() {
    this.featureDetails = this.bufferDataSet && this.bufferDataSet.featureMapping ?
      this.bufferDataSet.featureMapping.map(it => Object.assign({ ...it, select: false })) : [];
    this.setFlatDataFeatureDD(true);
    this.initialLoad = false;
  }

  filterStep2DD(stepName, selectedStep1) {
    let stepDD = [];
    if (stepName) {
      const Step2 = this.configurationDet.step2Obj &&
        this.configurationDet.step2Obj[stepName] ?
        this.configurationDet.step2Obj[stepName].filter(it => it.database === selectedStep1) : [];
      stepDD = Step2.length > 0 && Step2[0].collections ? [...Step2[0].collections] : [];
    }
    return stepDD;

  }

  getFeatureListValidation() {
    if (this.upsertStoredFrm.invalid) {
      this.global.opendisplayModal('Please provide all the details to fetch features', 'OK', 'Alert');
    } else if (!this.options && !this.fileName) {
      this.global.opendisplayModal('Please provide all the details to fetch features', 'OK', 'Alert');
    } else {
      this.getFeatureList();
    }
  }

  getFeatureList() {
    const data = Object.assign({}, this.configurationDet.selectedDataSrcObj);
    if (this.configurationDet.step1Name) {
      data[this.configurationDet.step1Name] = this.configurationDet.selectedStep1;
    }
    if (this.configurationDet.step2Name) {
      data[this.configurationDet.step2Name] = this.configurationDet.selectedStep2;
    }
    this.featureLoader = true;
    this.dataManagementService.getFeatureDet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.featureDetails = res.data && res.data.data ? res.data.data.map(it => Object.assign({ ...it, select: false })) : [];
        this.setFlatDataFeatureDD();
      } else {
        this.featureDetails = [];
        this.resetFlatDataFeature();
        this.notify.showToastrWarning('Alert', 'API failed to fetch feature');
      }
      this.featureLoader = false;
    },
      err => {
        this.featureDetails = [];
        this.resetFlatDataFeature();
        this.featureLoader = false;
        this.notify.showToastrWarning('Alert', 'API failed to fetch feature');
      });
  }

  valdateTime(hrs, min) {
    if (hrs < 0 || hrs > 24) {
      return true;
    } else if (min < 0 || min > 60) {
      return true;
    } else {
      const totalTime = +(hrs + '' + min);
      return totalTime >= 0 && totalTime <= 2400 ? false : true;
    }
  }

  saveDataSetDetails() {
    if (this.panelDetailsFrm.invalid || this.upsertStoredFrm.invalid ||
      (!this.stream && !this.stored) || this.selectedJobType.length === 0) {
      this.global.opendisplayModal('Please provide all the details to save data set', 'OK', 'Alert');
    } else if (this.dataSetName.length < 3) {
      this.global.opendisplayModal('Name provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.dataSetName)) {
      this.global.opendisplayModal('Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (this.stored && !this.options && !this.fileName) {
      this.global.opendisplayModal('Please provide all the details to fetch features', 'OK', 'Alert');
    } else if (this.stored && this.featureDetails.length === 0) {
      this.global.opendisplayModal('At least one feature should be available to save data set', 'OK', 'Alert');
    } else if (this.stored && this.featureDetails.some(it => it.select === true)) {
      this.global.opendisplayModal('Accept all features property changes to save data set', 'OK', 'Alert');
    } else if (!this.multivariateObj.multivariate && !this.flatDataObj.timeColumn && this.dateRangeFrm.invalid) {
      this.global.opendisplayModal('Please provide date range details for flat Data', 'OK', 'Alert');
    } else if (!this.multivariateObj.multivariate && !this.flatDataObj.timeColumn &&
      this.valdateTime(!this.multivariateObj.multivariate && this.flatDataObj.fromTimeHr, this.flatDataObj.fromTimeMin) === true) {
      this.global.opendisplayModal('Start Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else if (!this.multivariateObj.multivariate && !this.flatDataObj.timeColumn &&
      this.valdateTime(this.flatDataObj.toTimeHr, this.flatDataObj.toTimeMin) === true) {
      this.global.opendisplayModal('End Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else {
      if (!this.multivariateObj.multivariate && !this.flatDataObj.timeColumn) {
        this.flatDataObj.startTime = this.getDateString(this.flatDataObj.fromDate,
          this.flatDataObj.fromTimeHr, this.flatDataObj.fromTimeMin);
        this.flatDataObj.endTime = this.getDateString(this.flatDataObj.toDate,
          this.flatDataObj.toTimeHr, this.flatDataObj.toTimeMin);
      }
      if (!this.multivariateObj.multivariate && !this.flatDataObj.timeColumn &&
        new Date(this.flatDataObj.startTime) > new Date(this.flatDataObj.endTime)) {
        this.global.opendisplayModal('Start Time should not be greater than end time', 'OK', 'Alert');
      } else {
        this.saveDataSetObjCreate();
      }


    }

  }

  getDispTime(val) {
    val = val ? val.toString() : '';
    const tempVal = val.length === 1 ? ('0' + val) : val;
    return tempVal;
  }

  getDateString(dateObj, hrs, min) {
    dateObj = new Date(dateObj);
    let dateVal: any = dateObj.getDate();
    const dateMonth = dateObj.toLocaleString('default', { month: 'short' });
    const dateYear = dateObj.getFullYear();
    dateVal = dateVal < 10 ? ('0' + dateVal) : dateVal;
    const DateString = dateVal + ' ' + dateMonth + ' ' + dateYear + ' ' + hrs + ':' + min + ' UTC';
    const UTCdate = new Date(DateString);
    return UTCdate.toISOString();

  }

  createUTCDatefromISO(IsoString) {
    const localDate = new Date(IsoString);
    const UTCDate = localDate.getUTCDate();
    const UTCMonth = localDate.getUTCMonth();
    const UTCYear = localDate.getUTCFullYear();
    const UTCHrs = localDate.getUTCHours();
    const UTCMins = localDate.getUTCMinutes();
    return { dateObj: new Date(UTCYear, UTCMonth, UTCDate), hrs: this.getDispTime(UTCHrs), mins: this.getDispTime(UTCMins) };
  }

  saveDataSetObjCreate() {

    const fetaureList = this.featureDetails.map((addColumn) => {
      const newColumn = Object.assign({}, addColumn);
      delete newColumn.select;
      return newColumn;
    });
    const dataSrcType = [];
    const steps = [];
    if (this.stored) {
      dataSrcType.push('stored_data');
    }
    if (this.stream) {
      dataSrcType.push('stream_data');
    }
    if (this.configurationDet.step1Name) {
      steps.push({ key: this.configurationDet.step1Name, value: this.configurationDet.selectedStep1, type: 'step1' });
    }
    if (this.configurationDet.step2Name) {
      steps.push({ key: this.configurationDet.step2Name, value: this.configurationDet.selectedStep2, type: 'step2' });
    }
    const data = {
      dataSetName: this.dataSetName,
      dataSourceType: dataSrcType,
      jobType: this.selectedJobType,
      multivariate: this.multivariateObj.multivariate ? 'True' : 'False',
      dataSets: this.multivariateObj.dataSets,
      flatData: this.flatDataObj.flatData ? this.flatDataObj.flatData : '',
      featureToDescribe: this.flatDataObj.flatData === 'False' ? this.flatDataObj.featureToDescribe : [],
      lookUpColumns: this.flatDataObj.flatData === 'False' ? this.flatDataObj.lookUpColumns : [],
      timeColumn: this.flatDataObj.timeColumn ? this.flatDataObj.timeColumn : '',
      startTime: !this.flatDataObj.timeColumn && this.flatDataObj.startTime ? this.flatDataObj.startTime : '',
      endTime: !this.flatDataObj.timeColumn && this.flatDataObj.endTime ? this.flatDataObj.endTime : '',
      timeInterval: !this.flatDataObj.timeColumn && this.flatDataObj.timeInterval ? +this.flatDataObj.timeInterval : 0,

      fileName: !this.options ? this.fileName : '',
      storedData: {
        dbType: this.configurationDet.selectedDataSource,
        configuration: steps,
        connectionDetails: this.configurationDet.selectedDataSrcObj ? this.configurationDet.selectedDataSrcObj : {},
      },
      streamData: {
        dbType: this.streamConfigurationDet.selectedDataSource,
        databaseName: this.stream ? this.dataSetName : '',
        connectionDetails: this.streamConfigurationDet.selectedDataSrcObj ? this.streamConfigurationDet.selectedDataSrcObj : {},
      },
      featureMapping: fetaureList

    };


    if (this.upsertType === 'C') {
      this.createDataSetDetails(data);
    } else {
      this.updateDataSetDetails(data);
    }
  }

  updateDataSetDetails(data) {
    this.dataManagementService.updateDataSet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
          this.notify.showToastrWarning('Alert', res.data.message);
        } else {
          this.notify.showToastrSuccess('Success', 'Data set updated successfully');
          this.upsertType = 'U';
        }
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to update data set');
      }
    },
      err => {
        this.notify.showToastrWarning('Alert', 'API failed to update data set');
      });
  }

  createDataSetDetails(data) {
    this.dataManagementService.createDataSet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
          this.notify.showToastrWarning('Alert', res.data.message);
        } else {
          this.notify.showToastrSuccess('Success', 'Data set created successfully');
          this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/datasource']);
        }
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to create data set');
      }
    },
      err => {
        this.notify.showToastrWarning('Alert', 'API failed to create data set');
      });
  }

  saveFileTOBlob(evt) {
    if (evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      const file: File = evt.target.files[0];
      const fileExtension = (file.name) ? (file.name.split('.').pop()) : '';
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event: any) => {
        const arrayBuffer: any = reader.result;
        const uint = new Uint8Array(arrayBuffer);
        const bytes = [];
        for (let j = 0; j < 4; j++) {
          bytes.push(uint[j].toString(16));
        }
        let hex = bytes.join('').toUpperCase();
        hex = hex.slice(0, 4);
        if (fileExtension === 'xlsx' || fileExtension === 'csv' || fileExtension === 'xls' || hex === '4D5A') {
          this.fileName = file.name;
          evt.srcElement.value = null;
          this.saveFile(file);
        } else {
          this.global.opendisplayModal('File type should be .xlsx, .xls or csv', 'OK', 'Alert');
          this.fileName = '';
          evt.srcElement.value = null;
          this.configurationDet.storeddataSourceList = [];
          this.configurationDet.selectedDataSource = '';
          this.configurationDet.selectedDataSrcObj = null;
          this.resetSteps();
        }

      };

    }
  }

  saveFile(file) {
    const fd: FormData = new FormData();
    fd.append('file_uploaded', file);
    this.dataManagementService.fileUpload(fd).subscribe((res: any) => {
      if (res.status === 'success') {
        const dtasrcObj = res.data ? Object.assign({}, res.data) : null;
        delete dtasrcObj.stepDetails;
        this.configurationDet.storeddataSourceList = dtasrcObj ? [dtasrcObj] : [];
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSource = this.configurationDet.storeddataSourceList.length > 0 ? this.configurationDet.storeddataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSrcObj = this.configurationDet.storeddataSourceList.length > 0 ? Object.assign({}, this.configurationDet.storeddataSourceList[0]) : null;

        this.configurationDet.selectedStep1 = '';
        this.configurationDet.step1Obj = res.data && res.data.stepDetails && res.data.stepDetails.step1 ? res.data.stepDetails.step1 : null;
        this.configurationDet.step2Obj = res.data && res.data.stepDetails && res.data.stepDetails.step2 ? res.data.stepDetails.step2 : null;

        this.configurationDet.step1Name = this.configurationDet.step1Obj && this.configurationDet.step1Obj.stepName ?
          this.configurationDet.step1Obj.stepName : '';

        this.configurationDet.step1DD = this.configurationDet.step1Obj &&
          this.configurationDet.step1Obj[this.configurationDet.step1Name] ?
          [...this.configurationDet.step1Obj[this.configurationDet.step1Name]] : [];
        this.resetStep2();
        this.featureDetails = [];
        this.resetFlatDataFeature();
      } else {
        this.fileName = '';
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.resetSteps();
        this.notify.showToastrWarning('Alert', 'API failed to fetch upload details');
      }
    },
      err => {
        this.fileName = '';
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.resetSteps();
        this.notify.showToastrWarning('Alert', 'API failed to fetch upload details');
      });
  }

  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.flatDataObj.toDate && this.flatDataObj.fromDate && new Date(this.flatDataObj.toDate) < new Date(this.flatDataObj.fromDate)) {
      this.flatDataObj.toDate = '';
    }
    this.minToDate = this.flatDataObj.fromDate ? new Date(this.flatDataObj.fromDate) : '';
  }


}
