import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as moment from 'moment';
import { NwSnapshotService } from '../../services/nwsnapshot.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import { map } from 'jquery';
import { UpsertGroupNameComponent } from 'src/app/libs/feature-group/dialogs/upsert-group-name/upsert-group-name.component';
import { WebsocketService } from 'src/app/services/websocket.service';
@Component({
  selector: 'app-profiler-upsert-feature-group',
  templateUrl: './profiler-upsert-feature-group.component.html',
  styleUrls: ['./profiler-upsert-feature-group.component.scss']
})
export class ProfilerUpsertFeatureGroupComponent implements OnInit {

  @ViewChild('dateRange', { static: true }) public dateRangeFrm: NgForm;
  featureLoader: boolean = false;
  @Input() selectorType = '';

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

  //Correlation Analysis
  defaultCurrentPageCorrelation = 1;
  defauultItempgCorrelation = 25;
  itemPerPageCorrelation: number = this.defauultItempg;
  inputCurrentpageCorrelation: number = this.defaultCurrentPage;
  pageArrCorrelation = [25, 50, 100];
  configCorrelation = {
    id: 'paginateFeatureCorrelation',
    itemsPerPage: this.defauultItempgCorrelation,
    currentPage: this.defaultCurrentPageCorrelation,
    totalItems: 0
  };

  minFromDate: any = '';
  minToDate: any = '';
  minToDateAfterUpgrade: any = '';
  defaultTimeFilterVal: any = {
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
    from_Time: '',
    to_Time: ''
  };
  timeFilterVal: any = Object.assign({}, this.defaultTimeFilterVal);
  timeFilterVal1: any = Object.assign({}, this.defaultTimeFilterVal);
  searchFilter = '';
  searchFilter1 = '';

  jobType: any;
  jobTypes = [
    "COMPARISIONCLASSIFICATION"
  ];
  datasetDropdown: any;
  selectedDataSet = '';
  selectedModelConfig: any;
  modelConfigs: any;
  jobs = [];
  modelConfigDropdown: any = [];

  enableModelConfig: boolean = false;
  enableTable: boolean = false;

  enableCorrelationAnalysis: boolean = false;
  enableAnomalyAnalysis: boolean = false;

  anomalyAnalysisPresent: boolean = false;
  correlationAnalysisPresent: boolean = false;

  featureDetails = [];

  anomalyAnalysis: any = {};
  anomalyAnalysisFeatureName: any = [];
  anomalyAnalysisFeatureDetails: any = [];

  correlationAnalysis: any = {};
  correlationAnalysisFeatureName: any = [];
  correlationAnalysisFeatureDetails: any = [];

  enableAnalysisRadioButton: boolean = false;

  webSocket: any;
  statusWebSocketData: any;


  anomalyKey = '';
  anomalyReverse = false;

  correlationKey = '';
  correlationReverse = false;

  disableSubmitButton: boolean = false;

  radioButtonValue = "anomalyAnalysis";

  constructor(private webSocketService: WebsocketService, private notify: NotificationService, public nwSnapshotService: NwSnapshotService, public global: GlobalService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.anomalyAnalysis = {};
    this.correlationAnalysis = {};
    this.setDate();
    //this.getModelConfigs();
  }

  setDate() {
    const date = new Date();
    const day = date.toISOString().substring(0, 10);
    const hours = date.getUTCHours() < 10 ? "0" + date.getUTCHours().toString() : date.getUTCHours().toString();
    const minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes().toString() : date.getUTCMinutes().toString();

    this.timeFilterVal.fromDate = day;
    this.timeFilterVal.toDate = day;

    this.timeFilterVal1.fromDate = day;
    this.timeFilterVal1.toDate = day;

    this.timeFilterVal.fromTimeHr = hours;
    this.timeFilterVal.toTimeHr = hours;

    this.timeFilterVal1.fromTimeHr = hours;
    this.timeFilterVal1.toTimeHr = hours;

    this.timeFilterVal.fromTimeMin = minutes;
    this.timeFilterVal.toTimeMin = minutes;

    this.timeFilterVal1.fromTimeMin = minutes;
    this.timeFilterVal1.toTimeMin = minutes;


  }

