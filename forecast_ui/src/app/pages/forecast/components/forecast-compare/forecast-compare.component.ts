import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PATHS, SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ForecastService } from '../../services/forecast.service';
@Component({
  selector: 'app-forecast-compare',
  templateUrl: './forecast-compare.component.html',
  styleUrls: ['./forecast-compare.component.scss']
})
export class ForecastCompareComponent implements OnInit, OnDestroy {

  grfnUrl = '';
  compareProcess = [];
  stackView = false;
  socket;
  dataSetId = '';
  defaultJobType = 'FORECASTEXECUTION';
  isLoading = true;
  displayError = false;
  displayNoRecord = false;
  constructor(
    public forecastService: ForecastService,
    private notify: NotificationService,
    public global: GlobalService,
    public sanitizer: DomSanitizer,
    private appScheduler: AppSchedulerService,
    private router: Router) { }

  ngOnInit() {
    this.forecastService.ForecastCompare = true;
    if (this.forecastService.CompareProcess.length === 0) {
      this.router.navigate(['/' + this.global.prefixUrl + '/forecast/forecastprocess']);
    } else {
      this.dataSetId = this.forecastService.dataSetId ? this.forecastService.dataSetId : 'ALL';
      this.getCompareDetails();
    }
  }


  getCompareDetails() {
    this.isLoading = true;
    const foreacstprocess = this.forecastService.CompareProcess.map(it => it.dataId);
    const data = { dataSet: this.dataSetId, dataIds: [...foreacstprocess] };
    this.forecastService.getForecastCompareDetails(data).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.status === 'success' && res.data && res.data.length > 0) {
        const result = res.data.map(x => {
          x.lossValue = x.lossValue ? Math.round(x.lossValue * 10000) / 10000 : null;
          const timeofruns = x.timeOfRunning ? x.timeOfRunning.split(':') : null;
          if (timeofruns && timeofruns.length > 2) {
            timeofruns[2] = Math.round(timeofruns[2] * 1000) / 1000;
            x.timeOfRunning = timeofruns[0] + ':' + timeofruns[1] + ':' + timeofruns[2];
          }
          const speedlist = x.speed ? x.speed.split('records') : null;
          if (speedlist && speedlist.length > 1) {
            speedlist[0] = Math.round(speedlist[0] * 10000) / 10000;
            x.speed = speedlist[0] + 'records' + speedlist[1];
          }
          const dataRanges = x.defaultDataRange ? x.defaultDataRange.split(',') : null;
          if (dataRanges && dataRanges.length > 1) {
            x.minDataRange = dataRanges[0];
            x.maxDataRange = dataRanges[1];
          }
          return x;
        });
        this.displayError = false;
        this.displayNoRecord = false;
        this.grfnUrl = res.grfnUrl;
        this.createCompareDisplayObject(result);
        this.scheduleSoc('5s');
      } else {
        if (res && res.status === 'success') {
          const compareDetails = [...this.forecastService.CompareProcess];
          this.grfnUrl = res.grfnUrl;
          // this.displayNoRecord = true;
          this.createCompareDisplayObject(compareDetails);
        } else {
          this.displayError = true;
          this.createCompareDisplayObject([]);
          this.notify.showToastrWarning('Alert', 'Exception occured');
          this.isLoading = false;
        }

      }
    }, err => {
      this.isLoading = false;
      this.displayError = true;
      this.createCompareDisplayObject([]);
      this.notify.showToastrError('Alert', 'Server error occured');
    });

  }

  createCompareDisplayObject(compareDetails) {
    this.compareProcess = [];
    const compareDetailsArr = compareDetails ? compareDetails : [];
    compareDetailsArr.forEach(element => {
      const tempCompObj = this.createCompareObject(element);
      this.compareProcess.push(Object.assign({}, tempCompObj));
    });

  }
  removeCompareProcess(process) {
    const index = this.compareProcess.findIndex(it => it.dataId === process.dataId);
    this.compareProcess.splice(index, 1);
    this.displayNoRecord = this.compareProcess.length === 0 ? true : false;
    // this.showToastrSuccess('Success','Model deleted successfully.');

  }

  toggleView(Val: boolean) {
    this.stackView = Val;
  }
  scheduleSoc(value) {
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.socket.connect({}, () => {
        this.compareProcess.forEach((el) => {
          this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.FR_PROC_TABLE_VIEW_DETAILS, el.uid), message => {
            const payload = JSON.parse(message.body);
            that.updateLiveForecastDate(payload);
          });
        });
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  updateLiveForecastDate(data) {
    if (data) {
      const index = this.compareProcess.findIndex(x => x.uid === data.uid);
      if (index > -1) {
        if (data) {
          data.lossValue = data.lossValue ? Math.round(data.lossValue * 10000) / 10000 : null;
          const timeofruns = data.timeOfRunning ? data.timeOfRunning.split(':') : null;
          if (timeofruns && timeofruns.length > 2) {
            timeofruns[2] = Math.round(timeofruns[2] * 1000) / 1000;
            data.timeOfRunning = timeofruns[0] + ':' + timeofruns[1] + ':' + timeofruns[2];
          }
          const speedlist = data.speed ? data.speed.split('records') : null;
          if (speedlist && speedlist.length > 1) {
            speedlist[0] = Math.round(speedlist[0] * 10000) / 10000;
            data.speed = speedlist[0] + 'records' + speedlist[1];
          }
          const dataRanges = data.defaultDataRange ? data.defaultDataRange.split(',') : null;
          if (dataRanges && dataRanges.length > 1) {
            data.minDataRange = dataRanges[0];
            data.maxDataRange = dataRanges[1];
          }
          this.compareProcess[index].uid = data && data.uid ? data.uid : undefined;
          this.compareProcess[index].dataId = data && data.dataId ? data.dataId : 'NA';
          this.compareProcess[index].modelConfigName = data && data.modelConfigName ? data.modelConfigName : 'NA';
          this.compareProcess[index].lossFunction = data && data.lossFunction ? data.lossFunction : 'NA';
          this.compareProcess[index].timeseriesType = data && data.timeseriesType ? data.timeseriesType : 'NA';
          this.compareProcess[index].lossValue = data && data.lossValue ? data.lossValue : 0;

          this.compareProcess[index].dataSetName = data && data.dataSetName ? data.dataSetName : 'NA';
          this.compareProcess[index].dataFrequency = data && data.dataFrequency ? data.dataFrequency : 0;
          this.compareProcess[index].defaultDataRange = data && data.defaultDataRange ? data.defaultDataRange : 0;
          this.compareProcess[index].timeForForwardPrediction = data && data.timeForForwardPrediction ? data.timeForForwardPrediction : 0;

          this.compareProcess[index].cpuUsage = data && data.cpuUsage ? data.cpuUsage : 0;
          this.compareProcess[index].memoryUsage = data && data.memoryUsage ? data.memoryUsage : 0;
          this.compareProcess[index].gpuUsage = data && data.gpuUsage ? data.gpuUsage : 0;
          this.compareProcess[index].gpuMemoryUsage = data && data.gpuMemoryUsage ? data.gpuMemoryUsage : 0;
          this.compareProcess[index].speed = data && data.speed ? data.speed : 0;
          this.compareProcess[index].numberOfJobRunning = data && data.numberOfJobRunning ? data.numberOfJobRunning : 0;
          this.compareProcess[index].timeOfRunning = data && data.timeOfRunning ? data.timeOfRunning : 0;
          this.compareProcess[index].numberofRecordsProcessed = data && data.numberofRecordsProcessed ? data.numberofRecordsProcessed : 0;
          this.compareProcess[index].jobType = data && data.jobType ? data.jobType : 'NA';
          // this.compareProcess[index].modelType = data && data.modelType ? data.modelType : 'NA';
          this.compareProcess[index].minDataRange = data && data.minDataRange ? data.minDataRange : 'NA';
          this.compareProcess[index].maxDataRange = data && data.maxDataRange ? data.maxDataRange : 'NA';
        }
      }
    }
  }
  ngOnDestroy() {
    this.forecastService.CompareProcess = [];
    this.forecastService.dataSetId = '';
    this.forecastService.ForecastCompare = false;
    this.appScheduler.disconnectSocket();
  }


  createCompareObject(compareObj) {
    const compareProcess = {
      uid: compareObj && compareObj.uid ? compareObj.uid : undefined,
      dataId: compareObj && compareObj.dataId ? compareObj.dataId : 'NA',
      modelConfigName: compareObj && compareObj.modelConfigName ? compareObj.modelConfigName : 'NA',
      lossFunction: compareObj && compareObj.lossFunction ? compareObj.lossFunction : 'NA',
      timeseriesType: compareObj && compareObj.timeseriesType ? compareObj.timeseriesType : 'NA',
      lossValue: compareObj && compareObj.lossValue ? compareObj.lossValue : 0,

      dataSetName: compareObj && compareObj.dataSetName ? compareObj.dataSetName : 'NA',
      dataFrequency: compareObj && compareObj.dataFrequency ? compareObj.dataFrequency : 0,
      defaultDataRange: compareObj && compareObj.defaultDataRange ? compareObj.defaultDataRange : 0,
      timeForForwardPrediction: compareObj && compareObj.timeForForwardPrediction ? compareObj.timeForForwardPrediction : 0,

      cpuUsage: compareObj && compareObj.cpuUsage ? compareObj.cpuUsage : 0,
      memoryUsage: compareObj && compareObj.memoryUsage ? compareObj.memoryUsage : 0,
      gpuUsage: compareObj && compareObj.gpuUsage ? compareObj.gpuUsage : 0,
      gpuMemoryUsage: compareObj && compareObj.gpuMemoryUsage ? compareObj.gpuMemoryUsage : 0,
      speed: compareObj && compareObj.speed ? compareObj.speed : 0,
      numberOfJobRunning: compareObj && compareObj.numberOfJobRunning ? compareObj.numberOfJobRunning : 0,
      timeOfRunning: compareObj && compareObj.timeOfRunning ? compareObj.timeOfRunning : 0,
      numberofRecordsProcessed: compareObj && compareObj.numberofRecordsProcessed ? compareObj.numberofRecordsProcessed : 0,
      jobType: compareObj && compareObj.jobType ? compareObj.jobType : 'NA',
      // modelType: compareObj && compareObj.modelType ? compareObj.modelType : 'NA',
      minDataRange: compareObj && compareObj.minDataRange ? compareObj.minDataRange : 'NA',
      maxDataRange: compareObj && compareObj.maxDataRange ? compareObj.maxDataRange : 'NA'
    };
    const gfnUrl = this.grfnUrl.replace('_vax_var-PM_name_vax_', compareProcess.dataId);
    return Object.assign({
      ...compareProcess,
      graphUrl:
        this.sanitizer.bypassSecurityTrustResourceUrl(gfnUrl)
    });
  }

}

