import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ModelConfigViewComponent } from '../../dialogs/model-config-view/model-config-view.component';
import { MatDialog } from '@angular/material';
import { AnomalyService } from '../../services/anomaly.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { PATHS, SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { GlobalService } from 'src/app/services/global.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-anomaly-detection',
  templateUrl: './anomaly-detection.component.html',
  styleUrls: ['./anomaly-detection.component.scss']
})
export class AnomalyDetectionComponent implements OnInit, AfterViewChecked, OnDestroy {
  modelNameValidCheck;
  tableData;
  p = 1;
  Loader = true;
  headers: any;
  showFirst: any;
  closeforecastEdit: any;
  forecastData: any[];
  tempAnomalyDetections: any[] = [];
  tempforecast: any[];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  socket;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
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
  elUrl: any;
  getCallData: any;
  forecast: any;
  sample: any;
  input: any;
  edittemplate: any;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  key = 'name';
  reverse = false;
  isShown = true;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  searchFilter = '';
  defaultJobType = 'FORECAST';
  dataSetList;
  anmdStatusList;
  modelTypeList = [];
  // dataSetSelected;
  anmdStatusSelected = '';
  modelTypeSelected = '';
  featureCount = 38;
  selectionDataSet = [{ id: '1', name: 'selction 1' }, { id: '2', name: 'selction 2' }, { id: '2', name: 'selction 2' }];
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  disableDetectAnomalyBtn = false;
  anmdDetailsLoading = false;
  selectedModel: any = {};
  selectedModelAnmdDATA: any = {};
  trTab = true;
  isLoading = false;
  isRefreshLoading = false;
  datasetView = '';
  dataSetSelected = '';
  searchFilterTask = '';
  selectedModelType = '';
  anomaltDetectedData;
  AlltasksFilter = {
    modelName: this.searchFilter

  };

  constructor(
    public anomalyService: AnomalyService,
    private notify: NotificationService,
    private appScheduler: AppSchedulerService,
    public sanitizer: DomSanitizer,
    private router: Router,
    public global: GlobalService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.anomalyService.AnomalyDetection = true;
    this.loadTableData();
  }

  ngAfterViewChecked() {
    if (this.isLoading || this.anmdDetailsLoading) {
      this.anomalyService.disableheader = true;
    } else {
      this.anomalyService.disableheader = false;
    }
  }

  loadTableData(refresh?) {
    if (refresh) {
      this.isRefreshLoading = true;
    } else {
      this.isLoading = true;
    }
    this.anomalyService.getAnomalyDetectionTableData().subscribe((res: any) => {
      this.isLoading = false;
      this.isRefreshLoading = false;
      if (res.status === 'success') {
        if (res.elUrl) {
          this.elUrl = res.elUrl;
        }
        this.tempAnomalyDetections = res.data.map(x => {
          if (x.modelName && x.modelName.includes('.')) {
            const modList = x.modelName.split('.');
            x.modelNameDisp = modList[0];
          } else {
            x.modelNameDisp = x.modelName;
          }
          // if (x.accuracy && x.accuracy.length && x.accuracy.length > 0) {
          //   if (x.accuracy[x.accuracy.length - 1] && !isNaN(Number(x.accuracy[x.accuracy.length - 1]))) {
          //     x.accuracyDisp = Math.round(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
          //     if (x.accuracyDisp === 1) {
          //       x.accuracyDisp = Math.floor(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
          //     }
          //   } else {
          //     x.accuracyDisp = 'NA';
          //   }
          // }

          return x;
        });

        this.setDrapdownValues();
        if (refresh) {
          this.clearSelection();
        } else {
          this.displayModel(this.tempAnomalyDetections[0]);
          this.scheduleSoc('5s');
        }

      }
    }, (error) => {
      this.tempAnomalyDetections = [];
      this.isLoading = false;
      this.isRefreshLoading = false;
      this.clearSelection();
    });
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
  getAnomalyDetectBtnStatus(): boolean {
    let btnStatus = false;
    if (this.tempAnomalyDetections && this.tempAnomalyDetections.length && this.selectedModel && this.selectedModel.jobType) {
      const res = this.tempAnomalyDetections.filter(elem => elem.jobType === this.selectedModel.jobType
        && this.selectedModel.dataSetName === elem.dataSetName && elem.jobStatus.toLowerCase() !== 'completed'
        && elem.jobStatus.toLowerCase() !== 'aborted' && this.selectedModel.modelName !== elem.modelName);
      if (res && res.length) {
        this.modelNameValidCheck = res[0].modelName;
        btnStatus = true;
      } else {
        this.modelNameValidCheck = '';
      }
    }
    return btnStatus;
  }
  setDrapdownValues() {
    this.dataSetList = [];
    this.dataSetSelected = '';
    const dataSetListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.dataSetName.toLowerCase() === thing.dataSetName.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.dataSetName;
    });
    this.dataSetList = [...dataSetListTemp];