  ngOnDestroy() {
    if (this.webSocket) {
      this.webSocket.complete();
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  getStatusWebsocket(requestId) {
    this.webSocket = this.webSocketService.connectToStatusWebSocket(requestId).subscribe((res: any) => {
      if (res) {
        if (res.uid === requestId) {
          if (res.status == "COMPLETED") {
            this.statusWebSocketData = res.status;
            this.enableAnalysisRadioButton = true;
            this.disableSubmitButton = false;
            this.enableTable = true;
            if (res.anomalyAnalysis != null) {
              if (Object.keys(res.anomalyAnalysis).length > 0) {
                this.anomalyAnalysis = res.anomalyAnalysis;
                const anomalyObjectArray = this.createFeatureObj(this.anomalyAnalysis.anomalousEvents, true);
                this.anomalyAnalysisFeatureName = anomalyObjectArray.featureNameArr;
                this.anomalyAnalysisFeatureDetails = anomalyObjectArray.fetaureDetArr;
                this.anomalyAnalysisPresent = true;
              }
            }

            if (res.correlation != null) {
              if (Object.keys(res.correlation).length > 0) {
                this.correlationAnalysis = res.correlation;
                const correlationObjectArray = this.createFeatureObj(this.correlationAnalysis.correlationAnalysis, false);
                this.correlationAnalysisFeatureName = correlationObjectArray.featureNameArr;
                this.correlationAnalysisFeatureDetails = correlationObjectArray.fetaureDetArr;
                this.correlationAnalysisPresent = true;
              }
            }

            if (this.anomalyAnalysisPresent == false) {
              this.enableCorrelationAnalysis = true;
              this.enableAnomalyAnalysis = false;
              this.radioButtonValue = "correlationAnalysis";
            }

            else {
              this.enableCorrelationAnalysis = false;
              this.enableAnomalyAnalysis = true;
              this.radioButtonValue = "anomalyAnalysis";
            }

            if (this.webSocket) {
              this.webSocket.complete();
            }
          }

          else if (res.status === "ABORTED") {
            this.statusWebSocketData = res.status;
            this.disableSubmitButton = false;
            this.featureLoader = false;
            this.enableTable = false;
            this.enableAnomalyAnalysis = false;
            this.enableCorrelationAnalysis = false;
            this.resetData();
            if (this.webSocket) {
              this.webSocket.complete();
            }
          }

          else {
            this.statusWebSocketData = res.status;
          }
        }
      }

      else {
        this.featureLoader = false;
        this.enableTable = false;
        this.enableAnomalyAnalysis = false;
        this.enableCorrelationAnalysis = false;
        this.resetData();
      }
    },
      (err) => {
        this.statusWebSocketData = null;
        this.disableSubmitButton = false;
        this.featureLoader = false;
        this.enableTable = false;
        this.enableAnomalyAnalysis = false;
        this.enableCorrelationAnalysis = false;
        this.resetData();
        this.notify.showToastrError('Failed', 'API data fetching failed');
        if (this.webSocket) {
          this.webSocket.complete();
        }
      })
  }

  getModelConfigs() {
    this.modelConfigDropdown = [];
    //API call to fetch model configs
    this.nwSnapshotService.getModelConfigs().subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.modelConfigDropdown = res.data && res.data && res.data.length > 0 ? res.data.filter(x => x.dataSetName === this.selectedDataSet && x.jobType === "ANOMALYTRAINING1") : [];
        // tslint:disable-next-line:max-line-length
      } else {
        this.modelConfigDropdown = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
      }

    }, err => {
      this.modelConfigDropdown = [];
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
    });
  }

  getDataSetDropDownData() {
    this.datasetDropdown = [];
    const JobType = { jobType: this.jobType };
    this.nwSnapshotService.dataSetName(JobType).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.datasetDropdown = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length

      } else {
        this.datasetDropdown = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
      }

    }, err => {
      this.datasetDropdown = [];
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
    });
  }

  // on search
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

  //CORRELATION ANALYSIS PAGINATION CONFIGURATION
  onCorrelationSearchChange() {
    this.inputCurrentpageCorrelation = this.defaultCurrentPageCorrelation;
    this.configCorrelation.currentPage = this.defaultCurrentPageCorrelation;
  }

  changepageinpCorrelation(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpageCorrelation = this.configCorrelation.currentPage;
      // alert("Invalid page number")
    } else {
      this.configCorrelation.currentPage = inputVal;
    }
  }

  // onpage change
  changepageCorrelation(evt) {
    this.configCorrelation.currentPage = evt;
    this.inputCurrentpageCorrelation = evt;
  }

  // set new page size for pagination
  setNewPageSizeCorrelation(pageSize) {
    this.configCorrelation.itemsPerPage = pageSize;
    this.configCorrelation.currentPage = this.defaultCurrentPageCorrelation;
    this.inputCurrentpageCorrelation = this.defaultCurrentPageCorrelation;
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

  getHrsMin(hrs, min) {
    const hrsVal = hrs.length === 1 ? ('0' + hrs) : hrs;
    const MinVal = min.length === 1 ? ('0' + min) : min;
    return (hrsVal + ':' + MinVal);
  }

  getDateString(dateObj) {
    let dateVal: any = dateObj.getDate();
    const dateMonth = dateObj.toLocaleString('default', { month: 'short' });
    const dateYear = dateObj.getFullYear();
    dateVal = dateVal < 10 ? ('0' + dateVal) : dateVal;
    return (dateMonth + '-' + dateVal + '-' + dateYear);

  }

  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterVal.toDate && this.timeFilterVal.fromDate && new Date(this.timeFilterVal.toDate) < new Date(this.timeFilterVal.fromDate)) {
      this.timeFilterVal.toDate = '';
    }
    this.minToDate = this.timeFilterVal.fromDate ? new Date(this.timeFilterVal.fromDate) : '';
  }

  onFromDateChangeAfterUpgrade() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterVal1.toDate && this.timeFilterVal1.fromDate && new Date(this.timeFilterVal1.toDate) < new Date(this.timeFilterVal1.fromDate)) {
      this.timeFilterVal1.toDate = '';
    }
    this.minToDateAfterUpgrade = this.timeFilterVal1.fromDate ? new Date(this.timeFilterVal1.fromDate) : '';
  }

  onDropDownClose(feature, action, value) {
    if (action === "apply") {
      this.jobs = value;
      if (this.jobs.includes("ANOMALYTRAINING1")) {
        this.enableModelConfig = true;
        this.getModelConfigs();
      }

      else {
        this.enableModelConfig = false;
        this.selectedModelConfig = '';
      }
    }

    else {
      this.enableModelConfig = false;
      this.selectedModelConfig = '';
      this.jobs = [];
    }
  }

  switchAnalysisFilter(data) {
    if (data.detail.value === "correlationAnalysis") {
      this.enableCorrelationAnalysis = true;
      this.enableAnomalyAnalysis = false;
    }

    else {
      this.enableCorrelationAnalysis = false;
      this.enableAnomalyAnalysis = true;
    }
  }

  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  resetData() {

    this.correlationAnalysisPresent = false;
    this.anomalyAnalysisPresent = false;

    this.enableAnomalyAnalysis = false;
    this.enableCorrelationAnalysis = false;
    this.enableTable = false;
    this.anomalyAnalysis = {};
    this.anomalyAnalysisFeatureName = [];
    this.anomalyAnalysisFeatureDetails = [];

    this.correlationAnalysis = {};
    this.correlationAnalysisFeatureName = [];
    this.correlationAnalysisFeatureDetails = [];
  }

  createFeatureObj(dataObjectArr, removeReasons) {
    const fetureArr = [];
    const featureDetailsArr = [...dataObjectArr];
    if (dataObjectArr.length > 0) {
      const featureDetObj = Object.assign({}, dataObjectArr[0]);
      Object.keys(featureDetObj).forEach(it => {
        if (!(removeReasons && it == "Reasons")) {
          const featureObj = { featureName: it, fetureKey: it };
          fetureArr.push(Object.assign({}, featureObj));
        }
      });

    }
    return { featureNameArr: fetureArr, fetaureDetArr: featureDetailsArr };
  }

  displayReasonColor(dataObj, featureKey) {
    if (dataObj.Reasons) {
      let reasonArr = dataObj.Reasons.split(',');
      reasonArr = (reasonArr && reasonArr.length) ? reasonArr.flatMap(x => {
        if (x) {
          return x.trim();
        }
      }) : [];
      return reasonArr.some(x => x === featureKey);
    }

    else {
      return false;
    }
  }

  submitData() {
    const beforeFromTime = this.getDateString(new Date(this.timeFilterVal.fromDate)) + ' ' + this.getHrsMin(this.timeFilterVal.fromTimeHr, this.timeFilterVal.fromTimeMin);
    const beforeToTime = this.getDateString(new Date(this.timeFilterVal.toDate)) + ' ' + this.getHrsMin(this.timeFilterVal.toTimeHr, this.timeFilterVal.toTimeMin);
    const afterFromTime = this.getDateString(new Date(this.timeFilterVal1.fromDate)) + ' ' + this.getHrsMin(this.timeFilterVal1.fromTimeHr, this.timeFilterVal1.fromTimeMin);
    const afterToTime = this.getDateString(new Date(this.timeFilterVal1.toDate)) + ' ' + this.getHrsMin(this.timeFilterVal1.toTimeHr, this.timeFilterVal1.toTimeMin);

    if (!this.jobType || !this.selectedDataSet || this.jobs.length == 0 || !this.timeFilterVal.fromDate || !this.timeFilterVal.fromTimeHr ||
      !this.timeFilterVal.fromTimeMin || !this.timeFilterVal.toDate || !this.timeFilterVal.toTimeHr || !this.timeFilterVal.toTimeMin || !this.timeFilterVal1.fromDate || !this.timeFilterVal1.fromTimeHr ||
      !this.timeFilterVal1.fromTimeMin || !this.timeFilterVal1.toDate || !this.timeFilterVal1.toTimeHr || !this.timeFilterVal1.toTimeMin) {
      this.global.opendisplayModal('Please fill the details for all the fields ', 'OK', 'Alert');
    }

    else if (new Date(beforeFromTime) > new Date(beforeToTime) || new Date(afterFromTime) > new Date(afterToTime)) {
      this.global.opendisplayModal('From date should not be greater than To date', 'OK', 'Alert');
    }

    else if ((parseInt(this.timeFilterVal.fromTimeMin) || parseInt(this.timeFilterVal.toTimeMin) || parseInt(this.timeFilterVal1.fromTimeMin) || parseInt(this.timeFilterVal1.toTimeMin)) > 59) {
      this.global.opendisplayModal('Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    }

    else if ((parseInt(this.timeFilterVal.fromTimeHr) || parseInt(this.timeFilterVal.toTimeHr) || parseInt(this.timeFilterVal1.fromTimeHr) || parseInt(this.timeFilterVal1.toTimeHr)) > 24) {
      this.global.opendisplayModal('Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    }

    else {
      this.statusWebSocketData = ' ';
      this.enableAnalysisRadioButton = false;
      this.resetData();
      this.postCompare();
    }
  }

  postCompare() {
    const beforeFromTime = this.getDateString(new Date(this.timeFilterVal.fromDate)) + ' ' + this.getHrsMin(this.timeFilterVal.fromTimeHr, this.timeFilterVal.fromTimeMin);
    const beforeToTime = this.getDateString(new Date(this.timeFilterVal.toDate)) + ' ' + this.getHrsMin(this.timeFilterVal.toTimeHr, this.timeFilterVal.toTimeMin);
    const afterFromTime = this.getDateString(new Date(this.timeFilterVal1.fromDate)) + ' ' + this.getHrsMin(this.timeFilterVal1.fromTimeHr, this.timeFilterVal1.fromTimeMin);
    const afterToTime = this.getDateString(new Date(this.timeFilterVal1.toDate)) + ' ' + this.getHrsMin(this.timeFilterVal1.toTimeHr, this.timeFilterVal1.toTimeMin);
    const data = {
      jobType: this.jobType,
      dataSet: this.selectedDataSet,
      jobs: this.jobs,
      modelConfigName: this.selectedModelConfig,
      beforeFromTime: this.toISO(beforeFromTime),
      beforeToTime: this.toISO(beforeToTime),
      afterFromTime: this.toISO(afterFromTime),
      afterToTime: this.toISO(afterToTime)
    };

    if (this.webSocket) {
      this.webSocket.complete();
    }

    this.nwSnapshotService.postCompareData(data).subscribe((res: any) => {
      this.disableSubmitButton = true;
      if (res.status == "success") {
        if (res.data.status == "SCHEDULED") {
          this.statusWebSocketData = res.data.status;
          this.getStatusWebsocket(res.data.uid);
        }

        else {
          this.statusWebSocketData = null;
          this.disableSubmitButton = false;
          this.featureLoader = false;
          this.enableTable = false;
          this.enableAnomalyAnalysis = false;
          this.enableCorrelationAnalysis = false;
          this.resetData();
          this.notify.showToastrError('Failed', 'Analysis scheduling failed');
        }
      }
    },

      err => {
        this.statusWebSocketData = null;
        this.disableSubmitButton = false;
        this.enableTable = false;
        this.enableAnomalyAnalysis = false;
        this.enableCorrelationAnalysis = false;
        this.resetData();
        this.notify.showToastrError('Failed', 'API data fetching failed');
      });
  }

  sortAnomaly(key) {
    if (key === this.anomalyKey) {
      this.anomalyReverse = !this.anomalyReverse;
    } else {
      this.anomalyKey = key;
      this.anomalyReverse = true;
    }
  }

  sortCorrelation(key) {
    if (key === this.correlationKey) {
      this.correlationReverse = !this.correlationReverse;
    } else {
      this.correlationKey = key;
      this.correlationReverse = true;
    }
  }
}

