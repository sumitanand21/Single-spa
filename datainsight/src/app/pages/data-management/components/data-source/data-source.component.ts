import { Component, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { DataManagementService } from '../../services/data-management.service';
import { StreamScheduleComponent } from '../../dialogs/stream-schedule/stream-schedule.component';
import { map } from 'rxjs/operators';
import { PATHS, SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { WebsocketService } from 'src/app/services/websocket.service';



@Component({
  selector: 'datainsight-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss']
})
export class DataSourceComponent implements OnInit, OnDestroy {
  socket;
  staticJobType = {
    staticForecast: 'FORECASTEXECUTION',
    staticAnomaly: 'ANOMALY DETECTION',
    staticCorrelation: 'CORRELATION'
  };
  jobTypeStatusObj = null;
  detailsLoader = false;
  tableLoader = false;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  selectedRow = 0;
  selectedRowTask = 0;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilter = '';
  pageArr = [25, 50, 100];
  config = {
    id: 'trainedModelPaginate',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  selectedStatus = [];
  key = 'modelName';
  reverse = false;
  keyTask = 'Dataset_name';
  reverseTask = false;
  itemPerPageTask = this.defauultItempg;
  searchFilterTask = '';
  selectedDataSourceDetails: any = {};
  selectedDataSource: any = {};
  // DataSourceFilter = {schedule_name: this.searchFilterTask, schedule_status: { $or: [this.selectedStatus] } };
  inputCurrentpageTask = this.defaultCurrentPage;
  configTask = {
    id: 'taskPaginate',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  isLoading = false;
  datasourceTable: any[] = [];
  showStream = false;
  showStopStream = false;

  statusSocket: any;
  constructor(public dialog: MatDialog,
              public dataManagementService: DataManagementService,
              private notfyService: NotificationService,
              public global: GlobalService,
              private router: Router,
              private webSocketService: WebsocketService) { }

  ngOnInit() {
    this.dataManagementService.selectedDataSetName = '';
    this.dataManagementService.showDataSource = true;
    this.getdatatableAPI();
  }

  scheduleSocWithoutInterval(JobTypeStatus, dataSetName?) {
    if (JobTypeStatus && dataSetName) {
      this.disconnectSocket();

      // Call web socket API// for status
      this.statusSocket = this.webSocketService.connectToStreamDataScheduleWebSocket(dataSetName).subscribe((res) => {
        if (res.data && res.data.dataSetName === this.selectedDataSourceDetails.dataSetName) {
          this.OnRunningSchedule(res.data.jobStatus);
        }
      });
      // this.socket = this.appScheduler.connectSocket();
      // this.socket.connect({}, () => {
      //   JobTypeStatus.forEach((el) => {
      //     this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.DTMNG_JOBSTATUS, el._id), message => {
      //       const payload = JSON.parse(message.body);
      //       // {uid: "601d365ca3e64c4bdb03807f", jobStatus: "RUNNING", jobType: "DATAMANAGEMENT"}
      //       this.OnRunningSchedule(el, payload);
      //     });
      //   });
      // });
    } else {
      // disconnect socket
      // this.appScheduler.disconnectSocket();
      this.disconnectSocket();
    }
  }

  OnRunningSchedule(status) {
    // const index = this.jobTypeStatusObj.findIndex(it => it._id === scheduleObject._id);
    // if (index >= 0 && payload.jobStatus) {
    //   this.jobTypeStatusObj[index].jobStatus = payload.jobStatus.toLowerCase();

    //   const getStreamJobList = this.selectedDataSource && this.selectedDataSource.jobType ?
    //     this.setJobTypeList(this.selectedDataSource) : [];
    //   this.showStream = this.checkIfstreamEnable(getStreamJobList).length ? true : false;
    //   this.showStopStream = this.checkIfStopStreamEnable(getStreamJobList).length ? true : false;

    this.jobTypeStatusObj.jobStatus = status;
    this.showStream = this.jobTypeStatusObj &&
      (this.jobTypeStatusObj.jobStatus !== 'scheduled' && this.jobTypeStatusObj.jobStatus !== 'running') ? true : false;
    this.showStopStream = this.jobTypeStatusObj && this.jobTypeStatusObj.jobStatus === 'running' ? true : false;
  }

  emptyDetails() {
    this.selectedDataSourceDetails = {};
    this.selectedDataSource = {};
    // this.appScheduler.disconnectSocket();
    this.disconnectSocket();
  }

  navigateToUpsert(dataSetName?) {
    if (dataSetName) {
      this.dataManagementService.selectedDataSetName = dataSetName;
    }
    this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/upsertdatasource']);
  }

  navigateToDataPreview(dataSetName, dataSourceType) {
    this.dataManagementService.selectedDataSetName = dataSetName;
    this.dataManagementService.selectedDataSourceType = dataSourceType;
    this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/datapreviewdm']);
  }

  checkifObjectExist(selectedModel) {
    return selectedModel && Object.keys(selectedModel).length > 0 ? true : false;
  }
  getdatatableAPI(setvalue?) {
    // let userData = { dataSetName: this.selecteddata };
    let selectedConfigObj: any = null;
    this.tableLoader = true;
    this.dataManagementService.getDatasourceList().subscribe((res: any) => {
      this.tableLoader = false;
      if (res.status === 'success' && res.data && res.data.data && res.data.data.length) {
        this.datasourceTable = res.data && res.data.data ? res.data.data : [];
        selectedConfigObj = this.datasourceTable.length > 0 && !setvalue ?
          this.datasourceTable[0] : null;
        // set the 1st item from table , to display respective details in right panel
        this.getTableDetails(selectedConfigObj, 0);
      } else {
        this.notfyService.showToastrWarning('Alert', 'API failed in fetching data source');
        this.datasourceTable = [];
        this.getTableDetails(null, 0);
        this.tableLoader = false;
      }
    }, err => {
      this.notfyService.showToastrError('Alert', 'Exception while fetching data source');
      this.tableLoader = false;
      this.datasourceTable = [];
      this.getTableDetails(null, 0);
    });

  }
  sortTask(key) {
    // this.keyTask = key;
    // this.reverseTask = !this.reverseTask;
    if (key === this.keyTask) {
      this.reverseTask = !this.reverseTask;
    } else {
      this.keyTask = key;
      this.reverseTask = true;
    }
    this.emptyDetails();
  }
  getTableDetails(selectedItem, selRow) {
    this.getStreamData(selectedItem);
    if (selectedItem) {
      this.isLoading = true;
      this.selectedDataSource = selectedItem;
      const data = { dataSetName: selectedItem.dataSetName };
      this.dataManagementService.getDatasourceDeatils(data).subscribe((res: any) => {
        this.isLoading = false;
        if (res.status === 'success') {
          this.selectedDataSourceDetails = res.data && res.data.data ? res.data.data : {};
        } else {
          this.notfyService.showToastrWarning('Warning', 'No Data Available while fetching Data source details');
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.notfyService.showToastrError('Alert', 'Exception while fetching Data source details');
      });
    } else {
      this.selectedDataSourceDetails = {};
    }
  }

  // on search
  onsearchChange(paginationId) {
    if (paginationId === 'taskPaginate') {
      this.inputCurrentpageTask = this.defaultCurrentPage;
      this.configTask.currentPage = this.defaultCurrentPage;
      this.emptyDetails();
    }
  }
  // change page on input
  changepageinp(inputVal, lastpage, paginationId) {
    if (inputVal < 1 || inputVal > lastpage) {
      if (paginationId === 'taskPaginate') {
        this.inputCurrentpageTask = this.configTask.currentPage;
      }
    } else {
      if (paginationId === 'taskPaginate') {
        this.configTask.currentPage = inputVal;
        this.emptyDetails();
      }
    }
  }

  // onpage change
  changepage(evt, paginationId) {
    if (paginationId === 'taskPaginate') {
      this.configTask.currentPage = evt;
      this.inputCurrentpageTask = evt;
      this.emptyDetails();
    }
  }

  // set new page size for pagination
  setNewPageSize(pageSize, paginationId) {
    if (paginationId === 'taskPaginate') {
      this.configTask.itemsPerPage = pageSize;
      this.configTask.currentPage = this.defaultCurrentPage;
      this.inputCurrentpageTask = this.defaultCurrentPage;
      this.emptyDetails();
    }
  }

  createUTCDatefromISO(IsoString) {
    const localDate = new Date(IsoString);
    const UTCDate = localDate.getUTCDate();
    const UTCMonth = localDate.toLocaleString('en-us', { month: 'short' });
    const UTCYear = localDate.getUTCFullYear();
    const UTCHrs = localDate.getUTCHours();
    const UTCMins = localDate.getUTCMinutes();
    return `${UTCMonth} ${UTCDate}, ${UTCYear} ${this.getDispTime(UTCHrs)}:${this.getDispTime(UTCMins)}`;
  }

  getDispTime(val) {
    val = val ? val.toString() : '';
    const tempVal = val.length === 1 ? ('0' + val) : val;
    return tempVal;
  }

  deleteDataSource(dataSource) {
    if (dataSource) {
      this.global.opendisplayModal('Do you wish to delete the selected Data source', 'Confirm', 'Delete Data Source', true)
        .subscribe(result => {
          if (result === 'save') {
            const data = { dataSetName: dataSource.dataSetName };
            this.dataManagementService.deleteDatasource(data).subscribe((res: any) => {
              if (res.status === 'success') {
                if (res.data.message && res.data.responseType === 'ERR') {
                  this.notfyService.showToastrWarning('Warning', res.data.message);
                } else {
                  this.notfyService.showToastrSuccess('Success', 'Data source deleted');
                  this.emptyDetails();
                  this.getdatatableAPI(true);
                }
              } else {
                this.notfyService.showToastrWarning('Warning', 'Data source deletion failed');
              }
            }, err => {
              this.notfyService.showToastrError('Alert', 'Exception while deleting Data source ');
            });
          }
        });
    } else {
      this.global.opendisplayModal('Please select a Data Source to proceed with the action', 'OK', 'Alert');
    }
  }

  refreshJobStatus() {
    this.getStreamData(this.selectedDataSource);
  }

  checkIfEnableStream() {
    return this.selectedDataSourceDetails.dataSourceType.some(it => it === 'stream_data');
  }

  checkIfEnableStore() {
    return this.selectedDataSourceDetails.dataSourceType.some(it => it === 'stored_data');
  }

  getStreamData(selectedItem) {
    const streamData = selectedItem && selectedItem.dataSourceType ? selectedItem.dataSourceType.some(it => it === 'stream_data') : false;
    if (selectedItem && streamData) {
      this.getStreamScheduleStatus(selectedItem);
    } else {
      this.jobTypeStatusObj = null;
      this.showStream = false;
      this.showStopStream = false;
      this.scheduleSocWithoutInterval(null);
    }
    // const getStreamJobList = selectedItem && selectedItem.jobType ? this.setJobTypeList(selectedItem) : [];
    // const streamData = selectedItem && selectedItem.dataSourceType ?
    // selectedItem.dataSourceType.some(it => it === 'stream_data') : false;
    // if (selectedItem && streamData && getStreamJobList.length > 0) {
    //   this.getStreamScheduleStatus(selectedItem, getStreamJobList);
    // } else {
    //   this.jobTypeStatusObj = [];
    //   this.showStream = false;
    //   this.showStopStream = false;
    //   this.scheduleSocWithoutInterval(null);
    // }
  }

  checkJobStatus(JobType) {
    const selectedJob = this.jobTypeStatusObj.filter(item => item.scheduleJobType === JobType);
    const JobStatus = selectedJob.length > 0 ? selectedJob[0].jobStatus : '';
    return JobStatus;
  }

  checkIfstreamEnable(getStreamJobList) {
    const streamArr = [];
    getStreamJobList.forEach(it => {
      if (!this.jobTypeStatusObj.some(item => item.scheduleJobType === it &&
        (item.jobStatus.toLowerCase() === 'scheduled' || item.jobStatus.toLowerCase() === 'running'))) {
        streamArr.push(it);
      }
    });
    return streamArr;
  }

  checkIfStopStreamEnable(getStreamJobList) {
    const streamArr = [];
    getStreamJobList.forEach(it => {
      if (this.jobTypeStatusObj.some(item => item.scheduleJobType === it &&
        item.jobStatus.toLowerCase() === 'running')) {
        streamArr.push(it);
      }

      // if (this.jobTypeStatusObj.some(item => item.scheduleJobType === it &&
      //   (item.jobStatus.toLowerCase() === 'running' || item.jobStatus.toLowerCase() === 'scheduled'))) {
      //   streamArr.push(it);
      // }
    });
    return streamArr;
  }

  getStreamScheduleStatus(selectedItem) {
    this.showStream = false;
    this.showStopStream = false;
    const data = { dataSetName: selectedItem.dataSetName };
    this.dataManagementService.getstreamDataSchedule(data).subscribe((res: any) => {
      if (res.status === 'success') {
        console.log(res);
        this.jobTypeStatusObj = res.data && res.data.data && res.data.data.length > 0 ? { ...res.data.data[0] } : null;
        this.showStream = (!this.jobTypeStatusObj) || (this.jobTypeStatusObj &&
          (this.jobTypeStatusObj.jobStatus !== 'scheduled' && this.jobTypeStatusObj.jobStatus !== 'running')) ? true : false;
        this.showStopStream = this.jobTypeStatusObj && this.jobTypeStatusObj.jobStatus === 'running' ? true : false;
        // this.showStream = this.checkIfstreamEnable(getStreamJobList).length ? true : false;
        // this.showStopStream = this.checkIfStopStreamEnable(getStreamJobList).length ? true : false;
        this.scheduleSocWithoutInterval(this.jobTypeStatusObj, selectedItem.dataSetName);
      } else {
        this.showStream = false;
        this.showStopStream = false;
        this.jobTypeStatusObj = null;
        this.scheduleSocWithoutInterval(null);
        this.notfyService.showToastrWarning('Warning', 'API failed to get schedule stream data status');
      }
    }, err => {
      this.showStream = false;
      this.showStopStream = false;
      this.jobTypeStatusObj = null;
      this.scheduleSocWithoutInterval(null);
      this.notfyService.showToastrError('Alert', 'API failed to get schedule stream data status');
    });
  }

  checkDataSetModelType(dataSetName) {
    if (dataSetName.toUpperCase().includes('LTE')) {
      return 'LTE';
    } else if (dataSetName.toUpperCase().includes('ALARM')) {
      return 'ALARM';
    } else {
      return '';
    }
  }

  setJobTypeList(selectedDataSource) {
    const jobTypeList = selectedDataSource.jobType;
    const modelType = this.checkDataSetModelType(selectedDataSource.dataSetName);
    if (jobTypeList && jobTypeList.length > 0) {
      return jobTypeList.filter(it => it.toUpperCase() === this.staticJobType.staticForecast ||
        (it.toUpperCase() === this.staticJobType.staticAnomaly && modelType) ||
        it.toUpperCase() === this.staticJobType.staticCorrelation);
    } else {
      return [];
    }
  }

  openStreamSchedule(selectedDataSource, action) {
    const text = action === 'stream' ? 'stream' : 'stop streaming';
    const btnText = action === 'stream' ? 'Stream' : 'Stop';
    const headerText = action === 'stream' ? 'Stream Data' : 'Stop Stream Data';
    this.global.opendisplayModal('Do you wish to ' + text + ' the selected Data source jobtype(s)', btnText, headerText, true)
      .subscribe(result => {
        if (result === 'save') {
          this.scheduleStream(action);
        }
      });

    // let btnText = 'Stop';
    // let headerText = 'Stop Stream Data';
    // const StreamJobType = this.setJobTypeList(selectedDataSource);
    // const selectedJobTypeList = action === 'stream' ?
    // this.checkIfstreamEnable(StreamJobType) : this.checkIfStopStreamEnable(StreamJobType);
    // if (action === 'stream') {
    //   btnText = 'Stream';
    //   headerText = 'Stream Data';
    // }
    // const dialogRef = this.dialog.open(StreamScheduleComponent, {
    //   width: '600px',
    //   disableClose: true,
    //   data: { streamAction: action, jobTypeList: selectedJobTypeList, buttonText: btnText, header: headerText, dispCancel: true }
    // });


    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.action === 'save') {
    //     this.scheduleStream(result.jobType, result.streamAction);
    //   }
    // });
  }

  scheduleStream(streamAction) {
    // const modelType = this.checkDataSetModelType(this.selectedDataSourceDetails.dataSetName);
    const data: any = {
      dataSetName: this.selectedDataSourceDetails.dataSetName,
      dataSourceType: 'stream_data',
      jobStatus: streamAction === 'stream' ? 'scheduled' : 'stopped',
      jobType: 'DATAMANAGEMENT',
      jobs: this.selectedDataSourceDetails.jobType
    };

    // if (selectedJobType.toUpperCase() === this.staticJobType.staticForecast) {
    //   data.modelType = 'GRPC';
    // } else if (selectedJobType.toUpperCase() === this.staticJobType.staticAnomaly) {
    //   data.modelType = modelType;
    // } else if (selectedJobType.toUpperCase() === this.staticJobType.staticCorrelation) {
    //   data.modelType = 'CORRELATION';
    // }
    this.dataManagementService.streamDataSchedule(data).subscribe((res: any) => {
      if (res.status === 'success') {
        if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
          this.notfyService.showToastrWarning('Alert', res.data.message);
        } else {
          this.notfyService.showToastrSuccess('Success', res.data.message);
          this.getStreamData(this.selectedDataSource);
        }
      } else {
        if (streamAction === 'stream') {
          this.notfyService.showToastrWarning('Warning', 'API failed to schedule stream data');
        } else {
          this.notfyService.showToastrWarning('Warning', 'API failed to stop stream data');
        }

      }
    }, err => {
      if (streamAction === 'stream') {
        this.notfyService.showToastrError('Alert', 'API failed to schedule stream data');
      } else {
        this.notfyService.showToastrError('Alert', 'API failed to stop stream data');
      }

    });

  }

  disconnectSocket() {
    if (this.statusSocket) {
      console.log('Socket open', this.statusSocket.closed);
      this.statusSocket.complete();
      console.log('Socket close', this.statusSocket.closed);
    }
  }

  ngOnDestroy() {
    this.dataManagementService.showDataSource = false;
    // this.appScheduler.disconnectSocket();
    if (this.statusSocket) {
      this.statusSocket.complete();
    }
  }
}
