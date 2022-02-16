import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, Input } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { GlobalService } from 'src/app/services/global.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/services/notification.service';
import * as moment from 'moment';
import { SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { ModelConfigViewComponent } from '../../dialogs/model-config-view/model-config-view.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataPreviewComponent } from '../../dialogs/data-preview/data-preview.component';
import { SummaryService } from '../../services/summary.service';
@Component({
  selector: 'app-rca',
  templateUrl: './rca.component.html',
  styleUrls: ['./rca.component.scss']
})

export class RCAComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input()
  set rcaObj(value) {
    if (value) {
      this.jobTypeSelected = value.jobType ? value.jobType : '';
      this.dataSetSelected =  value.dataSetName ? value.dataSetName : '';
      this.correlationFromTimePeriod = value.fromTime ? value.fromTime : '';
      this.correlationToTimePeriod = value.toTime ? value.toTime : '';
      this.loadTableData(true);
    } else {
      this.jobTypeSelected = '';
      this.dataSetSelected = '';
      this.clearSelection();
      this.tempAnomalyDetections = [];
    }
  }
  @ViewChild('clickMenuTrigger', { static: false }) trigger: MatMenuTrigger;
  tableData;
  Loader = true;
  headers: any;
  showFirst: any;
  key = 'name';
  reverse = false;
  keyP = 'name';
  reverseP = false;
  isShowDiv = false;
  scheduleRes;
  p = 1;
  isTableLoading = false;
  private pageSize = 10;
  closeforecastEdit: any;
  forecastData: any[];
  tempAnomalyDetections: any[] = [];
  tempforecast: any[];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
  selectedAnomaly: any = null;
  threadId: any;
  editSampletime: any;
  mintime: any;
  maxtime: any;
  toggle = false;
  editid: any;
  editne: any;
  pmType: any;
  podNumber: any;
  jobStatus: any;
  editForecastparam: any;
  frwrdPredict: any;
  editSeconds: any;
  editMinutes: any;
  editHours: any;
  editDays: any;
  all: any;
  getCallData: any;
  forecast: any;
  sample: any;
  input: any;
  startScDate;
  endScDate;
  edittemplate: any;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  isShown = true;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  itemPerPageMinTable: number = this.defauultItempg;
  inputCurrentpageMinTable: number = this.defaultCurrentPage;
  searchFilter = '';
  searchFilterMain = '';
  defaultJobType = 'FORECAST';
  dataSetList = [];
  anmdStatusList;
  jobTypeList = ['ASCEXECUTION'];
  dataSetSelected = '';
  anmdStatusSelected;
  jobTypeSelected = '';
  featureCount = 38;
  selectedInterval = 'off';
  selectionDataSet = [{ id: '1', name: 'selction 1' }, { id: '2', name: 'selction 2' }, { id: '2', name: 'selction 2' }];
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  configMinTable = {
    id: 'paginate2',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  disableSelectButton = false;
  masterDataLoader = false;
  dataSetDetailsLoading = false;
  selectedModel: any = {};
  trTab = true;
  anomalyCount = 0;
  temptabledata = [];
  timeFilterDetails: any = {
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
    filterFeature: '',
    minToDate: ''
  };
  timeFilterValue = '';
  correlationFromTimePeriod = '';
  correlationToTimePeriod = '';


  isLoading = false;
  socket;
  statusSocket: any;
  constructor(
    private notify: NotificationService,
    public dialog: MatDialog,
    public global: GlobalService,
    public summaryService: SummaryService,
    private webSocketService: WebsocketService) {
    // const latestDate = this.getUtcDateTime(new Date());
    // this.timeFilterDetails.fromDate = latestDate;
    // this.timeFilterDetails.toDate = latestDate;
  }

  ngOnInit() {
    // this.jobTypeSelected = this.jobTypeList[0];
    // this.openTimeEditMenu();
    // this.setDateDetails();
    // this.getDataSetList(true);
  }

  ngAfterViewChecked() {
  }

  convertDateToUTC(localDate?) {
    localDate = localDate ? localDate : new Date();
    return new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
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
  openTimeEditMenu() {
    this.timeFilterDetails.filterFeature = this.timeFilterValue;
    const currentDate = this.convertDateToUTC();
    const prevCurr = this.convertDateToUTC();
    prevCurr.setDate(prevCurr.getDate() - 1);
    // tslint:disable-next-line:max-line-length
    const fromDateObj = this.correlationFromTimePeriod ? this.getTimeFiterVal(this.correlationFromTimePeriod) : this.getTimeFiterVal(prevCurr);
    const toDateObj = this.correlationToTimePeriod ? this.getTimeFiterVal(this.correlationToTimePeriod) : this.getTimeFiterVal(currentDate);
    this.timeFilterDetails.fromDate = fromDateObj ? fromDateObj.dateVal : '';
    this.timeFilterDetails.fromTimeHr = fromDateObj ? fromDateObj.hrs : '';
    this.timeFilterDetails.fromTimeMin = fromDateObj ? fromDateObj.min : '';
    this.timeFilterDetails.toDate = toDateObj ? toDateObj.dateVal : '';
    this.timeFilterDetails.toTimeHr = toDateObj ? toDateObj.hrs : '';
    this.timeFilterDetails.toTimeMin = toDateObj ? toDateObj.min : '';
    this.timeFilterDetails.minToDate = new Date(this.timeFilterDetails.fromDate);
  }
  getTimeFiterVal(StrDate) {
    const dateObj = new Date(StrDate);
    let hrsVal: any = dateObj.getHours().toString();
    let minVal: any = dateObj.getMinutes().toString();
    hrsVal = hrsVal.length === 1 ? ('0' + hrsVal) : hrsVal;
    minVal = minVal.length === 1 ? ('0' + minVal) : minVal;
    return { dateVal: dateObj, hrs: hrsVal, min: minVal };
  }
  OnTimeFilterCheckBox(value) {
    if (value === false) {
      this.timeFilterDetails.filterFeature = '';
    }
  }
  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterDetails.toDate && this.timeFilterDetails.fromDate && new Date(this.timeFilterDetails.toDate) < new Date(this.timeFilterDetails.fromDate)) {
      this.timeFilterDetails.toDate = '';
    }
    this.timeFilterDetails.minToDate = this.timeFilterDetails.fromDate ? new Date(this.timeFilterDetails.fromDate) : '';
  }
  setDateDetails() {
    const fromDateInFormat = new Date(this.timeFilterDetails.fromDate);
    const toDateInFormat = new Date(this.timeFilterDetails.toDate);
    // tslint:disable-next-line:max-line-length
    const fromTimeDateCreate = this.getDateString(fromDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin);
    // tslint:disable-next-line:max-line-length
    const toTimeDateCreate = this.getDateString(toDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin);
    if (this.valdateTime(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin) === true) {
      this.global.opendisplayModal('From Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else if (this.valdateTime(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin) === true) {
      this.global.opendisplayModal('To Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else {
      this.correlationFromTimePeriod = fromTimeDateCreate;
      this.correlationToTimePeriod = toTimeDateCreate;
    }
    this.timeFilterValue = 'true';
    this.someMethod();
  }
  someMethod() {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }
  getDateString(dateObj) {
    let dateVal: any = dateObj.getDate();
    const dateMonth = dateObj.toLocaleString('default', { month: 'short' });
    const dateYear = dateObj.getFullYear();
    dateVal = dateVal < 10 ? ('0' + dateVal) : dateVal;
    return (dateMonth + '-' + dateVal + '-' + dateYear);
  }
  getHrsMin(hrs, min) {
    const hrsVal = hrs.length === 1 ? ('0' + hrs) : hrs;
    const MinVal = min.length === 1 ? ('0' + min) : min;
    return (hrsVal + ':' + MinVal);
  }


  getDataSetList(loadData?) {
    if (loadData) {
      this.masterDataLoader = true;
    }
    const JobType = { jobType: this.jobTypeSelected };
    this.summaryService.getClusteringDataSets(JobType).subscribe((res: any) => {
      this.masterDataLoader = false;
      if (res && res.status === 'success') {
        this.dataSetList = res.data && res.data.data ? res.data.data : [];
        this.dataSetSelected = this.dataSetList.length ? this.dataSetList[0] : '';
        if (loadData) {
          this.loadTableData(true);
        }
      } else {
        this.dataSetList = [];
        this.dataSetSelected = '';
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.masterDataLoader = false;
      }

    }, err => {
      this.dataSetList = [];
      this.dataSetSelected = '';
      this.notify.showToastrError('Alert', 'Server error occured');
      this.masterDataLoader = false;
    });
  }
  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  loadTableData(enableLoader?) {
    if (this.dataSetSelected && this.correlationFromTimePeriod && this.correlationToTimePeriod) {
      this.clearSelection();
      this.tempAnomalyDetections = [];
      if (enableLoader) {
        this.isLoading = true;
      }
      this.isTableLoading = true;
      const data = {
        dataSetName: this.dataSetSelected,
        jobType : this.jobTypeSelected,
        fromTime: this.toISO(this.correlationFromTimePeriod),
        toTime: this.toISO(this.correlationToTimePeriod)
      };
      this.summaryService.getClusteringModelsTableData(data).subscribe((res: any) => {
        this.isLoading = false;
        this.isTableLoading = false;
        if (res.status === 'success') {
          this.anomalyCount = res.data && res.data.length ? res.data.length : 0;
          this.tempAnomalyDetections = this.anomalyCount ? res.data.map((x) => {
            const newObj = { ...x };
            newObj.jobType = this.jobTypeSelected;
            newObj.feFromTime = this.correlationFromTimePeriod;
            newObj.feToTime = this.correlationToTimePeriod;
            if (newObj.modelName && newObj.modelName.includes('.')) {
              const modList = newObj.modelName.split('.');
              newObj.modelNameDisp = modList[0];
            } else {
              newObj.modelNameDisp = newObj.modelName;
            }
            newObj.dataSet = newObj['@timestamp'];

            if (newObj.loss && !isNaN(Number(newObj.loss))) {
              newObj.loss = Math.round(newObj.loss * 1000) / 1000;
              if (newObj.loss === 1) {
                newObj.loss = Math.floor(newObj.loss * 1000) / 1000;
              }
            } else {
              newObj.loss = 'NA';
            }
            return newObj;
          }) : [];

          // if (this.tempAnomalyDetections && this.tempAnomalyDetections.length && this.tempAnomalyDetections.length > 0) {
          //   this.displayModel(this.tempAnomalyDetections[0]);
          //   // this.setDrapdownValues();
          // }
        }
      }, (error) => {
        this.isTableLoading = false;
        this.isLoading = false;
      });
    } else {
      this.tempAnomalyDetections = [];
      this.clearSelection();
      this.notify.showToastrInfo('Alert', 'Need JobType, Data Set Name, From Time and To Time for fetch the anomalies');
    }
  }
  setDrapdownValues() {

    this.anmdStatusList = [{
      key: 0,
      value: 'All'
    }];
    this.anmdStatusSelected = this.anmdStatusList[0].key;
    const anmdStatusListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.status === thing.status)) === i;
    }).map((elem, i) => {
      return {
        key: i + 1,
        value: elem.status
      };
    });
    this.anmdStatusList = [...this.anmdStatusList, ...anmdStatusListTemp];
    // this.jobTypeList  = this.tempAnomalyDetections.filter((thing, i, arr) => {
    //   return arr.indexOf(arr.find(t => t.jobType === thing.jobType)) === i;
    // }).map((elem, i) => {
    //   return  elem.jobType;
    // });

  }
  checkAlls(ev) {
    this.tempAnomalyDetections.forEach(x => x.checkboxdata = ev.target.checked);
  }

  isAllChecked() {
    return this.tempAnomalyDetections.every(_ => _.checkboxdata);
  }
  checkifObjectExist() {
    return this.selectedModel && Object.keys(this.selectedModel).length > 0 ? true : false;
  }

  displayModel(anmdModel) {
    // if (!this.checkifObjectExist() || (this.selectedModel &&
    //   this.selectedModel.reasonStatus
    //   && this.selectedModel.reasonStatus.toLowerCase() === 'completed')) {
      this.scheduleSoc();
      this.selectedModel = Object.assign({}, anmdModel);
      this.selectedModel.clusteringReason = [];
      this.selectedModel.resolution = [];
      this.selectedModel.reasonStatus = 'Analysing';
      this.getRootCauseDetails(true);
    // } else {
    //   this.notify.showToastrInfo('Alert', 'Please wait as the current anomaly is been scheduled');
    // }
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.clearSelection();
  }
  onsearchChangeMin(searchVal) {
    this.inputCurrentpageMinTable = this.defaultCurrentPage;
    this.configMinTable.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage, table) {
    if (table) {
      if (inputVal < 1 || inputVal > lastpage) {
        this.inputCurrentpage = this.config.currentPage;
        // alert("Invalid page number")
      } else {
        this.config.currentPage = inputVal;
        this.clearSelection();
      }
    } else {
      if (inputVal < 1 || inputVal > lastpage) {
        this.inputCurrentpageMinTable = this.configMinTable.currentPage;
        // alert("Invalid page number")
      } else {
        this.configMinTable.currentPage = inputVal;
      }
    }
  }

  // onpage change
  changepage(evt, table) {
    if (table) {
      this.config.currentPage = evt;
      this.inputCurrentpage = evt;
      this.clearSelection();
    } else {
      this.configMinTable.currentPage = evt;
      this.inputCurrentpageMinTable = evt;
    }

  }

  // set new page size for pagination
  setNewPageSize(pageSize, table) {
    if (table) {
      this.config.itemsPerPage = pageSize;
      this.config.currentPage = this.defaultCurrentPage;
      this.inputCurrentpage = this.defaultCurrentPage;
      this.clearSelection();
    } else {
      this.configMinTable.itemsPerPage = pageSize;
      this.configMinTable.currentPage = this.defaultCurrentPage;
      this.inputCurrentpageMinTable = this.defaultCurrentPage;
    }

  }


  toggleicons(x) {
    x.classList.toggle('fa-chevron-circle-right');
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  toggleView() {
    this.toggle = !this.toggle;
  }
  switchTab(val) {
    switch (val) {
      case 0:
        this.trTab = true;
        break;
      case 1:
        this.trTab = false;
        break;
    }
  }
  getConfigDetailsOnRow(selectedObj, i) {
    this.selectedAnomaly = Object.assign({}, selectedObj);
    // this.getselectedDetails(selectedObj);
  }

  getUtcDateTime(dateObject) {
    const UTCdate = dateObject.getUTCDate();
    const UTCFullYear = dateObject.getUTCFullYear();
    const UTCMonth = dateObject.getUTCMonth() + 1;
    const UTCHours = dateObject.getUTCHours();
    const UTCMinutes = dateObject.getUTCMinutes();
    const UTCSeconds = dateObject.getUTCSeconds();
    let changedMonth;
    let changedDay;
    let changedHours;
    let changedMinutes;
    let changedSeconds;
    if (UTCMinutes < 10) {
      changedMinutes = '0' + UTCMinutes;
    } else {
      changedMinutes = UTCMinutes;
    }
    if (UTCSeconds < 10) {
      changedSeconds = '0' + UTCSeconds;
    } else {
      changedSeconds = UTCSeconds;
    }

    if (UTCMonth < 10) {
      changedMonth = '0' + UTCMonth;
    } else {
      changedMonth = UTCMonth;
    }

    if (UTCdate < 10) {
      changedDay = '0' + UTCdate;
    } else {
      changedDay = UTCdate;
    }

    if (UTCHours < 10) {
      changedHours = '0' + UTCHours;
    } else {
      changedHours = UTCHours;
    }

    const clock = UTCFullYear + '-' + changedMonth +
      '-' + changedDay;

    return clock;
  }

  disconnectWebSocket() {
    if (this.statusSocket) {
      this.statusSocket.complete();
    }
  }

  ngOnDestroy() {
    if (this.statusSocket) {
      this.statusSocket.complete();
    }
  }
  valuechange(event) {
  }
  scheduleAnomalies() {
    if (this.selectedModel) {
      const modelTimes = this.selectedModel.modelName ? this.selectedModel.modelName.split('_') : [];
      const data = {
        uid: '',
        dataSetName: this.selectedModel.dataSetName ? this.selectedModel.dataSetName : '',
        modelName: this.selectedModel.modelName ? this.selectedModel.modelName : '',
        fromTime: this.toISO(this.selectedModel.feFromTime),
        toTime: this.toISO(this.selectedModel.feToTime),
        modelFromTime: modelTimes[modelTimes.length - 3],
        modelToTime: modelTimes[modelTimes.length - 2],
        target: '',
        modelConfigName: this.selectedModel.modelConfigName ? this.selectedModel.modelConfigName : '',
        jobType: this.selectedModel.jobType ? this.selectedModel.jobType : '',
        timeFilterFeature: ''
      };
      this.summaryService.scheduleClusteringProfiler(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.scheduleRes = res.data;
          if (res.data.status && res.data.status.toLowerCase() === 'completed') {
            this.selectedModel.reasonStatus = res.data.status;
            this.getRootCauseDetails();
          } else {
            this.selectedModel.reasonStatus = res.data.status;
            this.scheduleSoc(res.data.status);
          }

        } else {

          this.notify.showToastrWarning('Failed', 'To get alarm storm schedule status');
        }
      }, (error) => {

        this.notify.showToastrError('Error', 'To get alarm storm schedule status');
      });
    } else {
      this.notify.showToastrWarning('Failed', 'To get alarm storm schedule status');
    }
  }


  scheduleSoc(value?) {
    if (value) {
      this.disconnectWebSocket();
      this.statusSocket = this.webSocketService.connectToclusterschedulerWebSocket().subscribe((res) => {
        if (res && this.scheduleRes && res.uid === this.scheduleRes.uid) {
          this.scheduleRes.status = res.status;
          if (res.status && res.status.toLowerCase() === 'completed') {
            this.selectedModel.reasonStatus = res.status;
            this.getRootCauseDetails();
          } else {
            this.selectedModel.reasonStatus = res.status;
          }

        }
      }, err => {
        console.log('websocket Err', err);
      });
    } else {
      this.disconnectWebSocket();
    }
  }
  getRootCauseDetails(scheduleRCA?) {
    if (this.selectedModel) {
      const data = {
        timestamp: this.selectedModel.dataSet ? this.selectedModel.dataSet : '',
        dataSetName: this.selectedModel.dataSetName ? this.selectedModel.dataSetName : '',
        clusterId: this.selectedModel.clusterId,
        jobType: this.selectedModel.jobType ? this.selectedModel.jobType : '',
        modelName: this.selectedModel.modelName ? this.selectedModel.modelName : '',
      };
      // this.dataSetDetailsLoading = true;
      this.summaryService.getClusteringProfiler(data).subscribe((res: any) => {
        this.dataSetDetailsLoading = false;
        if (res.status === 'success') {
          const listData = res.data && res.data.length ? res.data : [];
          if (listData.length > 0) {
            this.selectedModel.reasonStatus = 'COMPLETED';
            this.selectedModel.clusteringReason = listData.flatMap(x => {
              const elements = x.clusteringReason && x.clusteringReason.length ? x.clusteringReason.map(it => {
                this.selectedModel.RCAObj = { ...x };
                return {
                  dispClusteringReason: it,
                };
              }) : [];
              return elements;
            });

            this.selectedModel.resolution = listData.flatMap(x => {
              const elements = x.resolution && x.resolution.length ? x.resolution.map(it => {
                return {
                  dispResolution: it,
                };
              }) : [];
              return elements;
            });
          } else {
            this.selectedModel.reasonStatus = '';
            // if (scheduleRCA) {
            //  this.scheduleAnomalies();
            // }

          }

        } else {

          this.notify.showToastrWarning('Failed', 'To get alarm storm root cause analysis result');
          this.dataSetDetailsLoading = false;
        }
      }, (error) => {
        this.dataSetDetailsLoading = false;
        this.notify.showToastrError('Error', 'To get alarm storm root cause analysis result');
      });
    } else {
      this.notify.showToastrInfo('Alert', 'No alarm storm selected');
    }
  }
  openModelConfigDialog(model) {
    const dialogRef = this.dialog.open(ModelConfigViewComponent, {
      width: '90%',
      maxHeight: '80vh',
      // tslint:disable-next-line:object-literal-shorthand
      data: { modelConfigName: model.modelConfigName, jobType: model.jobType },
      panelClass: 'anmaly-model-config-dialog'
    });


    dialogRef.afterClosed().subscribe(res => {

    });
  }



  openDataPreviewDialog(action) {
    const name = action === 'alarm' ? 'Alarm Details' : 'Sequence Details';
    const dialogRef = this.dialog.open(DataPreviewComponent, {
      width: '90%',
      disableClose: true,
      maxHeight: '80vh',
      data: { name, action, selectedModel: this.selectedModel },
      panelClass: 'anmaly-data-preview'
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }


  deleteClusterName() {
    this.global.opendisplayModal('Do you wish to delete the cluster name',
      'Confirm', 'Delete Cluster Name', true).subscribe(result => {
        if (result === 'save') {
          const data = {
            clusterId: this.selectedModel.RCAObj.clusterId,
            modelName: this.selectedModel.RCAObj.modelName
          };
          this.summaryService.deleteClusterName(data).subscribe((res: any) => {
            if (res && res.status === 'success' && res.data === 200) {
              this.selectedModel.RCAObj.clusterName = 'NA';
              this.notify.showToastrSuccess('Success', 'Cluster name deleted successfully');
            } else {
              this.notify.showToastrWarning('Alert', 'API failed to delete cluster name');
            }

          }, err => {
            this.notify.showToastrError('Alert', 'API failed to delete cluster name');
          });

        }
      });

  }

  deleteAllResolution() {
    this.global.opendisplayModal('Do you wish to delete all the clustering resolution details',
      'Confirm', 'Delete Clustering Resolution Details', true).subscribe(result => {
        if (result === 'save') {
          const data = {
            dataSetName: this.selectedModel.dataSetName ? this.selectedModel.dataSetName : '',
            clusterId: this.selectedModel.RCAObj.clusterId,
            modelName: this.selectedModel.RCAObj.modelName,
            resolution: []
          };
          this.summaryService.editResolution(data).subscribe((res: any) => {
            if (res && res.status === 'success' && res.data === 200) {
              this.selectedModel.resolution = [];
              this.selectedModel.RCAObj.resolution = [];
              this.notify.showToastrSuccess('Success', 'Clustering resolution details updated successfully');
            } else {
              this.notify.showToastrWarning('Alert', 'API failed to update clustering resolution details');
            }

          }, err => {
            this.notify.showToastrError('Alert', 'API failed to update clustering resolution details');
          });

        }
      });

  }

  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.clearSelection();
  }
  sortMin(key) {
    if (key === this.keyP) {
      this.reverseP = !this.reverseP;
    } else {
      this.keyP = key;
      this.reverseP = true;
    }
  }

  clearSelection() {
    this.scheduleRes = null;
    this.selectedModel = {};
    this.scheduleSoc();
    // this.appScheduler.disconnectSocket();
  }
}