    this.anmdStatusList = [];
    this.anmdStatusSelected = '';
    const anmdStatusListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.jobStatus.toLowerCase() === thing.jobStatus.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.jobStatus;
    });
    this.anmdStatusList = [...anmdStatusListTemp];
    this.modelTypeList = [];

    this.modelTypeSelected = '';
    const modelTypeListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.jobType.toLowerCase() === thing.jobType.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.jobType;
    });
    this.modelTypeList = [...modelTypeListTemp];
  }
  statusChange() {
    this.clearSelection();
  }
  modeltypeChange() {
    this.clearSelection();
  }
  datasetChange() {
    this.clearSelection();
  }
  checkAlls(ev) {
    this.tempAnomalyDetections.forEach(x => x.checkboxdata = ev.target.checked);
  }

  isAllChecked() {
    return this.tempAnomalyDetections.every(_ => _.checkboxdata);
  }
  checkifObjectExist(selectedModel) {
    return selectedModel && Object.keys(selectedModel).length > 0 ? true : false;

  }
  setSelectedModelDetails(data) {
    // this.selectedModel = {
    //   modelType: data.modelType ? data.modelType : this.selectedModel.modelType,
    //   lossFunction: data.lossFunction ? data.lossFunction : this.selectedModel.lossFunction,
    //   modelConfigName: data.modelConfigName ? data.modelConfigName : this.selectedModel.modelConfigName,
    //   dataSetName: data.dataSetName ? data.dataSetName : this.selectedModel.dataSetName,
    //   accuracy: data.accuracy ? data.accuracy : this.selectedModel.accuracy,
    //   jobStatus: this.selectedModel.jobStatus,
    //   threshold: data.threshold ? data.threshold : this.selectedModel.threshold
    // };
    this.selectedModel.threshold = data.threshold ? data.threshold : this.selectedModel.threshold;
    this.selectedModel.lossFunction = data.lossFunction ? data.lossFunction : this.selectedModel.lossFunction;
    this.selectedModel.accuracy = data.accuracy ? data.accuracy : this.selectedModel.accuracy;

    this.selectedModel.accuracyDisp = this.createAccuracy(data.accuracy);
  }

  createAccuracy(accuracy) {
    let accuracyDisp;
    if (accuracy && accuracy.length && accuracy.length > 0) {
      if (typeof (accuracy) === 'string') {
        accuracyDisp = accuracy ? (accuracy).toString() : 'NA';
      } else {
        if (!isNaN(Number(accuracy[accuracy.length - 1]))) {
          accuracyDisp = (accuracy[accuracy.length - 1]).toString();
        }
      }
    } else {
      accuracyDisp = 'NA';
    }

    return accuracyDisp;
  }

  setTask() {
    this.anomalyService.AnomalyTaskName = this.selectedModel.scheduleName;
    this.anomalyService.AnomalyModelTrainingName = this.selectedModel.modelName ? this.selectedModel.modelName : '';
    if (this.anomalyService.AnomalyModelTrainingName.includes('.')) {
      const modList = this.anomalyService.AnomalyModelTrainingName.split('.');
      this.anomalyService.AnomalyModelTrainingNameDisp = modList[0];
    } else {
      this.anomalyService.AnomalyModelTrainingNameDisp = this.anomalyService.AnomalyModelTrainingName;
    }
    this.anomalyService.AnomalySelectedTrainingModel = this.selectedModel;
    this.router.navigate(['/' + this.global.prefixUrl + '/schedule/anomalydetection/modeltraining']);

  }
  displayModel(anmdModel) {
    if (anmdModel) {
      this.selectedModelAnmdDATA = {};
      this.selectedModel = anmdModel;
      this.setUrl();
      this.selectedModel.threshold = 0.001;
      this.getAnomalyDetectionResult(anmdModel);
    }
  }
  getAnomalyDetectionResult(anmdModel) {
    this.anmdDetailsLoading = true;
    const data = { modelId: anmdModel.uid };
    this.anomalyService.getAnomalyDetDetails(data).subscribe((res: any) => {
      this.anmdDetailsLoading = false;
      if (res.status === 'success') {
        if (res.data) {
          this.anomaltDetectedData = res.data;
          this.selectedModelAnmdDATA = res.data;
          this.selectedModelAnmdDATA.speedDisp = this.selectedModelAnmdDATA.speed
            && !isNaN(this.selectedModelAnmdDATA.speed) ? (Math.round(this.selectedModelAnmdDATA.speed * 1000) / 1000).toString() : null;
          this.selectedModelAnmdDATA.cpuUsageDisp = this.selectedModelAnmdDATA.cpuUsage
            && !isNaN(this.selectedModelAnmdDATA.cpuUsage) ? (Math.round(this.selectedModelAnmdDATA.cpuUsage * 100)).toString() : null;
          this.selectedModelAnmdDATA.cpuMemoryUsageDisp = this.selectedModelAnmdDATA.cpuMemoryUsage
            && !isNaN(this.selectedModelAnmdDATA.cpuMemoryUsage) ?
            (Math.round(this.selectedModelAnmdDATA.cpuMemoryUsage * 100)).toString() : null;
          this.selectedModelAnmdDATA.gpuUsageDisp = this.selectedModelAnmdDATA.gpuUsage
            && !isNaN(this.selectedModelAnmdDATA.gpuUsage) ? (Math.round(this.selectedModelAnmdDATA.gpuUsage * 100)).toString() : null;
          this.selectedModelAnmdDATA.gpuMemoryUsageDisp = this.selectedModelAnmdDATA.gpuMemoryUsage
            && !isNaN(this.selectedModelAnmdDATA.gpuMemoryUsage) ?
            (Math.round(this.selectedModelAnmdDATA.gpuMemoryUsage * 100)).toString() : null;
          this.setSelectedModelDetails(this.selectedModelAnmdDATA);
          this.scheduleSoc('5s');
        } else {
          this.anomaltDetectedData = undefined;
          this.anmdDetailsLoading = false;
        }
        // this.selectedModelAnmdDATA.jobType = this.selectedModel.jobType;
        // this.selectedModelAnmdDATA.jobStatus = this.selectedModel.jobStatus;

      } else {
        this.anomaltDetectedData = undefined;
        this.anmdDetailsLoading = false;
      }
    }, (error) => {
      this.anomaltDetectedData = undefined;
      this.anmdDetailsLoading = false;
    });
  }

  disableThreshlod() {

    if (this.selectedModel &&
      (this.selectedModel.jobStatus.toLowerCase() === 'completed' || this.selectedModel.jobStatus.toLowerCase() === 'stopped')) {

      if (this.selectedModelAnmdDATA && this.selectedModelAnmdDATA.jobStatus &&
        (this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'running' ||
          this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'scheduled' ||
          this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'initiated' ||
          this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'queued')) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  showDetection() {
    if (this.selectedModel &&
      (this.selectedModel.jobStatus.toLowerCase() === 'completed' || this.selectedModel.jobStatus.toLowerCase() === 'stopped')) {

      if (this.selectedModelAnmdDATA &&
        (!this.selectedModelAnmdDATA.jobStatus ||
          this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'completed' ||
          this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'stopped')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  showStop() {
    if (this.selectedModelAnmdDATA && this.selectedModelAnmdDATA.jobStatus &&
      (this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'running' ||
        this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'scheduled' ||
        this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'initiated' ||
        this.selectedModelAnmdDATA.jobStatus.toLowerCase() === 'queued')) {
      return true;
    } else {
      return false;
    }
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.AlltasksFilter.modelName = searchVal;
    this.clearSelection();
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
      this.clearSelection();
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.clearSelection();
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.clearSelection();
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

  executionJobtype(jobType) {
    if (jobType === 'ANOMALYTRAINING1') {
      return 'ANOMALYEXECUTION1';
    } else if (jobType === 'ANOMALYTRAINING2') {
      return 'ANOMALYEXECUTION2';
    } else if (jobType === 'ASCTRAINING') {
      return 'ASCEXECUTION';
    } else {
      return jobType;
    }
  }
  createStopObject(dataObj) {
    const UsageDataObj = Object.assign({}, this.selectedModelAnmdDATA);
    const newObject = {
      accuracy: dataObj.accuracy ? dataObj.accuracy : '',
      dataSetName: dataObj.dataSetName ? dataObj.dataSetName : '',
      modelConfigName: dataObj.modelConfigName ? dataObj.modelConfigName : '',
      modelName: dataObj.modelName ? dataObj.modelName : '',
      // modelType: dataObj.modelType ? dataObj.modelType : '',
      scheduleName: dataObj.scheduleName ? dataObj.scheduleName : '',
      uid: dataObj.uid ? dataObj.uid : '',

      modelId: dataObj.uid ? dataObj.uid : '',
      jobStatus: 'COMPLETED',
      jobType: this.executionJobtype(dataObj.jobType),
      // jobType: dataObj.jobType ? dataObj.jobType : '',

      lossFunction: UsageDataObj && UsageDataObj.lossFunction ? UsageDataObj.lossFunction : '',
      speed: UsageDataObj && UsageDataObj.speed ? UsageDataObj.speed : '',
      threshold: UsageDataObj && UsageDataObj.threshold ? UsageDataObj.threshold : '',
      timeUsed: UsageDataObj && UsageDataObj.timeUsed ? UsageDataObj.timeUsed : '',
      gpuMemoryUsage: UsageDataObj && UsageDataObj.gpuMemoryUsage ? UsageDataObj.gpuMemoryUsage : '',
      gpuUsage: UsageDataObj && UsageDataObj.gpuUsage ? UsageDataObj.gpuUsage : '',
      cpuMemoryUsage: UsageDataObj && UsageDataObj.cpuMemoryUsage ? UsageDataObj.cpuMemoryUsage : '',
      cpuUsage: UsageDataObj && UsageDataObj.cpuUsage ? UsageDataObj.cpuUsage : '',
      numberOfAbnormalData: UsageDataObj && UsageDataObj.numberOfAbnormalData ? UsageDataObj.numberOfAbnormalData : '',
      numberOfRecordsprocessed: UsageDataObj && UsageDataObj.numberOfRecordsprocessed ? UsageDataObj.numberOfRecordsprocessed : '',
      numberofJobsRunning: UsageDataObj && UsageDataObj.numberofJobsRunning ? UsageDataObj.numberofJobsRunning : '',
      numberofNormalData: UsageDataObj && UsageDataObj.numberofNormalData ? UsageDataObj.numberofNormalData : '',
    };

    return Object.assign({}, newObject);
  }

  stopAnomaly() {
    if (this.selectedModelAnmdDATA && this.selectedModelAnmdDATA.uid) {
      this.global.opendisplayModal('Do you wish to stop Anomaly Detection', 'Confirm', 'Stop Trained Model', true)
        .subscribe(result => {
          if (result === 'save') {
            const data = { trainedModels: this.createStopObject(this.selectedModelAnmdDATA) };
            this.anomalyService.stopAnomalyDetection(data).subscribe((resp: any) => {
              if (resp && resp.status === 'success' && resp.data.deletedCount !== 0) {
                this.notify.showToastrSuccess('Success', ' Anomaly Detection stopped successfully.');
                this.getAnomalyDetectionResult(this.selectedModel);
              } else {
                this.notify.showToastrWarning('Alert', 'Exception occured');
              }

            }, err => {
              this.notify.showToastrError('Alert', 'Server error occured');
            });
          }
        });
    } else {
      this.global.opendisplayModal(' Anomaly Detection details are not available to proceed with the action', 'OK', 'Alert');
    }
  }

  validateDetectAnomaly() {
    if (!this.selectedModel || !this.selectedModel.uid) {
      this.global.opendisplayModal('uid not available to detect anomaly', 'OK', 'Alert');
    } else if (this.executionJobtype(this.selectedModel.jobType) !== 'ASCEXECUTION' &&
      (this.selectedModel.threshold === '' || this.selectedModel.threshold === null || this.selectedModel.threshold === undefined)) {
      this.global.opendisplayModal('Please provide threshold value to detect anomaly', 'OK', 'Alert');
    } else if (this.getAnomalyDetectBtnStatus() === true) {
      this.global.opendisplayModal(
        `${this.modelNameValidCheck} is already running, please stop it before further execution of same jobType and dataSetName`,
        'OK', 'Alert');
    } else {
      this.detectAnomaly();
    }
  }

  detectAnomaly() {
    const jobTypeExec = this.executionJobtype(this.selectedModel.jobType);
    const data = {
      dataRange: this.selectedModel.dataRange,
      dataSetName: this.selectedModel.dataSetName,
      jobStatus: 'SCHEDULED',
      modelConfigName: this.selectedModel.modelConfigName,
      modelId: this.selectedModel.uid,
      modelName: this.selectedModel.modelName,
      // modelType: this.selectedModel.modelType,
      jobType: jobTypeExec,
      scheduleName: this.selectedModel.scheduleName,
      threshold: jobTypeExec === 'ASCEXECUTION' ? '' : this.selectedModel.threshold,
    };
    this.disableDetectAnomalyBtn = true;
    this.anomalyService.scheduleDetectAnomaly(data).subscribe((res: any) => {
      this.disableDetectAnomalyBtn = false;
      if (res.status === 'success') {
        this.anomaltDetectedData = res.data;
        this.scheduleSoc('5s');
        this.notify.showToastrSuccess('Success', 'Detect Anomaly');
        this.getAnomalyDetectionResult(this.selectedModel);
        this.updateLiveTableData(this.anomaltDetectedData);
      } else {
        this.notify.showToastrWarning('Failed', 'Server Error occured while detect anomaly');
      }
    }, (error) => {
      this.disableDetectAnomalyBtn = false;
      this.notify.showToastrError('Error', 'Server Error occured while detect anomaly');
    });

  }
  scheduleSoc(value) {
    const id = this.appScheduler.getSessionId();
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.socket.connect({}, () => {
        this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ANMD_TABLE), message => {
          const payload = JSON.parse(message.body);
          that.updateLiveTableData(payload);
        });
        if (that.anomaltDetectedData && that.anomaltDetectedData.uid) {
          this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ANMD_RESULT,
            that.anomaltDetectedData.uid), message => {
              const payload = JSON.parse(message.body);
              that.updateLiveDetectionStatus(payload);
            });
        }
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  updateLiveTableData(data) {
    if (data && data.length && data.length > 0) {
      this.tempAnomalyDetections = data.map(x => {
        if (x.modelName && x.modelName.includes('.')) {
          const modList = x.modelName.split('.');
          x.modelNameDisp = modList[0];
        } else {
          x.modelNameDisp = x.modelName;
        }
        // if (x.accuracy && x.accuracy.length && x.accuracy.length > 0) {
        //   if (x.accuracy[x.accuracy.length - 1] && !isNaN(Number(x.accuracy[x.accuracy.length - 1]))) {
        //     x.accuracyDisp = Math.round(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
        //     if (x.accuracyDisp === 1) {
        //       x.accuracyDisp = Math.floor(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
        //     }
        //   } else {
        //     x.accuracyDisp = 'NA';
        //   }
        // }

        return x;
      });
      this.setDrapdownValues();
    }
  }
  updateLiveDetectionStatus(data) {
    if (data && this.selectedModelAnmdDATA.uid === data.uid) {
      this.selectedModelAnmdDATA = data;
      this.selectedModelAnmdDATA.speedDisp = this.selectedModelAnmdDATA.speed
        && !isNaN(this.selectedModelAnmdDATA.speed) ? (Math.round(this.selectedModelAnmdDATA.speed * 1000) / 1000).toString() : null;
      this.selectedModelAnmdDATA.cpuUsageDisp = this.selectedModelAnmdDATA.cpuUsage
        && !isNaN(this.selectedModelAnmdDATA.cpuUsage) ? (Math.round(this.selectedModelAnmdDATA.cpuUsage * 100) / 100).toString() : null;
      this.selectedModelAnmdDATA.cpuMemoryUsageDisp = this.selectedModelAnmdDATA.cpuMemoryUsage
        && !isNaN(this.selectedModelAnmdDATA.cpuMemoryUsage) ?
         (Math.round(this.selectedModelAnmdDATA.cpuMemoryUsage * 100) / 100).toString() : null;
      this.selectedModelAnmdDATA.gpuUsageDisp = this.selectedModelAnmdDATA.gpuUsage
        && !isNaN(this.selectedModelAnmdDATA.gpuUsage) ? (Math.round(this.selectedModelAnmdDATA.gpuUsage * 100) / 100).toString() : null;
      this.selectedModelAnmdDATA.gpuMemoryUsageDisp = this.selectedModelAnmdDATA.gpuMemoryUsage
        && !isNaN(this.selectedModelAnmdDATA.gpuMemoryUsage) ?
         (Math.round(this.selectedModelAnmdDATA.gpuMemoryUsage * 100) / 100).toString() : null;
      this.setSelectedModelDetails(this.selectedModelAnmdDATA);
    }
  }
  ngOnDestroy() {
    this.anomalyService.AnomalyDetection = false;
    this.appScheduler.disconnectSocket();
  }
  setUrl() {
    const eUrl = this.elUrl ? this.elUrl.replace(/_vaxModelNamevax_/g, this.selectedModel.modelName) : '';
    this.selectedModel.modelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(eUrl);
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
  clearSelection() {
    this.selectedModel = undefined;
    this.selectedModelAnmdDATA = undefined;
    this.scheduleSoc('5s');
  }
}
